import { createClient } from "./supabase-server";

/**
 * Downloads an image from a URL and uploads it to a Supabase bucket.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImageFromUrl(url: string, bucket: string, fileName: string) {
  try {
    const supabase = await createClient();

    // 1. Fetch the image from the source
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: response.headers.get('content-type') || 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    // 3. Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error("Storage upload error:", error);
    // Fallback to original URL if upload fails so the app doesn't break
    return url;
  }
}
