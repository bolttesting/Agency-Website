function readViteEnv(name) {
  const raw = import.meta.env[name];
  if (raw == null) return '';
  let s = String(raw).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

const supabaseUrl = readViteEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = readViteEnv('VITE_SUPABASE_ANON_KEY');

/** True when env keys exist (no network / no @supabase/supabase-js loaded yet). */
export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/** Set after the first successful `ensureSupabase()`; live binding for existing sync checks. */
export let supabase = null;

let ensureInflight = null;

/**
 * Lazily creates the Supabase client (dynamic import) so the main bundle
 * can paint before the ~170KB supabase chunk downloads and parses.
 */
export async function ensureSupabase() {
  if (supabase) return supabase;
  if (!isSupabaseConfigured()) return null;
  if (!ensureInflight) {
    ensureInflight = import('@supabase/supabase-js')
      .then(({ createClient }) => {
        try {
          supabase = createClient(supabaseUrl, supabaseAnonKey);
        } catch (e) {
          console.error(
            '[Supabase] createClient failed — check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
            e,
          );
          return null;
        }
        return supabase;
      })
      .catch((e) => {
        ensureInflight = null;
        console.error('[Supabase] failed to load client', e);
        return null;
      });
  }
  return ensureInflight;
}
