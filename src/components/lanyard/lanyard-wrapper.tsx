"use client";

import { Component, type ReactNode } from "react";
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

export function LanyardWrapper() {
  return (
    <LanyardErrorBoundary>
            {/* Camera moved closer (z: 20) so the card fills the hero slot. */}
      <LanyardCanvas position={[0, 0, 20]} fov={20} />
    </LanyardErrorBoundary>
  );
}