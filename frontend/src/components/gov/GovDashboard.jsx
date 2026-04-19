import { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, FileCheck, Activity, Check, X, Building } from 'lucide-react';
import GovRegisterNGOModal from './GovRegisterNGOModal';

const GovDashboard = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const stats = [
    { label: 'Total Credits Available', value: '45,231', icon: <Leaf size={14} className="text-emerald-600" />, trend: '+5.2%' },
    { label: 'Pending Verifications', value: '12', icon: <FileCheck size={14} className="text-amber-600" />, trend: 'Urgent' },
    { label: 'Active Transactions', value: '128', icon: <Activity size={14} className="text-blue-600" />, trend: 'Live' },
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
        className="px-6 py-8 sm:px-10 max-w-7xl mx-auto space-y-8 mt-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Regulatory Overview</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time marketplace monitoring and verification control.</p>
          </div>
          <button 
            onClick={() => setIsRegisterNgoOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <Building className="w-4 h-4" />
            Onboard NGO Partner
          </button>
        </div>

        {/* Precise KPI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants} 
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-emerald-200 transition-colors"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-slate-500">
                  {stat.icon}
                  <span className="text-xs font-bold uppercase tracking-wider uppercase">{stat.label}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-50 text-slate-600 rounded-full border border-slate-100">
                  {stat.trend}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-slate-900 tabular-nums">{stat.value}</p>
                <span className="text-xs font-bold text-slate-400">UNITs</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Pending Verifications Table */}
          <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="text-emerald-600 w-4 h-4" />
                <h2 className="text-sm font-bold text-slate-900">Pending Approvals</h2>
              </div>
              <button className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
            </div>
            
            <div className="p-2 space-y-1 flex-1">
              {pendingCredits.map((credit, i) => (
                <div key={i} className="px-4 py-3 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between border-b border-slate-50 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{credit.farm}</span>
                    <span className="text-[10px] font-mono text-slate-400 mt-0.5">{credit.id} • {credit.date}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-bold text-emerald-700">{credit.amount} CC</span>
                    <div className="flex gap-1.5">
                      <button className="p-1.5 hover:bg-emerald-100 text-emerald-600 rounded-md transition-colors" title="Approve">
                        <Check size={14} />
                      </button>
                      <button className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-md transition-colors" title="Reject">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {pendingCredits.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">No pending verifications found.</div>
              )}
            </div>
          </motion.div>

          {/* Transaction Monitor */}
          <motion.div variants={itemVariants} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="text-blue-600 w-4 h-4" />
                <h2 className="text-sm font-bold text-slate-900">Transaction Stream</h2>
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10">Active</span>
            </div>
            
            <div className="p-2 space-y-1 flex-1">
              {transactions.map((tx, i) => (
                <div key={i} className="px-4 py-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0 relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{tx.id}</span>
                    <span className="text-sm font-bold text-slate-900">{tx.amount} CC</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 truncate mb-3">
                    <span className="font-medium text-slate-900">{tx.seller}</span>
                    <span className="text-slate-300">→</span>
                    <span className="font-medium text-slate-900">{tx.buyer}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-1.5 bg-slate-900 text-white rounded-md text-[10px] font-bold hover:bg-emerald-600 transition-colors shadow-sm">
                      Inspect & Approve
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
