import type { ReactNode } from "react";

export function AICrewLostSection({ children }: { children: ReactNode }) {
  return (
    <section id="lost" className="mx-auto max-w-[1920px] bg-white px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1120px]">{children}</div>
    </section>
  );
}
