import React from 'react';
import { WifiOff, RefreshCw, Home } from 'lucide-react';
import logo from '../../img/logo.jpeg';

const OfflineFallback = () => {
  return (
    <div className="fixed inset-0 z-[999] bg-[#f0fdf4] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 mb-8 relative">
        <div className="absolute inset-0 bg-emerald-100 rounded-3xl animate-pulse blur-xl opacity-50" />
        <div className="relative w-full h-full bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden flex items-center justify-center">
          <img src={logo} alt="EosCarbon" className="w-full h-full object-cover" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-red-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
          <WifiOff size={16} />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2 font-heading">You're Offline</h1>
      <p className="text-gray-500 mb-8 max-w-xs text-sm leading-relaxed text-balance">
        It seems you've lost your connection. EosCarbon needs an internet connection to sync with the blockchain.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-[240px]">
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-3.5 bg-econe-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/10 active:scale-[0.98] transition-all"
        >
          <RefreshCw size={18} /> Retry Connection
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="w-full py-3.5 bg-white border border-emerald-100 text-emerald-700 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Home size={18} /> Go to Home
        </button>
      </div>

      <p className="mt-12 text-[10px] font-bold text-emerald-600/40 uppercase tracking-[0.2em]">
        EosCarbon Protocol · Offline Mode
      </p>
    </div>
  );
};

export default OfflineFallback;
