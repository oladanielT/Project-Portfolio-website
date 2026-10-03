import re

with open('components/CaseStudy.tsx', 'r') as f:
    content = f.read()

# Replace <main id="top"> with the wrapper
wrapper = r'<div className={`\$\{c.template || "architect"\}-wrapper theme-\$\{c.colorMode || "light"\}`}>\n      <main id="top">'
content = content.replace('<main id="top">', wrapper)
content = content.replace('</main>', '</main>\n    </div>')

with open('components/CaseStudy.tsx', 'w') as f:
    f.write(content)

