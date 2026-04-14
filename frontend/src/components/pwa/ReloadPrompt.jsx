import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ReloadPrompt() {
  const sw = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  // Most resilient way to extract state from the PWA hook
  const [offlineReady, setOfflineReady] = (sw && sw.offlineReady) ? sw.offlineReady : [false, () => {}];
  const [needUpdate, setNeedUpdate] = (sw && sw.needUpdate) ? sw.needUpdate : [false, () => {}];
  const updateServiceWorker = sw ? sw.updateServiceWorker : () => {};

  const close = () => {
    setOfflineReady(false);
    setNeedUpdate(false);
  };

  return (
    <AnimatePresence>
      {(offlineReady || needUpdate) && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 z-[9999] p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-2xl flex flex-col gap-3 md:left-auto md:w-80 md:bottom-8"
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                {needUpdate ? <RefreshCw className="animate-spin-slow" size={20} /> : <Download size={20} />}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-gray-900">
                  {needUpdate ? 'Update Available' : 'App Ready Offline'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {needUpdate 
                    ? 'A new version of EosCarbon is ready with improvements.' 
                    : 'The app is now cached and works even without internet.'}
                </p>
              </div>
            </div>
            <button onClick={close} className="text-gray-400 hover:text-gray-600 p-1">
              <X size={16} />
            </button>
          </div>

          {needUpdate && (
            <button
              onClick={() => updateServiceWorker(true)}
              className="w-full py-2.5 bg-econe-dark text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-black active:scale-[0.98]"
            >
              Update Now
            </button>
          )}

          {!needUpdate && (
            <button
              onClick={close}
              className="w-full py-2.5 border border-emerald-100 text-emerald-700 bg-emerald-50 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
            >
              Got it
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ReloadPrompt;
