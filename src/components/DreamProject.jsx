import { useState } from 'react';
import { m } from 'framer-motion';

export default function DreamProject() {
  const [email, setEmail] = useState('');

  return (
    <section className="section dream">
      <div className="dream__inner">
        <m.div
          className="dream__content"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="dream__title">Let's Start Your Dream Project Today?</h2>
          <h3 className="dream__subtitle">Talk to Us Today?</h3>
          <p className="dream__desc">
            Ready to bring your idea to life? Get in touch with our team and let's 
            discuss how we can help you achieve your goals.
          </p>
        </m.div>
        <m.div
          className="dream__form"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="button" className="dream__btn">
            Get Started
          </button>
        </m.div>
      </div>
    </section>
  );
}
