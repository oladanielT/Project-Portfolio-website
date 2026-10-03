import re

# Update Portfolio.tsx to use SimpleIcons
with open('components/templates/Architect/Portfolio.tsx', 'r') as f:
    content = f.read()

new_tools = """
              {[
                { name: 'Mailchimp', url: 'https://cdn.simpleicons.org/mailchimp' },
                { name: 'Jira', url: 'https://cdn.simpleicons.org/jira' },
                { name: 'Trello', url: 'https://cdn.simpleicons.org/trello' },
                { name: 'Asana', url: 'https://cdn.simpleicons.org/asana' },
                { name: 'Monday', url: 'https://cdn.simpleicons.org/mondaydotcom' },
                { name: 'Notion', url: 'https://cdn.simpleicons.org/notion' },
                { name: 'Slack', url: 'https://cdn.simpleicons.org/slack' },
                { name: 'Figma', url: 'https://cdn.simpleicons.org/figma' },
                // Duplicate for seamless loop
                { name: 'Mailchimp', url: 'https://cdn.simpleicons.org/mailchimp' },
                { name: 'Jira', url: 'https://cdn.simpleicons.org/jira' },
                { name: 'Trello', url: 'https://cdn.simpleicons.org/trello' },
                { name: 'Asana', url: 'https://cdn.simpleicons.org/asana' },
                { name: 'Monday', url: 'https://cdn.simpleicons.org/mondaydotcom' },
                { name: 'Notion', url: 'https://cdn.simpleicons.org/notion' },
                { name: 'Slack', url: 'https://cdn.simpleicons.org/slack' },
                { name: 'Figma', url: 'https://cdn.simpleicons.org/figma' }
              ].map((tool, i) => (
"""

content = re.sub(r'\{\[\s*\{\s*name:\s*\'Mailchimp\'.*?\]\.map\(\(tool, i\) => \(', new_tools.strip(), content, flags=re.DOTALL)

with open('components/templates/Architect/Portfolio.tsx', 'w') as f:
    f.write(content)


# Update styles.css
with open('components/templates/Architect/styles.css', 'r') as f:
    css = f.read()

new_marquee_css = """
/* --- PARTNERS MARQUEE --- */
@keyframes marquee-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.partners-section {
  padding: var(--spacing-section-desktop) 0;
  background: var(--color-surface);
  overflow: hidden;
}
.marquee-container {
  width: 100%;
  overflow: hidden;
  display: flex;
}
.marquee-track {
  display: flex;
  gap: 3rem;
  padding: 2rem 0;
  width: max-content;
  animation: marquee-scroll 25s linear infinite;
}
.marquee-container:hover .marquee-track {
  animation-play-state: paused;
}
.partner-logo-card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 90px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  flex-shrink: 0;
}
.partner-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.3s;
}
.partner-logo-card:hover .partner-img {
  filter: grayscale(0%);
  opacity: 1;
  transform: scale(1.1);
}
"""

css = re.sub(r'/\* --- PARTNERS MARQUEE ---\*/.*?(?=\/\* --- TESTIMONIALS --- \*/)', new_marquee_css, css, flags=re.DOTALL)
# Wait, TESTIMONIALS might just be /* --- TESTIMONIALS --- */
# Let's do it safely
parts = css.split('/* --- PARTNERS MARQUEE --- */')
if len(parts) > 1:
    post_partners = parts[1]
    testi_parts = post_partners.split('/* --- TESTIMONIALS --- */')
    if len(testi_parts) > 1:
        css = parts[0] + new_marquee_css + "\n/* --- TESTIMONIALS --- */" + testi_parts[1]

with open('components/templates/Architect/styles.css', 'w') as f:
    f.write(css)

