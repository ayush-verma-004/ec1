import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FarmerNavbar from './FarmerNavbar';
import FarmerDashboard from './FarmerDashboard';
import FarmerLands from './FarmerLands';
import FarmerCredits from './FarmerCredits';
import FarmerTransactions from './FarmerTransactions';
import FarmerProfile from './FarmerProfile';
import SharedMarketplace from '../shared/SharedMarketplace';

const pageV = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const FarmerPortal = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [registerLandOpen, setRegisterLandOpen] = useState(false);
  const [generateCreditOpen, setGenerateCreditOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f0fdf4]">

      <FarmerNavbar activeTab={activeTab} setActiveTab={setActiveTab} onSignOut={onSignOut} />
      <main className="flex-1 overflow-x-hidden relative pt-20">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" variants={pageV} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <FarmerDashboard
                setActiveTab={setActiveTab}
                onRegisterLand={() => { setActiveTab('lands'); setRegisterLandOpen(true); }}
                onGenerateCredit={() => { setActiveTab('credits'); setGenerateCreditOpen(true); }}
              />
            </motion.div>
          )}
          {activeTab === 'lands' && (
            <motion.div key="lands" variants={pageV} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <FarmerLands externalOpen={registerLandOpen} onExternalClose={() => setRegisterLandOpen(false)} />
            </motion.div>
          )}
          {activeTab === 'credits' && (
            <motion.div key="credits" variants={pageV} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <FarmerCredits externalOpen={generateCreditOpen} onExternalClose={() => setGenerateCreditOpen(false)} />
            </motion.div>
          )}
          {activeTab === 'transactions' && (
            <motion.div key="transactions" variants={pageV} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <FarmerTransactions />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" variants={pageV} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <FarmerProfile />
            </motion.div>
          )}
          {activeTab === 'marketplace' && (
            <motion.div key="marketplace" variants={pageV} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <SharedMarketplace userRole="FARMER" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default FarmerPortal;
