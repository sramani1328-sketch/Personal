import "server-only";
import { put, del } from "@vercel/blob";

const MAX_INLINE_BYTES = 4 * 1024 * 1024; // 4 MB data-URL fallback cap

function hasBlobToken() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function uploadToBlob(
  file: File | Blob,
  filename: string,
): Promise<{ url: string; pathname: string }> {
  if (hasBlobToken()) {
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return { url: blob.url, pathname: blob.pathname };
  }
  // Fallback: return a data URL so uploads work without a Blob store.
  // Enables images right after first deploy; switches to real Blob once
  // BLOB_READ_WRITE_TOKEN is set.
  const size = (file as File).size ?? (file as Blob).size ?? 0;
  if (size > MAX_INLINE_BYTES) {
    throw new Error(
      `Image is ${(size / 1024 / 1024).toFixed(1)} MB. Connect Vercel Blob (add BLOB_READ_WRITE_TOKEN) to upload files larger than 4 MB.`,
    );
  }
  const type = (file as File).type || "application/octet-stream";
  const buf = Buffer.from(await (file as Blob).arrayBuffer());
  const url = `data:${type};base64,${buf.toString("base64")}`;
  return { url, pathname: filename };
}

export async function deleteFromBlob(url: string) {
  if (!url || url.startsWith("data:")) return;
  if (!hasBlobToken()) return;
  try {
    await del(url);
  } catch (e) {
    console.warn("blob delete failed", e);
  }
}
