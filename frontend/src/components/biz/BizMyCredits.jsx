import { useState, useEffect, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Layers, Tag, X, DollarSign, PackageX } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { getUserId } from '../../utils/auth';

// Status mapping
const statusColors = {
  OWNED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  LISTED: 'bg-blue-50 text-blue-700 border-blue-200',
  SOLD: 'bg-purple-50 text-purple-700 border-purple-200',
};

const typeColors = {
  'Soil Carbon': 'bg-amber-50 text-amber-700 border-amber-200',
  'Forestry': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Biochar': 'bg-orange-50 text-orange-700 border-orange-200',
  'Biomass': 'bg-blue-50 text-blue-700 border-blue-200',
};

const BizMyCredits = () => {
  const [filter, setFilter] = useState('All'); // All | OWNED | LISTED
  const [listingCredit, setListingCredit] = useState(null);
  const [listPrice, setListPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchMyCredits = async () => {
    try {
      setLoading(true);
      const response = await api.get('/businessman-carbon/my-credits');
      const mappedCredits = response.data.map(c => ({
        ...c,
        displayStatus: c.status === 'ACTIVE' ? 'OWNED' : c.status === 'LISTED_FOR_SALE' ? 'LISTED' : c.status
      }));
      setCredits(mappedCredits);
    } catch (error) {
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCredits();
  }, []);

  const filtered = filter === 'All' ? credits : credits.filter(c => c.displayStatus === filter);

  const handleListForSale = async () => {
    const price = parseInt(listPrice);
    if (!price || price <= 0) { toast.error('Please enter a valid price.'); return; }
    setSubmitting(true);
    try {
      await api.post('/businessman-carbon/list-for-sale', { 
        creditId: listingCredit.id, 
        listPrice: price 
      });
      toast.success(`${listingCredit.id} listed for sale at ₹${price}/CC`);
      setListingCredit(null);
      setListPrice('');
      fetchMyCredits();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to list credit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveFromSale = async (credit) => {
    setSubmitting(true);
    try {
      await api.put(`/businessman-carbon/${credit.id}/remove-from-sale`);
      toast.success(`${credit.id} removed from marketplace.`);
      fetchMyCredits();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">My Carbon Credits</h1>
          <p className="text-gray-500 mt-1">Manage your owned inventory and active listings.</p>
        </div>
        <div className="flex gap-2">
          {['All', 'OWNED', 'LISTED'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filter === f ? 'bg-econe-dark text-white border-econe-dark' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {f === 'All' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Owned', value: `${credits.filter(c=>c.displayStatus==='OWNED').reduce((a,c)=>a+(c.carbonAmount||c.amount),0)} CC` },
          { label: 'Total Listed', value: `${credits.filter(c=>c.displayStatus==='LISTED').reduce((a,c)=>a+(c.carbonAmount||c.amount),0)} CC` },
          { label: 'Credits In Inventory', value: credits.filter(c=>c.displayStatus==='OWNED').length },
          { label: 'Active Listings', value: credits.filter(c=>c.displayStatus==='LISTED').length },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
            <p className="text-xl font-bold text-econe-dark">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Credit Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((credit, i) => (
            <motion.div key={credit.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border bg-emerald-50 text-emerald-800`}>{credit.carbonType || credit.type || 'Carbon Credit'}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[credit.displayStatus] || 'bg-gray-100 text-gray-500'}`}>{credit.displayStatus}</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-mono">{credit.id}</p>
                <h3 className="text-2xl font-bold text-econe-dark mt-1">{credit.carbonAmount || credit.amount} <span className="text-sm font-medium text-gray-400">Tons CO₂</span></h3>
                {credit.displayStatus === 'LISTED' && (
                  <p className="text-sm text-econe-emerald font-bold mt-1 flex items-center gap-1"><Tag size={13} /> Listed @ ₹{credit.pricePerTonne || credit.listPrice}/CC</p>
                )}
                <p className="text-xs text-gray-400 mt-2">Methodology: {credit.methodology || 'N/A'}</p>
              </div>
              <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                {credit.displayStatus === 'OWNED' ? (
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
            <div className="col-span-3 text-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">No credits match the selected filter.</div>
          )}
        </motion.div>
      )}

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
