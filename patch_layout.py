import re

with open('app/layout.tsx', 'r') as f:
    content = f.read()

content = content.replace('data-theme={content.colorMode}', 'data-theme={content.colorMode || "light"}')
content = content.replace('data-template={content.template}', 'data-template={content.template || "architect"}')

with open('app/layout.tsx', 'w') as f:
    f.write(content)
