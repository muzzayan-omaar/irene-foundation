"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

type InquiryType = "PARTNER" | "IN_KIND" | "VOLUNTEER";

export default function InquiryForm({
  type,
  messagePlaceholder,
}: {
  type: InquiryType;
  messagePlaceholder: string;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        fullName,
        email,
        phone: phone || undefined,
        organizationName: organizationName || undefined,
        message,
      }),
    });

    if (res.ok) {
      setStatus("done");
      showToast("Message sent — we'll be in touch");
      if (type === "VOLUNTEER" || type === "PARTNER") {
        localStorage.setItem("hasJoinedMovement", "true");
      }
    } else {
      setStatus("error");
      showToast("Something went wrong — try again", "error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-ink/70">
        Thank you — we&apos;ve received your message and someone from the
        foundation will follow up soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <label htmlFor={`${type}-fullName`} className="sr-only">
        Full name
      </label>
      <input
        id={`${type}-fullName`}
        type="text"
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
        className="w-full rounded-md border border-ink/15 px-4 py-2.5 text-sm"
      />
      <label htmlFor={`${type}-email`} className="sr-only">
        Email
      </label>
      <input
        id={`${type}-email`}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full rounded-md border border-ink/15 px-4 py-2.5 text-sm"
      />
      <label htmlFor={`${type}-phone`} className="sr-only">
        Phone
      </label>
      <input
        id={`${type}-phone`}
        type="tel"
        placeholder="Phone (optional)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full rounded-md border border-ink/15 px-4 py-2.5 text-sm"
      />
      {type === "PARTNER" && (
        <>
          <label htmlFor={`${type}-org`} className="sr-only">
            Organization name
          </label>
          <input
            id={`${type}-org`}
            type="text"
            placeholder="Organization name"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            required
            className="w-full rounded-md border border-ink/15 px-4 py-2.5 text-sm"
          />
        </>
      )}
      <label htmlFor={`${type}-message`} className="sr-only">
        Message
      </label>
      <textarea
        id={`${type}-message`}
        placeholder={messagePlaceholder}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={4}
        className="w-full rounded-md border border-ink/15 px-4 py-2.5 text-sm"
      />

      {status === "error" && (
        <p className="text-red-500 text-sm">Something went wrong — please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-clay text-paper px-6 py-2.5 rounded-full font-semibold text-sm hover:brightness-105 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
