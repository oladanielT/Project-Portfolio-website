import re

with open('components/CaseStudy.tsx', 'r') as f:
    content = f.read()

brand_replacement = """
<Link href={`${prefix}#hero`} className="brand-logo">
            <span className="name-full">{c.hero.name}</span>
            <span className="name-short">{c.hero.name.split(' ')[0]}</span>
          </Link>
"""

content = re.sub(r'<Link href=\{`\$\{prefix\}#hero`\} className="brand-logo">\{c\.hero\.name\}</Link>', brand_replacement.strip(), content)

with open('components/CaseStudy.tsx', 'w') as f:
    f.write(content)

