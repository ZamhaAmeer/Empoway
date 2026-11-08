import { useState, useRef, useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Custom hook for smooth, physics-based 3D Card Tilt,
 * Parallax depth, and dynamic cursor-following spotlight sheen.
 *
 * Fully responsive:
 * - On desktop with fine pointer: rich 3D spatial tilt, cursor spotlight, and parallax depth.
 * - On mobile/touchscreens (or reduced-motion): gracefully disables 3D rotations to prevent
 *   gesture conflicts or tilted card freezes, and delivers responsive tactile spring taps.
 */
export function use3DCardTilt(options = {}) {
  const {
    maxTilt = 7,             // Maximum degrees of tilt (subtle and refined)
    stiffness = 260,         // Spring stiffness
    damping = 22,            // Spring damping (prevents harsh wobbles)
    reverse = false,         // Invert tilt direction
    enableParallax = true    // Enable image counter-pan
  } = options;

  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Detect touch screens or coarse pointer
  useEffect(() => {
    const checkCapability = () => {
      const isCoarse = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
      const noHover = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
      const isSmall = typeof window !== 'undefined' && window.innerWidth < 768;
      const hasTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      setIsTouchDevice(isCoarse || noHover || (hasTouch && isSmall));
    };

    checkCapability();
    window.addEventListener('resize', checkCapability);
    return () => window.removeEventListener('resize', checkCapability);
  }, []);

  // Normalized cursor coordinates (-0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for fluid movement
  const springX = useSpring(mouseX, { stiffness, damping });
  const springY = useSpring(mouseY, { stiffness, damping });

  // Map spring coordinates to 3D tilt angles (degrees)
  const dir = reverse ? -1 : 1;
  const rawRotateX = useTransform(springY, [-0.5, 0.5], [`${maxTilt * dir}deg`, `${-maxTilt * dir}deg`]);
  const rawRotateY = useTransform(springX, [-0.5, 0.5], [`${-maxTilt * dir}deg`, `${maxTilt * dir}deg`]);

  // Dynamic light sheen / spotlight position (0% to 100%)
  const sheenX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const sheenY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  // Parallax counter-pan for background photography (subtle depth)
  const panX = useTransform(springX, [-0.5, 0.5], ['4px', '-4px']);
  const panY = useTransform(springY, [-0.5, 0.5], ['4px', '-4px']);

  const disable3D = shouldReduceMotion || isTouchDevice;

  const handleMouseMove = (e) => {
    if (disable3D) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width === 0 || height === 0) return;

    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Normalize between -0.5 and 0.5
    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return {
    cardRef,
    isHovered,
    isTouchDevice,
    shouldReduceMotion,
    disable3D,
    rotateX: disable3D ? 0 : rawRotateX,
    rotateY: disable3D ? 0 : rawRotateY,
    sheenX,
    sheenY,
    panX: disable3D || !enableParallax ? '0px' : panX,
    panY: disable3D || !enableParallax ? '0px' : panY,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave
  };
}

export default use3DCardTilt;
