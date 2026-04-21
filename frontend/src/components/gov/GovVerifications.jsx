import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { Search, X, CheckCircle, FileText, ShieldCheck, ShieldX, Leaf } from 'lucide-react';
import api from '../../utils/api';

const CREDIT_TYPES = {
  SOIL_CARBON:        { label: 'Soil Carbon',        icon: '🌱' },
  BIOMASS:            { label: 'Biomass',            icon: '🌿' },
  AGROFORESTRY:       { label: 'Agroforestry',       icon: '🌳' },
  ORGANIC_FARMING:    { label: 'Organic Farming',    icon: '🥬' },
  CROP_RESIDUE:       { label: 'Crop Residue',       icon: '🌾' },
  WATER_CONSERVATION: { label: 'Water Conservation', icon: '💧' },
  RENEWABLE_ENERGY:   { label: 'Renewable Energy',   icon: '☀️' },
};

const GovVerifications = () => {
  const [searchTerm, setSearchTerm]     = useState('');
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [actionType, setActionType]     = useState(null); // 'VERIFY' | 'REJECT'
  const [notes, setNotes]               = useState('');
  const [credits, setCredits]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [submitting, setSubmitting]     = useState(false);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await api.get('/government-carbon/pending-verification');
      setCredits(res.data);
    } catch {
      toast.error('Failed to load pending verifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const filtered = credits.filter(c =>
    c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.farmerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = async () => {
    if (actionType === 'REJECT' && !notes.trim()) {
      toast.error('Rejection reason is required.');
      return;
    }
    setSubmitting(true);
    try {
      const endpoint = actionType === 'VERIFY'
        ? '/government-carbon/verify'
        : '/government-carbon/reject';
      const body = actionType === 'VERIFY'
        ? { carbonCreditId: selectedCredit.id, approved: true,  verificationNotes: notes || 'Verified by Government' }
        : { carbonCreditId: selectedCredit.id, approved: false, rejectionReason: notes };

      await api.put(endpoint, body);

      toast.success(`Credit ${selectedCredit.id} has been ${actionType === 'VERIFY' ? 'approved and made ACTIVE' : 'rejected'}.`);
      setNotes('');
      setActionType(null);
      setSelectedCredit(null);
      fetchPending();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">Carbon Credit Approvals</h1>
          <p className="text-gray-500 mt-1">NGO-verified credits awaiting final Government approval.</p>
        </div>
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2.5">
          <ShieldCheck className="text-blue-600" size={18} />
          <span className="text-sm font-bold text-blue-700">{credits.length} pending approval</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/80 rounded-2xl p-4 flex gap-4 mb-6 border border-gray-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Credit ID, Farmer or Project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white/90 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Credit ID</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Farmer</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Project</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Type</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Amount (CC)</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">NGO Verified By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="6" className="p-10 text-center">
                  <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : (
                <AnimatePresence>
                  {filtered.map((credit, idx) => {
                    const typeObj = CREDIT_TYPES[credit.carbonType] || {};
                    return (
                      <motion.tr
                        key={credit.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedCredit(credit)}
                        className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                      >
                        <td className="p-5 font-mono text-blue-600 font-medium">{credit.id}</td>
                        <td className="p-5 font-bold text-gray-900">{credit.farmerName || 'Farmer'}</td>
                        <td className="p-5 text-gray-600 text-sm max-w-[200px] truncate">{credit.projectName}</td>
                        <td className="p-5">
                          <span className="flex items-center gap-1.5 text-gray-600 text-sm">
                            {typeObj.icon} {typeObj.label || credit.carbonType}
                          </span>
                        </td>
                        <td className="p-5 font-bold text-gray-900">{credit.carbonAmount} CC</td>
                        <td className="p-5 text-sm text-gray-500">{credit.ngoVerifierName || '—'}</td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan="6" className="p-10 text-center text-gray-400">No pending government approvals.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      <Transition.Root show={!!selectedCredit && !actionType} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setSelectedCredit(null)}>
          <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-econe-dark/70 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child as={Fragment}
                  enter="transform transition ease-in-out duration-400 sm:duration-500"
                  enterFrom="translate-x-full" enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-400 sm:duration-500"
                  leaveFrom="translate-x-0" leaveTo="translate-x-full">
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
                    <div className="flex h-full flex-col bg-white shadow-2xl overflow-y-auto">

                      <div className="p-6 bg-gradient-to-br from-[#0c1a4e] to-[#1e3a8a] flex items-center justify-between">
                        <Dialog.Title className="text-xl font-bold text-white flex items-center gap-2">
                          <ShieldCheck className="text-blue-300" /> Government Review
                        </Dialog.Title>
                        <button onClick={() => setSelectedCredit(null)} className="p-2 text-blue-200 hover:text-white rounded-full hover:bg-white/10">
                          <X size={20} />
                        </button>
                      </div>

                      {selectedCredit && (
                        <div className="p-6 flex-1 space-y-5">

                          {/* NGO Verification Badge */}
                          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                            <CheckCircle className="text-emerald-600 shrink-0" size={22} />
                            <div>
                              <p className="font-bold text-emerald-800 text-sm">NGO Verified ✓</p>
                              <p className="text-xs text-emerald-600">Verified by: {selectedCredit.ngoVerifierName || 'NGO auditor'}</p>
                              {selectedCredit.ngoVerificationNotes && (
                                <p className="text-xs text-emerald-700 mt-1 italic">"{selectedCredit.ngoVerificationNotes}"</p>
                              )}
                            </div>
                          </div>

                          {/* Core Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Credit Amount</p>
                              <p className="text-2xl font-bold text-gray-900">{selectedCredit.carbonAmount} CC</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Type</p>
                              <p className="text-lg font-bold text-gray-900">
                                {CREDIT_TYPES[selectedCredit.carbonType]?.icon} {CREDIT_TYPES[selectedCredit.carbonType]?.label || selectedCredit.carbonType}
                              </p>
                            </div>
                          </div>

                          {[
                            { label: 'Credit ID',   val: selectedCredit.id },
                            { label: 'Project',     val: selectedCredit.projectName },
                            { label: 'Farmer',      val: selectedCredit.farmerName },
                            { label: 'Land',        val: selectedCredit.landAddress },
                            { label: 'Validity',    val: `${selectedCredit.validityYears || '—'} years` },
                          ].map(({ label, val }) => (
                            <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{label}</p>
                              <p className="text-sm font-semibold text-gray-900">{val || '—'}</p>
                            </div>
                          ))}

                          {selectedCredit.projectDescription && (
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                              <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Project Description</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{selectedCredit.projectDescription}</p>
                            </div>
                          )}

                          {selectedCredit.assessmentReportUrl && (
                            <a href={selectedCredit.assessmentReportUrl} target="_blank" rel="noreferrer"
                              className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors">
                              <FileText className="text-blue-600" size={20} />
                              <span className="text-sm font-bold text-blue-600">View Assessment Report</span>
                            </a>
                          )}
                        </div>
                      )}

                      <div className="p-6 bg-gray-50 flex gap-4 sticky bottom-0 border-t border-gray-200">
                        <button onClick={() => setActionType('VERIFY')} disabled={submitting}
                          className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 flex justify-center items-center gap-2 transition-colors disabled:opacity-50">
                          <ShieldCheck size={20} /> Approve Credit
                        </button>
                        <button onClick={() => setActionType('REJECT')} disabled={submitting}
                          className="px-8 py-3.5 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-50 transition-colors disabled:opacity-50">
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

      {/* Action Confirmation Modal */}
      <Transition appear show={!!actionType} as={Fragment}>
        <Dialog as="div" className="relative z-[110]" onClose={() => setActionType(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-econe-dark/50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      {actionType === 'VERIFY'
                        ? <><ShieldCheck className="text-blue-600" /> Approve Carbon Credit</>
                        : <><ShieldX className="text-red-500" /> Reject Carbon Credit</>}
                    </Dialog.Title>
                    <button onClick={() => setActionType(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-2"><X size={16} /></button>
                  </div>

                  {selectedCredit && (
                    <div className="mb-5 bg-gray-50 p-4 rounded-xl text-sm border border-gray-200 space-y-1.5">
                      <div className="flex justify-between"><span className="text-gray-500">Credit ID</span><span className="font-bold">{selectedCredit.id}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-bold">{selectedCredit.carbonAmount} CC</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Farmer</span><span className="font-semibold">{selectedCredit.farmerName}</span></div>
                    </div>
                  )}

                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {actionType === 'VERIFY' ? 'Official Notes (Optional)' : 'Rejection Reason (Mandatory)'}
                  </label>
                  <textarea
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:outline-none transition-all text-sm mb-6 ${
                      actionType === 'VERIFY' ? 'border-gray-200 focus:ring-blue-500/50 focus:border-blue-500' : 'border-red-200 focus:ring-red-500/50 focus:border-red-500'}`}
                    rows="3"
                    placeholder={actionType === 'VERIFY' ? 'Add compliance reference numbers...' : 'State the reason for rejection...'}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <div className="flex gap-3">
                    <button type="button" onClick={handleAction} disabled={submitting}
                      className={`flex-1 py-3 rounded-xl font-bold text-white shadow-md transition-all disabled:opacity-50 ${
                        actionType === 'VERIFY' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'}`}>
                      {submitting ? 'Processing...' : `Confirm ${actionType === 'VERIFY' ? 'Approval' : 'Rejection'}`}
                    </button>
                    <button type="button" onClick={() => setActionType(null)}
                      className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
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

export default GovVerifications;
