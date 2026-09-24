"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Canvas,
  extend,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { useGLTF, Environment, Lightformer } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";
import { createBandTexture, createCardTexture, loadCardPhoto } from "./card-artwork";

// Next.js: assets are served from /public rather than imported as modules.
// Only the geometry is taken from the model; the card face and the strap are
// drawn from the site's design tokens in card-artwork.ts.
const CARD_GLB = "/lanyard/card.glb";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    // These are runtime-extended (via extend()) third-party elements. The
    // generated ThreeElement types over-constrain constructor args, so we
    // type them permissively; the props used below are valid at runtime.
    meshLineGeometry: Record<string, unknown>;
    meshLineMaterial: Record<string, unknown>;
  }
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_QUERY = "(max-width: 767px)";

/**
 * Both switches are media queries, so they are read the same way: one
 * subscription each, and a state update only when the query actually flips.
 * The mobile flag used to ride a `resize` listener, which re-rendered the
 * whole scene on every pixel of a window drag to recompute one boolean.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handleChange = (): void => setMatches(mql.matches);
    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
}: LanyardProps) {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  const slot = useRef<HTMLDivElement>(null);
  // The hero scrolls away but the canvas does not: without this the rope
  // simulation and a full render pass keep running at 60fps behind five
  // screens of static content, for an element nobody can see.
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = slot.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // `never` stops the loop outright; `demand` is the reduced-motion still
  // life, which draws only when SettleFrames asks for a frame.
  const frameloop = !inView ? "never" : reducedMotion ? "demand" : "always";

  return (
    <div
      ref={slot}
      className="relative z-0 flex h-full w-full items-center justify-center"
    >
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        frameloop={frameloop}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        {/* Exposure is set by measurement, not by taste: screenshot the slot,
            take the modal colour of the card, compare it to the page.

            The old setup (ambient 1 plus four lightformers, one of them a
            broadside at intensity 10) put the card face at #ECECEA against a
            #F6F2EB page. That is 1.06:1. The card was not subtly low
            contrast, it was the same colour as the paper behind it.

            Two lightformers do much less of the lifting than four did, so
            ambient has to rise to compensate; what matters is where the face
            lands, and 1.95 puts it at #CAC8C4, 1.50:1, reading as card stock
            in soft light rather than as a hole in the page. Going brighter
            walks back toward the old problem; going darker turns warm stock
            grey and drops the whole scene out of the palette. */}
        <ambientLight intensity={1.95} />
        {/* This boundary is load-bearing, not cosmetic. <Physics> suspends
            while the Rapier WASM initialises and useGLTF suspends on the
            model. Without a boundary of our own, that suspension reaches the
            Suspense that <Canvas> puts around its children, whose fallback
            makes the Canvas component itself throw the promise. Re-mounting
            the Canvas runs its unmount cleanup (unmountComponentAtNode ->
            renderer.dispose -> forceContextLoss) while the async configure()
            is still in flight, and under React Strict Mode's double-invoked
            effects the renderer ends up disposed for good: a live <canvas>
            with a dead context that never draws again. Catching the
            suspension here keeps the Canvas mounted throughout. */}
        <Suspense fallback={null}>
          {/* Remounting on the motion preference re-seeds the rigid bodies,
              whose `position` is only read once. */}
          <Physics
            key={reducedMotion ? "still" : "live"}
            gravity={gravity}
            timeStep={isMobile ? 1 / 30 : 1 / 60}
            paused={reducedMotion || !inView}
          >
            <Band isMobile={isMobile} reducedMotion={reducedMotion} />
          </Physics>
        </Suspense>
        {reducedMotion && inView ? <SettleFrames /> : null}
        {/* Two soft strip lights instead of the stock four. The pair that
            went is the one that cost the most and showed the least: a
            broadside at intensity 10 that lit the card like a shop window and
            put a hard specular streak across the metal clip. What is left
            gives the card top-left modelling and nothing to reflect.
            resolution={64} because a blurred environment feeding a matte
            surface has no detail to lose, and the cube render target is built
            on every mount. */}
        <Environment blur={0.75} resolution={64}>
          <Lightformer
            intensity={1.6}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={2}
            color="white"
            position={[-1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

/**
 * In `demand` mode nothing draws unless a frame is requested. Ask for frames
 * for a short window after mount so the environment map, the model and the
 * band geometry all land in the one still image the user is left with.
 */
function SettleFrames({ duration = 2500 }: { duration?: number }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const start = performance.now();
    let raf = requestAnimationFrame(function tick() {
      invalidate();
      if (performance.now() - start < duration) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [invalidate, duration]);

  return null;
}

/** Card face + strap textures, repainted once the webfonts resolve. */
function useDrawnTextures() {
  const invalidate = useThree((state) => state.invalidate);
  const [card] = useState(createCardTexture);
  const [band] = useState(createBandTexture);

  useEffect(() => {
    let cancelled = false;
    // The first paint can happen before Fraunces/DM Sans/JetBrains Mono are
    // available, and before the portrait has decoded; reprint the card once
    // both have arrived so it never ships fallbacks or a photoless face.
    // `loadCardPhoto` resolves either way, so a missing image cannot stall it.
    void Promise.all([document.fonts.ready, loadCardPhoto()]).then(() => {
      if (cancelled) return;
      card.repaint();
      band.repaint();
      invalidate();
    });
    return () => {
      cancelled = true;
    };
  }, [card, band, invalidate]);

  useEffect(
    () => () => {
      card.texture.dispose();
      band.texture.dispose();
    },
    [card, band],
  );

  return { cardTexture: card.texture, bandTexture: band.texture };
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  reducedMotion?: boolean;
}

type LanyardRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

// Seed positions. Live: the strap starts folded to the right and falls into
// place. Still: the settled hang, so a paused simulation is already correct.
type Vec3 = [number, number, number];
type Seed = { j1: Vec3; j2: Vec3; j3: Vec3; card: Vec3 };

const LIVE_SEED: Seed = {
  j1: [0.5, 0, 0],
  j2: [1, 0, 0],
  j3: [1.5, 0, 0],
  card: [2, 0, 0],
};

const STILL_SEED: Seed = {
  j1: [0, -1, 0],
  j2: [0, -2, 0],
  j3: [0, -3, 0],
  card: [0, -4.45, 0],
};

const SEGMENT_PROPS: RigidBodyProps = {
  type: "dynamic",
  canSleep: true,
  colliders: false,
  angularDamping: 4,
  linearDamping: 4,
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  reducedMotion = false,
}: BandProps) {
  const band =
    useRef<THREE.Mesh<InstanceType<typeof MeshLineGeometry>, InstanceType<typeof MeshLineMaterial>>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  // Scratch vectors for the frame loop. Allocated once per mount rather than
  // once per render.
  const [{ vec, ang, rot, dir }] = useState(() => ({
    vec: new THREE.Vector3(),
    ang: new THREE.Vector3(),
    rot: new THREE.Vector3(),
    dir: new THREE.Vector3(),
  }));

  const seed = reducedMotion ? STILL_SEED : LIVE_SEED;

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    if (!body.lerped) {
      body.lerped = new THREE.Vector3().copy(body.translation());
    }
    return body.lerped;
  };

  const { nodes, materials } = useGLTF(CARD_GLB) as unknown as {
    nodes: Record<string, THREE.Mesh>;
    materials: Record<string, THREE.Material>;
  };
  const { cardTexture, bandTexture } = useDrawnTextures();

  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  });
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  // curve.getPoints() returns a fresh array of fresh Vector3s on every call,
  // which is 33 objects per frame for the life of the page. Sampling into a
  // reused array costs the same arithmetic and allocates nothing.
  const segments = isMobile ? 16 : 32;
  const curvePoints = useMemo(
    () => Array.from({ length: segments + 1 }, () => new THREE.Vector3()),
    [segments],
  );

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        const lerped = getLerped(ref.current);
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, lerped.distanceTo(ref.current.translation())),
        );
        // The chase factor is `delta * 50`, so it passes 1 as soon as a frame
        // takes longer than 20ms, and THREE.Vector3.lerp does not clamp its
        // alpha, so above 1 the point is thrown *past* its target instead of
        // drawn towards it. `clampedDistance` then saturates at its own
        // ceiling of 1, which leaves the factor at `delta * 50` for the next
        // frame too, so the error compounds instead of correcting: one slow
        // frame is enough to walk the strap's control points out to 1e15,
        // where the band leaves the frustum and the lanyard is simply gone.
        // Startup reliably supplies that slow frame: the Suspense boundary
        // above keeps the Canvas mounted, so this loop is already ticking
        // while Rapier's WASM and the model are still landing on the main
        // thread (measured: a 2.1s frame at frame 7). Capping the factor at 1
        // keeps every step a convex combination of the two points, which can
        // approach the target but never overshoot it.
        lerped.lerp(
          ref.current.translation(),
          Math.min(1, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))),
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(getLerped(j2.current));
      curve.points[2].copy(getLerped(j1.current));
      curve.points[3].copy(fixed.current.translation());
      for (let i = 0; i <= segments; i += 1) {
        curve.getPoint(i / segments, curvePoints[i]);
      }
      band.current.geometry.setPoints(curvePoints);
      if (!reducedMotion) {
        ang.copy(card.current.angvel());
        rot.copy(card.current.rotation());
        card.current.setAngvel(
          { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
          true,
        );
      }
    }
  });

  // Dragging is a motion the user did not ask for when they asked for less of
  // it, so the card is inert under `prefers-reduced-motion`.
  const pointerHandlers = reducedMotion
    ? {}
    : {
        onPointerOver: () => hover(true),
        onPointerOut: () => hover(false),
        onPointerUp: (e: ThreeEvent<PointerEvent>) => {
          (e.target as Element).releasePointerCapture(e.pointerId);
          drag(false);
        },
        onPointerDown: (e: ThreeEvent<PointerEvent>) => {
          (e.target as Element).setPointerCapture(e.pointerId);
          drag(
            new THREE.Vector3()
              .copy(e.point)
              .sub(vec.copy(card.current.translation())),
          );
        },
      };

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...SEGMENT_PROPS} type="fixed" />
        <RigidBody position={seed.j1} ref={j1} {...SEGMENT_PROPS} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={seed.j2} ref={j2} {...SEGMENT_PROPS} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={seed.j3} ref={j3} {...SEGMENT_PROPS} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={seed.card}
          ref={card}
          {...SEGMENT_PROPS}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group scale={2.25} position={[0, -1.2, -0.05]} {...pointerHandlers}>
            <mesh geometry={nodes.card.geometry}>
              {/* Uncoated card stock. The clearcoat that used to sit here was
                  meant to give the card an edge highlight, but what it
                  actually did was read as laminate and pull a sheen across the
                  face at the angles the card spends most of its time at. The
                  printed rules on the artwork define the face better and cost
                  nothing to render. Dropping it also drops the material to a
                  plain standard one, which is the cheaper shader. */}
              <meshStandardMaterial
                map={cardTexture}
                roughness={0.85}
                metalness={0}
              />
            </mesh>
            {/* The clip and clamp share one material instance from the GLB,
                so this roughness applies to both. Brushed, not chromed: a
                mirror-finish clip out-sparkles everything on the card. */}
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.62}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap={1}
          map={bandTexture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

useGLTF.preload(CARD_GLB);
