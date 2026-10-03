"use client";
import { useState, type FormEvent } from "react";
export default function ContactForm() {
  const [state, setState] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    setState("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(
          result.error || "Unable to send. Please use the email link.",
        );
      setState("Thank you. Your message has been received.");
      form.reset();
    } catch (e) {
      setState(
        e instanceof Error
          ? e.message
          : "Unable to send. Please use the email link.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="contact-form" onSubmit={submit}>
      <div>
        <label>
          Your name
          <input name="name" required maxLength={120} autoComplete="name" />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
          />
        </label>
      </div>
      <label>
        What do you have in mind?
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={4}
        />
      </label>
      <label className="honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button className="button button-light" disabled={busy}>
        {busy ? "Sending…" : "Send message ↗"}
      </button>
      <p role="status">{state}</p>
    </form>
  );
}
