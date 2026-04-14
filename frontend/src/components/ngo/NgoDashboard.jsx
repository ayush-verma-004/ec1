import { motion } from 'framer-motion';
import { Leaf, MapPin, Activity, CheckCircle, Clock, Building } from 'lucide-react';

const NgoDashboard = () => {
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

  const stats = [
    { label: 'Total Verified Items', value: '1,248', icon: <CheckCircle className="text-[#12b76a]" /> },
    { label: 'Pending Land Reviews', value: '14', icon: <MapPin className="text-amber-500" /> },
    { label: 'Pending Carbon Reviews', value: '23', icon: <Leaf className="text-blue-500" /> },
  ];

  const recentActions = [
    { type: 'Carbon', target: 'CR-822 (EcoGrow)', status: 'Verified', time: '2 hours ago' },
    { type: 'Land', target: 'LND-901 (Sunny Farms)', status: 'Verified', time: '4 hours ago' },
    { type: 'Carbon', target: 'CR-821 (Oceanic Blue)', status: 'Rejected', time: '1 day ago' },
  ];

  return (
    <motion.div 
      className="p-6 sm:p-10 max-w-7xl mx-auto space-y-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">NGO Verification Hub</h1>
          <p className="text-gray-500 mt-1">Level 1 physical and record verification center.</p>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div key={i} variants={itemVariants} className="bg-white/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-gray-100">
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

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Welcome / Info Panel */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-xl text-white">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold font-mono tracking-wider">
              <Activity size={14} /> SYSTEM STATUS: ALL CLEAR
            </div>
            <h2 className="text-3xl font-bold font-sora">Ready for Reviews</h2>
            <p className="text-gray-300 max-w-md leading-relaxed text-sm">
              Your organization plays a critical role in preserving marketplace integrity. Please ensure all physical audits and satellite verifications are thoroughly checked.
            </p>
          </div>
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 p-8 opacity-20 pointer-events-none">
             <Building size={120} strokeWidth={1} />
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="bg-white/80 rounded-3xl p-6 md:p-8 flex flex-col shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="text-gray-400 w-5 h-5" />
            <h2 className="text-lg font-bold text-econe-dark">Recent Activity</h2>
          </div>
          
          <div className="space-y-4 flex-1">
            {recentActions.map((action, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className={`mt-1 p-2 rounded-full ${action.status === 'Verified' ? 'bg-[#12b76a]/10 text-[#12b76a]' : 'bg-red-50 text-red-500'}`}>
                  {action.type === 'Land' ? <MapPin size={16} /> : <Leaf size={16} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{action.target}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-bold ${action.status === 'Verified' ? 'text-[#12b76a]' : 'text-red-500'}`}>{action.status}</span>
                    <span className="text-xs text-gray-400">• {action.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default NgoDashboard;
