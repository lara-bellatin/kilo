export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-eyebrow">
      <span className="hoy-dash">— </span>
      {children}
    </span>
  );
}
