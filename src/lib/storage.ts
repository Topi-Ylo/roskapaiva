import { supabase } from './supabase';

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Upload a single file to the public 'media' bucket. Returns the file's public
 * URL plus the storage path (so the row in image_library can track it).
 */
export async function uploadToStorage(file: File, prefix = ''): Promise<UploadResult> {
  if (!supabase) throw new Error('Supabase ei ole konfiguroitu.');
  const ext = (file.name.split('.').pop() ?? 'bin').toLowerCase();
  const safePrefix = prefix.replace(/[^a-z0-9/_-]/gi, '');
  const id = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
  const path = `${safePrefix}${id}.${ext}`;

  const { error } = await supabase.storage.from('media').upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;

  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteFromStorage(path: string): Promise<void> {
  if (!supabase) return;
  await supabase.storage.from('media').remove([path]);
}

/**
 * Best-effort client-side compression of an image File before upload.
 * Resizes to a long-edge cap and re-encodes as JPEG at the given quality.
 * Returns the original File untouched for non-image, SVG, or animated GIF
 * inputs, or if the re-encode would be larger than the source.
 *
 * Typical phone JPEG (4 MB, 4032×3024) → ~250–500 KB at 2000 px / 0.82.
 */
export async function compressImage(
  file: File,
  maxDim = 2000,
  quality = 0.82,
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return file;

  // Decode the bitmap. Prefer createImageBitmap (faster, off-main-thread on
  // most browsers); fall back to <img> for any environment that doesn't
  // support it on Files.
  let source: CanvasImageSource;
  let w0: number;
  let h0: number;
  try {
    const bmp = await createImageBitmap(file);
    source = bmp;
    w0 = bmp.width;
    h0 = bmp.height;
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = reject;
        i.src = url;
      });
      source = img;
      w0 = img.naturalWidth;
      h0 = img.naturalHeight;
    } catch {
      URL.revokeObjectURL(url);
      return file;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const longEdge = Math.max(w0, h0);
  const scale = longEdge > maxDim ? maxDim / longEdge : 1;
  const w = Math.max(1, Math.round(w0 * scale));
  const h = Math.max(1, Math.round(h0 * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(source, 0, 0, w, h);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
  });
  if (!blob || blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
  return new File([blob], newName, { type: 'image/jpeg', lastModified: Date.now() });
}
