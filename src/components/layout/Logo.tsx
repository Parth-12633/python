export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-neon" style={{ width: size, height: size }}>
      <svg viewBox="0 0 32 32" fill="none" style={{ width: size * 0.56, height: size * 0.56 }}>
        <path d="M8 25V7l16 18V7" stroke="#000" strokeWidth="3.6" strokeLinecap="square" strokeLinejoin="miter" />
      </svg>
    </span>
  );
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span className="font-display text-[1.2rem] font-semibold leading-none tracking-tight text-white sm:text-[1.35rem]"><span className="text-neon">NovaCraft</span> Studio</span>
    </span>
  );
}
