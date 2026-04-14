import { useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Layers, Tag, X, DollarSign, PackageX } from 'lucide-react';
import toast from 'react-hot-toast';

const mockMyCredits = [
  { id: 'CC-101', type: 'Soil Carbon', amount: 300, status: 'Owned', acquiredDate: '2026-01-15' },
  { id: 'CC-102', type: 'Forestry', amount: 600, status: 'Listed', listPrice: 1050, acquiredDate: '2026-02-22' },
  { id: 'CC-103', type: 'Biochar', amount: 150, status: 'Owned', acquiredDate: '2026-03-10' },
  { id: 'CC-104', type: 'Biomass', amount: 400, status: 'Listed', listPrice: 870, acquiredDate: '2026-03-28' },
];

const typeColors = {
  'Soil Carbon': 'bg-amber-50 text-amber-700 border-amber-200',
  'Forestry': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Biochar': 'bg-orange-50 text-orange-700 border-orange-200',
  'Biomass': 'bg-blue-50 text-blue-700 border-blue-200',
};

const BizMyCredits = () => {
  const [filter, setFilter] = useState('All'); // All | Owned | Listed
  const [listingCredit, setListingCredit] = useState(null);
  const [listPrice, setListPrice] = useState('');
  const [credits, setCredits] = useState(mockMyCredits);

  const filtered = filter === 'All' ? credits : credits.filter(c => c.status === filter);

  const handleListForSale = () => {
    const price = parseInt(listPrice);
    if (!price || price <= 0) { toast.error('Please enter a valid price.'); return; }
    // API: POST /api/businessman-carbon/list-for-sale
    setCredits(prev => prev.map(c => c.id === listingCredit.id ? { ...c, status: 'Listed', listPrice: price } : c));
    toast.success(`${listingCredit.id} listed for sale at ₹${price}/CC`);
    setListingCredit(null);
    setListPrice('');
  };

  const handleRemoveFromSale = (credit) => {
    // API: PUT /api/businessman-carbon/{creditId}/remove-from-sale
    setCredits(prev => prev.map(c => c.id === credit.id ? { ...c, status: 'Owned', listPrice: undefined } : c));
    toast.success(`${credit.id} removed from marketplace.`);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">My Carbon Credits</h1>
          <p className="text-gray-500 mt-1">Manage your owned inventory and active listings.</p>
        </div>
        <div className="flex gap-2">
          {['All', 'Owned', 'Listed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filter === f ? 'bg-econe-dark text-white border-econe-dark' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Owned', value: `${credits.filter(c=>c.status==='Owned').reduce((a,c)=>a+c.amount,0)} CC` },
          { label: 'Total Listed', value: `${credits.filter(c=>c.status==='Listed').reduce((a,c)=>a+c.amount,0)} CC` },
          { label: 'Credits In Inventory', value: credits.filter(c=>c.status==='Owned').length },
          { label: 'Active Listings', value: credits.filter(c=>c.status==='Listed').length },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
            <p className="text-xl font-bold text-econe-dark">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Credit Cards Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((credit, i) => (
          <motion.div key={credit.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${typeColors[credit.type] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>{credit.type}</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${credit.status === 'Listed' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>{credit.status}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-mono">{credit.id}</p>
              <h3 className="text-2xl font-bold text-econe-dark mt-1">{credit.amount} <span className="text-sm font-medium text-gray-400">Tons CO₂</span></h3>
              {credit.status === 'Listed' && (
                <p className="text-sm text-econe-emerald font-bold mt-1 flex items-center gap-1"><Tag size={13} /> Listed @ ₹{credit.listPrice}/CC</p>
              )}
              <p className="text-xs text-gray-400 mt-2">Acquired: {credit.acquiredDate}</p>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
              {credit.status === 'Owned' ? (
                <button onClick={() => { setListingCredit(credit); setListPrice(''); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-econe-emerald text-white rounded-xl text-sm font-bold hover:bg-econe-forest transition-colors shadow-sm shadow-econe-emerald/20">
                  <DollarSign size={15} /> List for Sale
                </button>
              ) : (
                <button onClick={() => handleRemoveFromSale(credit)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors border border-rose-200">
                  <PackageX size={15} /> Remove Listing
                </button>
              )}
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-20 text-gray-400">No credits match the selected filter.</div>
        )}
      </motion.div>

      {/* List for Sale Modal */}
      <Transition appear show={!!listingCredit} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setListingCredit(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-econe-dark/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title as="h3" className="text-xl font-bold text-econe-dark flex items-center gap-3">
                      <Tag className="text-econe-emerald" size={22} /> List for Sale
                    </Dialog.Title>
                    <button onClick={() => setListingCredit(null)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"><X size={18} /></button>
                  </div>
                  {listingCredit && (
                    <div className="space-y-5">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm space-y-1">
                        <p className="text-gray-500">Credit: <span className="font-bold text-gray-900">{listingCredit.id}</span></p>
                        <p className="text-gray-500">Amount: <span className="font-bold text-gray-900">{listingCredit.amount} CC</span></p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Sale Price (₹ per CC)</label>
                        <input type="number" min={1} value={listPrice} onChange={e => setListPrice(e.target.value)}
                          placeholder="e.g. 1200"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-econe-emerald/50 focus:border-econe-emerald font-bold text-gray-900" />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handleListForSale} className="flex-1 bg-econe-emerald hover:bg-econe-forest text-white py-3 rounded-xl font-bold shadow-lg shadow-econe-emerald/20">List Now</button>
                        <button onClick={() => setListingCredit(null)} className="px-5 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50">Cancel</button>
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

export default BizMyCredits;
