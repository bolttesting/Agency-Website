import { m } from 'framer-motion';
import Icon from './Icons';
import { CpuArchitecture } from './CpuArchitecture';

const stats = [
  { value: '73+', label: 'Projects', icon: 'folder' },
  { value: '12k', label: 'Active Clients', icon: 'users' },
  { value: '50+', label: 'Team Members', icon: 'handshake' },
  { value: '8', label: 'Years Experience', icon: 'star' },
];

export default function Mission() {
  return (
    <section className="section mission" id="about">
      <div className="mission__glow mission__glow--1" />
      <div className="mission__glow mission__glow--2" />
      <div className="mission__inner">
        <m.div
          className="mission__visual"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mission__visual-wrap mission__visual-wrap--cpu">
            <CpuArchitecture text="LC" className="mission__cpu-arch" />
          </div>
        </m.div>
        <m.div
          className="mission__content"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mission__badge">Who We Are</span>
          <h2 className="mission__title">Our Mission & Priorities</h2>
          <p className="mission__text">
            We are dedicated to delivering exceptional software solutions that empower businesses
            to thrive in the digital age. Our mission is to combine cutting-edge technology with
            strategic vision, ensuring every project exceeds expectations and drives real results.
          </p>
          <p className="mission__highlight">
            Quality, innovation, and client success are at the heart of everything we do.
          </p>
          <div className="mission__stats">
            {stats.map((stat, i) => (
              <m.div
                key={stat.label}
                className="mission__stat"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <span className="mission__stat-icon-wrap">
                  <Icon name={stat.icon} size={24} />
                </span>
                <div className="mission__stat-text">
                  <span className="mission__stat-value">{stat.value}</span>
                  <span className="mission__stat-label">{stat.label}</span>
                </div>
              </m.div>
            ))}
          </div>
        </m.div>
      </div>
    </section>
  );
}
