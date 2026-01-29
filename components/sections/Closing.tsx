"use client";
import { motion } from "framer-motion";

export default function Closing() {
  return (
    <section className="h-[60vh] flex flex-col items-center justify-center text-center px-6 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="uppercase text-4xl md:text-5xl font-bold mb-6 max-w-3xl">
          Built for teams that make decisions with data
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Xai helps leaders move from information overload to confident action.
        </p>
      </motion.div>

      <div className="absolute -z-10 w-125 h-125 bg-blue-900/10 rounded-full blur-[120px]" />
    </section>
  );
}
