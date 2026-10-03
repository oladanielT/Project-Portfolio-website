import re

with open('components/templates/Architect/Portfolio.tsx', 'r') as f:
    content = f.read()

original_expertise = """
              <span className="section-eyebrow">STRATEGY</span>
              <h2 className="section-title">{c.expertise[0].title}</h2>
              <p className="showcase-desc">{c.expertise[0].description}</p>
              {c.expertise[0].skills && c.expertise[0].skills.length > 0 && (
                <div className="showcase-skills">
                  {c.expertise[0].skills.map((s, i) => <span key={i} className="skill-pill">{s}</span>)}
                </div>
              )}
"""

# Replace the mapped one with the original
content = re.sub(r'<span className="section-eyebrow">EXPERTISE & CAPABILITIES</span>.*?(?=\s*</div>\s*<div className="showcase-visual">)', original_expertise.strip(), content, flags=re.DOTALL)

with open('components/templates/Architect/Portfolio.tsx', 'w') as f:
    f.write(content)

