import re

with open('components/templates/Architect/Portfolio.tsx', 'r') as f:
    content = f.read()

new_expertise = """
              <span className="section-eyebrow">EXPERTISE & CAPABILITIES</span>
              <div className="expertise-list" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginTop: '2rem' }}>
                {c.expertise.map((exp, idx) => (
                  <div key={idx} className="expertise-group">
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>{exp.title}</h3>
                    <p className="showcase-desc" style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>{exp.description}</p>
                    {exp.skills && exp.skills.length > 0 && (
                      <div className="showcase-skills" style={{ marginTop: '0' }}>
                        {exp.skills.map((s, i) => <span key={i} className="skill-pill">{s}</span>)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
"""

# Replace the single expertise render with the mapped one
content = re.sub(r'<span className="section-eyebrow">STRATEGY</span>.*?(?=\s*</div>\s*<div className="showcase-visual">)', new_expertise.strip(), content, flags=re.DOTALL)

with open('components/templates/Architect/Portfolio.tsx', 'w') as f:
    f.write(content)

