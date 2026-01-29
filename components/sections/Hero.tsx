"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.9]);

  return (
    <motion.section
      style={{ opacity, scale }}
      className="h-screen flex flex-col items-center justify-center text-center px-4 relative"
    >
      <div className="z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="uppercase text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500"
        >
          Turn raw data into intelligence that acts
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-xl text-slate-400 mx-auto"
        >
          Xai transforms fragmented data into structured insights and automated
          decisions - in real time.
        </motion.p>
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mt-12 text-sm uppercase tracking-widest text-slate-500"
        >
          Scroll to see intelligence in action
        </motion.p>
      </div>
    </motion.section>
  );
}
