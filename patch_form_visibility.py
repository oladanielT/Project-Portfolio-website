import re

with open('components/templates/Architect/Portfolio.tsx', 'r') as f:
    content = f.read()

# Replace the conditional logic for the form
old_form_logic = r'\{\(contactReady \|\| c\.contact\.formEnabled\) \? \(\s*<form className="premium-form"'
new_form_logic = r'{true ? (\n              <form className="premium-form"'

content = re.sub(old_form_logic, new_form_logic, content)

with open('components/templates/Architect/Portfolio.tsx', 'w') as f:
    f.write(content)

