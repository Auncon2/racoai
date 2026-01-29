import EarthScene from "@/components/canvas/EarthScene";
import Closing from "@/components/sections/Closing";
import Dashboard from "@/components/sections/Dashboard";
import Hero from "@/components/sections/Hero";
import InsightFlow from "@/components/sections/InsightFlow";
import Signature from "@/components/sections/Signature";

export default function Home() {
  return (
    <main className="relative text-white selection:bg-blue-500/30">
      <EarthScene />
      <Hero />
      <InsightFlow />
      <Dashboard />
      <Signature />
      <Closing />
    </main>
  );
}
