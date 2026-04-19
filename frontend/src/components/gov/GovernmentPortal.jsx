import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GovNavbar from './GovNavbar';
import GovDashboard from './GovDashboard';
import GovProfile from './GovProfile';
import GovVerifications from './GovVerifications';
import GovTransactions from './GovTransactions';
import GovNgoList from './GovNgoList';
import SharedMarketplace from '../shared/SharedMarketplace';


const GovernmentPortal = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f0fdf4]">

      <GovNavbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSignOut={onSignOut} 
      />
      
      <main className="flex-1 overflow-x-hidden relative pt-20">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <GovDashboard />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <GovProfile />
            </motion.div>
          )}
          {activeTab === 'ngos' && (
            <motion.div key="ngos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <GovNgoList />
            </motion.div>
          )}
          {activeTab === 'verifications' && (
            <motion.div 
              key="verifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GovVerifications />
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div key="transactions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <GovTransactions />
            </motion.div>
          )}

          {activeTab === 'marketplace' && (
            <motion.div key="marketplace" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <SharedMarketplace userRole="GOVERNMENT" />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default GovernmentPortal;
