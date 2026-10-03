import re

with open('components/templates/Architect/Portfolio.tsx', 'r') as f:
    content = f.read()

new_tools = """
              {[
                { name: 'Google Workspace', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Workspace_Logo.svg' },
                { name: 'Google Analytics', url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Google_Analytics_icon.svg' },
                { name: 'GitHub', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' },
                { name: 'ChatGPT', url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
                { name: 'Jira', url: 'https://cdn.simpleicons.org/jira' },
                { name: 'Trello', url: 'https://cdn.simpleicons.org/trello' },
                { name: 'Monday', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Monday_logo.svg' },
                { name: 'Notion', url: 'https://cdn.simpleicons.org/notion' },
                { name: 'Slack', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
                { name: 'Figma', url: 'https://cdn.simpleicons.org/figma' },
                // Duplicate for seamless loop
                { name: 'Google Workspace', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Workspace_Logo.svg' },
                { name: 'Google Analytics', url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Google_Analytics_icon.svg' },
                { name: 'GitHub', url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg' },
                { name: 'ChatGPT', url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
                { name: 'Jira', url: 'https://cdn.simpleicons.org/jira' },
                { name: 'Trello', url: 'https://cdn.simpleicons.org/trello' },
                { name: 'Monday', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Monday_logo.svg' },
                { name: 'Notion', url: 'https://cdn.simpleicons.org/notion' },
                { name: 'Slack', url: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
                { name: 'Figma', url: 'https://cdn.simpleicons.org/figma' }
              ].map((tool, i) => (
"""

content = re.sub(r'\{\[\s*\{\s*name:\s*\'Mailchimp\'.*?\]\.map\(\(tool, i\) => \(', new_tools.strip(), content, flags=re.DOTALL)

with open('components/templates/Architect/Portfolio.tsx', 'w') as f:
    f.write(content)

