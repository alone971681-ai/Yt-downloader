import { motion } from "framer-motion";

export default function GlowOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          top: "-10%",
          right: "10%",
        }}
        animate={{ y: [0, 30, 0], x: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
          bottom: "15%",
          left: "5%",
        }}
        animate={{ y: [0, -25, 0], x: [0, 15, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          top: "50%",
          left: "40%",
        }}
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
}
