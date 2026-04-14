import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BizNavbar from './BizNavbar';
import BizDashboard from './BizDashboard';
import SharedMarketplace from '../shared/SharedMarketplace';
import BizMyCredits from './BizMyCredits';
import BizTransactions from './BizTransactions';
import BizProfile from './BizProfile';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const BizPortal = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f0fdf4]">

      <BizNavbar activeTab={activeTab} setActiveTab={setActiveTab} onSignOut={onSignOut} />
      <main className="flex-1 overflow-x-hidden relative pt-20">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <BizDashboard setActiveTab={setActiveTab} />
            </motion.div>
          )}
          {activeTab === 'marketplace' && (
            <motion.div key="marketplace" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <SharedMarketplace userRole="BUSINESSMAN" />
            </motion.div>
          )}
          {activeTab === 'my_credits' && (
            <motion.div key="my_credits" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <BizMyCredits />
            </motion.div>
          )}
          {activeTab === 'transactions' && (
            <motion.div key="transactions" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <BizTransactions />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
              <BizProfile />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default BizPortal;
