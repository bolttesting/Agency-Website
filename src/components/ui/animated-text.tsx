import * as React from 'react'
import { m, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'
import './animated-text.css'

export type AnimatedTextTone = 'default' | 'hero-line-light' | 'hero-gradient'

export interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  duration?: number
  delay?: number
  /** Extra delay before this block’s letters start (after `delayChildren`) */
  startDelay?: number
  replay?: boolean
  className?: string
  textClassName?: string
  underlineClassName?: string
  tone?: AnimatedTextTone
  /** When false, show full text immediately (use with prefers-reduced-motion) */
  animate?: boolean
  /** Hide the gradient underline */
  hideUnderline?: boolean
}

const AnimatedText = React.forwardRef<HTMLDivElement, AnimatedTextProps>(
  (
    {
      text,
      duration = 0.05,
      delay = 0.08,
      startDelay = 0,
      replay = true,
      className,
      textClassName,
      underlineClassName,
      tone = 'default',
      animate: shouldAnimate = true,
      hideUnderline = false,
      ...props
    },
    ref,
  ) => {
    const letters = Array.from(text)

    const container: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: duration,
          delayChildren: delay + startDelay,
        },
      },
    }

    const child: Variants = {
      visible: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', damping: 14, stiffness: 220 },
      },
      hidden: {
        opacity: 0,
        y: 20,
        transition: { type: 'spring', damping: 14, stiffness: 220 },
      },
    }

    const lineVariants: Variants = {
      hidden: { width: '0%', left: '50%' },
      visible: {
        width: '100%',
        left: '0%',
        transition: {
          delay: Math.max(0, letters.length * duration + delay + startDelay - 0.05),
          duration: 0.75,
          ease: [0.23, 1, 0.32, 1],
        },
      },
    }

    const toneClass =
      tone === 'hero-line-light'
        ? 'animated-text--hero-line-light'
        : tone === 'hero-gradient'
          ? 'animated-text--hero-gradient'
          : ''

    if (!shouldAnimate) {
      return (
        <div
          ref={ref}
          className={cn('animated-text', toneClass, className)}
          {...props}
        >
          <div className={cn('animated-text__typo', textClassName)}>{text}</div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn('animated-text', toneClass, className)}
        {...props}
      >
        <div className="animated-text__relative">
          <m.div
            className={cn('animated-text__letters animated-text__typo', textClassName)}
            variants={container}
            initial="hidden"
            animate={replay ? 'visible' : 'hidden'}
          >
            {letters.map((letter, index) => (
              <m.span
                key={`${index}-${letter}`}
                className="animated-text__letter"
                variants={child}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </m.span>
            ))}
          </m.div>
          {!hideUnderline && (
            <m.div
              variants={lineVariants}
              initial="hidden"
              animate={replay ? 'visible' : 'hidden'}
              className={cn('animated-text__underline', underlineClassName)}
            />
          )}
        </div>
      </div>
    )
  },
)
AnimatedText.displayName = 'AnimatedText'

export { AnimatedText }
