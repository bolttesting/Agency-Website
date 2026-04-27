import { useState, useCallback, useEffect } from 'react';
import {
  m,
  useMotionValue,
  useTransform,
  AnimatePresence,
  animate,
} from 'framer-motion';
import { Check, Loader2, SendHorizontal, X } from 'lucide-react';
import './slide-button.css';

const MAX_DRAG = 155;
const THRESHOLD = 0.88;

const SPRING = {
  type: 'spring',
  stiffness: 400,
  damping: 40,
  mass: 0.8,
};

function StatusIcon({ status }) {
  if (status === 'loading') {
    return <Loader2 size={20} className="slide-button__icon-spin" aria-hidden />;
  }
  if (status === 'success') {
    return <Check size={20} aria-hidden />;
  }
  if (status === 'error') {
    return <X size={20} aria-hidden />;
  }
  return null;
}

/**
 * Slide-to-confirm control (no Tailwind/shadcn). Call `onConfirm` when the user drags to the end.
 * @param {object} props
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 * @param {() => Promise<void>} [props.onConfirm] — runs after slide completes; throw to show error state
 * @param {string} [props.hint] — label in the track before slide
 */
export default function SlideButton({
  className = '',
  disabled = false,
  onConfirm,
  hint = 'Slide to send',
}) {
  const [completed, setCompleted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle');

  const x = useMotionValue(0);
  const fillW = useTransform(x, (v) => Math.max(0, v + 10));

  const runConfirm = useCallback(async () => {
    setStatus('loading');
    try {
      if (onConfirm) {
        await onConfirm();
      } else {
        await new Promise((r) => setTimeout(r, 900));
      }
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }, [onConfirm]);

  const handleDragEnd = useCallback(() => {
    if (disabled) {
      animate(x, 0, SPRING);
      return;
    }
    const pos = x.get();
    if (pos >= MAX_DRAG * THRESHOLD) {
      x.set(MAX_DRAG);
      setCompleted(true);
      runConfirm();
    } else {
      animate(x, 0, SPRING);
    }
  }, [disabled, x, runConfirm]);

  useEffect(() => {
    if (status !== 'success' && status !== 'error') return undefined;
    const delay = status === 'success' ? 3200 : 2200;
    const id = window.setTimeout(() => {
      setCompleted(false);
      setStatus('idle');
      x.set(0);
    }, delay);
    return () => window.clearTimeout(id);
  }, [status, x]);

  const rootClass = [
    'slide-button',
    completed ? 'slide-button--completed' : '',
    disabled && !completed ? 'slide-button--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      {!completed && (
        <>
          <m.div className="slide-button__fill" style={{ width: fillW }} aria-hidden />
          <span className="slide-button__hint">{hint}</span>
          <div className="slide-button__drag-host">
            <m.button
              type="button"
              style={{ x }}
              drag={disabled ? false : 'x'}
              dragConstraints={{ left: 0, right: MAX_DRAG }}
              dragElastic={0.05}
              dragMomentum={false}
              onDragStart={() => !disabled && setIsDragging(true)}
              onDragEnd={() => {
                setIsDragging(false);
                handleDragEnd();
              }}
              className={`slide-button__handle${isDragging ? ' slide-button__handle--dragging' : ''}`}
              disabled={disabled}
              aria-label={hint}
            >
              <SendHorizontal size={16} strokeWidth={2} aria-hidden />
            </m.button>
          </div>
        </>
      )}

      {completed && (
        <div className="slide-button__result">
          <button type="button" className="slide-button__result-btn" disabled={status === 'loading'}>
            <AnimatePresence mode="wait">
              <m.div
                key={status}
                initial={{ opacity: 0, scale: 0.65 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
              >
                <StatusIcon status={status} />
              </m.div>
            </AnimatePresence>
          </button>
        </div>
      )}
    </div>
  );
}
