import os
import re

github_path = 'github: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22",'

for root, _, files in os.walk('components'):
    for file in files:
        if file.endswith('.tsx'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            if 'linkedin: "M16 8a6' in content and 'github:' not in content:
                content = content.replace('linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z"', 
                                          'linkedin: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z M2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",\n    ' + github_path)
                
                # Also add the SocialIcon usage for github
                if 'url={c.contact.linkedin} />' in content:
                    content = content.replace('<SocialIcon type="linkedin" url={c.contact.linkedin} />',
                                              '<SocialIcon type="linkedin" url={c.contact.linkedin} />\n             {c.contact.github && <SocialIcon type="github" url={c.contact.github} />}')
                with open(filepath, 'w') as f:
                    f.write(content)
                print(f"Patched SocialIcon in {filepath}")
