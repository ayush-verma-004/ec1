import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  LayoutDashboard, 
  User,
  PlusCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isFarmer = location.pathname.includes('/farmer');
  const isGov = location.pathname.includes('/gov');
  const isNgo = location.pathname.includes('/ngo');
  const isBiz = location.pathname.includes('/biz');
  const isPortal = isFarmer || isGov || isNgo || isBiz;

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'market', label: 'Market', icon: ShoppingBag, path: '/marketplace' },
    { id: 'portal', label: 'Portal', icon: LayoutDashboard, path: isFarmer ? '/farmer' : isGov ? '/gov' : isNgo ? '/ngo' : '/biz', hidden: !isPortal },
  ];

  if (location.pathname === '/') {
     // Special tabs for landing page
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2 h-auto pointer-events-none">
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-emerald-100 shadow-[0_-8px_40px_rgba(6,78,59,0.12)] rounded-[2.5rem] flex items-center justify-around p-2 gap-1"
      >
        {tabs.filter(t => !t.hidden).map(tab => {
          const isActive = location.pathname === tab.path || (tab.id === 'portal' && isPortal);
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center p-3 rounded-2xl flex-1 transition-all group"
            >
              <div className={`relative z-10 p-2 rounded-xl transition-all ${isActive ? 'bg-econe-dark text-white shadow-lg shadow-emerald-900/20' : 'text-gray-400 group-hover:bg-gray-50'}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${isActive ? 'text-econe-dark' : 'text-gray-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-2 w-1 h-1 bg-econe-emerald rounded-full"
                />
              )}
            </button>
          );
        })}

        {/* Action Button for Mobile Portal Users */}
        {isFarmer && (
            <button
              onClick={() => {/* Trigger rapid land registration or similar */}}
              className="flex flex-col items-center justify-center p-2 flex-1"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#15803d] to-[#22c55e] text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 -mt-8 border-4 border-white transition-transform active:scale-90">
                 <PlusCircle size={24} />
              </div>
              <span className="text-[10px] font-bold mt-1 text-econe-emerald">New Action</span>
            </button>
        )}
      </motion.div>
    </div>
  );
};

export default BottomNav;
