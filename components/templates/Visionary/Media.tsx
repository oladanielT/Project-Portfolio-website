"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { OrbitMark } from "./Chrome";

// Keep the composition intact when a saved external image is unavailable.
export default function Media(props: ImageProps) {
  const [failedSource, setFailedSource] = useState<ImageProps["src"] | null>(
    null,
  );
  if (failedSource === props.src) {
    return (
      <div
        className="v-media-fallback"
        role={props.alt ? "img" : undefined}
        aria-label={props.alt || undefined}
        aria-hidden={props.alt ? undefined : true}
      >
        <OrbitMark />
      </div>
    );
  }
  return <Image {...props} onError={() => setFailedSource(props.src)} />;
}
