import { useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Search, X, CheckCircle, Leaf, AlertTriangle, FileText, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const mockCarbonCredits = [
  { id: 'CR-822', farmer: 'EcoGrow Partners', type: 'Soil Carbon', amount: 1200, date: '2026-04-13', description: 'Transitioned 2000 acres to regenerative zero-till practices mapping directly to deep soil carbon sequestration.' },
  { id: 'CR-823', farmer: 'Sunny Farms Co.', type: 'Biochar', amount: 450, date: '2026-04-14', description: 'Application of 100 tons of structural biochar into depleted topsoils.' },
];

const NgoCarbonVerifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [actionType, setActionType] = useState(null); // 'VERIFY' | 'REJECT'
  const [notes, setNotes] = useState('');
  
  const filteredCredits = mockCarbonCredits.filter(c => 
    c.farmer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = () => {
    if (actionType === 'REJECT' && !notes.trim()) {
      toast.error('Rejection reason is absolutely mandatory for Carbon verification.');
      return;
    }
    
    // API Call: PUT /api/ngo-carbon/verify OR /api/ngo-carbon/reject
    const endpoint = actionType === 'VERIFY' ? 'verified' : 'rejected';
    toast.success(`Carbon Credit ${selectedCredit.id} has been ${endpoint}.`);
    
    setActionType(null);
    setNotes('');
    setSelectedCredit(null);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Carbon Credit Verifications</h1>
        <p className="text-gray-500 mt-1">Audit scientific evidence supporting claimed carbon offsets.</p>
      </div>

      <div className="bg-white/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 mb-6 relative z-10 border border-gray-100 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by ID or Farmer..."
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
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Credit ID</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Farmer</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Credit Type</th>
                <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Requested Amount</th>
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
                  className="hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <td className="p-5 font-mono text-[#12b76a] font-medium">{credit.id}</td>
                  <td className="p-5 font-bold text-gray-900">{credit.farmer}</td>
                  <td className="p-5">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">{credit.type}</span>
                  </td>
                  <td className="p-5 font-bold text-gray-900">{credit.amount} CC</td>
                </motion.tr>
              ))}
              {filteredCredits.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-400">No carbon verification requests pending.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Details Modal */}
      <Transition appear show={!!selectedCredit && !actionType} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setSelectedCredit(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95 y-4" enterTo="opacity-100 scale-100 y-0" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100 y-0" leaveTo="opacity-0 scale-95 y-4">
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all border border-gray-100">
                  {selectedCredit && (
                    <>
                      <div className="p-8 pb-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 flex items-center gap-3">
                          <Leaf className="text-[#12b76a]" /> Carbon Evidence Review
                        </Dialog.Title>
                        <button onClick={() => setSelectedCredit(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                      </div>

                      <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Target Amount</p>
                            <p className="text-2xl font-bold text-gray-900">{selectedCredit.amount} CC</p>
                          </div>
                          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-1">Methodology</p>
                            <p className="text-xl font-bold text-gray-900">{selectedCredit.type}</p>
                          </div>
                        </div>
                        
                        <div>
                           <h4 className="text-sm font-bold text-gray-900 mb-2">Claim Overview</h4>
                           <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-gray-600 text-sm">
                             {selectedCredit.description}
                           </div>
                        </div>

                        <div>
                           <h4 className="text-sm font-bold text-gray-900 mb-2">Scientific Evidence Attached</h4>
                           <div className="grid grid-cols-3 gap-3">
                             <div className="aspect-square bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100">
                               <FileText size={24} className="mb-2" />
                               <span className="text-xs font-bold">Soil Samples</span>
                             </div>
                             <div className="aspect-square bg-gray-50 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100">
                               <ImageIcon size={24} className="mb-2" />
                               <span className="text-xs font-bold">Drone Scans</span>
                             </div>
                           </div>
                        </div>

                      </div>

                      <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                        <button onClick={() => setActionType('VERIFY')} className="flex-1 py-3.5 bg-[#12b76a] hover:bg-[#0fa65e] text-white rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-[#12b76a]/20">
                          <CheckCircle size={20} /> Verify Credit
                        </button>
                        <button onClick={() => setActionType('REJECT')} className="px-8 py-3.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50">
                          Reject
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Action Workflow Modal */}
      <Transition appear show={!!actionType} as={Fragment}>
        <Dialog as="div" className="relative z-[110]" onClose={() => setActionType(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
                  <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 flex items-center gap-3 mb-6">
                    {actionType === 'VERIFY' ? <><CheckCircle className="text-[#12b76a]" /> Finalize Verification</> : <><AlertTriangle className="text-red-500" /> Reject Carbon Claim</>}
                  </Dialog.Title>
                  
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {actionType === 'VERIFY' ? 'Internal Notes (Optional)' : 'Rejection Reason (Mandatory)'}
                  </label>
                  <textarea
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:outline-none transition-all text-sm mb-6 ${actionType === 'REJECT' ? 'border-red-200 focus:ring-red-500/50 focus:border-red-500' : 'border-gray-200 focus:ring-[#12b76a]/50 focus:border-[#12b76a]'}`}
                    rows="4"
                    placeholder={actionType === 'REJECT' ? "State why evidence is insufficient..." : "Add audit reference IDs..."}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <div className="flex gap-3">
                    <button type="button" onClick={handleAction} className={`flex-1 py-3 rounded-xl font-bold text-white shadow-md transition-all ${actionType === 'VERIFY' ? 'bg-[#12b76a] hover:bg-[#0fa65e] shadow-[#12b76a]/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'}`}>
                       Confirm {actionType === 'VERIFY' ? 'Verification' : 'Rejection'}
                    </button>
                    <button type="button" onClick={() => setActionType(null)} className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
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

export default NgoCarbonVerifications;
