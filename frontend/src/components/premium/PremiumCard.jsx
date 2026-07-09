import { motion } from "framer-motion";
import { fadeUp } from "../../utils/motion";

function PremiumCard({ children, className = "", hover = true }) {
  return (
    <motion.div
      className={`premium-card ${className}`}
      variants={fadeUp}
      whileHover={
        hover
          ? {
              y: -5,
              scale: 1.01,
              transition: { duration: 0.25, ease: "easeOut" },
            }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}

export default PremiumCard;