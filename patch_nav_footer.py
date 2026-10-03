import re

# Update Portfolio.tsx
with open('components/templates/Architect/Portfolio.tsx', 'r') as f:
    content = f.read()

new_footer = """
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
"""

# Replace old footer
content = re.sub(r'<footer className="site-footer">.*</footer>', new_footer.strip(), content, flags=re.DOTALL)

with open('components/templates/Architect/Portfolio.tsx', 'w') as f:
    f.write(content)


# Update styles.css
with open('components/templates/Architect/styles.css', 'r') as f:
    css = f.read()

# Nav padding
css = css.replace('padding: 1.5rem 5%;', 'padding: 0.85rem 5%;')

# Footer styles replacement
old_footer_css = r'/\* --- FOOTER \(SIMPLIFIED\) ---\*/.*'
new_footer_css = """/* --- FOOTER --- */
.site-footer {
  padding: 4rem 5% 2rem;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}
.footer-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}
.footer-social-wrapper {
  display: flex;
  gap: 1.5rem;
}
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: var(--color-bg);
  color: var(--color-text);
  opacity: 0.8;
  border: 1px solid var(--color-border);
  transition: transform 0.3s, opacity 0.3s;
}
.social-icon:hover { 
  opacity: 1; 
  transform: translateY(-3px); 
}
.footer-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}
.copyright {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin: 0;
}
.legal-links {
  display: flex;
  gap: 2rem;
}
.legal-links a {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;
}
.legal-links a:hover {
  color: var(--color-text);
}

@media (max-width: 768px) {
  .footer-top-row, .footer-bottom-row {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
}
"""

css = re.sub(r'/\* --- FOOTER \(SIMPLIFIED\) ---\*/.*', new_footer_css, css, flags=re.DOTALL)

with open('components/templates/Architect/styles.css', 'w') as f:
    f.write(css)

# Update MotionScene.tsx
with open('components/templates/Architect/MotionScene.tsx', 'r') as f:
    motion = f.read()

smart_nav_js = """
      // Smart Header (Hide on scroll down, show on scroll up)
      const nav = document.querySelector(".site-nav") as HTMLElement;
      if (nav) {
        ScrollTrigger.create({
          start: "top top",
          end: "max",
          onUpdate: (self) => {
            const currentScroll = self.scroll();
            if (currentScroll > 150) {
              if (self.direction === 1) {
                // scrolling down
                gsap.to(nav, { yPercent: -100, duration: 0.3, ease: "power2.out", overwrite: true });
              } else {
                // scrolling up
                gsap.to(nav, { yPercent: 0, duration: 0.3, ease: "power2.out", overwrite: true });
              }
            } else {
              gsap.to(nav, { yPercent: 0, duration: 0.3, ease: "power2.out", overwrite: true });
            }
          }
        });
      }
"""

if 'Smart Header' not in motion:
    motion = motion.replace('// Abstract SVGs subtle animations', smart_nav_js + '\n      // Abstract SVGs subtle animations')

with open('components/templates/Architect/MotionScene.tsx', 'w') as f:
    f.write(motion)

