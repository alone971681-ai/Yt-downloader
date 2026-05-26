import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import GlowOrbs from "@/components/GlowOrbs";

const faqs = [
  {
    q: "Is NexDrop free to use?",
    a: "Yes, completely free. No registration, no subscription, no hidden fees. Just paste a link and download.",
  },
  {
    q: "Which platforms are supported?",
    a: "NexDrop supports YouTube — videos, Shorts, and live recordings. More platforms may be added in the future.",
  },
  {
    q: "What quality options are available?",
    a: "We offer 360p, 480p, 720p HD, 1080p Full HD, and MP3 audio extraction. Available qualities depend on what the original video was uploaded in.",
  },
  {
    q: "Can I download private videos?",
    a: "No. NexDrop can only download publicly accessible content. Private, age-restricted, or DRM-protected content is not supported.",
  },
  {
    q: "Is this legal?",
    a: "Downloading media for personal, offline use is generally acceptable. However, you should not redistribute, re-upload, or monetize content that you don't own. Always respect the original creator's rights and platform terms of service.",
  },
  {
    q: "Why is my download slow?",
    a: "Download speed depends on your internet connection, the server handling your request, and the file size. 1080p files can be large. Try 720p for a faster experience.",
  },
  {
    q: "Do you store my downloads?",
    a: "No. Files are processed in temporary storage and removed immediately after serving. We don't keep copies of any media.",
  },
  {
    q: "The link isn't working — what should I do?",
    a: "Make sure the URL is copied directly from the browser address bar. Ensure the content is public and accessible without logging in. If it still doesn't work, the video may be region-locked, age-restricted, or unavailable.",
  },
  {
    q: "Is there a file size limit?",
    a: "There's no hard limit set by NexDrop, but very long videos (2+ hours in 1080p) can be slow and may time out depending on server load. For large files, we recommend 720p.",
  },
];

export default function FaqPage() {
  return (
    <div className="relative">
      <GlowOrbs />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 glass-panel px-4 py-1.5 rounded-full border border-blue-500/20 text-xs text-blue-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              FAQ
            </div>
            <h1
              className="text-5xl font-bold text-gradient mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Questions answered.
            </h1>
            <p className="text-slate-400 text-lg">Everything you need to know about NexDrop.</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Accordion type="single" collapsible className="divide-y divide-white/5">
              {faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                >
                  <AccordionItem value={`item-${i}`} className="border-0 px-6">
                    <AccordionTrigger className="text-left text-slate-200 hover:text-white hover:no-underline py-5 font-medium">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400 pb-5 leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
