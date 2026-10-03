import re

# Update Portfolio.tsx
with open('components/templates/Architect/Portfolio.tsx', 'r') as f:
    content = f.read()

about_section = r'<section id="about" className="about-section">'
about_section_replacement = '<section id="about" className="about-section">\n            <div className="about-bg-shape"></div>'

if '<div className="about-bg-shape"></div>' not in content:
    content = content.replace(about_section, about_section_replacement)

with open('components/templates/Architect/Portfolio.tsx', 'w') as f:
    f.write(content)

# Update styles.css
with open('components/templates/Architect/styles.css', 'r') as f:
    css = f.read()

# Make about-section relative if not already
css = css.replace('.about-section {\n  display: flex;', '.about-section {\n  position: relative;\n  z-index: 1;\n  display: flex;')

# Add about-bg-shape
about_css = """
.about-bg-shape {
  position: absolute;
  top: -10%;
  bottom: -10%;
  left: 15%;
  right: 0;
  background: var(--color-cta-bg);
  z-index: -1;
  border-top-left-radius: 300px;
  border-bottom-left-radius: 300px;
}
"""

if '.about-bg-shape' not in css:
    css = css.replace('/* --- ABOUT SECTION --- */', '/* --- ABOUT SECTION --- */' + about_css)

with open('components/templates/Architect/styles.css', 'w') as f:
    f.write(css)

