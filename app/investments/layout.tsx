import type { ReactNode } from "react";
import "./investment-light.css";

/** Consistent paper-light treatment for the investment collection only. */
export default function InvestmentsLayout({ children }: { children: ReactNode }) {
  return <div className="investment-light">{children}</div>;
}
