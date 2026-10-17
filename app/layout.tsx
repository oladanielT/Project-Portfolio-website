import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getContent } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

const display = localFont({
  src: [
    {
      path: "./fonts/newsreader-normal.woff2",
      weight: "400 600",
      style: "normal",
    },
    {
      path: "./fonts/newsreader-italic.woff2",
      weight: "400 600",
      style: "italic",
    },
  ],
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
const sans = localFont({
  src: "./fonts/inter.woff2",
  weight: "400 600",
  variable: "--font-sans",
  display: "swap",
});
const mono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-mono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContent();
  const { seo } = content;
  const image = content.hero.photo || undefined;
  return {
    metadataBase: getSiteUrl(),
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: "website",
      siteName: content.hero.name,
      url: "/",
      images: image ? [{ url: image, alt: `${content.hero.name} portfolio` }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: seo.title,
      description: seo.description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getContent();
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      data-theme={content.colorMode || "light"}
      data-template={content.template || "architect"}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
