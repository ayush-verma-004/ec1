import { useState, useEffect, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Search, Filter, Leaf, X, ShieldCheck, CheckCircle, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api'; // Add API import

const typeColors = {
  'SOIL_CARBON': 'bg-amber-50 text-amber-700 border-amber-100',
  'AGROFORESTRY': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'ORGANIC_FARMING': 'bg-orange-50 text-orange-700 border-orange-100',
  'BIOMASS': 'bg-blue-50 text-blue-700 border-blue-100',
  'WATER_CONSERVATION': 'bg-cyan-50 text-cyan-700 border-cyan-100',
};

// Map backend ENUM to readable type
const formatType = (type) => {
  if (!type) return 'Unknown';
  return type.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
};

const BizMarketplace = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [selectedListing, setSelectedListing] = useState(null);
  const [confirmPurchase, setConfirmPurchase] = useState(false);
  const [qty, setQty] = useState(1);
  const [listings, setListings] = useState([]); // State for real listings
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/marketplace/listings');
      setListings(res.data);
    } catch (error) {
      toast.error('Failed to load marketplace listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const types = ['All', 'Soil Carbon', 'Agroforestry', 'Organic Farming', 'Biomass', 'Water Conservation'];

  const filtered = listings.filter(l => {
    const formattedType = formatType(l.carbonType);
    const matchSearch = l.id.toLowerCase().includes(search.toLowerCase()) || 
                        (l.sellerName && l.sellerName.toLowerCase().includes(search.toLowerCase())) || 
                        formattedType.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || formattedType === filterType;
    return matchSearch && matchType;
  });

  const handlePurchase = async () => {
    try {
      const loadingToast = toast.loading('Initiating secure payment...');
      
      // 1. Create Order
      const { data: orderDetails } = await api.post('/payment/create-order', {
        carbonCreditId: selectedListing.id,
        amount: qty * selectedListing.pricePerTonne,
        quantity: qty
      });

      toast.dismiss(loadingToast);

      // 2. Initialize Razorpay
      const options = {
        key: orderDetails.keyId,
        amount: orderDetails.amount * 100,
        currency: orderDetails.currency,
        name: 'EosCarbon',
        description: `Purchase of ${qty} Carbon Credits`,
        order_id: orderDetails.orderId,
        handler: async function (response) {
          const verifyingToast = toast.loading('Verifying payment...');
          try {
            // 3. Verify Payment
            await api.post('/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            toast.dismiss(verifyingToast);
            toast.success('Payment successful! Carbon credits acquired.', { style: { background: '#10b981', color: '#fff' }});
            
            // Refresh listings
            fetchListings();
            setConfirmPurchase(false);
            setSelectedListing(null);
            setQty(1);
          } catch (err) {
            toast.dismiss(verifyingToast);
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: 'EosCarbon User',
        },
        theme: {
          color: '#10b981'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error('Payment failed: ' + response.error.description);
      });
      rzp.open();

    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to initiate payment.');
    }
  };


  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-econe-dark">Carbon Marketplace</h1>
        <p className="text-gray-500 mt-1">Browse and acquire verified carbon credits.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search by ID, Farmer, or Type..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-econe-emerald/50 focus:border-econe-emerald text-sm shadow-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Filter size={16} className="text-gray-400 self-center" />
          {types.map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filterType === t ? 'bg-econe-dark text-white border-econe-dark' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-20 text-emerald-800 font-bold">Loading marketplace listings...</div>
        ) : filtered.map((listing, i) => (
          <motion.div key={listing.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -5, boxShadow: '0 20px 40px -8px rgba(0,0,0,0.12)' }}
            onClick={() => setSelectedListing(listing)}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm cursor-pointer flex flex-col gap-4 transition-all">
            <div className="flex justify-between items-start">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${typeColors[listing.carbonType] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>{formatType(listing.carbonType)}</span>
              <span className="font-mono text-xs text-gray-400">{listing.id.substring(0,8)}...</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-econe-dark">{listing.carbonAmount} <span className="text-base font-semibold text-gray-400">Tons CO₂</span></h3>
              <p className="text-sm text-gray-500 mt-1 font-medium truncate" title={listing.projectName}>{listing.projectName || 'Carbon Project'}</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">By: {listing.sellerName}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck size={12} className="text-econe-emerald" /> {listing.verificationLevel === 'LEVEL_2_GOV' ? 'Gov. Verified' : 'NGO Verified'} · {listing.ngoName || 'Unknown NGO'}
            </div>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400 font-medium">Price / CC</p>
                <p className="text-lg font-bold text-econe-dark">₹{listing.pricePerTonne}</p>
              </div>
              <button className="bg-econe-emerald hover:bg-econe-forest text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm shadow-econe-emerald/20">
                Buy Now
              </button>
            </div>
          </motion.div>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="col-span-3 text-center py-20 text-gray-400 text-sm">No listings match your search.</div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <Transition appear show={!!selectedListing && !confirmPurchase} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setSelectedListing(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-econe-dark/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
                  {selectedListing && (
                    <>
                      <div className="bg-gradient-to-br from-econe-dark to-[#1f2937] p-8 pb-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-econe-emerald/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                        <button onClick={() => setSelectedListing(null)} className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><X size={18} /></button>
                        <div className="relative z-10">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${typeColors[selectedListing.carbonType] || 'bg-gray-50 text-gray-500'} mb-3 inline-block`}>{formatType(selectedListing.carbonType)}</span>
                          <h2 className="text-3xl font-bold">{selectedListing.carbonAmount} Tons CO₂</h2>
                          <p className="text-gray-400 mt-1 text-sm">by {selectedListing.sellerName} · {selectedListing.projectName}</p>
                        </div>
                      </div>
                      <div className="p-8 space-y-6">
                        <p className="text-gray-600 text-sm leading-relaxed">{selectedListing.projectDescription || 'No description provided.'}</p>
                        
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Verification Chain</h4>
                          <div className="space-y-2">
                            {[
                              { label: 'NGO Verified', value: selectedListing.ngoName || 'Verified by NGO', icon: <CheckCircle size={14} className="text-econe-emerald" /> },
                              selectedListing.verificationLevel === 'LEVEL_2_GOV' ? { label: 'Gov Approved', value: selectedListing.govName || 'Verified by Govt', icon: <ShieldCheck size={14} className="text-blue-500" /> } : null,
                            ].filter(Boolean).map((item, i) => (
                              <div key={i} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                {item.icon}
                                <div>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase">{item.label}</p>
                                  <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Total Cost (1 CC)</p>
                            <p className="text-2xl font-bold text-econe-dark">₹{selectedListing.pricePerTonne}</p>
                          </div>
                          <button onClick={() => setConfirmPurchase(true)} className="bg-econe-emerald hover:bg-econe-forest text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-econe-emerald/20 transition-all">
                            Request Purchase
                          </button>
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

      {/* Purchase Confirmation Modal */}
      <Transition appear show={confirmPurchase} as={Fragment}>
        <Dialog as="div" className="relative z-[110]" onClose={() => setConfirmPurchase(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-econe-dark/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
                  <Dialog.Title as="h3" className="text-xl font-bold text-econe-dark mb-6 flex items-center gap-3">
                    <Star className="text-econe-emerald" size={22} /> Confirm Purchase
                  </Dialog.Title>
                  {selectedListing && (
                    <>
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-6 space-y-2">
                        <p className="text-sm text-gray-500">Credit: <span className="font-bold text-gray-900">{selectedListing.id.substring(0,8)} ({formatType(selectedListing.carbonType)})</span></p>
                        <div className="flex items-center gap-3">
                          <label className="text-sm font-medium text-gray-600 shrink-0">Quantity (CC):</label>
                          <input type="number" min={1} max={selectedListing.carbonAmount} value={qty} onChange={(e) => setQty(parseInt(e.target.value) || 1)} className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-econe-emerald text-center font-bold" />
                        </div>
                        <p className="text-sm text-gray-500 pt-2 border-t border-gray-100">Total: <span className="font-bold text-lg text-econe-dark">₹{(qty * selectedListing.pricePerTonne).toLocaleString()}</span></p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handlePurchase} className="flex-1 bg-econe-emerald hover:bg-econe-forest text-white py-3 rounded-xl font-bold shadow-lg shadow-econe-emerald/20 transition-all">
                          Confirm Purchase
                        </button>
                        <button onClick={() => setConfirmPurchase(false)} className="px-5 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50">
                          Cancel
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
    </div>
  );
};

export default BizMarketplace;
