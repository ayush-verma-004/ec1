import { useState, Fragment, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Map, PlusCircle, X, CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { getUserId } from '../../utils/auth';

const soilTypes = ['Loamy', 'Clay', 'Sandy', 'Black', 'Red', 'Alluvial'];

const statusConfig = {
  VERIFIED: { label: 'Verified', bg: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: <CheckCircle size={12} /> },
  PENDING_NGO_VERIFICATION: { label: 'Pending NGO', bg: 'bg-amber-50 text-amber-700 ring-amber-200', icon: <Clock size={12} /> },
  REJECTED: { label: 'Rejected', bg: 'bg-rose-50 text-rose-700 ring-rose-200', icon: <AlertCircle size={12} /> },
  PENDING_GOVERNMENT_APPROVAL: { label: 'Pending Gov.', bg: 'bg-blue-50 text-blue-700 ring-blue-200', icon: <Clock size={12} /> },
};

const defaultForm = { landAddress: '', landArea: '', soilType: soilTypes[0], geoCoordinates: '', latitude: '', longitude: '' };

const FloatingInput = ({ label, value, onChange, disabled, type = 'text', ...props }) => (
  <div className="relative w-full">
    <input type={type} value={value} onChange={onChange} disabled={disabled} placeholder=" "
      className="peer block w-full px-4 pb-2.5 pt-6 text-sm text-gray-900 bg-white rounded-xl border border-gray-200 focus:border-[#15803d] focus:ring-[#15803d]/20 appearance-none focus:outline-none focus:ring-4 transition-all" {...props} />
    <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none peer-focus:text-[#15803d]">{label}</label>
  </div>
);

const FarmerLands = ({ externalOpen, onExternalClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLand, setSelectedLand] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lands, setLands] = useState([]);

  const handledRef = useRef(false);

  useEffect(() => {
    if (externalOpen && !handledRef.current) {
      handledRef.current = true;
      setTimeout(() => { setIsOpen(true); onExternalClose(); handledRef.current = false; }, 0);
    }
  }, [externalOpen, onExternalClose]);

  const fetchLands = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const response = await api.get(`/farmer-land/farmer/${userId}`);
      setLands(response.data);
    } catch (error) {
      toast.error('Failed to load lands');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  const f = (field) => ({ value: form[field], onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value })) });

  const handleSubmit = async () => {
    if (!form.landAddress || !form.landArea) { toast.error('Address and Area are required.'); return; }
    setSubmitting(true);
    try {
      const userId = getUserId();
      const payload = { 
        ...form, 
        farmerId: userId,
        landArea: parseFloat(form.landArea),
        latitude: parseFloat(form.latitude) || 0,
        longitude: parseFloat(form.longitude) || 0
      };
      await api.post('/farmer-land/create', payload);
      toast.success('Land registered! Pending NGO verification.');
      setIsOpen(false);
      setForm(defaultForm);
      fetchLands();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register land');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">My Lands</h1>
          <p className="text-gray-500 mt-1">Registry of all your registered farmland parcels.</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-green-700/20 transition-colors">
          <PlusCircle size={17} /> Register New Land
        </button>
      </div>

      {/* Status Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', val: lands.length },
          { label: 'Verified', val: lands.filter(l => l.landStatus === 'VERIFIED').length },
          { label: 'Pending', val: lands.filter(l => l.landStatus === 'PENDING_NGO_VERIFICATION').length },
          { label: 'Rejected', val: lands.filter(l => l.landStatus === 'REJECTED').length },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">{s.label}</p>
            <p className="text-2xl font-bold text-econe-dark">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />)}
        </div>
      ) : lands.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
          <Map className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500 font-medium">No lands registered yet.</p>
          <button onClick={() => setIsOpen(true)} className="mt-4 text-[#15803d] font-bold hover:underline">Register your first parcel</button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {lands.map((land, i) => {
            const sc = statusConfig[land.landStatus] || statusConfig.PENDING_NGO_VERIFICATION;
            return (
              <motion.div key={land.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.04 }}
                whileHover={{ y: -4, boxShadow: '0 16px 40px -8px rgba(0,0,0,0.10)' }}
                onClick={() => setSelectedLand(land)}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 cursor-pointer transition-all">
                <div className="flex justify-between items-start">
                  <div className="p-2.5 bg-[#15803d]/10 rounded-xl"><Map size={20} className="text-[#15803d]" /></div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ${sc.bg}`}>{sc.icon} {sc.label}</span>
                </div>
                <div>
                  <p className="font-mono text-xs text-gray-400">{land.id}</p>
                  <p className="font-bold text-gray-900 mt-1 text-sm line-clamp-2">{land.landAddress}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Area</p>
                    <p className="font-bold text-gray-900">{land.landArea} Acres</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-0.5">Soil</p>
                    <p className="font-bold text-gray-900">{land.soilType}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-400">
                  <span className="font-mono">{land.geoCoordinates}</span>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      )}

      {/* Register Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setIsOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-econe-dark/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
                  <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                    <Dialog.Title as="h3" className="text-xl font-bold text-econe-dark flex items-center gap-3">
                      <Map className="text-[#15803d]" size={22} /> Register New Land
                    </Dialog.Title>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-200 text-gray-400"><X size={18} /></button>
                  </div>
                  <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
                    <FloatingInput label="Land Address *" {...f('landAddress')} />
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput label="Land Area (Acres) *" type="number" {...f('landArea')} />
                      <div className="relative">
                        <select value={form.soilType} onChange={e => setForm(p => ({...p, soilType: e.target.value}))}
                          className="peer block w-full px-4 pb-2.5 pt-6 text-sm text-gray-900 bg-white rounded-xl border border-gray-200 focus:border-[#15803d] focus:ring-[#15803d]/20 focus:outline-none focus:ring-4 transition-all appearance-none">
                          {soilTypes.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <label className="absolute text-sm text-[#15803d] duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 pointer-events-none">Soil Type</label>
                      </div>
                    </div>
                    <FloatingInput label="Geo Coordinates (e.g. 28.7, 79.2)" {...f('geoCoordinates')} />
                    <div className="grid grid-cols-2 gap-4">
                      <FloatingInput label="Latitude" type="number" step="any" {...f('latitude')} />
                      <FloatingInput label="Longitude" type="number" step="any" {...f('longitude')} />
                    </div>
                  </div>
                  <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex gap-3 justify-end">
                    <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSubmit} disabled={submitting}
                      className="px-6 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl font-bold shadow-lg shadow-green-700/20 disabled:opacity-70 disabled:cursor-wait transition-colors min-w-[140px] flex justify-center">
                      {submitting ? 'Submitting…' : 'Register Land'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Land Detail Modal */}
      <Transition appear show={!!selectedLand} as={Fragment}>
        <Dialog as="div" className="relative z-[110]" onClose={() => setSelectedLand(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-econe-dark/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                  {selectedLand && (
                    <>
                      <div className="bg-gradient-to-br from-[#052e16] to-[#14532d] p-8 text-white relative">
                        <button onClick={() => setSelectedLand(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20"><X size={18} /></button>
                        <div className="inline-flex items-center gap-2 mb-3"><Map size={16} className="text-green-300" /><span className="font-mono text-xs text-green-300">{selectedLand.id}</span></div>
                        <h2 className="text-2xl font-bold">{selectedLand.landArea} Acres</h2>
                        <p className="text-green-200/80 text-sm mt-1">{selectedLand.soilType} Soil</p>
                      </div>
                      <div className="p-6 space-y-4">
                        {[
                          { label: 'Address', val: selectedLand.landAddress },
                          { label: 'Coordinates', val: selectedLand.geoCoordinates },
                          { label: 'Latitude', val: selectedLand.latitude },
                          { label: 'Longitude', val: selectedLand.longitude },
                        ].map(item => (
                          <div key={item.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{item.label}</p>
                            <p className="text-sm font-semibold text-gray-900">{item.val}</p>
                          </div>
                        ))}
                        <p className="text-xs text-gray-400 text-center pt-2">Carbon credits linked to this land: <span className="font-bold text-[#15803d]">GET /api/farmer-carbon/land/{selectedLand.id}</span></p>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default FarmerLands;
