import re
with open('components/templates/Architect/styles.css', 'r') as f:
    css = f.read()

css = re.sub(
    r'\.hero-title \{[^}]+\}',
    r'.hero-title {\n  font-size: clamp(2.5rem, 4vw, 3.5rem);\n  font-weight: 800;\n  line-height: 1.1;\n  margin: 0 0 0.5rem;\n}',
    css
)

css = re.sub(
    r'\.hero-intro \{[^}]+\}',
    r'.hero-intro {\n  font-size: 1rem;\n  color: var(--color-text-muted);\n  margin-bottom: 1.5rem;\n  line-height: 1.5;\n}',
    css
)

with open('components/templates/Architect/styles.css', 'w') as f:
    f.write(css)
