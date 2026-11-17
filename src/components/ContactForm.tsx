"use client";

import { useState, type FormEvent } from "react";
import { SITE_LINKTREE, SITE_NAME } from "@/lib/site";

const TOPICS = [
  "Question about a chart or number",
  "Correction or data vintage",
  "Source or methodology",
  "Permissions / reuse",
  "Something else",
] as const;

function buildMessage(name: string, email: string, topic: string, body: string) {
  return [
    `Theta Scribe inquiry`,
    `From: ${name}`,
    email ? `Reply-to: ${email}` : null,
    `Topic: ${topic}`,
    "",
    body,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const message = buildMessage(name.trim(), email.trim(), topic, body.trim());
    try {
      await navigator.clipboard.writeText(message);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    window.open(SITE_LINKTREE, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-800">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-800">
          Email <span className="font-normal text-slate-500">(so we can reply)</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
        />
      </div>
      <div>
        <label htmlFor="contact-topic" className="block text-sm font-semibold text-slate-800">
          Topic
        </label>
        <select
          id="contact-topic"
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
        >
          {TOPICS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="contact-body" className="block text-sm font-semibold text-slate-800">
          Message
        </label>
        <textarea
          id="contact-body"
          name="message"
          required
          rows={7}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
        />
      </div>
      <p className="text-sm leading-relaxed text-slate-600">
        This site is statically hosted and does not run a private inbox. Submitting copies your
        note and opens the operator’s public profile — paste the message there. That profile is
        the working contact channel for {SITE_NAME}.
      </p>
      <button
        type="submit"
        className="inline-flex items-center rounded-lg bg-[#0f1629] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-800"
      >
        Copy note and open contact profile
      </button>
      {status === "copied" ? (
        <p className="text-sm font-medium text-cyan-800" role="status">
          Message copied. Paste it on the profile that just opened.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm font-medium text-amber-800" role="status">
          Clipboard permission was blocked. Copy your note manually, then use the public profile
          linked on this page.
        </p>
      ) : null}
    </form>
  );
}
