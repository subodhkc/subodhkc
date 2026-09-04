"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import Hero from "@/components/Hero";
import Section from "@/components/Section";

const INTERESTS = [
  "Strategic Diagnostic Intensive",
  "Executive AI Advisory",
  "AI Systems Architecture & Implementation",
  "HAIEC Enterprise Assurance POC",
  "Design Partnership",
  "Partner / Agency Collaboration",
  "Developer / Open Source Evaluation",
  "Research Collaboration",
  "Speaking / Executive Session",
  "Not sure yet",
];

const SUBJECT_MAP: Record<string, string> = {
  "strategic-diagnostic": "Strategic Diagnostic Intensive",
  "executive-decision": "Executive AI Advisory",
  "ai-advisor": "Executive AI Advisory",
  "ai-architecture-implementation": "AI Systems Architecture & Implementation",
  "haiec-enterprise-poc": "HAIEC Enterprise Assurance POC",
  "design-partner": "Design Partnership",
  "partner-agency": "Partner / Agency Collaboration",
  "developer-evaluation": "Developer / Open Source Evaluation",
  "member-technical-review": "Partner / Agency Collaboration",
};

function DecisionContactForm() {
  const params = useSearchParams();
  const initialInterest = useMemo(() => SUBJECT_MAP[params.get("subject") || ""] || "", [params]);
  const [form, setForm] = useState({ name: "", email: "", company: "", interest: initialInterest, decision: "", consequence: "", blocker: "", timeline: "", website: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.website) return;
    setStatus("sending");
    setError("");
    const message = [
      `Decision / objective:\n${form.decision}`,
      `Material consequence:\n${form.consequence}`,
      `Current blocker / unknown:\n${form.blocker}`,
      `Decision timeline:\n${form.timeline || "Not specified"}`,
    ].join("\n\n");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, company: form.company, interest: form.interest, message, website: form.website }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "The inquiry could not be sent.");
      setStatus("sent");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The inquiry could not be sent.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return <div role="status" className="rounded-xl border border-primary/25 bg-primary/5 p-8"><h2 className="text-2xl font-semibold">Inquiry received.</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">I will review the decision, consequence, and evidence constraint before proposing the appropriate next conversation.</p></div>;
  }

  const inputClass = "mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-foreground";
  const labelClass = "block text-sm font-medium";

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 md:p-9">
      <input name="website" value={form.website} onChange={(e) => update("website", e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-6 md:grid-cols-2">
        <label className={labelClass}>Name *<input required name="name" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} /></label>
        <label className={labelClass}>Work email *<input required type="email" name="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} /></label>
        <label className={labelClass}>Organization<input name="company" value={form.company} onChange={(e) => update("company", e.target.value)} className={inputClass} /></label>
        <label className={labelClass}>Engagement path *<select required name="interest" value={form.interest} onChange={(e) => update("interest", e.target.value)} className={inputClass}><option value="">Select one</option>{INTERESTS.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="mt-6 grid gap-6">
        <label className={labelClass}>What decision or objective requires clarity? *<textarea required rows={4} name="decision" value={form.decision} onChange={(e) => update("decision", e.target.value)} className={inputClass} placeholder="Name the decision, not only the requested deliverable." /></label>
        <label className={labelClass}>What becomes materially different if the decision is wrong? *<textarea required rows={3} name="consequence" value={form.consequence} onChange={(e) => update("consequence", e.target.value)} className={inputClass} placeholder="Money, data, authority, infrastructure, customer state, operational availability, or another consequence." /></label>
        <label className={labelClass}>What can your current process or evidence not establish confidently? *<textarea required rows={3} name="blocker" value={form.blocker} onChange={(e) => update("blocker", e.target.value)} className={inputClass} /></label>
        <label className={labelClass}>Desired decision date<input type="date" name="timeline" value={form.timeline} onChange={(e) => update("timeline", e.target.value)} className={inputClass} /></label>
      </div>
      {status === "error" && <p role="alert" className="mt-5 text-sm text-red-600">{error}</p>}
      <button disabled={status === "sending"} className="mt-7 inline-flex items-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60">{status === "sending" ? "Sending..." : "Submit the Decision"}</button>
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">No complete source or runtime access is required to begin scoping. Sensitive evidence should not be submitted through this form.</p>
    </form>
  );
}

export default function ContactPageClient() {
  return (
    <>
      <Hero subtitle="Decision Intake" title={<>Start with the decision.<br /><span className="gradient-text">Then define the work.</span></>} description="Provide the decision, consequence, unresolved boundary, and timing. The next step should match the real constraint, not a generic service catalog." />
      <Section subtitle="Qualified Inquiry" title="What must become possible after this work?" description="Subodh reviews inquiries personally. For detailed context or supporting documents, email subodhkc@subodhkc.com after submitting the decision brief." sectionNum="01">
        <Suspense fallback={<div className="rounded-xl border border-border p-8 text-sm text-muted-foreground">Loading decision intake...</div>}><DecisionContactForm /></Suspense>
      </Section>
    </>
  );
}
