import sys

with open("components/templates/Template5/Portfolio.tsx", "r") as f:
    content = f.read()

old_about = """
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
"""

new_about = """
        {content.sections.about && (
          <section id="about" className="about-section">
            <div className="about-visual">
              {content.about.photo && (
                <Image 
                  src={content.about.photo}
                  alt="About me"
                  width={400}
                  height={500}
                  className="about-avatar"
                  style={{ objectPosition: content.about.photoPosition || "center" }}
                />
              )}
            </div>
            <div className="about-details">
              <h2>{content.about.heading || "About me"}</h2>
              <div className="about-content">
                {content.about.paragraphs?.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {content.about.stat?.value && (
                <div className="about-stat">
                  <span className="stat-value">{content.about.stat.value}</span>
                  <span className="stat-label">{content.about.stat.label}</span>
                </div>
              )}
            </div>
          </section>
        )}
"""

content = content.replace(old_about.strip(), new_about.strip())

with open("components/templates/Template5/Portfolio.tsx", "w") as f:
    f.write(content)
    print("Patched Portfolio.tsx")

with open("components/templates/Template5/styles.css", "r") as f:
    css = f.read()

css_patch = """
[data-template="template5"] .about-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}
[data-template="template5"] .about-avatar {
  border-radius: 40px;
  width: 100%;
  max-width: 400px;
  height: 500px;
  object-fit: cover;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}
[data-template="template5"] .about-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
[data-template="template5"] .about-details h2 {
  font-size: 40px;
  line-height: 1.1;
  margin-bottom: 30px;
}
"""

if ".about-visual" not in css:
    with open("components/templates/Template5/styles.css", "a") as f:
        f.write(css_patch)
        print("Patched styles.css")

