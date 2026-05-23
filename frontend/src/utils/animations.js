export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
};

export const scaleUp = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export const glowHover = {
  whileHover: { 
    y: -8,
    boxShadow: '0 20px 40px -15px rgba(37, 99, 235, 0.12), 0 0 50px -10px rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.4)'
  }
};

export const heartPop = {
  initial: { scale: 1 },
  hover: { scale: 1.2 },
  tap: { scale: 0.8 },
  active: { scale: [1, 1.4, 0.95, 1.1, 1], transition: { duration: 0.4 } }
};

export const buttonHover = {
  whileHover: { scale: 1.03, y: -1 },
  whileTap: { scale: 0.98 }
};
