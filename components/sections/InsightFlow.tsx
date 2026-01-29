"use client";
import { motion } from "framer-motion";
import { Database, Cpu, Lightbulb } from "lucide-react";
const steps = [
  {
    title: "Ingest Data",
    desc: "Connect raw data from tools, systems, and files - structured or unstructured - without manual cleanup.",
    icon: Database,
  },
  {
    title: "Analyze with AI",
    desc: "Xai organizes, understands, and enriches data using adaptive AI models designed for complex decision-making.",
    icon: Cpu,
  },
  {
    title: "Generate Insight",
    desc: "Surface patterns, risks, and opportunities as clear, actionable intelligence - not raw outputs.",
    icon: Lightbulb,
  },
];

export default function InsightFlow() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, letterSpacing: "0.2em" }}
        whileInView={{ opacity: 1, letterSpacing: "0.05em" }}
        transition={{ duration: 1 }}
        className="uppercase text-4xl font-bold mb-24 text-center bg-linear-to-b from-white to-slate-500 bg-clip-text text-transparent"
      >
        How Xai creates intelligence
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 20px rgba(59,130,246,0.2)",
            }}
            className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="flex items-baseline gap-2.5">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{
                  delay: i * 0.2 + 0.3,
                  type: "spring",
                  stiffness: 200,
                }}
                className="w-12 h-12 mb-6 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20"
              >
                <step.icon size={24} />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 text-blue-400">
                {step.title}
              </h3>
            </div>

            <p className="text-slate-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
