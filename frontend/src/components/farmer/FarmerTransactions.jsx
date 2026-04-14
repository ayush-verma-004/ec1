import { useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Wallet, CheckCircle, Clock, AlertCircle, X, FileText, Search } from 'lucide-react';

const statusConfig = {
  Approved: { bg: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: <CheckCircle size={12} /> },
  Pending: { bg: 'bg-amber-50 text-amber-700 ring-amber-200', icon: <Clock size={12} /> },
  Rejected: { bg: 'bg-rose-50 text-rose-700 ring-rose-200', icon: <AlertCircle size={12} /> },
};

const mockSales = [
  { id: 'TX-5510', buyer: 'IndusTrade Corp', creditType: 'Soil Carbon', amount: 200, price: 240000, status: 'Approved', date: '2026-04-13', notes: 'Settlement complete.' },
  { id: 'TX-5511', buyer: 'Global Green Inc.', creditType: 'Agroforestry', amount: 500, price: 490000, status: 'Pending', date: '2026-04-12', notes: 'Government review in progress.' },
];

const mockHistory = [
  ...mockSales,
  { id: 'TX-5512', buyer: 'EcoTech Ltd.', creditType: 'Biochar', amount: 100, price: 115000, status: 'Rejected', date: '2026-04-10', notes: 'Buyer withdrew request.' },
];

const FarmerTransactions = () => {
  const [tab, setTab] = useState('sales');
  const [search, setSearch] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  const data = tab === 'sales' ? mockSales : mockHistory;
  const filtered = data.filter(tx =>
    tx.id.toLowerCase().includes(search.toLowerCase()) ||
    tx.buyer.toLowerCase().includes(search.toLowerCase()) ||
    tx.creditType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-econe-dark">Sales & Transactions</h1>
        <p className="text-gray-500 mt-1">Complete record of buyer activity and payment history.</p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex gap-2">
          {[{ id: 'sales', label: 'My Sales' }, { id: 'history', label: 'Full History' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm border transition-all ${tab === t.id ? 'bg-econe-dark text-white border-econe-dark' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search by ID, Buyer, or Type..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#15803d]/50 text-sm shadow-sm" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100">
                {['Transaction ID', 'Buyer', 'Credit Type', 'Amount (CC)', 'Total Price', 'Status', 'Date'].map(h => (
                  <th key={h} className="p-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((tx, i) => {
                const sc = statusConfig[tx.status];
                return (
                  <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    onClick={() => setSelectedTx(tx)} className="hover:bg-gray-50/60 cursor-pointer transition-colors">
                    <td className="p-5 font-mono text-[#15803d] font-medium text-sm">{tx.id}</td>
                    <td className="p-5 font-bold text-gray-900 text-sm">{tx.buyer}</td>
                    <td className="p-5 text-gray-600 text-sm">{tx.creditType}</td>
                    <td className="p-5 font-semibold text-gray-900">{tx.amount}</td>
                    <td className="p-5 font-bold text-gray-900">₹{tx.price.toLocaleString()}</td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ${sc.bg}`}>{sc.icon} {tx.status}</span>
                    </td>
                    <td className="p-5 text-gray-500 text-sm">{tx.date}</td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan="7" className="p-12 text-center text-gray-400">No transactions found.</td></tr>
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
                        <h3 className="text-lg font-bold text-econe-dark flex items-center gap-2">
                          <FileText className="text-[#15803d]" size={20} /> Transaction Detail
                        </h3>
                        <button onClick={() => setSelectedTx(null)} className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400"><X size={18} /></button>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { label: 'ID', val: selectedTx.id, mono: true },
                            { label: 'Buyer', val: selectedTx.buyer },
                            { label: 'Credit Type', val: selectedTx.creditType },
                            { label: 'Quantity', val: `${selectedTx.amount} CC` },
                            { label: 'Total Price', val: `₹${selectedTx.price.toLocaleString()}` },
                            { label: 'Date', val: selectedTx.date },
                          ].map(item => (
                            <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">{item.label}</p>
                              <p className={`text-sm font-bold text-gray-900 ${item.mono ? 'font-mono text-[#15803d]' : ''}`}>{item.val}</p>
                            </div>
                          ))}
                          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${statusConfig[selectedTx.status].bg}`}>
                              {statusConfig[selectedTx.status].icon} {selectedTx.status}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Notes</p>
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

export default FarmerTransactions;
