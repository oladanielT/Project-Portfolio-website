import re

with open('components/templates/Architect/styles.css', 'r') as f:
    content = f.read()

# Replace the hardcoded variable block
old_vars = r'\[data-template="architect"\] \{\s*--font-sans:[^}]+--color-dark-text: [^;]+;\s*\}'

new_vars = """
[data-template="architect"] {
  --font-sans: var(--font-inter, sans-serif);
  
  /* Map architect colors directly to the dynamic global color mode variables */
  --color-bg: var(--background);
  --color-surface: var(--surface);
  --color-text: var(--foreground);
  --color-text-muted: var(--muted);
  
  --color-primary: var(--foreground);
  --color-primary-fg: var(--background);
  --color-border: var(--line);
  
  --color-cta-bg: var(--surface-raised);
  --color-about-bg: var(--surface-deep);
  --color-accent: var(--accent);
  
  /* Map dark sections (like Contact) to deep/raised surfaces to maintain contrast in any theme */
  --color-dark-bg: var(--surface-deep);
  --color-dark-surface: var(--surface-raised);
  --color-dark-text: var(--foreground);
}
"""

content = re.sub(old_vars, new_vars.strip(), content, flags=re.DOTALL)

with open('components/templates/Architect/styles.css', 'w') as f:
    f.write(content)

