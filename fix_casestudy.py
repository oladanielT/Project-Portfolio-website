import re

with open('components/CaseStudy.tsx', 'r') as f:
    content = f.read()

# Remove the broken lines
content = re.sub(r'return \(\s*<div className=\{`\\\$[^>]+>\\n\s*<main id="top">', r'''  return (
    <>
      <ThemeInjector template={c.template || "architect"} colorMode={c.colorMode || "light"} />
      <div className={`${c.template || "architect"}-wrapper theme-${c.colorMode || "light"}`}>
        <main id="top">''', content)

with open('components/CaseStudy.tsx', 'w') as f:
    f.write(content)

