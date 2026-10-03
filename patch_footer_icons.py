import re

with open('components/templates/Architect/styles.css', 'r') as f:
    css = f.read()

# Replace the social-icon block and wrapper block
old_wrapper = r'\.footer-social-wrapper \{.*?\n\}'
old_icon = r'\.social-icon \{.*?\}\n\.social-icon:hover \{.*?\}'

new_wrapper = """
.footer-social-wrapper {
  display: flex !important;
  flex-direction: row !important;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}
"""

new_icon = """
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: transparent;
  color: var(--color-accent);
  border: 1.5px solid var(--color-accent);
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
}
.social-icon:hover { 
  transform: translateY(-3px) scale(1.05);
  background: var(--color-accent);
  color: #fff;
  box-shadow: 0 0 20px var(--color-accent), 0 0 40px var(--color-accent);
  border-color: var(--color-accent);
}
"""

css = re.sub(r'\.footer-social-wrapper \{[^}]+\}', new_wrapper.strip(), css)
css = re.sub(r'\.social-icon \{[^}]+\}\n\.social-icon:hover \{[^}]+\}', new_icon.strip(), css)

with open('components/templates/Architect/styles.css', 'w') as f:
    f.write(css)
