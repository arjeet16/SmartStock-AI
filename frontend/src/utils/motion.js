// frontend/src/utils/motion.js

export const motionViewport = {
  once: true,
  amount: 0.16,
  margin: "0px 0px -70px 0px",
};

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeDown = {
  hidden: {
    opacity: 0,
    y: -24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const slideFromLeft = {
  hidden: {
    opacity: 0,
    x: -34,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const slideFromRight = {
  hidden: {
    opacity: 0,
    x: 34,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

export const fastStaggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.03,
    },
  },
};

export const cardHover = {
  whileHover: {
    y: -7,
    scale: 1.012,
    transition: {
      duration: 0.24,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  whileTap: {
    scale: 0.99,
  },
};

export const softCardHover = {
  whileHover: {
    y: -4,
    transition: {
      duration: 0.22,
      ease: "easeOut",
    },
  },
};

export const buttonMotion = {
  whileHover: {
    y: -2,
    scale: 1.02,
  },
  whileTap: {
    scale: 0.97,
  },
  transition: {
    duration: 0.18,
    ease: "easeOut",
  },
};

export const pageTransition = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

export const pulseGlow = {
  animate: {
    scale: [1, 1.035, 1],
    opacity: [0.82, 1, 0.82],
  },
  transition: {
    duration: 2.4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const floatingMotion = {
  animate: {
    y: [0, -8, 0],
  },
  transition: {
    duration: 3.8,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export const progressReveal = {
  hidden: {
    scaleX: 0,
    transformOrigin: "left",
  },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.9,
      delay: 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};