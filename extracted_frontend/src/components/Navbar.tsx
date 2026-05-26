import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className="glass-panel border-b border-white/5"
        style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" data-testid="link-logo">
              <motion.div
                className="flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Zap className="w-4 h-4 text-white fill-white" />
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 blur-md opacity-50 -z-10" />
                </div>
                <span
                  className="text-xl font-bold text-gradient"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  NexDrop
                </span>
              </motion.div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const active = location === link.href;
                return (
                  <Link key={link.href} href={link.href} data-testid={`link-nav-${link.label.toLowerCase()}`}>
                    <motion.span
                      className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer block ${
                        active ? "text-blue-400" : "text-slate-400 hover:text-slate-200"
                      }`}
                      whileHover={{ y: -1 }}
                    >
                      {link.label}
                      {active && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-lg bg-blue-500/10 border border-blue-500/20"
                        />
                      )}
                    </motion.span>
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={toggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-lg glass-panel flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                data-testid="button-theme-toggle"
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.button>

              <motion.button
                className="md:hidden w-9 h-9 rounded-lg glass-panel flex items-center justify-center text-slate-400"
                onClick={() => setOpen(!open)}
                whileTap={{ scale: 0.9 }}
                data-testid="button-mobile-menu"
              >
                {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed inset-0 top-16 z-40"
            style={{ background: "rgba(5,5,8,0.97)", backdropFilter: "blur(20px)" }}
          >
            <nav className="flex flex-col gap-2 p-6">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link href={link.href}>
                    <span
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3 text-lg font-medium rounded-xl cursor-pointer transition-colors ${
                        location === link.href
                          ? "text-blue-400 bg-blue-500/10 border border-blue-500/20"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
