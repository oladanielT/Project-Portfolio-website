import re

with open('components/templates/Architect/styles.css', 'r') as f:
    content = f.read()

# Replace the dynamic variable block with the original hardcoded one
old_vars = r'\[data-template="architect"\] \{\s*--font-sans:[^}]+--color-dark-text: [^;]+;\s*\}'

original_vars = """
[data-template="architect"] {
  --font-sans: var(--font-inter, sans-serif);
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-text: #111111;
  --color-text-muted: #666666;
  --color-primary: #111111;
  --color-primary-fg: #FFFFFF;
  --color-border: rgba(0,0,0,0.1);
  --color-cta-bg: #F0F4F8;
  --color-about-bg: #E5E7EB;
  --color-accent: #3b82f6;
  --color-dark-bg: #111111;
  --color-dark-surface: #1A1A1A;
  --color-dark-text: #FFFFFF;
}
"""

content = re.sub(old_vars, original_vars.strip(), content, flags=re.DOTALL)

# Revert the color-mix back to rgba for site nav
content = content.replace('color-mix(in srgb, var(--color-bg) 85%, transparent)', 'rgba(250, 250, 250, 0.85)')

with open('components/templates/Architect/styles.css', 'w') as f:
    f.write(content)

