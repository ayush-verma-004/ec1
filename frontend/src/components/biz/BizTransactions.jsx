import { useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Search, Clock, CheckCircle, AlertCircle, X, FileText } from 'lucide-react';

const mockTransactions = [
  { id: 'TX-5500', creditType: 'Soil Carbon', qty: 200, totalPrice: 240000, status: 'Approved', date: '2026-04-13', notes: 'Verified and processed by the GoI regulatory office.' },
  { id: 'TX-5501', creditType: 'Forestry', qty: 500, totalPrice: 490000, status: 'Pending', date: '2026-04-12', notes: 'Under review by MoEF-Delhi.' },
  { id: 'TX-5502', creditType: 'Biochar', qty: 100, totalPrice: 150000, status: 'Rejected', date: '2026-04-10', notes: 'Transaction rejected due to incomplete KYC documentation.' },
  { id: 'TX-5503', creditType: 'Wetland', qty: 80, totalPrice: 168000, status: 'Approved', date: '2026-04-08', notes: 'Credits transferred. Settlement complete.' },
];

const statusConfig = {
  Approved: { bg: 'bg-emerald-50 text-emerald-700', icon: <CheckCircle size={13} />, ring: 'ring-emerald-200' },
  Pending: { bg: 'bg-amber-50 text-amber-700', icon: <Clock size={13} />, ring: 'ring-amber-200' },
  Rejected: { bg: 'bg-rose-50 text-rose-700', icon: <AlertCircle size={13} />, ring: 'ring-rose-200' },
};

const BizTransactions = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTx, setSelectedTx] = useState(null);

  const filtered = mockTransactions.filter(tx => {
    const matchS = tx.id.toLowerCase().includes(search.toLowerCase()) || tx.creditType.toLowerCase().includes(search.toLowerCase());
    const matchF = filterStatus === 'All' || tx.status === filterStatus;
    return matchS && matchF;
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-econe-dark">Transaction History</h1>
        <p className="text-gray-500 mt-1">Full audit trail of your carbon credit purchases.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search Transaction ID or Credit Type..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-econe-emerald/50 text-sm shadow-sm" />
        </div>
        <div className="flex gap-2">
          {['All', 'Approved', 'Pending', 'Rejected'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filterStatus === s ? 'bg-econe-dark text-white border-econe-dark' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100">
                {['Transaction ID', 'Credit Type', 'Qty (CC)', 'Total Price', 'Status', 'Date'].map(h => (
                  <th key={h} className="p-5 font-semibold text-gray-400 text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((tx, i) => {
                const sc = statusConfig[tx.status];
                return (
                  <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedTx(tx)} className="hover:bg-gray-50/60 cursor-pointer transition-colors">
                    <td className="p-5 font-mono text-econe-emerald font-medium text-sm">{tx.id}</td>
                    <td className="p-5 font-bold text-gray-900 text-sm">{tx.creditType}</td>
                    <td className="p-5 text-gray-700 font-semibold text-sm">{tx.qty}</td>
                    <td className="p-5 font-bold text-gray-900 text-sm">₹{tx.totalPrice.toLocaleString()}</td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ${sc.bg} ${sc.ring}`}>
                        {sc.icon} {tx.status}
                      </span>
                    </td>
                    <td className="p-5 text-gray-500 text-sm">{tx.date}</td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="6" className="p-12 text-center text-gray-400">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Transition appear show={!!selectedTx} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setSelectedTx(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-econe-dark/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                  {selectedTx && (
                    <>
                      <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <Dialog.Title as="h3" className="text-lg font-bold text-econe-dark flex items-center gap-2">
                          <FileText className="text-econe-emerald" size={20} /> Transaction Detail
                        </Dialog.Title>
                        <button onClick={() => setSelectedTx(null)} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400"><X size={18} /></button>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'ID', val: selectedTx.id, mono: true },
                            { label: 'Credit Type', val: selectedTx.creditType },
                            { label: 'Quantity', val: `${selectedTx.qty} CC` },
                            { label: 'Total Price', val: `₹${selectedTx.totalPrice.toLocaleString()}` },
                            { label: 'Date', val: selectedTx.date },
                          ].map(item => (
                            <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{item.label}</p>
                              <p className={`text-sm font-bold text-gray-900 ${item.mono ? 'font-mono text-econe-emerald' : ''}`}>{item.val}</p>
                            </div>
                          ))}
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusConfig[selectedTx.status].bg}`}>
                              {statusConfig[selectedTx.status].icon} {selectedTx.status}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Regulator Notes</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{selectedTx.notes}</p>
                        </div>
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

export default BizTransactions;
