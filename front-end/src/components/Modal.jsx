import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

void motion;

export default function Modal({ isOpen, onClose, children, title }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            key="modal"
            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md mx-4 relative border border-[#e0e7e0]"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 120,
              damping: 18,
            }}
          >
            <motion.div
              className="flex justify-between items-center border-b border-[#dfe8df] pb-3 mb-4"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.3 }}
            >
              <h2 className="text-[#264533] text-xl font-bold tracking-tight">
                {title}
              </h2>
              <motion.button
                onClick={onClose}
                className="text-[#366348] hover:text-[#264533] transition"
                whileHover={{ rotate: 90, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={22} />
              </motion.button>
            </motion.div>

            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.25 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}