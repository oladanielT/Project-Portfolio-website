"use client";
import { useEffect, useState, useRef, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { browserClient } from "@/lib/supabase/browser";
import type { SiteContent } from "@/lib/schema";
import { projectStorySections } from "@/lib/schema";

type Path = (string | number)[];
type Revision = { id: number; created_at: string };
type Media = { id: string; name: string; mime: string; size: number };
type Inquiry = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};
const tabs = [
  ["overview", "Overview", "◈"],
  ["hero", "Introduction", "↗"],
  ["about", "Your story", "◎"],
  ["projects", "Selected work", "▤"],
  ["expertise", "Expertise & approach", "✳"],
  ["organizations", "Organizations", "◇"],
  ["tools", "Your toolkit", "⌘"],
  ["testimonial", "Testimonial", "“"],
  ["faqs", "Frequently asked questions", "?"],
  ["contact", "Contact & links", "↗"],
  ["media", "Media library", "▧"],
  ["inquiries", "Inquiries", "✉"],
  ["settings", "Visibility & SEO", "⚙"],
  ["history", "Publishing history", "↶"],
];
async function api(url: string, body?: unknown) {
  const res = await fetch(
    url,
    body
      ? {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : { cache: "no-store" },
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}
function date(value?: string) {
  return value ? new Date(value).toLocaleString() : "Not yet";
}
function Field({
  label,
  value,
  onChange,
  large = false,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  large?: boolean;
  hint?: string;
  type?: string;
}) {
  return (
    <label className="editor-field">
      <span>{label}</span>
      {large ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}
function Panel({
  title,
  children,
  description,
}: {
  title: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <section className="editor-panel">
      <div className="panel-heading">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </section>
  );
}
function CollectionActions({
  index,
  length,
  move,
  remove,
}: {
  index: number;
  length: number;
  move: (to: number) => void;
  remove: () => void;
}) {
  return (
    <div className="collection-actions">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => move(index - 1)}
        aria-label="Move item up"
      >
        ↑
      </button>
      <button
        type="button"
        disabled={index === length - 1}
        onClick={() => move(index + 1)}
        aria-label="Move item down"
      >
        ↓
      </button>
      <button type="button" className="remove-item" onClick={remove}>
        Remove
      </button>
    </div>
  );
}
function MediaField({
  label,
  value,
  onChange,
  pdf = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void | Promise<void>;
  pdf?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      if (file.size > 8 * 1024 * 1024)
        throw new Error("Choose a file up to 8 MB.");
      const form = new FormData();
      form.set("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="media-field">
      <Field
        label={label}
        value={value}
        onChange={onChange}
        hint="Paste an HTTPS link, choose a library URL, or upload a file."
      />
      <label className="upload-button">
        {busy ? "Uploading…" : pdf ? "Upload PDF +" : "Upload image +"}
        <input
          type="file"
          accept={pdf ? "application/pdf" : "image/jpeg,image/png,image/webp"}
          disabled={busy}
          onChange={(e) => {
            void upload(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>
      {value && !pdf && (
        <img
          className="editor-image-preview"
          src={value}
          alt="Current image preview"
        />
      )}
      {error && (
        <p className="admin-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
export default function Editor({
  email,
  mediaReady,
}: {
  email: string;
  mediaReady: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [tab, setTab] = useState("overview");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [version, setVersion] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [savedAt, setSavedAt] = useState<string>();
  const [publishedAt, setPublishedAt] = useState<string>();
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [confirmPublish, setConfirmPublish] = useState(false);
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const result = await api("/api/admin/content");
      setContent(result.content);
      setVersion(result.version);
      setSavedAt(result.savedAt);
      setPublishedAt(result.publishedAt);
      setRevisions(result.revisions || []);
      setDirty(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load content");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  useEffect(() => {
    if (confirmPublish) dialogRef.current?.showModal();
  }, [confirmPublish]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    if (tab !== "media" && tab !== "inquiries") return;
    let active = true;
    setError("");
    void api(`/api/admin/${tab === "media" ? "upload" : "inquiries"}`)
      .then((data) => {
        if (active) {
          if (tab === "media") setMedia(data);
          else setInquiries(data);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [tab]);
  function update(path: Path, value: unknown) {
    setContent((previous) => {
      if (!previous) return previous;
      const next = structuredClone(previous);
      let target: any = next;
      path.slice(0, -1).forEach((key) => {
        target = target[key];
      });
      target[path[path.length - 1]] = value;
      return next;
    });
    setDirty(true);
    setNotice("");
  }
  function read(path: Path): any {
    let value: any = content;
    path.forEach((key) => {
      value = value?.[key];
    });
    return value;
  }
  function field(label: string, path: Path, large = false, hint?: string) {
    return (
      <Field
        key={path.join(".")}
        label={label}
        value={read(path) || ""}
        onChange={(v) => update(path, v)}
        large={large}
        hint={hint}
      />
    );
  }
  function image(label: string, path: Path, pdf = false) {
    return (
      <MediaField
        key={path.join(".")}
        label={label}
        value={read(path) || ""}
        onChange={(v) => update(path, v)}
        pdf={pdf}
      />
    );
  }
  function framing(path: Path) {
    return (
      <label className="editor-field">
        <span>Portrait framing</span>
        <select
          value={read(path) || "50% 35%"}
          onChange={(e) => update(path, e.target.value)}
        >
          {[
            ["50% 20%", "Focus higher"],
            ["50% 35%", "Portrait balance"],
            ["50% 50%", "Center"],
            ["50% 75%", "Focus lower"],
          ].map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <small>Save and preview to check the crop on desktop and mobile.</small>
      </label>
    );
  }
  function actions(path: Path, i: number) {
    const items = read(path) as unknown[];
    return (
      <CollectionActions
        index={i}
        length={items.length}
        move={(to) => {
          const next = [...items];
          [next[i], next[to]] = [next[to], next[i]];
          update(path, next);
        }}
        remove={() => {
          if (window.confirm("Remove this item from the draft?"))
            update(
              path,
              items.filter((_, index) => index !== i),
            );
        }}
      />
    );
  }
  async function save() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await api("/api/admin/content", {
        action: "save",
        content,
        version,
      });
      setVersion(result.version);
      setContent(result.content);
      setDirty(false);
      setSavedAt(new Date().toISOString());
      setNotice("Draft saved. The live portfolio has not changed.");
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save");
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function publish() {
    setBusy(true);
    setError("");
    try {
      await api("/api/admin/content", { action: "publish", version });
      setConfirmPublish(false);
      await load();
      setNotice("Your portfolio is published.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to publish");
    } finally {
      setBusy(false);
    }
  }
  async function restore(id: number) {
    if (
      !window.confirm(
        "Replace the current draft with this version? The live site will stay unchanged until you publish.",
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      const result = await api("/api/admin/content", {
        action: "restore",
        id,
        version,
      });
      setContent(result.content);
      setVersion(result.version);
      setDirty(false);
      setSavedAt(new Date().toISOString());
      setNotice("Version restored as a draft. Preview it before publishing.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to restore");
    } finally {
      setBusy(false);
    }
  }
  async function signOut() {
    if (dirty && !window.confirm("Leave without saving your changes?")) return;
    setBusy(true);
    try {
      const { error } = await browserClient().auth.signOut();
      if (error) throw error;
      router.refresh();
    } catch {
      setError("Unable to sign out. Try again.");
      setBusy(false);
    }
  }
  const selected = tabs.find((t) => t[0] === tab)!;
  return (
    <div className="studio">
      <aside className="studio-sidebar">
        <Link href="/" className="admin-wordmark">
          Portfolio
          <br />
          studio<span>.</span>
        </Link>
        <span className="sidebar-label">MAKE IT YOURS</span>
        <nav aria-label="Admin sections">
          {tabs.map(([id, label, icon]) => (
            <button
              key={id}
              className={tab === id ? "selected" : ""}
              aria-current={tab === id ? "page" : undefined}
              onClick={() => {
                setTab(id);
                setError("");
              }}
            >
              <span aria-hidden="true">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span>{email}</span>
          <button onClick={signOut} disabled={busy}>
            Sign out ↗
          </button>
        </div>
      </aside>
      <main className="studio-main">
        <header className="studio-toolbar">
          <div>
            <span className={`save-indicator ${dirty ? "unsaved" : ""}`} />
            {dirty
              ? "Unsaved changes"
              : version
                ? "Draft saved"
                : "Your portfolio studio"}
          </div>
          <div className="toolbar-actions">
            <Link href="/" target="_blank">
              View site ↗
            </Link>
            {!dirty && version > 0 ? (
              <Link
                href="/admin/preview"
                target="_blank"
                className="admin-button"
              >
                Preview
              </Link>
            ) : (
              <button
                className="admin-button"
                disabled
                title="Save your draft before previewing"
              >
                Preview
              </button>
            )}
            <button
              className="admin-button"
              onClick={save}
              disabled={busy || !content || (!dirty && version > 0)}
            >
              {busy ? "Working…" : "Save draft"}
            </button>
            <button
              className="admin-button primary"
              disabled={busy || dirty || version === 0}
              onClick={() => setConfirmPublish(true)}
            >
              Publish ↗
            </button>
          </div>
        </header>
        <div className="studio-content">
          <div className="studio-heading">
            <p className="eyebrow">
              YOUR PORTFOLIO / {selected[1].toUpperCase()}
            </p>
            <h1>
              {tab === "overview"
                ? "A little progress, every day."
                : selected[1]}
              <em>{tab === "overview" ? "" : "."}</em>
            </h1>
            <p>
              {tab === "overview"
                ? "Your story and your work, all in one place."
                : "Make your changes, save a draft, and preview before publishing."}
            </p>
          </div>
          {!mediaReady && (
            <div className="admin-notice warning">
              Add the server-only Supabase service key to enable public access
              to uploaded media and the inquiry form. Existing external image
              links continue to work.
            </div>
          )}
          {error && (
            <div className="admin-notice error" role="alert">
              {error}
            </div>
          )}
          {notice && (
            <div className="admin-notice" role="status">
              {notice}
            </div>
          )}
          {loading && <p className="loading-state">Opening your studio…</p>}
          {!loading && !content && (
            <button className="admin-button" onClick={load}>
              Try again
            </button>
          )}
          {content && !loading && (
            <fieldset className="editor-fields" disabled={busy}>
              {tab === "overview" && (
                <>
                  <div className="overview-stats">
                    <div>
                      <span>SELECTED PROJECTS</span>
                      <strong>
                        {String(content.projects.length).padStart(2, "0")}
                      </strong>
                      <button onClick={() => setTab("projects")}>
                        Manage your work ↗
                      </button>
                    </div>
                    <div>
                      <span>LAST DRAFT SAVED</span>
                      <strong className="stat-date">{date(savedAt)}</strong>
                      <button onClick={() => setTab("hero")}>
                        Keep creating ↗
                      </button>
                    </div>
                    <div>
                      <span>LAST PUBLISHED</span>
                      <strong className="stat-date">{date(publishedAt)}</strong>
                      <button onClick={() => setTab("history")}>
                        View history ↗
                      </button>
                    </div>
                  </div>
                  <Panel
                    title="Your next chapter starts here."
                    description="The live portfolio stays exactly as it is while you work on a draft."
                  >
                    <div className="workflow">
                      <div>
                        <span>01</span>
                        <h3>Make it yours</h3>
                        <p>
                          Update your story, add a project, or upload a fresh
                          photograph.
                        </p>
                      </div>
                      <div>
                        <span>02</span>
                        <h3>Take a look</h3>
                        <p>
                          Save your draft and preview the full page before it
                          goes live.
                        </p>
                      </div>
                      <div>
                        <span>03</span>
                        <h3>Share the progress</h3>
                        <p>
                          Publish when ready. Previous publications stay in your
                          history.
                        </p>
                      </div>
                    </div>
                  </Panel>
                  <div className="admin-notice">
                    Your working approach and toolkit start hidden. Confirm the
                    process wording and add only tools you use, then enable them
                    in Visibility & SEO.
                  </div>
                </>
              )}
              {tab === "hero" && (
                <Panel
                  title="A memorable first impression"
                  description="Keep the name, role, and introduction unmistakably you."
                >
                  {field("Full name", ["hero", "name"])}
                  {field("Role / professional title", ["hero", "title"])}
                  {field("Portrait caption", ["hero", "eyebrow"])}
                  {field("Introduction", ["hero", "intro"], true)}
                  {field("Main button label", ["hero", "ctaLabel"])}
                  {image("Hero portrait", ["hero", "photo"])}
                  {framing(["hero", "photoPosition"])}
                </Panel>
              )}
              {tab === "about" && (
                <Panel title="The person behind the work">
                  {field("Section heading", ["about", "heading"])}
                  {image("About portrait", ["about", "photo"])}
                  {framing(["about", "photoPosition"])}
                  {content.about.paragraphs.map((_, i) => (
                    <div className="collection-item" key={i}>
                      {field(
                        `Paragraph ${i + 1}`,
                        ["about", "paragraphs", i],
                        true,
                      )}
                      {actions(["about", "paragraphs"], i)}
                    </div>
                  ))}
                  <button
                    className="admin-button"
                    onClick={() =>
                      update(
                        ["about", "paragraphs"],
                        [...content.about.paragraphs, ""],
                      )
                    }
                  >
                    Add paragraph +
                  </button>
                </Panel>
              )}
              {tab === "projects" && (
                <>
                  <div className="admin-notice">
                    The featured project appears first on the homepage.
                    Case-study blocks are optional: add only details you can
                    substantiate.
                  </div>
                  {content.projects.map((p, i) => (
                    <Panel
                      key={i}
                      title={`${String(i + 1).padStart(2, "0")} / ${p.title || "New project"}`}
                    >
                      <div className="editor-two-col">
                        {field("Project title", ["projects", i, "title"])}
                        {field(
                          "URL slug",
                          ["projects", i, "slug"],
                          false,
                          "Lowercase words separated with hyphens.",
                        )}
                        {field("Organization", ["projects", i, "org"])}
                        {field("Category", ["projects", i, "category"])}
                      </div>
                      {field("Your role", ["projects", i, "role"])}
                      {field("Overview", ["projects", i, "description"], true)}
                      {image("Project cover", ["projects", i, "cover"])}
                      <h3 className="subsection-title">Project story</h3>
                      <Field
                        label="The challenge"
                        value={p.challenge || projectStorySections(p).find((b) => /challenge/i.test(b.heading))?.body || ""}
                        large
                        onChange={(v) => update(["projects", i, "challenge"], v)}
                      />
                      <Field
                        label="My approach"
                        value={p.approach || projectStorySections(p).find((b) => /approach/i.test(b.heading))?.body || ""}
                        large
                        onChange={(v) => update(["projects", i, "approach"], v)}
                      />
                      <Field
                        label="The result"
                        value={p.result || projectStorySections(p).find((b) => /result/i.test(b.heading))?.body || ""}
                        large
                        onChange={(v) => update(["projects", i, "result"], v)}
                      />
                      <Field
                        label="Results / outcomes"
                        value={p.stats.join("\n")}
                        large
                        onChange={(v) =>
                          update(["projects", i, "stats"], v.split("\n"))
                        }
                        hint="One outcome per line. Keep numbers tied to this project."
                      />
                      {field("External project or case-study URL (optional)", [
                        "projects",
                        i,
                        "caseStudyUrl",
                      ])}
                      <label className="toggle-field">
                        <input
                          type="checkbox"
                          checked={p.featured}
                          onChange={(e) =>
                            update(
                              ["projects"],
                              content.projects.map((item, index) => ({
                                ...item,
                                featured:
                                  index === i ? e.target.checked : false,
                              })),
                            )
                          }
                        />
                        <span>Feature this project on the homepage</span>
                      </label>
                      <h3 className="subsection-title">Case-study sections</h3>
                      {p.blocks.map((b, j) => (
                        <div className="collection-item" key={j}>
                          {field("Heading", [
                            "projects",
                            i,
                            "blocks",
                            j,
                            "heading",
                          ])}
                          {field(
                            "Story / details",
                            ["projects", i, "blocks", j, "body"],
                            true,
                          )}
                          {image("Supporting image (optional)", [
                            "projects",
                            i,
                            "blocks",
                            j,
                            "image",
                          ])}
                          {field("Image description", [
                            "projects",
                            i,
                            "blocks",
                            j,
                            "alt",
                          ])}
                          {actions(["projects", i, "blocks"], j)}
                        </div>
                      ))}
                      <button
                        className="admin-button"
                        onClick={() =>
                          update(
                            ["projects", i, "blocks"],
                            [
                              ...p.blocks,
                              { heading: "", body: "", image: "", alt: "" },
                            ],
                          )
                        }
                      >
                        Add case-study section +
                      </button>
                      {actions(["projects"], i)}
                    </Panel>
                  ))}
                  <button
                    className="admin-button primary"
                    onClick={() =>
                      update(
                        ["projects"],
                        [
                          ...content.projects,
                          {
                            title: "New project",
                            slug: `project-${Date.now()}`,
                            org: "",
                            cover: "",
                            description: "",
                            stats: [],
                            caseStudyUrl: "",
                            category: "",
                            role: "",
                            featured: false,
                            blocks: [],
                          },
                        ],
                      )
                    }
                  >
                    Add project +
                  </button>
                </>
              )}
              {tab === "expertise" && (
                <>
                  <Panel title="Where you make a difference">
                    {content.expertise.map((e, i) => (
                      <div className="collection-item" key={i}>
                        {field("Expertise title", ["expertise", i, "title"])}
                        {field(
                          "Description",
                          ["expertise", i, "description"],
                          true,
                        )}
                        <Field
                          label="Skills"
                          large
                          value={e.skills.join("\n")}
                          onChange={(v) =>
                            update(["expertise", i, "skills"], v.split("\n"))
                          }
                          hint="One skill per line."
                        />
                        {actions(["expertise"], i)}
                      </div>
                    ))}
                    <button
                      className="admin-button"
                      onClick={() =>
                        update(
                          ["expertise"],
                          [
                            ...content.expertise,
                            { title: "", description: "", skills: [] },
                          ],
                        )
                      }
                    >
                      Add expertise +
                    </button>
                  </Panel>
                  <Panel
                    title="Your working approach"
                    description="Review these proposed steps against your actual practice. Enable this section in Visibility & SEO when ready."
                  >
                    {content.process.map((p, i) => (
                      <div className="collection-item" key={i}>
                        {field("Step title", ["process", i, "title"])}
                        {field(
                          "Description",
                          ["process", i, "description"],
                          true,
                        )}
                        {actions(["process"], i)}
                      </div>
                    ))}
                    <button
                      className="admin-button"
                      onClick={() =>
                        update(
                          ["process"],
                          [...content.process, { title: "", description: "" }],
                        )
                      }
                    >
                      Add step +
                    </button>
                  </Panel>
                </>
              )}
              {tab === "organizations" && (
                <Panel
                  title="Teams you’ve worked with"
                  description="Organization names appear as a clean wordmark strip. Confirm your relationship before publishing."
                >
                  {content.organizations.map((o, i) => (
                    <div className="collection-item" key={i}>
                      {field("Organization name", ["organizations", i, "name"])}
                      {field("Industry / context", [
                        "organizations",
                        i,
                        "detail",
                      ])}
                      {actions(["organizations"], i)}
                    </div>
                  ))}
                  <button
                    className="admin-button"
                    onClick={() =>
                      update(
                        ["organizations"],
                        [
                          ...content.organizations,
                          { name: "", detail: "", url: "" },
                        ],
                      )
                    }
                  >
                    Add organization +
                  </button>
                </Panel>
              )}
              {tab === "tools" && (
                <Panel
                  title="The tools behind the work"
                  description="Add the tools you actually use. The section stays hidden until it has content and is enabled in Visibility & SEO."
                >
                  {content.tools.length === 0 && (
                    <p className="empty-state">
                      A fresh toolkit. Add your first tool below.
                    </p>
                  )}
                  {content.tools.map((t, i) => (
                    <div className="collection-item" key={i}>
                      {field("Tool name", ["tools", i, "name"])}
                      {field("What you use it for", ["tools", i, "purpose"])}
                      {image("Tool logo (optional)", ["tools", i, "logo"])}
                      {actions(["tools"], i)}
                    </div>
                  ))}
                  <button
                    className="admin-button"
                    onClick={() =>
                      update(
                        ["tools"],
                        [...content.tools, { name: "", purpose: "", logo: "" }],
                      )
                    }
                  >
                    Add tool +
                  </button>
                </Panel>
              )}
              {tab === "testimonial" && (
                <Panel
                  title="Client testimonials"
                  description="These saved testimonials are shared across portfolio templates."
                >
                  {(content.testimonials || []).map((testimonial, i) => (
                    <div className="collection-item" key={i}>
                      {field("Quote", ["testimonials", i, "quote"], true)}
                      {field("Person’s name", ["testimonials", i, "name"])}
                      {field("Role and organization", ["testimonials", i, "role"])}
                      {actions(["testimonials"], i)}
                    </div>
                  ))}
                  <button
                    className="admin-button"
                    onClick={() =>
                      update(
                        ["testimonials"],
                        [
                          ...(content.testimonials || []),
                          { quote: "", name: "", role: "" },
                        ],
                      )
                    }
                  >
                    Add testimonial +
                  </button>
                </Panel>
              )}
              {tab === "faqs" && (
                <Panel
                  title="Frequently asked questions"
                  description="Manage FAQ content here for portfolio templates that include an FAQ section."
                >
                  {(content.faqs || []).map((faq, i) => (
                    <div className="collection-item" key={i}>
                      {field("Question", ["faqs", i, "question"])}
                      {field("Answer", ["faqs", i, "answer"], true)}
                      {actions(["faqs"], i)}
                    </div>
                  ))}
                  <button
                    className="admin-button"
                    onClick={() =>
                      update(
                        ["faqs"],
                        [...(content.faqs || []), { question: "", answer: "" }],
                      )
                    }
                  >
                    Add question +
                  </button>
                </Panel>
              )}
              {tab === "contact" && (
                <Panel title="Make the next conversation easy">
                  {field("Contact heading", ["contact", "heading"])}
                  {field("Supporting text", ["contact", "subheading"])}
                  {field("Email address", ["contact", "email"])}
                  {field("Location", ["contact", "location"])}
                  {field("GitHub profile URL (optional)", [
                    "contact",
                    "github",
                  ])}
                  {field("LinkedIn profile URL (optional)", [
                    "contact",
                    "linkedin",
                  ])}
                  {field("Instagram profile URL (optional)", [
                    "contact",
                    "instagram",
                  ])}
                  {field("Facebook profile URL (optional)", [
                    "contact",
                    "facebook",
                  ])}
                  {field("Twitter profile URL (optional)", [
                    "contact",
                    "twitter",
                  ])}
                  {image("CV / résumé (optional)", ["contact", "cv"], true)}
                  <label className="toggle-field">
                    <input
                      type="checkbox"
                      checked={content.contact.formEnabled}
                      onChange={(e) =>
                        update(["contact", "formEnabled"], e.target.checked)
                      }
                    />
                    <span>Show the inquiry form</span>
                  </label>
                  <p className="field-help">
                    Messages are stored in Inquiries. The form requires the
                    server-only service key; email links always remain
                    available.
                  </p>
                </Panel>
              )}
              {tab === "settings" && (
                <>
                  <Panel
                    title="Choose what the world sees"
                    description="Turn sections on as your portfolio grows. Empty tools and organization lists stay hidden automatically."
                  >
                    {Object.entries(content.sections).map(([key, value]) => (
                      <label className="toggle-field" key={key}>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            update(["sections", key], e.target.checked)
                          }
                        />
                        <span>
                          {
                            (
                              {
                                organizations: "Organizations",
                                about: "Your story",
                                work: "Selected work",
                                expertise: "Expertise",
                                process: "Working approach",
                                tools: "Toolkit",
                                testimonial: "Testimonial",
                                faqs: "Frequently asked questions",
                              } as Record<string, string>
                            )[key]
                          }
                        </span>
                      </label>
                    ))}
                  </Panel>
                  <Panel title="Search & sharing">
                    {field("Page title", ["seo", "title"])}
                    {field(
                      "Page description",
                      ["seo", "description"],
                      true,
                      "A clear summary of who you are and what you do.",
                    )}
                  </Panel>
                  <Panel title="Design & Theming">
                    <label className="editor-field">
                                            <span>Template layout</span>
                      <select
                        value={content.template || "architect"}
                        onChange={(e) => update(["template"], e.target.value)}
                        className="editor-select"
                      >
                        <option value="architect">01 — The Architect (Blueprint / Technical)</option>
                        <option value="visionary">02 — The Visionary (Cinematic / Immersive)</option>
                        <option value="bento">03 — Bento Creator (Modular Blocks)</option>
                        <option value="noir">04 — Noir (Pitch Black Luxury)</option>
                        <option value="bold">05 — The Bold (Brutalist / Experimental)</option>
                        <option value="aurora">06 — Aurora (Organic Gradients)</option>
                        <option value="elegant">-- Legacy Classic --</option>
                      </select>
                    </label>
                    <label className="editor-field">
                      <span>Color mode</span>
                      <select
                        value={content.colorMode || "light"}
                        onChange={(e) => update(["colorMode"], e.target.value)}
                        className="editor-select"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="pitch-black">Pitch Black (OLED)</option>
                        <option value="cream">Cream (Warm Neutral)</option>
                        <option value="vibrant">Vibrant</option>
                        <option value="sunset">Sunset (Orange/Pink)</option>
                        <option value="ocean">Ocean (Cyan/Blue)</option>
                        <option value="forest">Forest (Green)</option>
                        <option value="candy">Candy (Multi-color)</option>
                      </select>
                    </label>
                  </Panel>
                </>
              )}
              {tab === "media" && (
                <Panel
                  title="Your media library"
                  description="Files stay private until used in a published page. Upload through an image field, or add a file here."
                >
                  <MediaField
                    label="Upload a new image"
                    value=""
                    onChange={async () => {
                      setMedia(await api("/api/admin/upload"));
                      setNotice(
                        "Image uploaded. Copy its URL below to use it in a content field.",
                      );
                    }}
                  />
                  {media.length === 0 && (
                    <p className="empty-state">
                      No uploads yet. Your existing external image links
                      continue to work.
                    </p>
                  )}
                  <div className="media-grid">
                    {media.map((m) => (
                      <div className="media-tile" key={m.id}>
                        {m.mime.startsWith("image/") ? (
                          <img src={`/api/media/${m.id}`} alt={m.name} />
                        ) : (
                          <span className="pdf-tile">PDF</span>
                        )}
                        <strong>{m.name}</strong>
                        <small>{Math.round(m.size / 1024)} KB</small>
                        <input
                          aria-label={`URL for ${m.name}`}
                          readOnly
                          value={`/api/media/${m.id}`}
                          onFocus={(e) => e.target.select()}
                        />
                        <button
                          className="admin-button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(
                                `/api/media/${m.id}`,
                              );
                              setNotice(
                                "Media URL copied. Paste it into an image or document field.",
                              );
                            } catch {
                              setError(
                                "Select and copy the URL from the field above.",
                              );
                            }
                          }}
                        >
                          Copy URL
                        </button>
                      </div>
                    ))}
                  </div>
                </Panel>
              )}
              {tab === "inquiries" && (
                <Panel
                  title="New conversations"
                  description="Messages sent through your portfolio appear here. Reply using your email app."
                >
                  {inquiries.length === 0 && (
                    <p className="empty-state">No inquiries yet.</p>
                  )}
                  {inquiries.map((inquiry) => (
                    <article key={inquiry.id} className="inquiry-card">
                      <div>
                        <h3>{inquiry.name}</h3>
                        <time>{date(inquiry.created_at)}</time>
                      </div>
                      <a href={`mailto:${inquiry.email}`}>{inquiry.email} ↗</a>
                      <p>{inquiry.message}</p>
                      <label>
                        Status
                        <select
                          value={inquiry.status}
                          onChange={async (e) => {
                            const status = e.target.value;
                            try {
                              await api("/api/admin/inquiries", {
                                id: inquiry.id,
                                status,
                              });
                              setInquiries((items) =>
                                items.map((item) =>
                                  item.id === inquiry.id
                                    ? { ...item, status }
                                    : item,
                                ),
                              );
                            } catch (e) {
                              setError(
                                e instanceof Error
                                  ? e.message
                                  : "Unable to update",
                              );
                            }
                          }}
                        >
                          {["new", "contacted", "archived"].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                    </article>
                  ))}
                </Panel>
              )}
              {tab === "history" && (
                <Panel
                  title="Every chapter, kept"
                  description="Restore a previous publication into your draft. Preview and publish it when you’re ready."
                >
                  {revisions.length === 0 && (
                    <p className="empty-state">
                      Your first published version will appear here.
                    </p>
                  )}
                  {revisions.map((r, i) => (
                    <div className="revision-row" key={r.id}>
                      <div>
                        <strong>
                          Version {r.id}{" "}
                          {i === 0 && <span>Latest publication</span>}
                        </strong>
                        <p>{date(r.created_at)}</p>
                      </div>
                      <button
                        className="admin-button"
                        onClick={() => restore(r.id)}
                        disabled={busy}
                      >
                        Restore as draft ↶
                      </button>
                    </div>
                  ))}
                </Panel>
              )}
            </fieldset>
          )}
          {confirmPublish && (
            <dialog
              ref={dialogRef}
              className="publish-review"
              aria-labelledby="publish-title"
              onCancel={(e) => {
                e.preventDefault();
                setConfirmPublish(false);
              }}
            >
              <div>
                <p className="eyebrow">READY FOR THE WORLD</p>
                <h2 id="publish-title">Publish your latest chapter?</h2>
                <p>
                  This will replace the live portfolio with your saved draft.
                  Your current publication remains in history.
                </p>
                <a
                  href="/admin/preview"
                  target="_blank"
                  rel="noreferrer"
                  className="text-link"
                >
                  One last preview ↗
                </a>
                <div className="publish-actions">
                  <button
                    className="admin-button"
                    autoFocus
                    onClick={() => setConfirmPublish(false)}
                    disabled={busy}
                  >
                    Keep editing
                  </button>
                  <button
                    className="admin-button primary"
                    onClick={publish}
                    disabled={busy}
                  >
                    {busy ? "Publishing…" : "Publish now ↗"}
                  </button>
                </div>
                {error && (
                  <p role="alert" className="admin-error">
                    {error}
                  </p>
                )}
              </div>
            </dialog>
          )}
        </div>
      </main>
    </div>
  );
}
