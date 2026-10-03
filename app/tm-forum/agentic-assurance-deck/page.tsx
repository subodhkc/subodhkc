import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "HAIEC Agentic Assurance | TM Forum 2026 Technical Thesis",
  description: "Pre-event architecture and technical thesis deck for HAIEC at TM Forum Innovate Americas 2026.",
  robots: { index: false, follow: false },
};

export default function AgenticAssuranceDeckPage() {
  redirect("/tm-forum/haiec-agentic-assurance-deck.html");
}
