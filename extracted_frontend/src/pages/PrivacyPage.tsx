import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import GlowOrbs from "@/components/GlowOrbs";

const sections = [
  {
    title: "Information We Collect",
    content:
      "NexDrop does not require you to create an account or provide personal information. When you submit a URL for processing, that URL is temporarily held in memory only for the duration of the download task and is not logged or stored in any database.",
  },
  {
    title: "Media Files & Temporary Storage",
    content:
      "Downloaded media files are stored in temporary server directories for the sole purpose of serving them to you. These files are not retained after delivery and are automatically cleaned from the server. We do not access, inspect, or retain any content you download.",
  },
  {
    title: "Cookies & Tracking",
    content:
      "NexDrop does not use tracking cookies, analytics scripts, or third-party advertising trackers. Your theme preference (dark or light mode) is stored in your browser's localStorage, which never leaves your device.",
  },
  {
    title: "Third-Party Services",
    content:
      "NexDrop uses open-source tools (yt-dlp) for media extraction. These tools operate entirely on our server and do not communicate your personal data to any third party on your behalf.",
  },
  {
    title: "Security",
    content:
      "All communication between your browser and our servers is encrypted over HTTPS. We do not store credentials, payment information, or any personally identifiable information.",
  },
  {
    title: "Children's Privacy",
    content:
      "NexDrop is not directed at children under the age of 13. We do not knowingly collect information from minors. If you believe a minor has used this service, please contact us and we will address the concern.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy occasionally. Changes will be reflected on this page with an updated effective date. Continued use of NexDrop after changes constitute acceptance of the updated policy.",
  },
  {
    title: "Contact",
    content:
      "If you have any questions or concerns about this Privacy Policy, please reach out through the Contact page. We are committed to addressing any privacy concerns promptly.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative">
      <GlowOrbs />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full border border-blue-500/20 text-xs text-blue-300 mb-6">
              <Shield size={10} />
              Privacy Policy
            </div>
            <h1
              className="text-5xl font-bold text-gradient mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Your data.
              <br />
              Your business.
            </h1>
            <p className="text-slate-500 text-sm">Effective date: May 2026</p>
          </div>

          <div className="space-y-4">
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06 }}
                className="glass-panel rounded-2xl p-6"
                style={{ border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <h2 className="font-semibold text-slate-200 mb-3">{s.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed">{s.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
