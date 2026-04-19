import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../../img/logo.jpeg';
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
  const profileRef = useRef(null);

  useOutsideClick(profileRef, () => setProfileOpen(false));

  const handleTab = (id) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const badge = ROLE_BADGE[role] || ROLE_BADGE.FARMER;

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo & Brand */}
          <button
            onClick={() => handleTab(links[0]?.id || 'dashboard')}
            className="flex items-center gap-3 transition-opacity hover:opacity-80 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center p-1.5 shadow-emerald-200 shadow-lg">
              <img src={logo} alt="L" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Eos<span className="text-emerald-600">Carbon</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-0.5">
                {brandLabel}
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleTab(link.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === link.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.icon && (
                  <span className={activeTab === link.id ? 'text-emerald-600' : 'text-slate-400'}>
                    {link.icon}
                  </span>
                )}
                {link.label}
              </button>
            ))}
          </nav>

          {/* User Profile & Menu */}
          <div className="flex items-center gap-4">
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
                  {userInitials}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <p className="text-xs font-bold text-slate-900 leading-none">{userName}</p>
                  <span className={`text-[10px] font-bold mt-1 inline-block ${badge.label === 'GOV' ? 'text-purple-600' : 'text-emerald-600'}`}>
                    {role} Official
                  </span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50">
                      <p className="text-sm font-bold text-slate-900">{userName}</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{userSubtitle}</p>
                    </div>
                    <div className="p-1.5">
                      <button
                        onClick={() => { setActiveTab('profile'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all font-bold"
                      >
                        <User size={16} /> View Profile
                      </button>
                      <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all font-bold">
                        <Settings size={16} /> Preferences
                      </button>
                      <div className="my-1.5 h-px bg-slate-50" />
                      <button
                        onClick={() => { onSignOut?.(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 active:scale-95 transition-all"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-50 overflow-hidden"
          >
            <nav className="p-4 space-y-1">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleTab(link.id)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold transition-all ${
                    activeTab === link.id
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={activeTab === link.id ? 'text-emerald-600' : 'text-slate-400'}>
                    {link.icon}
                  </span>
                  {link.label}
                </button>
              ))}
              <div className="pt-4 mt-4 border-t border-slate-50">
                <button
                  onClick={() => { onSignOut?.(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default UniversalNavbar;
