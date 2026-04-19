import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Building, Mail, Trash2, ExternalLink, ShieldCheck, Activity } from 'lucide-react';
import api from '../../utils/api';
import GovRegisterNGOModal from './GovRegisterNGOModal';
import toast from 'react-hot-toast';

const GovNgoList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [ngos, setNgos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNgos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/government/ngos');
      setNgos(response.data);
    } catch (error) {
      toast.error('Failed to fetch NGO directory');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to PERMANENTLY delete this NGO account? This action cannot be undone.')) {
      try {
        await api.delete(`/government/ngo/${userId}`);
        toast.success('NGO account deleted successfully');
        setNgos(prev => prev.filter(n => n.userId !== userId));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete NGO');
      }
    }
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  const filteredNgos = ngos.filter(ngo => 
    ngo.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">NGO Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and audit verification partners ({filteredNgos.length})</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
          >
            <Building className="w-4 h-4" />
            <span className="hidden sm:inline">Add Partner</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total active', value: ngos.length, icon: <Building size={14} />, color: 'text-slate-600 bg-slate-100' },
          { label: 'Verified', value: ngos.filter(n => n.status === 'VERIFIED').length, icon: <ShieldCheck size={14} />, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Pending', value: ngos.filter(n => n.status === 'PENDING').length, icon: <Activity size={14} />, color: 'text-amber-600 bg-amber-50' },
          { label: 'Growth', value: '+12%', icon: <ExternalLink size={14} />, color: 'text-blue-600 bg-blue-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-3 rounded-xl flex items-center gap-3">
             <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
             <div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
               <p className="text-sm font-bold text-slate-900 mt-1">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {filteredNgos.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4">
            <Search className="text-slate-300 w-8 h-8" />
          </div>
          <p className="text-slate-500 font-medium">No verification partners found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNgos.map((ngo) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              key={ngo.userId}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-emerald-200 transition-colors flex flex-col group"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-slate-50 text-slate-600 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                    ngo.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {ngo.status}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-1">{ngo.organizationName}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                  <Mail size={12} className="shrink-0" />
                  <span className="truncate">{ngo.email}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Experience</span>
                    <span className="text-xs font-bold text-slate-700 mt-0.5">{ngo.yearsOfOperation} Years</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Since</span>
                    <span className="text-xs font-bold text-slate-700 mt-0.5">
                      {new Date(ngo.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <button className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
                  Audit History
                </button>
                <button 
                  onClick={() => handleDelete(ngo.userId)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  title="Terminate Partner"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <GovRegisterNGOModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          fetchNgos();
        }} 
      />
    </div>
  );
};

export default GovNgoList;
