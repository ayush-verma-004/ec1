import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown, Menu, X } from 'lucide-react';

/* ─── Role config ─────────────────────────────────────────────────────── */
const ROLE_BADGE = {
  FARMER:      { label: 'FARMER', cls: 'bg-amber-50   text-amber-700  border border-amber-200' },
  NGO:         { label: 'NGO',    cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
  BUSINESSMAN: { label: 'BIZ',   cls: 'bg-blue-50    text-blue-700   border border-blue-200' },
  GOVERNMENT:  { label: 'GOV',   cls: 'bg-purple-50  text-purple-700 border border-purple-200' },
};

/* ─── Outside-click hook ───────────────────────────────────────────────── */
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) callback();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, callback]);
};

/* ══════════════════════════════════════════════════════════════════════════
   UniversalNavbar — floating Capsule Design
   ══════════════════════════════════════════════════════════════════════════ */
const UniversalNavbar = ({
  links = [],
  activeTab,
  setActiveTab,
  onSignOut,
  role = 'FARMER',
  brandLabel = 'Portal',
  brandIcon,
  userName = 'User',
  userInitials = 'U',
  userSubtitle = 'Member',
}) => {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const profileRef = useRef(null);

  useOutsideClick(profileRef, () => setProfileOpen(false));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleTab = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const badge = ROLE_BADGE[role] || ROLE_BADGE.FARMER;

  return (
    <div className="sticky top-0 z-[100] w-full">
      <div className="px-4 pt-6 pb-4 pointer-events-none">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="pointer-events-auto max-w-7xl mx-auto"
        >
          {/* The Capsule Pill */}
          <div
            className="flex items-center justify-between px-2 py-2 transition-all duration-300"
            style={{
              background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.90)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '999px',
              border: scrolled ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(34, 197, 94, 0.2)',
              boxShadow: scrolled 
                ? '0 8px 32px rgba(6, 78, 59, 0.12), 0 2px 8px rgba(0,0,0,0.05)' 
                : '0 4px 16px rgba(6, 78, 59, 0.06)',
            }}
          >
            {/* ── LEFT: Logo Pill ───────────────────────────────────── */}
            <button
              onClick={() => handleTab(links[0]?.id || 'dashboard')}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-emerald-50 transition-all focus:outline-none shrink-0"
            >
              {brandIcon && (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#15803d] to-[#22c55e] text-white flex items-center justify-center shadow-sm">
                  <span className="w-5 h-5 flex items-center justify-center">{brandIcon}</span>
                </div>
              )}
              <span className="text-base font-bold font-heading text-[#022c22] tracking-tight hidden sm:block">
                Econe<span className="text-[#15803d]"> {brandLabel}</span>
              </span>
            </button>

            {/* ── CENTER: Nav Links (Desktop) ───────────────────────── */}
            <div className="hidden md:flex items-center gap-1 bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleTab(link.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeTab === link.id
                      ? 'bg-white text-[#022c22] shadow-sm'
                      : 'text-gray-500 hover:text-[#022c22] hover:bg-white/50'
                  }`}
                >
                  {link.icon && (
                    <span className={activeTab === link.id ? 'text-[#15803d]' : 'opacity-60'}>
                      {link.icon}
                    </span>
                  )}
                  {link.label}
                  {activeTab === link.id && (
                    <motion.span
                      layoutId="nav-pill-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#22c55e] rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* ── RIGHT: Profile + Hamburger ─────────────────────────── */}
            <div className="flex items-center gap-2 pr-1">
              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-white border border-gray-200 hover:border-emerald-200 shadow-sm transition-all focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#15803d] to-[#22c55e] text-white flex items-center justify-center font-bold text-xs font-mono">
                    {userInitials}
                  </div>
                  <div className="hidden lg:block text-left leading-tight pr-1">
                    <p className="text-xs font-bold text-[#022c22]">{userName}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full inline-block ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 hidden sm:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 z-[110] bg-white rounded-3xl overflow-hidden overflow-y-auto"
                      style={{
                        border: '1px solid #d1fae5',
                        boxShadow: '0 16px 48px rgba(6,78,59,0.15)',
                      }}
                    >
                      <div className="px-5 py-4 border-b border-gray-100 bg-emerald-50/30">
                        <p className="text-sm font-bold text-[#022c22]">{userName}</p>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">{userSubtitle}</p>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => { setActiveTab('profile'); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-gray-700 hover:text-[#15803d] hover:bg-emerald-50 transition-all font-medium"
                        >
                          <User size={16} className="text-[#15803d]" /> View Profile
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-gray-700 hover:text-[#15803d] hover:bg-emerald-50 transition-all font-medium">
                          <Settings size={16} className="text-[#15803d]" /> Settings
                        </button>
                        <div className="my-1 border-t border-gray-100" />
                        <button
                          onClick={() => { onSignOut?.(); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hamburger Button (Mobile) */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:text-[#15803d] hover:border-emerald-200 transition-all"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </motion.nav>

        {/* ── Mobile Menu Dropdown (Inside sticky wrapper) ───────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              className="md:hidden max-w-7xl mx-auto mt-2 pointer-events-auto"
            >
              <div
                className="bg-white rounded-3xl border border-emerald-100 shadow-2xl overflow-hidden p-2 space-y-1"
                style={{ backdropFilter: 'blur(16px)' }}
              >
                {links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleTab(link.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold transition-all text-left ${
                      activeTab === link.id
                        ? 'bg-emerald-50 text-[#15803d]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#022c22]'
                    }`}
                  >
                    {link.icon && (
                      <span className={activeTab === link.id ? 'text-[#15803d]' : 'text-gray-400'}>
                        {link.icon}
                      </span>
                    )}
                    {link.label}
                  </button>
                ))}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => { onSignOut?.(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UniversalNavbar;
