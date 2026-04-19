import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, MapPin, Phone, Mail, Building, ShieldCheck } from 'lucide-react';
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
    if (window.confirm('Are you sure you want to PERMANENTLY delete this NGO account and profile? This action cannot be undone.')) {
      try {
        await api.delete(`/government/ngo/${userId}`);
        toast.success('NGO account deleted successfully');
        fetchNgos();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete NGO');
      }
    }
  };

  useEffect(() => {
    fetchNgos();
  }, []);

  const filteredNgos = ngos.filter(ngo => 
    ngo.profile?.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ngo.profile?.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">NGO Verification Partners</h1>
          <p className="text-gray-500 mt-1">Manage and onboard independent auditing organizations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-econe-emerald hover:bg-econe-forest text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-econe-emerald/20 transition-all"
        >
          <Plus size={20} /> Onboard New NGO
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-econe-emerald/10 rounded-2xl text-econe-emerald"><Building size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Partners</p>
            <p className="text-2xl font-bold text-econe-dark">{ngos.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-econe-emerald"><ShieldCheck size={24} /></div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active Verifiers</p>
            <p className="text-2xl font-bold text-econe-dark">{ngos.filter(n => n.status === 'VERIFIED' || n.status === 'ACTIVE').length || ngos.length}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="Search by name, email or registration number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-econe-emerald/50 focus:border-econe-emerald transition-all"
        />
      </div>

      {/* NGO Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />)
        ) : filteredNgos.map((ngo, idx) => (
          <motion.div 
            key={ngo.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-econe-emerald group-hover:bg-econe-emerald group-hover:text-white transition-all">
                    <Building size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-econe-dark">{ngo.profile?.organizationName || 'Unnamed NGO'}</h3>
                    <p className="text-xs font-mono text-gray-400 mt-0.5">ID: {ngo.userId}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border uppercase ${
                  ngo.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-100'
                }`}>
                  {ngo.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Mail size={14} /></div>
                  <span className="truncate">{ngo.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Phone size={14} /></div>
                  <span>{ngo.profile?.phoneNumber || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 lg:col-span-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><MapPin size={14} /></div>
                  <span className="truncate">{ngo.profile?.address?.city}, {ngo.profile?.address?.state} (IN)</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button className="flex-1 py-3 bg-gray-50 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-100 transition-colors">View Details</button>
              <button 
                onClick={() => handleDelete(ngo.userId)}
                className="flex-1 py-3 bg-white border border-rose-100 text-rose-600 font-bold rounded-xl text-sm hover:bg-rose-50 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {!loading && filteredNgos.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
          <Building className="mx-auto text-gray-200 mb-4" size={48} />
          <p className="text-gray-500 font-medium font-bold">No verification partners found.</p>
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
