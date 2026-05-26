import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail } from "lucide-react";
import { toast } from "sonner";
import GlowOrbs from "@/components/GlowOrbs";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", message: "" });
      toast.success("Message sent! We'll get back to you soon.");
    }, 1200);
  };

  const inputClass =
    "w-full bg-white/3 border border-white/10 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 text-sm outline-none focus:border-blue-500/60 focus:bg-white/5 transition-all";

  return (
    <div className="relative">
      <GlowOrbs />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full border border-blue-500/20 text-xs text-blue-300 mb-6">
              <Mail size={10} />
              Contact
            </div>
            <h1
              className="text-5xl font-bold text-gradient mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Get in touch.
            </h1>
            <p className="text-slate-400 text-lg">Have a question or issue? Send us a message.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl p-8"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className={inputClass}
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className={inputClass}
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us what's on your mind..."
                  rows={5}
                  className={`${inputClass} resize-none`}
                  data-testid="input-message"
                />
              </div>

              <motion.button
                type="submit"
                disabled={sending}
                whileHover={!sending ? { scale: 1.01, y: -1 } : {}}
                whileTap={!sending ? { scale: 0.99 } : {}}
                data-testid="button-send"
                className="w-full py-3 px-6 rounded-xl font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  boxShadow: sending ? "none" : "0 0 20px rgba(59,130,246,0.35)",
                }}
              >
                {sending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
