import re

with open('components/templates/Architect/styles.css', 'r') as f:
    css = f.read()

# Add a deeper color variable
css = css.replace('--color-cta-bg: #F0F4F8;', '--color-cta-bg: #F0F4F8;\n  --color-about-bg: #E5E7EB; /* deeper neutral */')
css = css.replace('--color-cta-bg: #1A1A1A;', '--color-cta-bg: #1A1A1A;\n  --color-about-bg: #1F2937; /* deeper dark neutral */')

# Use it in about-bg-shape
css = css.replace('background: var(--color-cta-bg);', 'background: var(--color-about-bg);')

with open('components/templates/Architect/styles.css', 'w') as f:
    f.write(css)

