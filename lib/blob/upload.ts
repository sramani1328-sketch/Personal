import "server-only";
import { put, del } from "@vercel/blob";

export async function uploadToBlob(
  file: File | Blob,
  filename: string,
): Promise<{ url: string; pathname: string }> {
  const blob = await put(filename, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return { url: blob.url, pathname: blob.pathname };
}

export async function deleteFromBlob(url: string) {
  try {
    await del(url);
  } catch (e) {
    console.warn("blob delete failed", e);
  }
}
