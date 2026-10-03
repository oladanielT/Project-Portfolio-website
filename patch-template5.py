import sys

with open("components/templates/Template5/Portfolio.tsx", "r") as f:
    content = f.read()

injection = """
        {content.sections.about && (
          <section id="about" className="about-section">
            <div className="about-header">
              <h2>{content.about.heading || "About me"}</h2>
              {content.about.stat?.value && (
                <div className="about-stat">
                  <span className="stat-value">{content.about.stat.value}</span>
                  <span className="stat-label">{content.about.stat.label}</span>
                </div>
              )}
            </div>
            <div className="about-content">
              {content.about.paragraphs?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}

        {content.sections.expertise && content.expertise.length > 0 && (
          <section id="services" className="expertise-section">
            <div className="section-header">
              <span className="label">Expertise</span>
              <h2>Services I offer</h2>
            </div>
            <div className="expertise-grid">
              {content.expertise.map((exp, i) => (
                <div key={i} className="expertise-card">
                  <h3>{exp.title}</h3>
                  <p>{exp.description}</p>
                  <div className="expertise-skills">
                    {exp.skills?.map((skill, j) => (
                      <span key={j} className="skill-pill">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.sections.process && content.process.length > 0 && (
          <section id="process" className="process-section">
            <div className="section-header">
              <span className="label">Process</span>
              <h2>How I work</h2>
            </div>
            <div className="process-grid">
              {content.process.map((step, i) => (
                <div key={i} className="process-step">
                  <div className="step-number">0{i + 1}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.sections.tools && content.tools.length > 0 && (
          <section id="tools" className="tools-section">
            <div className="section-header">
              <span className="label">Toolkit</span>
              <h2>Tools I use daily</h2>
            </div>
            <div className="tools-flex">
              {content.tools.map((tool, i) => (
                <div key={i} className="tool-pill">
                  {tool.name}
                </div>
              ))}
            </div>
          </section>
        )}
"""

if "content.sections.about" not in content:
    content = content.replace("        {content.sections.testimonial", injection + "\n        {content.sections.testimonial")
    with open("components/templates/Template5/Portfolio.tsx", "w") as f:
        f.write(content)
        print("Patched Portfolio.tsx")

with open("components/templates/Template5/styles.css", "r") as f:
    css = f.read()

css_injection = """
[data-template="template5"] .about-section,
[data-template="template5"] .expertise-section,
[data-template="template5"] .process-section,
[data-template="template5"] .tools-section {
  padding: 60px 10%;
}

[data-template="template5"] .about-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  background: var(--color-surface);
  border-radius: 40px;
  margin: 0 5%;
  padding: 60px;
}
[data-template="template5"] .about-header h2 {
  font-size: 40px;
  line-height: 1.1;
  margin-bottom: 20px;
}
[data-template="template5"] .about-stat {
  margin-top: 40px;
  display: flex;
  align-items: baseline;
  gap: 12px;
}
[data-template="template5"] .stat-value {
  font-size: 64px;
  font-weight: 700;
  color: var(--color-accent);
}
[data-template="template5"] .stat-label {
  font-size: 16px;
  color: var(--color-text-muted);
}
[data-template="template5"] .about-content p {
  font-size: 16px;
  color: var(--color-text-muted);
  margin-bottom: 20px;
}

[data-template="template5"] .section-header {
  margin-bottom: 40px;
}
[data-template="template5"] .section-header .label {
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 12px;
  display: block;
}
[data-template="template5"] .section-header h2 {
  font-size: 32px;
}

[data-template="template5"] .expertise-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}
[data-template="template5"] .expertise-card {
  background: var(--color-surface);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}
[data-template="template5"] .expertise-card h3 {
  font-size: 20px;
  margin-bottom: 12px;
}
[data-template="template5"] .expertise-card p {
  font-size: 14px;
  color: var(--color-text-muted);
  margin-bottom: 20px;
}
[data-template="template5"] .expertise-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
[data-template="template5"] .skill-pill {
  font-size: 11px;
  padding: 4px 12px;
  background: var(--color-bg);
  border-radius: 20px;
  color: var(--color-text-muted);
}

[data-template="template5"] .process-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}
[data-template="template5"] .process-step {
  padding: 30px;
  border-left: 2px solid var(--color-accent);
}
[data-template="template5"] .step-number {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 12px;
}
[data-template="template5"] .process-step h3 {
  font-size: 20px;
  margin-bottom: 12px;
}
[data-template="template5"] .process-step p {
  font-size: 14px;
  color: var(--color-text-muted);
}

[data-template="template5"] .tools-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
[data-template="template5"] .tool-pill {
  padding: 12px 24px;
  background: var(--color-surface);
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}
"""

if ".about-section" not in css:
    with open("components/templates/Template5/styles.css", "a") as f:
        f.write(css_injection)
        print("Patched styles.css")

