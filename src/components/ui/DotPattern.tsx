"use client";

interface Props {
  cx?: number;
  cy?: number;
  cr?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  gap?: number;
}

export default function DotPattern({
  cx = 1,
  cy = 1,
  cr = 1,
  color = "rgba(200,169,110,0.18)",
  gap = 24,
  className,
  style,
}: Props) {
  const id = `dp-${gap}-${cr}`;
  return (
    <svg
      className={className}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", ...style }}
      aria-hidden
    >
      <defs>
        <pattern id={id} x={0} y={0} width={gap} height={gap} patternUnits="userSpaceOnUse">
          <circle cx={cx} cy={cy} r={cr} fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
