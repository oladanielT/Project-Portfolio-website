import sys

with open("components/templates/Template5/Portfolio.tsx", "r") as f:
    lines = f.readlines()

about_start = -1
about_end = -1
work_start = -1

for i, line in enumerate(lines):
    if "{content.sections.about && (" in line:
        about_start = i
    if "          </section>" in line and about_start != -1 and about_end == -1:
        about_end = i + 1  # include the closing bracket `        )}` which is on the next line
    if "        )}" in line and about_start != -1 and i > about_start and about_end == -1:
        about_end = i + 1

    if "{content.sections.work && content.projects.length > 0 && (" in line:
        work_start = i

print(about_start, about_end, work_start)

# Move about block to just before work block
about_block = lines[about_start:about_end]
del lines[about_start:about_end]

# Need to find work_start again since we deleted lines before it
work_start = -1
for i, line in enumerate(lines):
    if "{content.sections.work && content.projects.length > 0 && (" in line:
        work_start = i

lines = lines[:work_start] + about_block + ["\n"] + lines[work_start:]

with open("components/templates/Template5/Portfolio.tsx", "w") as f:
    f.writelines(lines)

print("Moved About section")
