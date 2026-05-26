import { motion } from "framer-motion";
import { Zap, Shield, Music, Cpu } from "lucide-react";
import GlowOrbs from "@/components/GlowOrbs";

const features = [
  {
    icon: <Zap className="w-5 h-5 text-blue-400" />,
    title: "Lightning Fast",
    desc: "Powered by yt-dlp, the gold standard for media extraction. Your files are ready in seconds.",
  },
  {
    icon: <Shield className="w-5 h-5 text-violet-400" />,
    title: "Privacy First",
    desc: "We don't store your media. Files are served directly and cleared from our servers immediately.",
  },
  {
    icon: <Music className="w-5 h-5 text-blue-400" />,
    title: "YouTube Only",
    desc: "Built exclusively for YouTube — videos, Shorts, and full channels. Fast, reliable, and always up to date.",
  },
  {
    icon: <Cpu className="w-5 h-5 text-violet-400" />,
    title: "Every Format",
    desc: "Download in 360p, 480p, 720p, 1080p, or strip audio to MP3. Your choice, your quality.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative">
      <GlowOrbs />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full border border-blue-500/20 text-xs text-blue-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              About NexDrop
            </div>
            <h1
              className="text-5xl font-bold text-gradient mb-5"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Built for speed.
              <br />
              Designed to impress.
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
              NexDrop is a free, premium-grade YouTube downloader. We built it because downloading
              a video shouldn't require a registration form, a Chrome extension, or tolerating ads
              the size of billboards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="glass-panel rounded-2xl p-6"
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center mb-4"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-slate-200 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-panel rounded-2xl p-8 text-center"
            style={{ border: "1px solid rgba(59,130,246,0.15)", boxShadow: "0 0 40px rgba(59,130,246,0.05)" }}
          >
            <h2 className="text-2xl font-bold text-slate-200 mb-3">Open, honest, free.</h2>
            <p className="text-slate-400 leading-relaxed max-w-md mx-auto">
              NexDrop is free to use with no sign-ups. We earn nothing and track nothing.
              It's just a tool that works — the way tools should.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
