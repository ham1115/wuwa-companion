/**
 * Whether the person has asked their system for less motion.
 *
 * Read at the moment it matters rather than subscribed to: every caller is
 * about to start one animation, and someone changing the setting part-way
 * through a single 240ms transition is not worth a listener.
 */
export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
