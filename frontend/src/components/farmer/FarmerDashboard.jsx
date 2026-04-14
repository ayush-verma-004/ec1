import { motion } from 'framer-motion';
import { Sprout, Map, Leaf, Wallet, TrendingUp, CheckCircle, Clock, AlertCircle, PlusCircle, Zap } from 'lucide-react';

const recentActivity = [
  { icon: <CheckCircle size={14} />, color: 'text-emerald-600 bg-emerald-50', text: 'Land LND-12 verified by GreenSpan NGO', time: '2 hrs ago' },
  { icon: <Clock size={14} />, color: 'text-amber-600 bg-amber-50', text: 'Carbon Credit CR-44 pending gov review', time: '1 day ago' },
  { icon: <AlertCircle size={14} />, color: 'text-rose-600 bg-rose-50', text: 'Sale TX-5510 rejected — incomplete docs', time: '2 days ago' },
  { icon: <CheckCircle size={14} />, color: 'text-emerald-600 bg-emerald-50', text: 'Earned ₹1,20,000 from TX-5509', time: '3 days ago' },
];

const kpis = [
  { label: 'Registered Lands', value: '8', icon: <Map className="text-[#15803d]" />, change: '2 Verified' },
  { label: 'Credits Generated', value: '3,240', icon: <Leaf className="text-blue-500" />, change: '+120 CC this month' },
  { label: 'Active Listings', value: '5', icon: <TrendingUp className="text-purple-500" />, change: 'On marketplace' },
  { label: 'Total Earnings', value: '₹4.8L', icon: <Wallet className="text-amber-500" />, change: 'Approved sales' },
];

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } } };

const FarmerDashboard = ({ setActiveTab, onRegisterLand, onGenerateCredit }) => (
  <motion.div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-10" variants={containerVariants} initial="hidden" animate="show">

    {/* Header */}
    <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-econe-dark">Eco-Portfolio</h1>
        <p className="text-gray-500 mt-1">Your land registry, carbon pipeline, and sales dashboard.</p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onRegisterLand}
          className="flex items-center gap-2 bg-econe-dark hover:bg-[#1f2937] text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-colors">
          <PlusCircle size={17} /> Register New Land
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onGenerateCredit}
          className="flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-green-700/25 transition-colors">
          <Zap size={17} /> Generate Carbon Credit
        </motion.button>
      </div>
    </motion.div>

    {/* KPI Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((k, i) => (
        <motion.div key={i} variants={itemVariants} whileHover={{ y: -4 }} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 cursor-default">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">{k.icon}</div>
            <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{k.change}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">{k.label}</p>
            <h3 className="text-3xl font-bold text-econe-dark mt-0.5">{k.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Lower Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* Hero Banner */}
      <motion.div variants={itemVariants} className="lg:col-span-2 bg-gradient-to-br from-[#052e16] to-[#14532d] rounded-3xl p-8 relative overflow-hidden shadow-xl text-white flex flex-col justify-between min-h-[240px]">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 rounded-full bg-[#22c55e]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 opacity-5 p-6 pointer-events-none"><Sprout size={160} strokeWidth={0.6} /></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold font-mono tracking-wider">
            <Leaf size={12} /> CARBON MARKET: OPEN
          </div>
          <h2 className="text-3xl font-bold font-sora">Every Acre Counts</h2>
          <p className="text-green-200/80 max-w-md leading-relaxed text-sm">
            Your sustainable farming practices are generating real environmental value. Keep your land registry up to date and list verified credits to grow your eco-portfolio.
          </p>
        </div>
        <div className="relative z-10 flex gap-3 mt-6 flex-wrap">
          <button onClick={() => setActiveTab('lands')} className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-bold text-sm border border-white/20 transition-all">View My Lands</button>
          <button onClick={() => setActiveTab('credits')} className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-green-500/30 transition-colors">View Credits</button>
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 md:p-8 flex flex-col border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="text-gray-400 w-5 h-5" />
          <h2 className="text-lg font-bold text-econe-dark">Recent Activity</h2>
        </div>
        <div className="space-y-4 flex-1">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className={`mt-0.5 p-1.5 rounded-full shrink-0 ${a.color}`}>{a.icon}</div>
              <div>
                <p className="text-sm text-gray-800 font-medium leading-relaxed">{a.text}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  </motion.div>
);

export default FarmerDashboard;
