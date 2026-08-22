"use client";

import { Suspense, useEffect, useRef, useState } from "react";
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
import { createBandTexture, createCardTexture } from "./card-artwork";

// Next.js: assets are served from /public rather than imported as modules.
// Only the geometry is taken from the model — the card face and the strap are
// drawn from the site's design tokens in card-artwork.ts.
const CARD_GLB = "/lanyard/card.glb";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    // These are runtime-extended (via extend()) third-party elements. The
    // generated ThreeElement types over-constrain constructor args, so we
    // type them permissively — the props used below are valid at runtime.
    meshLineGeometry: Record<string, unknown>;
    meshLineMaterial: Record<string, unknown>;
  }
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

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
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const handleChange = (): void => setReducedMotion(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="relative z-0 flex h-full w-full items-center justify-center">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        // Reduced motion: the scene is a still life, so only draw when
        // something actually asks for a frame.
        frameloop={reducedMotion ? "demand" : "always"}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        {/* The stock scene used intensity={Math.PI}, which reproduces an
            albedo exactly — right for the metallic demo card, far too hot for
            a matte one that also picks up the environment on top. Measured off
            the rendered frame: at 2 the card face came back RGB ~245, the same
            brightness as the page it sits on, so it read as blank. At 1 it
            lands ~232 and separates from the background. */}
        <ambientLight intensity={1} />
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
            paused={reducedMotion}
          >
            <Band isMobile={isMobile} reducedMotion={reducedMotion} />
          </Physics>
        </Suspense>
        {reducedMotion ? <SettleFrames /> : null}
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
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
    // available; reprint the card once they are so it never ships fallbacks.
    void document.fonts.ready.then(() => {
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

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const seed = reducedMotion ? STILL_SEED : LIVE_SEED;

  const segmentProps: RigidBodyProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

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
        lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(getLerped(j2.current));
      curve.points[2].copy(getLerped(j1.current));
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
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
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={seed.j1} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={seed.j2} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={seed.j3} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={seed.card}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group scale={2.25} position={[0, -1.2, -0.05]} {...pointerHandlers}>
            <mesh geometry={nodes.card.geometry}>
              {/* Matte card stock, not a glossy plastic badge: no metalness,
                  only a whisper of clearcoat to keep an edge highlight. */}
              <meshPhysicalMaterial
                map={cardTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 0.3}
                clearcoatRoughness={0.55}
                roughness={0.68}
                metalness={0}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
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
