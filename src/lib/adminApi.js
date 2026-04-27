import { ensureSupabase } from './supabase';
import { unwrap } from './supabaseResult';

async function requireClient() {
  const c = await ensureSupabase();
  if (!c) throw new Error('Supabase is not configured');
  return c;
}

export const adminApi = {
  portfolio: {
    list: () =>
      ensureSupabase().then((c) =>
        c ? c.from('portfolio').select('*').order('sort_order') : { data: [], error: null },
      ),
    add: (data) => requireClient().then((c) => unwrap(c.from('portfolio').insert(data).select().single())),
    update: (id, data) =>
      requireClient().then((c) => unwrap(c.from('portfolio').update(data).eq('id', id).select().single())),
    delete: (id) => requireClient().then((c) => unwrap(c.from('portfolio').delete().eq('id', id))),
  },
  blog: {
    list: () =>
      ensureSupabase().then((c) =>
        c ? c.from('blog_posts').select('*').order('date', { ascending: false }) : { data: [], error: null },
      ),
    add: (data) => requireClient().then((c) => unwrap(c.from('blog_posts').insert(data).select().single())),
    update: (id, data) =>
      requireClient().then((c) => unwrap(c.from('blog_posts').update(data).eq('id', id).select().single())),
    delete: (id) => requireClient().then((c) => unwrap(c.from('blog_posts').delete().eq('id', id))),
  },
  team: {
    list: () =>
      ensureSupabase().then((c) =>
        c ? c.from('team_members').select('*').order('sort_order') : { data: [], error: null },
      ),
    add: (data) => requireClient().then((c) => unwrap(c.from('team_members').insert(data).select().single())),
    update: (id, data) =>
      requireClient().then((c) => unwrap(c.from('team_members').update(data).eq('id', id).select().single())),
    delete: (id) => requireClient().then((c) => unwrap(c.from('team_members').delete().eq('id', id))),
  },
  testimonials: {
    list: () =>
      ensureSupabase().then((c) =>
        c ? c.from('testimonials').select('*').order('sort_order') : { data: [], error: null },
      ),
    add: (data) => requireClient().then((c) => unwrap(c.from('testimonials').insert(data).select().single())),
    update: (id, data) =>
      requireClient().then((c) => unwrap(c.from('testimonials').update(data).eq('id', id).select().single())),
    delete: (id) => requireClient().then((c) => unwrap(c.from('testimonials').delete().eq('id', id))),
  },
  settings: {
    get: () => ensureSupabase().then((c) => (c ? c.from('site_settings').select('*').single() : { data: null, error: null })),
    update: (data) =>
      requireClient().then((c) =>
        unwrap(
          c
            .from('site_settings')
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq('id', 'default')
            .select()
            .single(),
        ),
      ),
  },
  contacts: {
    list: () =>
      ensureSupabase().then((c) =>
        c ? c.from('contact_submissions').select('*').order('created_at', { ascending: false }) : { data: [], error: null },
      ),
    delete: (id) => requireClient().then((c) => unwrap(c.from('contact_submissions').delete().eq('id', id))),
  },
  newsletter: {
    list: () =>
      ensureSupabase().then((c) =>
        c
          ? c.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })
          : { data: [], error: null },
      ),
    delete: (id) => requireClient().then((c) => unwrap(c.from('newsletter_subscribers').delete().eq('id', id))),
  },
  services: {
    list: () =>
      ensureSupabase().then((c) =>
        c ? c.from('services').select('*').order('sort_order') : { data: [], error: null },
      ),
    upsert: (data) =>
      requireClient().then((c) => unwrap(c.from('services').upsert(data, { onConflict: 'id' }).select().single())),
    delete: (id) => requireClient().then((c) => unwrap(c.from('services').delete().eq('id', id))),
  },
};
