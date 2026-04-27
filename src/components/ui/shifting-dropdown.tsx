import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { AnimatePresence, m } from 'framer-motion';
import { Link } from 'react-router-dom';
import { servicesMenu } from '../../data/servicesData';
import Icon from '../Icons';
import './shifting-dropdown.css';

const TAB_ID = 'services';

const SERVICE_COLUMNS = [
  servicesMenu.slice(0, 2),
  servicesMenu.slice(2, 4),
  servicesMenu.slice(4, 6),
];

function ServicesPanelGrid() {
  return (
    <div className="shifting-dropdown__services-grid">
      {SERVICE_COLUMNS.map((col, ci) => (
        <div key={ci}>
          {col.map((category) => (
            <div key={category.id} className="shifting-dropdown__category-block">
              <Link to={category.path} className="shifting-dropdown__col-title">
                {category.title}
              </Link>
              {category.items.slice(0, 3).map((item) => (
                <Link
                  key={item.title}
                  to={item.slug ? `${category.path}/${item.slug}` : category.path}
                  className="shifting-dropdown__sub"
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ServicesDropdown() {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayId = useId().replace(/:/g, '');
  const [open, setOpen] = useState(false);
  const [panelShiftX, setPanelShiftX] = useState(0);

  const updatePanelOffset = useCallback(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const viewportPadding = 10;
    let shift = 0;

    if (rect.left < viewportPadding) {
      shift = viewportPadding - rect.left;
    } else if (rect.right > window.innerWidth - viewportPadding) {
      shift = (window.innerWidth - viewportPadding) - rect.right;
    }
    setPanelShiftX(shift);
  }, [open]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useLayoutEffect(() => {
    updatePanelOffset();
  }, [open, updatePanelOffset]);

  useEffect(() => {
    if (!open) return undefined;
    const onResize = () => updatePanelOffset();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, updatePanelOffset]);

  useEffect(() => {
    if (!open || !panelRef.current) return undefined;
    const panel = panelRef.current;
    const ro = new ResizeObserver(() => updatePanelOffset());
    ro.observe(panel);
    const raf1 = requestAnimationFrame(() => updatePanelOffset());
    const raf2 = requestAnimationFrame(() => updatePanelOffset());
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
    };
  }, [open, updatePanelOffset]);

  return (
    <div
      className="shifting-dropdown"
      ref={rootRef}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="shifting-dropdown__tabs">
        <button
          type="button"
          id={`${overlayId}-shift-tab-${TAB_ID}`}
          onMouseEnter={() => setOpen(true)}
          onClick={() => setOpen((o) => !o)}
          className={[
            'navbar__ghost',
            'navbar__link--btn',
            'shifting-dropdown__trigger',
            open ? 'shifting-dropdown__trigger--active' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-expanded={open}
          aria-haspopup="true"
        >
          <span>Services</span>
          <ChevronDown className="shifting-dropdown__chev" size={16} aria-hidden />
        </button>

        <AnimatePresence>
          {open ? (
            <m.div
              key="mega"
              ref={panelRef}
              id={`${overlayId}-overlay-content`}
              role="region"
              aria-label="Services menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="shifting-dropdown__panel"
              style={{ '--shift-x': `${panelShiftX}px` } as CSSProperties}
            >
              <div className="shifting-dropdown__bridge" aria-hidden />
              <Nub overlayId={overlayId} />
              <div className="shifting-dropdown__panel-slide">
                <m.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <ServicesPanelGrid />
                </m.div>
              </div>
              <Link
                to={servicesMenu[0]?.path ?? '/services/app-development'}
                className="shifting-dropdown__footer-link"
              >
                <span>View all capabilities</span>
                <ArrowRight size={16} aria-hidden />
              </Link>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Nub({ overlayId }: { overlayId: string }) {
  const [left, setLeft] = useState(0);

  const moveNub = useCallback(() => {
    const hovered = document.getElementById(`${overlayId}-shift-tab-${TAB_ID}`);
    const overlay = document.getElementById(`${overlayId}-overlay-content`);
    if (!hovered || !overlay) return;
    const tabRect = hovered.getBoundingClientRect();
    const { left: contentLeft, width } = overlay.getBoundingClientRect();
    const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;
    setLeft(Math.min(Math.max(tabCenter, 16), width - 16));
  }, [overlayId]);

  useLayoutEffect(() => {
    moveNub();
  }, [moveNub]);

  useEffect(() => {
    window.addEventListener('resize', moveNub);
    return () => window.removeEventListener('resize', moveNub);
  }, [moveNub]);

  return (
    <span
      aria-hidden
      className="shifting-dropdown__nub"
      style={{ left: `${left}px`, transition: 'left 0.25s ease-in-out' }}
    />
  );
}
