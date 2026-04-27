import { ensureSupabase } from './supabase';

const BUCKET = 'media';

/**
 * Upload a file to public `media` bucket. Requires Storage policies from supabase/storage.sql
 * and an authenticated admin session.
 * @param {File} file
 * @param {string} folder e.g. 'portfolio', 'blog', 'team'
 * @returns {Promise<string>} public URL
 */
export async function uploadMediaFile(file, folder = 'uploads') {
  const supabase = await ensureSupabase();
  if (!supabase) throw new Error('Supabase is not configured');
  const safeFolder = folder.replace(/[^a-z0-9-_]/gi, '') || 'uploads';
  const ext = (file.name && file.name.includes('.'))
    ? file.name.split('.').pop().slice(0, 8).toLowerCase()
    : 'bin';
  const name = `${crypto.randomUUID()}.${ext}`;
  const path = `${safeFolder}/${name}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) throw new Error('Could not get public URL for upload');
  return data.publicUrl;
}

export function isStorageConfigured() {
  return Boolean(
    typeof import.meta !== 'undefined' &&
      import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_ANON_KEY,
  );
}
