"use client";

import {
  Component,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";

function LanyardFallback() {
  return (
    <div aria-hidden="true" className="relative flex h-full w-full items-start justify-center">
      <span className="absolute top-0 h-24 w-px bg-[var(--color-border)]" />
      <span className="absolute top-24 h-1.5 w-1.5 -translate-x-[2.5px] rounded-full bg-[var(--color-accent)]" />
    </div>
  );
}

const LanyardCanvas = dynamic(() => import("./lanyard-canvas"), {
  ssr: false,
  loading: () => <LanyardFallback />,
});

type BoundaryProps = { children: ReactNode };
type BoundaryState = { failed: boolean };

class LanyardErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <LanyardFallback />;
    return this.props.children;
  }
}

/**
 * react-three-fiber creates its renderer asynchronously, so a missing WebGL
 * context rejects a promise rather than throwing during render, so an error
 * boundary never sees it and the hero is left with a dead canvas. Probing up
 * front keeps the quiet fallback in charge whenever WebGL is unavailable.
 */
let webglSupport: boolean | undefined;

function hasWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const probe = document.createElement("canvas");
    const gl =
      probe.getContext("webgl2") ??
      (probe.getContext("webgl") as WebGLRenderingContext | null);
    webglSupport = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

const noopSubscribe = () => () => {};

export function LanyardWrapper() {
  // Support never changes within a session, so this is a one-shot read that
  // still renders the fallback on the server and through hydration.
  const supported = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);

  // three + drei + rapier is ~3.3 MB of JavaScript. next/dynamic keeps it out
  // of the initial bundle, but it still fetches and executes the moment this
  // component renders, which is during hydration, on the same main thread
  // that is trying to make the page interactive. Holding the render back to
  // the first idle period moves all of that after first paint. The fallback
  // occupies the slot in the meantime, and the hero reserves the height, so
  // nothing shifts when the scene arrives.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supported) return;

    if (typeof window.requestIdleCallback === "function") {
      const handle = window.requestIdleCallback(() => setReady(true), {
        timeout: 2000,
      });
      return () => window.cancelIdleCallback?.(handle);
    }

    // Safari before 16.4 has no requestIdleCallback; a short timeout clears
    // first paint, which is the point of the deferral.
    const handle = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(handle);
  }, [supported]);

  if (!supported || !ready) return <LanyardFallback />;

  return (
    <LanyardErrorBoundary>
      {/* Camera moved closer (z: 20) so the card fills the hero slot. */}
      <LanyardCanvas position={[0, 0, 20]} fov={20} />
    </LanyardErrorBoundary>
  );
}
