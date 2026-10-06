"use client";

import { useEffect } from "react";
import type { SiteContent } from "@/lib/schema";
import ClassicPortfolio from "./templates/Classic/Portfolio";
import ArchitectPortfolio from "./templates/Architect/Portfolio";
import VisionaryPortfolio from "./templates/Visionary/Portfolio";
import BoldPortfolio from "./templates/Bold/Portfolio";
import BentoPortfolio from "./templates/Bento/Portfolio";
import NoirPortfolio from "./templates/Noir/Portfolio";
import Template5Portfolio from "./templates/Template5/Portfolio";
import AuroraPortfolio from "./templates/Aurora/Portfolio";

function ThemeInjector({ template, colorMode }: { template: string; colorMode: string }) {
  useEffect(() => {
    // Inject the preview template and theme into the html tag
    document.documentElement.setAttribute("data-theme", colorMode);
    document.documentElement.setAttribute("data-template", template);
    document.body.setAttribute("data-theme", colorMode);
    document.body.setAttribute("data-template", template);
  }, [template, colorMode]);
  
  return null;
}

export default function TemplateRenderer({
  content,
  contactReady = false,
  preview = false,
}: {
  content: SiteContent;
  contactReady?: boolean;
  preview?: boolean;
}) {
  const template = content.template || "architect";
  const colorMode = content.colorMode || "light";

  return (
    <>
      <ThemeInjector template={template} colorMode={colorMode} />
      {template === "template5" && <Template5Portfolio content={content} contactReady={contactReady} preview={preview} /> }
      {template === "architect" && <ArchitectPortfolio content={content} contactReady={contactReady} preview={preview} /> }
      {template === "visionary" && <VisionaryPortfolio content={content} contactReady={contactReady} preview={preview} /> }
      {template === "bento" && <BentoPortfolio content={content} contactReady={contactReady} preview={preview} /> }
      {template === "noir" && <NoirPortfolio content={content} contactReady={contactReady} preview={preview} /> }
      {template === "bold" && <BoldPortfolio content={content} contactReady={contactReady} preview={preview} /> }
      {template === "aurora" && <AuroraPortfolio content={content} contactReady={contactReady} preview={preview} /> }
      {(!["template5", "architect", "visionary", "bento", "noir", "bold", "aurora"].includes(template)) && 
        <ClassicPortfolio content={content} contactReady={contactReady} preview={preview} />
      }
    </>
  );
}
