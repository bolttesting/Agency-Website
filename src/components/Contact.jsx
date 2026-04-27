import { useState } from 'react';
import { m } from 'framer-motion';

export default function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleChange = (e) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section className="section contact" id="contact">
      <div className="section__inner contact__inner">
        <m.div
          className="contact__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section__tag">Get in Touch</span>
          <h2 className="section__title">Let's Build Something</h2>
          <p className="section__desc">
            Ready to turn your idea into reality? Drop us a line.
          </p>
        </m.div>

        <m.form
          className="contact__form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="contact__row">
            <m.div
              className="contact__field"
              whileFocus={{ scale: 1.01 }}
            >
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </m.div>
            <m.div
              className="contact__field"
              whileFocus={{ scale: 1.01 }}
            >
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </m.div>
          </div>
          <m.div
            className="contact__field"
            whileFocus={{ scale: 1.01 }}
          >
            <label htmlFor="message">Project Details</label>
            <textarea
              id="message"
              name="message"
              placeholder="Tell us about your project..."
              rows={5}
              value={formState.message}
              onChange={handleChange}
            />
          </m.div>
          <m.button
            type="submit"
            className="contact__submit"
            whileHover={{ boxShadow: '0 0 40px rgba(0, 245, 255, 0.5)' }}
            whileTap={{ scale: 0.98 }}
          >
            Send Message
          </m.button>
        </m.form>
      </div>
    </section>
  );
}
