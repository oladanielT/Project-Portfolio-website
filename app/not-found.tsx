import Link from "next/link";
export default function NotFound() {
  return (
    <main className="page-width case-study">
      <p className="eyebrow">404 / A SMALL DETOUR</p>
      <h1>
        This page hasn’t
        <br />
        found its way here.
      </h1>
      <p className="case-lead">Let’s take you back to the work.</p>
      <Link
        className="button button-primary"
        href="/"
        style={{ marginTop: 30 }}
      >
        Back to portfolio ↗
      </Link>
    </main>
  );
}
