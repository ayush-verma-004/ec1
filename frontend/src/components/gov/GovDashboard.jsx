import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, FileCheck, Activity, Check, X, Building } from 'lucide-react';
import GovRegisterNGOModal from './GovRegisterNGOModal';

const GovDashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  // Mock Data
  const stats = [
    { label: 'Total Credits Available', value: '45,231', icon: <Leaf className="text-emerald-500" /> },
    { label: 'Pending Verifications', value: '12', icon: <FileCheck className="text-amber-500" /> },
    { label: 'Active Transactions', value: '128', icon: <Activity className="text-blue-500" /> },
  ];

  const pendingCredits = [
    { id: 'CR-901', farm: 'Green Valley Init', amount: 500, date: '2026-04-12' },
    { id: 'CR-902', farm: 'EcoGrow Partners', amount: 1200, date: '2026-04-13' },
    { id: 'CR-903', farm: 'Sunny Horizon', amount: 350, date: '2026-04-14' },
  ];

  const transactions = [
    { id: 'TX-1002', buyer: 'TechCorp Inc.', seller: 'Green Valley Init', amount: 200, status: 'Pending' },
    { id: 'TX-1003', buyer: 'Global Logistics', seller: 'Sunny Horizon', amount: 350, status: 'Pending' },
  ];

  const [isRegisterNgoOpen, setIsRegisterNgoOpen] = useState(false);

  return (
    <>
    <motion.div 
      className="p-6 sm:p-10 max-w-7xl mx-auto space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">Regulatory Dashboard</h1>
          <p className="text-gray-500 mt-1">Marketplace oversight and verification control.</p>
        </div>
        <button 
          onClick={() => setIsRegisterNgoOpen(true)}
          className="flex items-center gap-2 bg-econe-emerald hover:bg-econe-forest text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-econe-emerald/20 transition-all"
        >
          <Building className="w-5 h-5" />
          Register Verification Partner
        </button>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="glass bg-white/80 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                {stat.icon}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-econe-dark">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pending Carbon Credits */}
        <motion.div variants={itemVariants} className="glass bg-white/80 rounded-3xl p-6 md:p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <FileCheck className="text-econe-emerald w-6 h-6" />
            <h2 className="text-xl font-bold text-econe-dark">Pending Verifications</h2>
          </div>
          
          <div className="space-y-4 flex-1">
            {pendingCredits.map((credit, i) => (
              <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-econe-dark text-sm">{credit.farm}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">{credit.id}</span>
                    <span>• {credit.date}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  <div className="text-right">
                    <span className="block text-sm font-bold text-econe-forest">{credit.amount} CC</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors">
                      <Check size={18} />
                    </button>
                    <button className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pendingCredits.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">No pending verifications.</div>
            )}
          </div>
        </motion.div>

        {/* Transaction Monitor */}
        <motion.div variants={itemVariants} className="glass bg-white/80 rounded-3xl p-6 md:p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-blue-500 w-6 h-6" />
            <h2 className="text-xl font-bold text-econe-dark">Transaction Monitor</h2>
          </div>
          
          <div className="space-y-4 flex-1 overflow-auto">
            {transactions.map((tx, i) => (
              <div key={i} className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium">{tx.id}</span>
                  <span className="text-sm font-bold text-econe-dark">{tx.amount} CC</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                  <span className="truncate max-w-[100px]" title={tx.seller}>{tx.seller}</span>
                  <span className="text-gray-300">→</span>
                  <span className="truncate max-w-[100px] font-medium text-econe-dark" title={tx.buyer}>{tx.buyer}</span>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-econe-emerald text-white rounded-xl text-xs font-semibold shadow-sm hover:shadow-md transition-all">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-xl text-xs font-semibold transition-all">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
    
    <GovRegisterNGOModal isOpen={isRegisterNgoOpen} onClose={() => setIsRegisterNgoOpen(false)} />
    </>
  );
};

export default GovDashboard;
