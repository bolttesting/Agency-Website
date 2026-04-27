import { useState, useCallback } from 'react';
import { m } from 'framer-motion';
import SlideButton from './ui/SlideButton';
import { ensureSupabase } from '../lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const emailOk = EMAIL_RE.test(email.trim());

  const handleConfirm = useCallback(async () => {
    const addr = email.trim();
    if (!EMAIL_RE.test(addr)) {
      throw new Error('Invalid email');
    }
    const client = await ensureSupabase();
    if (!client) {
      throw new Error('Newsletter signup is not configured');
    }
    const normalized = addr.toLowerCase();
    const { error } = await client.from('newsletter_subscribers').insert({ email: normalized });
    // Ignore duplicate signup attempts (unique index)
    if (error && error.code !== '23505') {
      throw new Error(error.message || 'Signup failed');
    }
    setEmail('');
  }, [email]);

  return (
    <section className="section newsletter">
      <div className="section__inner newsletter__inner">
        <m.h2
          className="newsletter__title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Join Our Daily Newsletter
        </m.h2>
        <m.form
          className="newsletter__form"
          onSubmit={(e) => e.preventDefault()}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-invalid={email.length > 0 && !emailOk}
          />
          <SlideButton
            className="newsletter__slide"
            disabled={!emailOk}
            onConfirm={handleConfirm}
            hint="Slide to subscribe"
          />
        </m.form>
      </div>
    </section>
  );
}
