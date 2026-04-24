import { useState, useEffect, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Search, Clock, CheckCircle, AlertCircle, X, FileText, Download, ShieldCheck, User } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statusConfig = {
  COMPLETED: { bg: 'bg-emerald-50 text-emerald-700', icon: <CheckCircle size={13} />, ring: 'ring-emerald-200' },
  PENDING: { bg: 'bg-amber-50 text-amber-700', icon: <Clock size={13} />, ring: 'ring-amber-200' },
  REJECTED: { bg: 'bg-rose-50 text-rose-700', icon: <AlertCircle size={13} />, ring: 'ring-rose-200' },
};

const BizTransactions = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTx, setSelectedTx] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/transaction/my-history');
      setTransactions(res.data);
    } catch (error) {
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = transactions.filter(tx => {
    const matchS = tx.id.toLowerCase().includes(search.toLowerCase());
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
          {['All', 'COMPLETED', 'PENDING', 'REJECTED'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filterStatus === s ? 'bg-econe-dark text-white border-econe-dark' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {s === 'All' ? 'All' : s}
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
              {loading ? (
                <tr><td colSpan="6" className="p-12 text-center text-emerald-800 font-bold animate-pulse">Loading transactions...</td></tr>
              ) : filtered.map((tx, i) => {
                const sc = statusConfig[tx.status] || { bg: 'bg-gray-50 text-gray-700', icon: <Clock size={13} />, ring: 'ring-gray-200' };
                return (
                  <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedTx(tx)} className="hover:bg-gray-50/60 cursor-pointer transition-colors">
                    <td className="p-5 font-mono text-econe-emerald font-medium text-sm">{tx.id.substring(0, 12)}...</td>
                    <td className="p-5 font-bold text-gray-900 text-sm">Carbon Credit</td>
                    <td className="p-5 text-gray-700 font-semibold text-sm">{tx.carbonAmount}</td>
                    <td className="p-5 font-bold text-gray-900 text-sm">₹{tx.totalAmount ? tx.totalAmount.toLocaleString() : 'N/A'}</td>
                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ring-1 ${sc.bg} ${sc.ring}`}>
                        {sc.icon} {tx.status}
                      </span>
                    </td>
                    <td className="p-5 text-gray-500 text-sm">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </motion.tr>
                );
              })}
              {!loading && filtered.length === 0 && (
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
                <Dialog.Panel className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
                  {selectedTx && (
                    <div className="relative">
                      {/* Decorative Background */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-econe-emerald/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                      
                      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10">
                        <div>
                          <Dialog.Title as="h3" className="text-2xl font-bold text-econe-dark flex items-center gap-2">
                            <ShieldCheck className="text-econe-emerald" size={26} /> Digital Receipt
                          </Dialog.Title>
                          <p className="text-gray-400 text-sm mt-1 font-mono">TXN: {selectedTx.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => window.print()} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors tooltip" title="Print/Save PDF">
                            <Download size={20} />
                          </button>
                          <button onClick={() => setSelectedTx(null)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                            <X size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="p-8 space-y-8 relative z-10">
                        {/* Status & Highlights */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-6 border border-gray-100">
                          <div>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Amount Paid</p>
                            <p className="text-4xl font-bold text-econe-dark">₹{selectedTx.totalAmount ? selectedTx.totalAmount.toLocaleString() : '0'}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold ring-1 ${statusConfig[selectedTx.status]?.bg} ${statusConfig[selectedTx.status]?.ring}`}>
                              {statusConfig[selectedTx.status]?.icon} {selectedTx.status}
                            </span>
                            <p className="text-xs text-gray-400 mt-2">{new Date(selectedTx.completedAt || selectedTx.createdAt).toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><FileText size={16} className="text-gray-400" /> Purchase Details</h4>
                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Carbon Credit ID</p>
                                <p className="text-sm font-mono text-gray-700">{selectedTx.carbonCreditId}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quantity</p>
                                  <p className="text-sm font-bold text-gray-900">{selectedTx.carbonAmount} CC</p>
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Price / CC</p>
                                  <p className="text-sm font-bold text-gray-900">₹{selectedTx.pricePerTonne?.toLocaleString() || 'N/A'}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Payment Reference (Razorpay)</p>
                                <p className="text-sm font-mono text-econe-emerald font-bold">{selectedTx.paymentReference || 'N/A'}</p>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><User size={16} className="text-gray-400" /> Parties Involved</h4>
                            <div className="space-y-4">
                              <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Buyer (You)</p>
                                <p className="text-sm font-medium text-gray-700">{selectedTx.buyerName || selectedTx.buyerId}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Original Seller</p>
                                <p className="text-sm font-medium text-gray-700">{selectedTx.sellerName || selectedTx.sellerId}</p>
                              </div>
                              {selectedTx.projectHash && (
                                <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Blockchain / Hash Document</p>
                                  <p className="text-xs font-mono text-blue-500 break-all">{selectedTx.projectHash}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Footer Proof Note */}
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-start gap-3">
                          <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                          <div>
                            <p className="text-sm font-bold text-emerald-800">Verified Electronic Receipt</p>
                            <p className="text-xs text-emerald-600 mt-1 leading-relaxed">
                              This document serves as cryptographic proof of purchase. The transaction was facilitated securely via Razorpay and the carbon credit ownership has been immutably updated on the EOSCarbon registry.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
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
