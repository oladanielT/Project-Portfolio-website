import re

with open('components/templates/Architect/Portfolio.tsx', 'r') as f:
    content = f.read()

# Replace <Link href="#hero" className="brand-logo">{c.hero.name}</Link>
# in both the nav and the footer!
brand_replacement = """
<Link href="#hero" className="brand-logo">
            <span className="name-full">{c.hero.name}</span>
            <span className="name-short">{c.hero.name.split(' ')[0]}</span>
          </Link>
"""

content = re.sub(r'<Link href="#hero" className="brand-logo">\{c\.hero\.name\}</Link>', brand_replacement.strip(), content)

with open('components/templates/Architect/Portfolio.tsx', 'w') as f:
    f.write(content)

