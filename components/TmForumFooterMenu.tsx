import Link from "next/link";

export function TmForumFooterMenu() {
  return (
    <aside
      aria-label="TM Forum Challenge resources"
      style={{
        borderTop: "1px solid var(--op-border)",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "18px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          flexWrap: "wrap",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
        }}
      >
        <Link href="/tm-forum-challenge" style={{ color: "var(--fg)", textDecoration: "none", fontWeight: 700 }}>
          TM Forum Challenge
        </Link>
        <nav style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link href="/tm-forum-challenge#resources" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Team Hub</Link>
          <a href="/tm-forum/team-field-guide.html" target="_blank" rel="noreferrer" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Field Guide</a>
          <a href="/tm-forum/team-environment-integration-intake.html" target="_blank" rel="noreferrer" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Environment Intake</a>
          <a href="/tm-forum/assurance-report-template.html" target="_blank" rel="noreferrer" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Report Template</a>
        </nav>
      </div>
    </aside>
  );
}
