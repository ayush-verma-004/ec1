import { motion } from 'framer-motion';
import { Layers, ArrowLeftRight, DollarSign, Clock, ShoppingBag, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

const stats = [
  { label: 'Credits Owned', value: '3,420', icon: <Layers className="text-econe-emerald" />, change: '+12%' },
  { label: 'Active Listings', value: '7', icon: <TrendingUp className="text-blue-500" />, change: '+2 this week' },
  { label: 'Total Spent', value: '₹8.4L', icon: <DollarSign className="text-purple-500" />, change: 'All time' },
  { label: 'Pending Transactions', value: '3', icon: <Clock className="text-amber-500" />, change: 'Awaiting approval' },
];

const recentActivity = [
  { id: 'TX-5500', type: 'Purchase', credits: 200, status: 'Approved', date: '2 hrs ago' },
  { id: 'TX-5501', type: 'Purchase', credits: 500, status: 'Pending', date: '1 day ago' },
  { id: 'TX-5502', type: 'Sale', credits: 100, status: 'Rejected', date: '2 days ago' },
];

const statusConfig = {
  Approved: { color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle size={12} /> },
  Pending: { color: 'bg-amber-100 text-amber-700', icon: <Clock size={12} /> },
  Rejected: { color: 'bg-rose-100 text-rose-700', icon: <AlertCircle size={12} /> },
};

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } } };

const BizDashboard = ({ setActiveTab }) => {
  return (
    <motion.div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-10" variants={containerVariants} initial="hidden" animate="show">
      
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">Carbon Portfolio</h1>
          <p className="text-gray-500 mt-1">Your trading activity and carbon credit overview.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab('marketplace')}
          className="flex items-center gap-2 bg-econe-emerald hover:bg-econe-forest text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-econe-emerald/25 transition-colors"
        >
          <ShoppingBag size={18} /> Browse Marketplace
        </motion.button>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants} whileHover={{ y: -4 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 cursor-default">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">{stat.icon}</div>
              <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{stat.change}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-3xl font-bold text-econe-dark mt-0.5">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Dark hero panel */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-gradient-to-br from-econe-dark to-[#1f2937] rounded-3xl p-8 relative overflow-hidden shadow-xl text-white flex flex-col justify-between min-h-[220px]">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-econe-emerald/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none p-6">
            <TrendingUp size={140} strokeWidth={0.7} />
          </div>
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold font-mono tracking-wider">
              <TrendingUp size={12} /> MARKET STATUS: ACTIVE
            </div>
            <h2 className="text-3xl font-bold font-sora">Carbon Market is Live</h2>
            <p className="text-gray-300 max-w-md leading-relaxed text-sm">
              New verified credits from NGO-certified farms are available. Browse listings across Soil Carbon, Biochar, and Forestry categories.
            </p>
          </div>
          <button onClick={() => setActiveTab('marketplace')} className="relative z-10 mt-6 self-start flex items-center gap-2 bg-econe-emerald hover:bg-[#0fa65e] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-econe-emerald/30">
            <ShoppingBag size={16} /> Explore Now
          </button>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 md:p-8 flex flex-col border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <ArrowLeftRight className="text-gray-400 w-5 h-5" />
            <h2 className="text-lg font-bold text-econe-dark">Recent Activity</h2>
          </div>
          <div className="space-y-4 flex-1">
            {recentActivity.map((tx, i) => {
              const sc = statusConfig[tx.status];
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${sc.color}`}>{sc.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{tx.id} · {tx.type}</p>
                    <p className="text-xs text-gray-400">{tx.credits} CC · {tx.date}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.color}`}>{tx.status}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default BizDashboard;
