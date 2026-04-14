import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { Search, Filter, X, CheckCircle, FileText, Image as ImageIcon, MapPin } from 'lucide-react';

const mockCredits = [
  { id: 'CR-901', generator: 'Green Valley Init', type: 'Forestry', amount: 500, date: '2026-04-12', location: 'Northern Highlands', description: 'Reforestation of 500 hectares with native pine species ensuring long-term carbon sequestration.' },
  { id: 'CR-902', generator: 'EcoGrow Partners', type: 'Soil Carbon', amount: 1200, date: '2026-04-13', location: 'Midwest Plains', description: 'Transitioned 2000 acres to regenerative agriculture zero-till practices.' },
  { id: 'CR-903', generator: 'Oceanic Blue Projects', type: 'Blue Carbon', amount: 350, date: '2026-04-14', location: 'Coastal Bay', description: 'Restoration of mangrove ecosystems to capture coastal blue carbon.' },
  { id: 'CR-904', generator: 'Sunny Horizon', type: 'Renewable', amount: 800, date: '2026-04-15', location: 'Desert Basin', description: 'Installation of 50MW solar farm displacing grid emissions.' },
];

const GovVerifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [actionType, setActionType] = useState(null); // 'VERIFY' | 'REJECT'
  const [notes, setNotes] = useState('');

  // Filter Logic
  const filteredCredits = mockCredits.filter(c => {
    const matchesSearch = c.generator.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAction = () => {
    if (actionType === 'REJECT' && !notes.trim()) {
      toast.error('Rejection reason is required.');
      return;
    }
    toast.success(`Credit ${selectedCredit.id} has been ${actionType === 'VERIFY' ? 'Verified' : 'Rejected'}!`, {
      style: { borderRadius: '12px', background: '#022c22', color: '#fff' }
    });
    setNotes('');
    setActionType(null);
    setSelectedCredit(null);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">Pending Verifications</h1>
          <p className="text-gray-500 mt-1">Review and authenticate submitted Carbon Credits.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="glass bg-white/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 mb-6 relative z-10 border border-gray-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by Generator Name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-econe-emerald/50 focus:border-econe-emerald transition-all"
          />
        </div>
        <div className="w-full md:w-64 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-econe-emerald/50 focus:border-econe-emerald appearance-none font-medium text-econe-dark"
          >
            <option value="All">All Types</option>
            <option value="Forestry">Forestry</option>
            <option value="Soil Carbon">Soil Carbon</option>
            <option value="Blue Carbon">Blue Carbon</option>
            <option value="Renewable">Renewable</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass bg-white/90 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Credit ID</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Generator</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Type</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Amount (Tons)</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Date Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCredits.map((credit, idx) => (
                <motion.tr 
                  key={credit.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedCredit(credit)}
                  className="hover:bg-econe-emerald/5 cursor-pointer transition-colors group"
                >
                  <td className="p-5 font-mono text-econe-emerald font-medium"><span className="border-b border-transparent group-hover:border-econe-emerald/50">{credit.id}</span></td>
                  <td className="p-5 font-bold text-econe-dark">{credit.generator}</td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                      {credit.type}
                    </span>
                  </td>
                  <td className="p-5 font-semibold text-econe-dark">{credit.amount} CC</td>
                  <td className="p-5 font-medium text-gray-500">{credit.date}</td>
                </motion.tr>
              ))}
              {filteredCredits.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">No verifications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Panel for Verification Flow */}
      <Transition.Root show={!!selectedCredit} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setSelectedCredit(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-econe-dark/70 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-[105] overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 y-8"
                enterTo="opacity-100 scale-100 y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 y-0"
                leaveTo="opacity-0 scale-95 y-8"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 flex items-center gap-3">
                      Verification Details
                    </Dialog.Title>
                    <button onClick={() => setSelectedCredit(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-2"><X size={16} strokeWidth={2}/></button>
                  </div>

                  {selectedCredit && (
                    <div className="flex flex-col max-h-[70vh] overflow-y-auto space-y-6 pr-2 mb-6">
                        
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Credit Amount</p>
                          <p className="text-2xl font-bold text-gray-900">{selectedCredit.amount} CC</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Project Type</p>
                          <p className="text-xl font-bold text-gray-900">{selectedCredit.type}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Project Description</h3>
                        <div className="text-gray-600 leading-relaxed text-sm bg-gray-50 p-5 rounded-2xl border border-gray-100">
                          {selectedCredit.description}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Supporting Evidence</h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="aspect-[4/3] bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100">
                            <FileText className="mb-2 w-6 h-6 stroke-[1.5]" />
                            <span className="text-[10px] font-bold">Audit Report</span>
                          </div>
                          <div className="aspect-[4/3] bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100">
                            <ImageIcon className="mb-2 w-6 h-6 stroke-[1.5]" />
                            <span className="text-[10px] font-bold">Geo-Satellite</span>
                          </div>
                          <div className="aspect-[4/3] bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100">
                            <FileText className="mb-2 w-6 h-6 stroke-[1.5]" />
                            <span className="text-[10px] font-bold">Registry Form</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}

                  <div className="pt-6 border-t border-gray-100 flex gap-3">
                    <button 
                      onClick={() => setActionType('VERIFY')}
                      className="inline-flex justify-center flex-1 rounded-xl border border-transparent px-4 py-3 text-sm font-bold text-white shadow-md transition-all bg-[#12b76a] hover:bg-[#0fa65e] shadow-[#12b76a]/20 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} /> Verify Credit
                    </button>
                    <button 
                      onClick={() => setActionType('REJECT')}
                      className="inline-flex justify-center px-8 py-3 rounded-xl border border-red-200 bg-red-50 text-sm font-bold text-red-600 hover:bg-red-100 transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Action Modal (Verify / Reject) matching GovTransactions */}
      <Transition appear show={!!actionType} as={Fragment}>
        <Dialog as="div" className="relative z-[110]" onClose={() => setActionType(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-econe-dark/50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 y-8"
                enterTo="opacity-100 scale-100 y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 y-0"
                leaveTo="opacity-0 scale-95 y-8"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 flex items-center gap-3">
                      {actionType === 'VERIFY' ? (
                        <><CheckCircle className="text-[#12b76a]" /> Verify Credit</>
                      ) : (
                        <><X className="text-red-500 bg-red-100 rounded-full p-0.5" /> Reject Credit</>
                      )}
                    </Dialog.Title>
                    <button onClick={() => setActionType(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-2"><X size={16} strokeWidth={2}/></button>
                  </div>

                  {selectedCredit && (
                    <div className="mb-6 space-y-2 bg-gray-50/80 p-4 rounded-xl text-sm border border-gray-200">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Credit ID</span>
                        <span className="font-bold text-gray-900">{selectedCredit.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Generator</span>
                        <span className="font-semibold text-gray-800">{selectedCredit.generator}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                       {actionType === 'VERIFY' ? 'Verification Notes (Optional)' : 'Rejection Reason (Mandatory)'}
                    </label>
                    <textarea
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:outline-none transition-all text-sm ${
                        actionType === 'VERIFY' 
                          ? 'border-gray-200 focus:ring-[#12b76a]/50 focus:border-[#12b76a]' 
                          : 'border-red-200 focus:ring-red-500/50 focus:border-red-500'
                      }`}
                      rows="3"
                      placeholder={actionType === 'VERIFY' ? "Add any internal compliance notes..." : "Enter reason for rejection..."}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      className={`inline-flex justify-center flex-1 rounded-xl border border-transparent px-4 py-3 text-sm font-bold text-white shadow-md transition-all ${
                        actionType === 'VERIFY' 
                          ? 'bg-[#12b76a] hover:bg-[#0fa65e] shadow-[#12b76a]/20' 
                          : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                      }`}
                      onClick={handleAction}
                    >
                      Confirm {actionType === 'VERIFY' ? 'Verification' : 'Rejection'}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-6 py-3 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                      onClick={() => setActionType(null)}
                    >
                      Cancel
                    </button>
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
