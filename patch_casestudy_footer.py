import re

with open('components/CaseStudy.tsx', 'r') as f:
    content = f.read()

footer_replacement = """
          <div className="footer-brand-col">
             <Link href={`${prefix}#hero`} className="brand-logo">
                <span className="name-full">{c.hero.name}</span>
                <span className="name-short">{c.hero.name.split(' ')[0]}</span>
             </Link>
             <div className="footer-contact-info" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.8 }}>
                <a href={`mailto:${c.contact.email}`} className="contact-link">{c.contact.email}</a>
                {c.contact.location && <span className="contact-link">{c.contact.location}</span>}
             </div>
          </div>
"""
content = re.sub(r'<div className="footer-brand">.*?</div>', footer_replacement.strip(), content, flags=re.DOTALL)

with open('components/CaseStudy.tsx', 'w') as f:
    f.write(content)

