"use client";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Database,
  Lightbulb,
  Zap,
  Settings,
  CircleDot,
  ArrowUpRight,
} from "lucide-react";

const tableData = [
  {
    source: "Salesforce CRM",
    status: "Active",
    impact: "High",
    time: "3m ago",
  },
  {
    source: "AWS CloudWatch",
    status: "Active",
    impact: "Medium",
    time: "15m ago",
  },
  {
    source: "Stripe Billing",
    status: "Warning",
    impact: "Critical",
    time: "1h ago",
  },
  {
    source: "Zendesk Support",
    status: "Active",
    impact: "Low",
    time: "3h ago",
  },
];

export default function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.8 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard, active: true },
    { name: "Data Sources", icon: Database, active: false },
    { name: "Insights", icon: Lightbulb, active: false },
    { name: "Automations", icon: Zap, active: false },
    { name: "Settings", icon: Settings, active: false },
  ];

  return (
    <section className="py-24 px-6 flex flex-col items-center">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="uppercase text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r from-white to-slate-500 bg-clip-text text-transparent">
          Intelligence Dashboard Preview
        </h2>
        <p className="text-slate-400">
          Real-time adaptive monitoring for your entire data stack.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-6xl w-full border border-white/10 rounded-2xl overflow-hidden flex bg-black/40 backdrop-blur-xl h-[650px] shadow-2xl shadow-blue-500/5"
      >
        {/* Sidebar */}
        <div className="w-64 border-r border-white/10 p-6 space-y-8 hidden md:block">
          <div className="flex items-center gap-2 font-bold text-blue-500 text-lg tracking-tight">
            <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
            Xai OS
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                  item.active
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </div>
            ))}
          </nav>
        </div>

        {/* Main Panel */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Header Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              {
                label: "Active Data Sources",
                value: "18",
                color: "text-blue-400",
              },
              {
                label: "Insights Generated",
                value: "124",
                color: "text-emerald-400",
              },
              {
                label: "Automations Running",
                value: "7",
                color: "text-purple-400",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-4 bg-white/5 border border-white/5 rounded-xl"
              >
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                  {stat.label}
                </p>
                <p className={`text-2xl font-mono font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Alert Insight */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-xl mb-8 group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-blue-400 flex items-center gap-2">
                <CircleDot size={14} className="animate-pulse" />
                Revenue risk detected
              </h4>
              <ArrowUpRight
                size={16}
                className="text-slate-500 group-hover:text-blue-400 transition-colors"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A recurring delay pattern across three data sources indicates
              potential revenue leakage. Suggesting automated reconciliation.
            </p>
          </motion.div>

          {/* Data Table */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-300">
                    Source
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-300">
                    Impact
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-300 text-right">
                    Activity
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tableData.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-white">
                      {row.source}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`flex items-center gap-1.5 ${row.status === "Warning" ? "text-amber-400" : "text-emerald-400"}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${row.status === "Warning" ? "bg-amber-400" : "bg-emerald-400"}`}
                        />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{row.impact}</td>
                    <td className="px-4 py-3 text-slate-500 text-right">
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
