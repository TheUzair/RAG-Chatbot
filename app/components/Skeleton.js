export function SkeletonLine({ className = "" }) {
  return <div className={`shimmer h-3 rounded ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="shimmer w-8 h-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonLine className="w-2/3" />
          <SkeletonLine className="w-1/3" />
        </div>
      </div>
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-5/6" />
      <SkeletonLine className="w-4/5" />
    </div>
  );
}

export function SkeletonBubble({ align = "left" }) {
  return (
    <div
      className={`flex gap-3 ${align === "right" ? "flex-row-reverse" : ""}`}
    >
      <div className="shimmer w-7 h-7 rounded-full shrink-0" />
      <div
        className={`space-y-2 flex flex-col max-w-xs ${
          align === "right" ? "items-end" : "items-start"
        }`}
      >
        <div className="shimmer h-3 w-48 rounded" />
        <div className="shimmer h-3 w-36 rounded" />
        <div className="shimmer h-3 w-44 rounded" />
      </div>
    </div>
  );
}

export function SkeletonSidebarRow() {
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <div className="shimmer w-5 h-5 rounded shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonLine className="w-full h-2.5" />
        <SkeletonLine className="w-2/3 h-2" />
      </div>
    </div>
  );
}
