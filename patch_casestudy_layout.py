import re

with open('components/CaseStudy.tsx', 'r') as f:
    content = f.read()

architect_components = """
const SocialIcon = ({ type, url }: { type: string; url?: string }) => {
    const paths: Record<string, string> = {
        facebook: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
        twitter: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
        instagram: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M6.5 6.5h.01 M21 12v-2a9 9 0 00-9-9 9 9 0 00-9 9v2a9 9 0 009 9 9 9 0 009-9z",
        linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z"
    };
    return (
    <a href={url || '#'} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label={type}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d={paths[type]}></path>
        {type === 'instagram' && <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>}
      </svg>
    </a>
    );
};

const ArchitectNav = ({ c, base }: { c: SiteContent; base: string }) => {
  const prefix = base ? base : "/";
  return (
      <nav className="site-nav">
        <div className="nav-left">
          <Link href={`${prefix}#hero`} className="brand-logo">{c.hero.name}</Link>
        </div>
        <div className="nav-center">
          <Link href={`${prefix}#hero`}>Home</Link>
          {c.sections.about && <Link href={`${prefix}#about`}>About</Link>}
          {c.sections.work && <Link href={`${prefix}#work`}>Work</Link>}
          {c.sections.organizations && <Link href={`${prefix}#partners`}>Partners</Link>}
          <Link href={`${prefix}#contact`}>Contact</Link>
        </div>
        <div className="nav-right">
          <Link href={`${prefix}#contact`} className="btn-primary btn-small">Let's Talk</Link>
        </div>
      </nav>
  );
};

const ArchitectFooter = ({ c }: { c: SiteContent }) => {
  return (
      <footer className="site-footer">
        <div className="footer-top-row">
          <div className="footer-brand">
             <Link href="#hero" className="brand-logo">{c.hero.name}</Link>
          </div>
          <div className="footer-social-wrapper">
             <SocialIcon type="twitter" url={c.contact.twitter} />
             <SocialIcon type="facebook" url={c.contact.facebook} />
             <SocialIcon type="instagram" url={c.contact.instagram} />
             <SocialIcon type="linkedin" url={c.contact.linkedin} />
          </div>
        </div>
        <div className="footer-bottom-row">
          <p className="copyright">
             &copy; {new Date().getFullYear()} {c.hero.name}. All rights reserved.
          </p>
          <div className="legal-links">
             <a href="#">Privacy Policy</a>
             <a href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
  );
};
"""

# Insert components before the main CaseStudy component
content = re.sub(r'(export default function CaseStudy)', architect_components + r'\n\1', content)

# Replace Nav with conditional Nav
nav_replacement = """
      {(!c.template || c.template === "architect") ? (
        <ArchitectNav c={c} base={base} />
      ) : (
        <Nav name={c.hero.name} home base={base} sections={c.sections} />
      )}
"""
content = content.replace('<Nav name={c.hero.name} home base={base} sections={c.sections} />', nav_replacement.strip())

# Insert Footer before </main>
footer_replacement = """
    </main>
    {(!c.template || c.template === "architect") && <ArchitectFooter c={c} />}
"""
content = content.replace('</main>', footer_replacement.strip())

with open('components/CaseStudy.tsx', 'w') as f:
    f.write(content)

