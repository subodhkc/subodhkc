"use client";

import * as React from "react";

type FormType = "discuss" | "hire";

interface FieldDef {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select";
  required: boolean;
  placeholder?: string;
  options?: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  formType: FormType;
}

const DISCUSS_FIELDS: FieldDef[] = [
  { name: "name", label: "Name", type: "text", required: true, placeholder: "Your full name" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "your@email.com" },
  { name: "company", label: "Company", type: "text", required: false, placeholder: "Company / Organization" },
  { name: "system", label: "AI System Description", type: "textarea", required: true, placeholder: "Describe the AI system you want to discuss — use case, current stack, scale, challenges..." },
  { name: "stack", label: "Current Stack (optional)", type: "text", required: false, placeholder: "e.g. Python, OpenAI, LangChain, Pinecone, AWS..." },
];

const HIRE_FIELDS: FieldDef[] = [
  { name: "name", label: "Name", type: "text", required: true, placeholder: "Your full name" },
  { name: "email", label: "Email", type: "email", required: true, placeholder: "your@email.com" },
  { name: "company", label: "Company", type: "text", required: true, placeholder: "Company / Organization" },
  { name: "roleType", label: "Role Type", type: "select", required: true, options: ["Advisory", "Fractional Executive", "Full-time", "Project-based"] },
  { name: "timeline", label: "Engagement Timeline", type: "select", required: true, options: ["Immediate", "1-3 months", "3-6 months", "6+ months"] },
  { name: "description", label: "Brief Description", type: "textarea", required: true, placeholder: "Tell me about the role, team, and what you need..." },
];

export function HeroCTAModal({ isOpen, onClose, formType }: Props) {
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const fields = formType === "discuss" ? DISCUSS_FIELDS : HIRE_FIELDS;
  const endpoint = formType === "discuss" ? "/api/discuss" : "/api/hire";
  const title = formType === "discuss" ? "Discuss an AI System" : "Hire Subodh KC";
  const subtitle =
    formType === "discuss"
      ? "Tell me about your AI system — I'll review and reply within 24-48 hours."
      : "Tell me about the opportunity — I'll review and respond within 24-48 hours.";
  const successMsg =
    formType === "discuss"
      ? "Thanks — I'll review your AI system context and reply within 24-48 hours."
      : "Thanks — I'll review your opportunity and respond within 24-48 hours.";

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send");
      }

      setStatus("success");
      setFormData({});
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setFormData({});
    setErrorMsg("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "color-mix(in oklab, var(--bg) 85%, transparent)",
        backdropFilter: "blur(6px)",
      }}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 520,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "var(--op-card)",
          border: "1px solid var(--op-border)",
          borderRadius: 12,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--op-muted)",
            fontSize: 20,
            lineHeight: 1,
            padding: 4,
          }}
        >
          ✕
        </button>

        <div style={{ padding: "32px 28px 28px" }}>
          {status === "success" ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "color-mix(in oklab, var(--op-accent) 15%, transparent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  fontSize: 24,
                }}
              >
                ✓
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, margin: "0 0 8px", color: "var(--fg)" }}>
                Sent
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {successMsg}
              </p>
              <button
                onClick={handleClose}
                style={{
                  marginTop: 20,
                  background: "var(--fg)",
                  color: "var(--bg)",
                  border: "none",
                  borderRadius: 999,
                  padding: "8px 20px",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--op-accent)",
                  marginBottom: 8,
                }}
              >
                {formType === "discuss" ? "§ Contact / Discuss" : "§ Contact / Hire"}
              </div>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  margin: "0 0 6px",
                  color: "var(--fg)",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  margin: "0 0 24px",
                }}
              >
                {subtitle}
              </p>

              {status === "error" && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "color-mix(in oklab, #ef4444 10%, transparent)",
                    border: "1px solid color-mix(in oklab, #ef4444 30%, transparent)",
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: 13,
                    color: "#ef4444",
                  }}
                >
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {fields.map((field) => {
                  if (field.type === "select") {
                    return (
                      <div key={field.name}>
                        <label
                          style={{
                            display: "block",
                            fontSize: 11,
                            fontFamily: "var(--font-mono)",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: "var(--text-secondary)",
                            marginBottom: 6,
                          }}
                        >
                          {field.label}
                          {field.required && " *"}
                        </label>
                        <select
                          value={formData[field.name] || ""}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          required={field.required}
                          disabled={status === "loading"}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid var(--op-border)",
                            borderRadius: 8,
                            background: "var(--bg)",
                            color: "var(--fg)",
                            fontSize: 14,
                            fontFamily: "inherit",
                            outline: "none",
                          }}
                        >
                          <option value="">Select...</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  if (field.type === "textarea") {
                    return (
                      <div key={field.name}>
                        <label
                          style={{
                            display: "block",
                            fontSize: 11,
                            fontFamily: "var(--font-mono)",
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: "var(--text-secondary)",
                            marginBottom: 6,
                          }}
                        >
                          {field.label}
                          {field.required && " *"}
                        </label>
                        <textarea
                          value={formData[field.name] || ""}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          required={field.required}
                          disabled={status === "loading"}
                          placeholder={field.placeholder}
                          rows={4}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid var(--op-border)",
                            borderRadius: 8,
                            background: "var(--bg)",
                            color: "var(--fg)",
                            fontSize: 14,
                            fontFamily: "inherit",
                            resize: "vertical",
                            outline: "none",
                          }}
                        />
                      </div>
                    );
                  }

                  return (
                    <div key={field.name}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 11,
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          color: "var(--text-secondary)",
                          marginBottom: 6,
                        }}
                      >
                        {field.label}
                        {field.required && " *"}
                      </label>
                      <input
                        type={field.type}
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        required={field.required}
                        disabled={status === "loading"}
                        placeholder={field.placeholder}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "1px solid var(--op-border)",
                          borderRadius: 8,
                          background: "var(--bg)",
                          color: "var(--fg)",
                          fontSize: 14,
                          fontFamily: "inherit",
                          outline: "none",
                        }}
                      />
                    </div>
                  );
                })}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    marginTop: 8,
                    background: "var(--fg)",
                    color: "var(--bg)",
                    border: "none",
                    borderRadius: 999,
                    padding: "12px 24px",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    opacity: status === "loading" ? 0.6 : 1,
                  }}
                >
                  {status === "loading" ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
