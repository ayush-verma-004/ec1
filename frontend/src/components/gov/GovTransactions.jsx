import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tab, Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { AlertCircle, CheckCircle, X, ChevronRight } from 'lucide-react';

const mockTransactions = [
  { id: 'TX-1001', buyer: 'TechCorp Inc.', seller: 'Green Valley Init', amount: 200, cost: '$3,400', status: 'Approved' },
  { id: 'TX-1002', buyer: 'Global Logistics', seller: 'Sunny Horizon', amount: 350, cost: '$5,950', status: 'Pending' },
  { id: 'TX-1003', buyer: 'BuildRight Construction', seller: 'EcoGrow Partners', amount: 1500, cost: '$25,500', status: 'Pending' },
  { id: 'TX-1004', buyer: 'Oceanic Shipping', seller: 'Coastal Conservators', amount: 800, cost: '$13,600', status: 'Rejected' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
    Rejected: 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {status}
    </span>
  );
};

const TableLayout = ({ data, showActions, onAction }) => (
  <div className="glass bg-white/90 rounded-3xl overflow-hidden shadow-xl border border-gray-100">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Transaction ID</th>
            <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Buyer</th>
            <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Seller</th>
            <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Credits</th>
            <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Total Cost</th>
            <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider">Status</th>
            {showActions && <th className="p-5 font-semibold text-gray-500 text-sm tracking-wider text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((tx, idx) => (
            <motion.tr 
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <td className="p-5 font-mono text-gray-900 font-bold">{tx.id}</td>
              <td className="p-5 font-medium text-econe-dark">{tx.buyer}</td>
              <td className="p-5 font-medium text-gray-500">{tx.seller}</td>
              <td className="p-5 font-bold text-econe-forest">{tx.amount} CC</td>
              <td className="p-5 font-bold text-gray-800">{tx.cost}</td>
              <td className="p-5"><StatusBadge status={tx.status} /></td>
              
              {showActions && (
                <td className="p-5 text-right space-x-2">
                  <button 
                    onClick={() => onAction(tx, 'APPROVE')}
                    className="px-4 py-2 bg-emerald-50 text-econe-emerald hover:bg-econe-emerald hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => onAction(tx, 'REJECT')}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Reject
                  </button>
                </td>
              )}
            </motion.tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={showActions ? 7 : 6} className="p-10 text-center text-gray-400">No transactions found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const GovTransactions = () => {
  const [selectedTx, setSelectedTx] = useState(null);
  const [actionType, setActionType] = useState(''); // 'APPROVE' | 'REJECT'
  const [notes, setNotes] = useState('');

  const pending = mockTransactions.filter(tx => tx.status === 'Pending');
  const all = mockTransactions;

  const handleAction = () => {
    if (actionType === 'REJECT' && !notes.trim()) {
      toast.error('Rejection reason is mandatory.');
      return;
    }
    toast.success(`Transaction ${selectedTx.id} ${actionType === 'APPROVE' ? 'Approved' : 'Rejected'}!`, {
      style: { borderRadius: '12px', background: '#022c22', color: '#fff' }
    });
    setSelectedTx(null);
    setNotes('');
  };

  const openAction = (tx, type) => {
    setSelectedTx(tx);
    setActionType(type);
    setNotes('');
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">Transaction Monitor</h1>
          <p className="text-gray-500 mt-1">Oversee trades between carbon credit generators and buyers.</p>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-2 rounded-2xl bg-gray-100/50 p-1.5 w-max mb-6">
          {['Pending Review', 'Historical Ledger'].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full rounded-xl py-2.5 px-6 text-sm font-bold leading-5 transition-all outline-none ${
                  selected
                    ? 'bg-white text-econe-dark shadow-sm'
                    : 'text-gray-500 hover:text-econe-dark hover:bg-white/50'
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel><TableLayout data={pending} showActions={true} onAction={openAction} /></Tab.Panel>
          <Tab.Panel><TableLayout data={all} showActions={false} onAction={openAction} /></Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Action Dialog (Approve / Reject) */}
      <Transition appear show={!!selectedTx} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setSelectedTx(null)}>
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
                      {actionType === 'APPROVE' ? (
                        <><CheckCircle className="text-[#12b76a]" /> Approve Transaction</>
                      ) : (
                        <><X className="text-red-500 bg-red-100 rounded-full p-0.5" /> Reject Transaction</>
                      )}
                    </Dialog.Title>
                    <button onClick={() => setSelectedTx(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full p-2"><X size={16} strokeWidth={2}/></button>
                  </div>

                  {selectedTx && (
                    <div className="mb-6 space-y-2 bg-gray-50 p-4 rounded-xl text-sm border border-gray-100">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Transaction ID</span>
                        <span className="font-bold text-gray-900">{selectedTx.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Trade Route</span>
                        <span className="font-semibold text-gray-700">{selectedTx.seller} <ChevronRight className="inline w-3 h-3"/> {selectedTx.buyer}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                       {actionType === 'APPROVE' ? 'Approval Notes (Optional)' : 'Rejection Reason (Mandatory)'}
                    </label>
                    <textarea
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:outline-none transition-all text-sm ${
                        actionType === 'APPROVE' 
                          ? 'border-gray-200 focus:ring-[#12b76a]/50 focus:border-[#12b76a]' 
                          : 'border-red-200 focus:ring-red-500/50 focus:border-red-500'
                      }`}
                      rows="3"
                      placeholder={actionType === 'APPROVE' ? "Add any internal notes..." : "Enter reason for rejection..."}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      className={`inline-flex justify-center flex-1 rounded-xl border border-transparent px-4 py-3 text-sm font-bold text-white shadow-md transition-all ${
                        actionType === 'APPROVE' 
                          ? 'bg-[#12b76a] hover:bg-[#0fa65e] shadow-[#12b76a]/20' 
                          : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                      }`}
                      onClick={handleAction}
                    >
                      Confirm {actionType === 'APPROVE' ? 'Approval' : 'Rejection'}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center px-6 py-3 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                      onClick={() => setSelectedTx(null)}
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

export default GovTransactions;
