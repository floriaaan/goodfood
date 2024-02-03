import { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return <div className="mb-12 flex h-full grow flex-col justify-center gap-y-12">{children}</div>;
}
