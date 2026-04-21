import { useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Search, X, CheckCircle, MapPin, Maximize, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../../utils/api';
import { useEffect } from 'react';

const NgoLandVerifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLand, setSelectedLand] = useState(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [notes, setNotes] = useState('');
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchLands = async () => {
    try {
      setLoading(true);
      const response = await api.get('/ngo-land/pending');
      setLands(response.data);
    } catch (error) {
      toast.error('Failed to fetch land registrations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLands();
  }, []);

  const filteredLand = lands.filter(c => 
    c.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerify = async () => {
    setSubmitting(true);
    try {
      await api.put(`/ngo-land/${selectedLand.id}/verify`);
      toast.success(`Land ${selectedLand.id} verified successfully!`);
      setSelectedLand(null);
      fetchLands();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!notes.trim()) {
      toast.error('Rejection reason is required.');
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/ngo-land/${selectedLand.id}/reject`);
      toast.success(`Land ${selectedLand.id} has been rejected.`);
      setIsRejecting(false);
      setNotes('');
      setSelectedLand(null);
      fetchLands();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Rejection failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Land Verifications</h1>
        <p className="text-gray-500 mt-1">Review and authenticate physical farm land registrations.</p>
      </div>

      <div className="bg-white/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 mb-6 relative z-10 border border-gray-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by Farmer Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#12b76a]/50 focus:border-[#12b76a] transition-all"
          />
        </div>
      </div>

      <div className="bg-white/90 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Land ID</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Farmer</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Location</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Area (Acres)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="p-10 text-center"><div className="w-8 h-8 border-4 border-[#12b76a]/20 border-t-[#12b76a] rounded-full animate-spin mx-auto" /></td></tr>
              ) : filteredLand.map((land, idx) => (
                <motion.tr 
                  key={land.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedLand(land)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <td className="p-5 font-mono text-[#12b76a] font-medium">{land.id}</td>
                  <td className="p-5">
                    <div className="font-bold text-gray-900">{land.farmerName}</div>
                    <div className="text-xs text-gray-400">{land.farmerId}</div>
                  </td>
                  <td className="p-5">
                    <div className="text-gray-600 text-sm">{land.landAddress}</div>
                    <div className="text-xs text-[#12b76a] font-medium">{land.distanceFromNgoKm.toFixed(2)} km away</div>
                  </td>
                  <td className="p-5 font-semibold text-gray-900">{land.landArea} acres</td>
                </motion.tr>
              ))}
              {!loading && filteredLand.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-400">No land verifications pending in your area.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Panel */}
      <Transition.Root show={!!selectedLand && !isRejecting} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setSelectedLand(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-400 sm:duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-400 sm:duration-500"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
                    <div className="flex h-full flex-col bg-white shadow-2xl overflow-y-auto">
                      
                      <div className="p-6 bg-gray-50 flex items-center justify-between border-b border-gray-200">
                        <Dialog.Title className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <MapPin className="text-[#12b76a]" /> Land Details
                        </Dialog.Title>
                        <button onClick={() => setSelectedLand(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200">
                          <X size={20} />
                        </button>
                      </div>

                      {selectedLand && (
                        <div className="p-6 flex-1 space-y-6">
                          <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Farmer Overview</h3>
                            <p className="text-2xl font-bold text-gray-900">{selectedLand.farmerName}</p>
                            <p className="text-sm font-medium text-gray-600 mt-1">Phone: {selectedLand.farmerPhone}</p>
                            <p className="text-sm font-mono text-[#12b76a] mt-1">{selectedLand.id}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Area</p>
                              <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Maximize size={18} className="text-gray-400" /> {selectedLand.landArea} Acres
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Soil Type</p>
                              <p className="text-lg font-bold text-gray-900">{selectedLand.soilType}</p>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Land Coordinates & Location</h3>
                            <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600 font-mono">
                              {selectedLand.landAddress} <br/>
                              ({selectedLand.latitude}, {selectedLand.longitude}) <br/>
                              <span className="text-[#12b76a] font-bold">{selectedLand.distanceFromNgoKm.toFixed(2)} km from your center</span>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Geo-Coordinates Hash</h3>
                            <div className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-4 rounded-xl font-mono truncate">
                              {selectedLand.geoCoordinates}
                            </div>
                          </div>

                        </div>
                      )}

                      <div className="p-6 bg-gray-50 flex gap-4 sticky bottom-0 border-t border-gray-200">
                        <button 
                          onClick={handleVerify}
                          disabled={submitting}
                          className="flex-1 py-3.5 bg-[#12b76a] hover:bg-[#0fa65e] text-white rounded-xl font-bold shadow-lg shadow-[#12b76a]/20 flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle size={20} /> {submitting ? 'Processing...' : 'Verify Land'}
                        </button>
                        <button 
                          onClick={() => setIsRejecting(true)}
                          disabled={submitting}
                          className="px-8 py-3.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>

                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Reject Modal */}
      <Transition appear show={isRejecting} as={Fragment}>
        <Dialog as="div" className="relative z-[110]" onClose={() => setIsRejecting(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                  <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 flex items-center gap-3 mb-6">
                    <AlertTriangle className="text-red-500" /> Confirm Rejection
                  </Dialog.Title>
                  
                  <label className="block text-sm font-bold text-gray-700 mb-2">Rejection Reason (Mandatory)</label>
                  <textarea
                    className="w-full p-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:outline-none transition-all text-sm mb-6"
                    rows="4"
                    placeholder="Provide specific details..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <div className="flex gap-3">
                    <button type="button" onClick={handleReject} disabled={submitting} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-md shadow-red-600/20 transition-all disabled:opacity-50">
                      {submitting ? 'Rejecting...' : 'Reject Land'}
                    </button>
                    <button type="button" onClick={() => setIsRejecting(false)} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default NgoLandVerifications;
