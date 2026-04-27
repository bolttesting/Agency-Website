import { useState, lazy, Suspense } from 'react';
import { m } from 'framer-motion';
import Icon from '../components/Icons';
import { useSiteData } from '../context/SiteDataContext';
import { ensureSupabase } from '../lib/supabase';
import Seo from '../components/Seo';
import { contactEmails, contactPhones, telHref } from '../utils/contactLines';
import { parseFooterSocialLinks } from '../utils/footerSocialLinks';
import './ContactPage.css';

const OfficesMapSection = lazy(() => import('../components/OfficesMapSection'));

export default function ContactPage() {
  const { settings, loadContactSubmissions } = useSiteData();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailLines = contactEmails(settings);
  const phoneLines = contactPhones(settings);
  const socialLinks = parseFooterSocialLinks(settings?.social_links);

  const contactInfo = [
    { icon: 'map', label: 'Address', kind: 'text', value: settings?.address || '123 Street, City, Country' },
    { icon: 'phone', label: 'Phone', kind: 'phones', values: phoneLines },
    { icon: 'email', label: 'Email', kind: 'emails', values: emailLines },
    { icon: 'clock', label: 'Hours', kind: 'text', value: settings?.hours || 'Mon - Fri: 9AM - 6PM' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const client = await ensureSupabase();
      if (client) {
        await client.from('contact_submissions').insert({
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          subject: form.subject || null,
          message: form.message,
        });
        await loadContactSubmissions();
      }
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true); // still show success to user
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      <Seo
        title="Contact"
        description="Contact Logix Contact — UK digital product studio for web apps, mobile apps, and design. Request a quote, book a call, or ask about our services."
        keywords="contact Logix Contact, web development enquiry UK, hire app developers UK, digital agency contact"
      />
      <section className="contact-hero">
        <div className="contact-hero__glow" />
        <div className="contact-hero__content">
          <m.span
            className="contact-hero__badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            We'd Love to Hear From You
          </m.span>
          <m.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Get in Touch
          </m.h1>
          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Have a project in mind? Let's discuss how we can help bring your ideas to life.
          </m.p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-main__inner">
          <m.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Contact Information</h2>
            <p className="contact-info__intro">
              Reach out to us through any of the channels below. We typically respond within 24 hours.
            </p>
            <div className="contact-info__list">
              {contactInfo.map((item) => (
                <div key={item.label} className="contact-info__item">
                  <span className="contact-info__icon"><Icon name={item.icon} size={24} /></span>
                  <div>
                    <span className="contact-info__label">{item.label}</span>
                    {item.kind === 'text' ? (
                      <p>{item.value}</p>
                    ) : item.kind === 'emails' ? (
                      item.values.map((em) => (
                        <p key={em}>
                          <a href={`mailto:${em}`} className="contact-info__value-link">
                            {em}
                          </a>
                        </p>
                      ))
                    ) : (
                      item.values.map((num) => (
                        <p key={num}>
                          <a href={telHref(num)} className="contact-info__value-link">
                            {num}
                          </a>
                        </p>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
            {socialLinks.length > 0 ? (
              <div className="contact-info__social">
                {socialLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    aria-label={s.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name={s.icon} size={20} />
                  </a>
                ))}
              </div>
            ) : null}
          </m.div>

          <m.div
            id="contact-form"
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>Send a Message</h2>
            {submitted ? (
              <m.div
                className="contact-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="contact-success__icon"><Icon name="check" size={40} /></span>
                <h3>Thank You!</h3>
                <p>We've received your message and will get back to you soon.</p>
              </m.div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form__row">
                  <div className="contact-form__field">
                    <label htmlFor="name">Your Name *</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="contact-form__row">
                  <div className="contact-form__field">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="contact-form__field">
                    <label htmlFor="subject">Subject</label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Project inquiry"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                  </div>
                </div>
                <div className="contact-form__field">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    placeholder="Tell us about your project..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="contact-form__submit" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </m.div>
        </div>
      </section>

      <Suspense fallback={<div className="contact-page__map-skeleton" aria-hidden />}>
        <OfficesMapSection />
      </Suspense>
    </main>
  );
}
