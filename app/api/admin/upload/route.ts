import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { adminSession } from "@/lib/supabase/server";
import { sameOrigin, failure } from "@/lib/api";
export const dynamic = "force-dynamic";
export async function GET() {
  const session = await adminSession();
  if (!session) return failure("Unauthorized", 401);
  const { data, error } = await session.db
    .from("portfolio_media")
    .select("id,name,mime,size,created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  return error ? failure("Unable to load media", 500) : NextResponse.json(data);
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return failure("Invalid request origin", 403);
  const session = await adminSession();
  if (!session) return failure("Unauthorized", 401);
  if (Number(request.headers.get("content-length")) > 9 * 1024 * 1024)
    return failure("Maximum file size is 8 MB", 413);
  let form;
  try {
    form = await request.formData();
  } catch {
    return failure("Invalid upload");
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size > 8 * 1024 * 1024 || file.size === 0)
    return failure("Choose a non-empty file up to 8 MB");
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "application/pdf": "pdf",
  };
  if (!extensions[file.type]) return failure("Use JPG, PNG, WebP, or PDF");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const signature =
    file.type === "image/jpeg"
      ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      : file.type === "image/png"
        ? Buffer.from(bytes.slice(0, 8)).equals(
            Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
          )
        : file.type === "image/webp"
          ? Buffer.from(bytes.slice(0, 4)).toString() === "RIFF" &&
            Buffer.from(bytes.slice(8, 12)).toString() === "WEBP"
          : Buffer.from(bytes.slice(0, 5)).toString() === "%PDF-";
  if (!signature) return failure("The file contents do not match its type");
  const id = randomUUID();
  const path = `${id}.${extensions[file.type]}`;
  const { error } = await session.db.storage
    .from("portfolio-media")
    .upload(path, bytes, { contentType: file.type, upsert: false });
  if (error)
    return failure(
      "Upload failed. Check the storage migration and permissions.",
      500,
    );
  const result = await session.db.from("portfolio_media").insert({
    id,
    path,
    name: file.name.slice(0, 200),
    mime: file.type,
    size: file.size,
  });
  if (result.error) {
    await session.db.storage.from("portfolio-media").remove([path]);
    return failure("Unable to save media information", 500);
  }
  return NextResponse.json({ url: `/api/media/${id}`, name: file.name });
}
