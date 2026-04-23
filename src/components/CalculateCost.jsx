import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icons';
import { servicesMenu } from '../data/servicesData';
import ButtonTextChange from './ui/ButtonTextChange';

export default function CalculateCost() {
  const [form, setForm] = useState({ name: '', email: '', service: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="section calculate" id="contact">
      <div className="calculate__glow calculate__glow--1" />
      <div className="calculate__glow calculate__glow--2" />
      <div className="calculate__inner">
        <motion.div
          className="calculate__content"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="calculate__badge">Get a Quote</span>
          <h2 className="calculate__title">Calculate Your Project Cost</h2>
          <h3 className="calculate__subtitle">Tell Us Your Need</h3>
          <p className="calculate__desc">
            Share your project requirements and we'll provide a detailed estimate.
            Get started with a free consultation today.
          </p>
          <div className="calculate__features">
            <span><Icon name="clock" size={18} /> Free estimate</span>
            <span><Icon name="sparkles" size={18} /> Quick response</span>
          </div>
          <div className="calculate__btns">
            <ButtonTextChange href="/contact" variant="filled" className="calculate__estimate-tc">
              Estimate Your Project
            </ButtonTextChange>
            <ButtonTextChange href="#" variant="outline">
              Chat Live
            </ButtonTextChange>
          </div>
        </motion.div>
        <motion.form
          className="calculate__form-wrap"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="calculate__form">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <label htmlFor="calculate-service" className="sr-only">
              Service you need
            </label>
            <select
              id="calculate-service"
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              className="calculate__select"
              required
            >
              <option value="">Select a service</option>
              {servicesMenu.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
              <option value="other">Other / General Inquiry</option>
            </select>
            <textarea
              placeholder="Your Message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <ButtonTextChange type="submit" variant="filled" className="btn-text-change--block calculate__submit-tc">
              Submit Now
            </ButtonTextChange>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
