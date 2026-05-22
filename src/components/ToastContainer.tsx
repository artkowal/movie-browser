import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useToast } from '../context/ToastContext';

const TOAST_VARIANTS: Variants = {
  initial: { opacity: 0, x: 48, scale: 0.9 },
  animate: {
    opacity: 1, x: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
  exit: { opacity: 0, x: 48, scale: 0.85, transition: { duration: 0.18 } },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            variants={TOAST_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="toast"
            onClick={() => removeToast(t.id)}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
