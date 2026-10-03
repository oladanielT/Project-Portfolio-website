"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="page-width case-study">
      <p className="eyebrow">A MOMENT, PLEASE</p>
      <h1>
        Something didn’t
        <br />
        come together.
      </h1>
      <p className="case-lead">Please try again in a moment.</p>
      <button
        className="button button-primary"
        onClick={reset}
        style={{ marginTop: 30 }}
      >
        Try again ↗
      </button>
    </main>
  );
}
