import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NgoNavbar from './NgoNavbar';
import NgoDashboard from './NgoDashboard';
import NgoLandVerifications from './NgoLandVerifications';
import NgoCarbonVerifications from './NgoCarbonVerifications';
import NgoProfile from './NgoProfile';
import SharedMarketplace from '../shared/SharedMarketplace';

const NgoPortal = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f0fdf4]">
      <NgoNavbar 
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
              <NgoDashboard />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NgoProfile />
            </motion.div>
          )}

          {activeTab === 'land_verifications' && (
            <motion.div 
              key="land_verifications"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <NgoLandVerifications />
            </motion.div>
          )}

          {activeTab === 'carbon_verifications' && (
            <motion.div key="carbon_verifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <NgoCarbonVerifications />
            </motion.div>
          )}

          {activeTab === 'marketplace' && (
            <motion.div key="marketplace" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <SharedMarketplace userRole="NGO" />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default NgoPortal;
