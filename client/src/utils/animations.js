/**
 * EMPOWAY Motion Animation Presets
 * Designed for fluid, premium, modern 3D spatial interactions.
 * Fully respects prefers-reduced-motion for accessibility.
 */

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.stagger || 0.08,
      delayChildren: custom.delay || 0.04
    }
  })
};

export const deckStagger = {
  hidden: { opacity: 0 },
  visible: (custom = {}) => ({
    opacity: 1,
    transition: {
      staggerChildren: custom.stagger || 0.08,
      delayChildren: custom.delay || 0.04
    }
  })
};

/**
 * 3D Spatial Card Reveal on Scroll
 * Cards remain hidden until the user scrolls down, then glide into view
 * with a subtle 3D perspective fold and settling spring physics.
 */
export const cardReveal3D = {
  hidden: {
    opacity: 0,
    y: 48,
    rotateX: 10,
    scale: 0.94
  },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 20,
      mass: 0.85,
      delay: custom?.delay || 0
    }
  })
};

export const cardReveal = {
  hidden: {
    opacity: 0,
    y: 36,
    scale: 0.96
  },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 160,
      damping: 20,
      delay: custom?.delay || 0
    }
  })
};

export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 28
  },
  visible: (custom = {}) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      delay: custom?.delay || 0
    }
  })
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.94
  },
  visible: (custom = {}) => ({
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 220,
      damping: 20,
      delay: custom?.delay || 0
    }
  })
};

export const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } }
};
