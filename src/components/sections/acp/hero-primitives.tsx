import type { ReactNode } from "react";

export function AcpHeroCopy({ children }: { children: ReactNode }) {
  return <div className="flex max-w-[1200px] flex-col items-center gap-[20px] text-center">{children}</div>;
}

export function AcpHeroTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-[48px] font-normal leading-[56px] tracking-normal text-[#24292F] lg:text-[60px] lg:leading-[72px]">{children}</h1>;
}

export function AcpHeroLead({ children }: { children: ReactNode }) {
  return <p className="max-w-[760px] text-[18px] font-light leading-[28px] tracking-[0.36px] text-[#57606A]">{children}</p>;
}
