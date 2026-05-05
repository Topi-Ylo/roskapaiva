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
