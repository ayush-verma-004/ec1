import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Menu, X, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';

import logo from '../img/logo.jpeg';

/**
 * Landing Page Navbar — Floating Capsule Design
 *
 * Concept: A single floating pill-shaped capsule, centered horizontally,
 * pinned near the top. Inside the capsule:
 *   LEFT  — Logo icon + wordmark (small pill within the capsule)
 *   CENTER — Nav links
 *   RIGHT  — "Sign In" CTA (inner pill)
 *
 * On scroll: capsule gets a deeper shadow and slight opacity shift.
 * On mobile: the capsule shrinks to show just logo + hamburger.
 */

const Navbar = ({ onOpenAuth, onOpenMarketplace }) => {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { name: 'Marketplace', action: onOpenMarketplace, icon: <ShoppingBag size={13} /> },
    { name: 'Ecosystem',   href: '#ecosystem' },
    { name: 'Technology',  href: '#tech' },
    { name: 'How It Works',href: '#how-it-works' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-center pt-6 pb-4 px-4 pointer-events-none">
        <motion.nav
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.1 }}
          className="pointer-events-auto w-full"
          style={{ maxWidth: '860px' }}
        >
          {/* The capsule pill */}
          <div
            className="flex items-center justify-between px-2 py-2 transition-all duration-300"
            style={{
              background: scrolled
                ? 'rgba(255, 255, 255, 0.97)'
                : 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '999px',
              border: '1px solid rgba(34, 197, 94, 0.22)',
              boxShadow: scrolled
                ? '0 8px 40px rgba(6, 78, 59, 0.15), 0 2px 8px rgba(0,0,0,0.05)'
                : '0 4px 24px rgba(6, 78, 59, 0.10), 0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            {/* ── LEFT: Logo pill ───────────────────────────────────── */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full transition-all duration-200 hover:bg-[#022c22]/5 focus:outline-none shrink-0"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-emerald-100/50 bg-white overflow-hidden"
              >
                <img src={logo} alt="EosCarbon Logo" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="text-base font-bold tracking-tight text-[#022c22] hidden sm:block">
                EosCarbon<span className="text-[#22c55e]">.</span>
              </span>
            </button>

            {/* ── CENTER: Nav links (desktop only) ─────────────────── */}
            <div className="hidden md:flex items-center gap-0.5">
              {links.map((link, i) => (
                link.action ? (
                  <motion.button
                    key={link.name}
                    onClick={link.action}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-[#15803d] hover:bg-[#22c55e]/10 transition-all duration-200"
                  >
                    {link.icon}
                    {link.name}
                  </motion.button>
                ) : (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.07 }}
                    className="px-4 py-2 rounded-full text-sm font-medium text-[#022c22]/70 hover:text-[#022c22] hover:bg-[#022c22]/5 transition-all duration-200"
                  >
                    {link.name}
                  </motion.a>
                )
              ))}
            </div>

            {/* ── RIGHT: CTA pill + hamburger ──────────────────────── */}
            <div className="flex items-center gap-2 pr-1 shrink-0">
              {/* Sign In CTA — styled as inner pill */}
              <motion.button
                onClick={onOpenAuth}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-200 focus:outline-none shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
                  boxShadow: '0 2px 12px rgba(34, 197, 94, 0.35)',
                }}
              >
                Sign In
              </motion.button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#022c22] hover:bg-[#022c22]/8 transition-colors focus:outline-none"
                style={{ background: 'rgba(2,44,34,0.07)' }}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* ── Mobile menu — drops below the capsule ─────────────── */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                key="mobile-drop"
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="mt-2 overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.97)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(34, 197, 94, 0.18)',
                  boxShadow: '0 8px 32px rgba(6, 78, 59, 0.12)',
                }}
              >
                <div className="p-4 space-y-1">
                  {links.map((link) => (
                    link.action ? (
                      <button
                        key={link.name}
                        onClick={() => { link.action(); setMobileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#15803d] hover:bg-[#22c55e]/10 transition-colors text-left"
                      >
                        {link.icon} {link.name}
                      </button>
                    ) : (
                      <a
                        key={link.name}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center px-4 py-3 rounded-2xl text-sm font-medium text-[#022c22]/75 hover:text-[#022c22] hover:bg-[#022c22]/5 transition-colors"
                      >
                        {link.name}
                      </a>
                    )
                  ))}
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => { onOpenAuth(); setMobileOpen(false); }}
                      className="w-full py-3 rounded-2xl text-sm font-bold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)' }}
                    >
                      Sign In / Get Started
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </div>
  );
};

export default Navbar;
