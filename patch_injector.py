import re

with open('components/CaseStudy.tsx', 'r') as f:
    content = f.read()

injector_code = """
"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { SiteContent } from "@/lib/schema";
import Nav from "./Nav";

function ThemeInjector({ template, colorMode }: { template: string; colorMode: string }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", colorMode);
    document.documentElement.setAttribute("data-template", template);
  }, [template, colorMode]);
  return null;
}
"""

content = re.sub(r'import Image from "next/image";.*import Nav from "./Nav";', injector_code.strip(), content, flags=re.DOTALL)

# Now inject it into the render
wrapper = r"""
  return (
    <>
      <ThemeInjector template={c.template || "architect"} colorMode={c.colorMode || "light"} />
      <div className={`\$\{c.template || "architect"\}-wrapper theme-\$\{c.colorMode || "light"\}`}>
"""
content = re.sub(r'return \(\s*<div className=\{`\$\{[^}]+\}-wrapper theme-\$\{[^}]+\}`\}>', wrapper.strip(), content)

content = content.replace('</main>\n    </div>', '</main>\n    </div>\n    </>')

with open('components/CaseStudy.tsx', 'w') as f:
    f.write(content)

