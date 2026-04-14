import { useState, useEffect, useRef, Fragment } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import {
  Leaf, ShieldCheck, TrendingUp, Search, Filter, X,
  Clock, CheckCircle, AlertCircle, Star, BarChart2, SlidersHorizontal
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ─── Mock Data ─────────────────────────────────────────────────────────── */
const mockStats = {
  totalCredits: 1248,
  totalCarbonAmount: 284560,
  averagePrice: 1142,
  minPrice: 760,
  maxPrice: 2300,
};

const mockListings = [
  { id: 'MC-201', carbonType: 'SOIL_CARBON', carbonAmount: 500, pricePerTonne: 1200, totalValue: 600000, sellerName: 'EcoGrow Partners', landAddress: 'Khasra 441, Rampur, UP', verificationLevel: 'NGO + Government', validUntil: '2028-12-31', listedAt: '2026-04-12', description: 'Verified deep-soil carbon from 2000-acre no-till regenerative farmland. Third-party satellite imagery confirmed.' },
  { id: 'MC-202', carbonType: 'AGROFORESTRY', carbonAmount: 1200, pricePerTonne: 980, totalValue: 1176000, sellerName: 'Sunny Farms Co.', landAddress: 'Survey No. 88, Nashik, MH', verificationLevel: 'NGO + Government', validUntil: '2030-06-30', listedAt: '2026-04-11', description: 'Afforestation project credit pool from Northern Highland plantations. 15-year permanence guaranteed.' },
  { id: 'MC-203', carbonType: 'BIOCHAR', carbonAmount: 300, pricePerTonne: 1550, totalValue: 465000, sellerName: 'AgroVital Init', landAddress: 'Plot 14, Anand, Gujarat', verificationLevel: 'NGO Only', validUntil: '2029-03-15', listedAt: '2026-04-10', description: '200+ year structural biochar permanence via pyrolysis. High co-benefits: water retention and soil health.' },
  { id: 'MC-204', carbonType: 'BIOMASS', carbonAmount: 800, pricePerTonne: 860, totalValue: 688000, sellerName: 'Green Valley Init', landAddress: 'Sector 9, Bhopal, MP', verificationLevel: 'NGO + Government', validUntil: '2027-09-20', listedAt: '2026-04-09', description: 'Agro-residue energy biomass credits from certified processing units.' },
  { id: 'MC-205', carbonType: 'WATER_CONSERVATION', carbonAmount: 400, pricePerTonne: 2100, totalValue: 840000, sellerName: 'WetLand Corps', landAddress: 'Bengal Delta Zone, WB', verificationLevel: 'NGO + Government', validUntil: '2031-01-01', listedAt: '2026-04-08', description: 'Rare wetland restoration offsets from the protected Bengal delta ecosystem.' },
  { id: 'MC-206', carbonType: 'RENEWABLE_ENERGY', carbonAmount: 700, pricePerTonne: 1100, totalValue: 770000, sellerName: 'FarmFresh Org', landAddress: 'Taluka Baramati, Pune', verificationLevel: 'NGO + Government', validUntil: '2028-05-15', listedAt: '2026-04-07', description: 'Farm-scale solar + biogas renewable energy credits with satellite-verified generation logs.' },
  { id: 'MC-207', carbonType: 'ORGANIC_FARMING', carbonAmount: 250, pricePerTonne: 1350, totalValue: 337500, sellerName: 'Sarathi Farms', landAddress: 'Wardha, Maharashtra', verificationLevel: 'NGO Only', validUntil: '2029-07-31', listedAt: '2026-04-06', description: 'Phase-transition organic farming credits validated via NPOP certified methodology.' },
  { id: 'MC-208', carbonType: 'CROP_RESIDUE', carbonAmount: 600, pricePerTonne: 760, totalValue: 456000, sellerName: 'Punjab Agri Collective', landAddress: 'Ludhiana, Punjab', verificationLevel: 'NGO + Government', validUntil: '2027-11-30', listedAt: '2026-04-05', description: 'Paddy residue avoided-burning credits with real-time IoT burn-prevention monitoring.' },
];

/* ─── Config ─────────────────────────────────────────────────────────────── */
const TYPE_CONFIG = {
  SOIL_CARBON:        { label: 'Soil Carbon',        color: 'bg-amber-50 text-amber-700 border-amber-200',   icon: '🌱' },
  AGROFORESTRY:       { label: 'Agroforestry',        color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '🌳' },
  BIOCHAR:            { label: 'Biochar',             color: 'bg-orange-50 text-orange-700 border-orange-200', icon: '🔥' },
  BIOMASS:            { label: 'Biomass',             color: 'bg-blue-50 text-blue-700 border-blue-200',      icon: '🌿' },
  WATER_CONSERVATION: { label: 'Water Conservation',  color: 'bg-cyan-50 text-cyan-700 border-cyan-200',      icon: '💧' },
  RENEWABLE_ENERGY:   { label: 'Renewable Energy',   color: 'bg-purple-50 text-purple-700 border-purple-200',icon: '☀️' },
  ORGANIC_FARMING:    { label: 'Organic Farming',     color: 'bg-lime-50 text-lime-700 border-lime-200',      icon: '🥬' },
  CROP_RESIDUE:       { label: 'Crop Residue',        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',icon: '🌾' },
};

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc',label: 'Price: High to Low' },
];

const DAYS_AGO = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  return diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : `${diff} days ago`;
};

/* ─── Count-Up Hook ──────────────────────────────────────────────────────── */
const useCountUp = (target, duration = 1400) => {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);
  useEffect(() => {
    if (target === 0) return;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(ease * target));
      if (p < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);
  return value;
};

/* ─── Skeleton Card ─────────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse flex flex-col gap-4">
    <div className="flex justify-between"><div className="h-6 w-28 bg-gray-100 rounded-full" /><div className="h-4 w-16 bg-gray-100 rounded" /></div>
    <div className="h-9 w-3/4 bg-gray-100 rounded-xl" />
    <div className="h-4 w-1/2 bg-gray-100 rounded" />
    <div className="grid grid-cols-2 gap-3">
      <div className="h-16 bg-gray-50 rounded-xl" /><div className="h-16 bg-gray-50 rounded-xl" />
    </div>
    <div className="h-10 bg-gray-100 rounded-xl mt-auto" />
  </div>
);

/* ─── Stat Card ─────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, prefix = '', suffix = '', icon }) => {
  const animated = useCountUp(value);
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col gap-2 flex-1 min-w-[140px]">
      <div className="flex items-center gap-2 text-gray-400">{icon}<span className="text-xs font-bold uppercase tracking-widest">{label}</span></div>
      <p className="text-2xl xl:text-3xl font-bold text-econe-dark">{prefix}{animated.toLocaleString()}{suffix}</p>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════════════════ */
const SharedMarketplace = ({ userRole = 'FARMER' }) => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selected, setSelected] = useState(null);
  const [confirmBuy, setConfirmBuy] = useState(false);
  const [qty, setQty] = useState(1);

  // Simulate API load
  useEffect(() => {
    const t = setTimeout(() => { setListings(mockListings); setLoading(false); }, 900);
    return () => clearTimeout(t);
  }, []);

  // Filter + Sort
  const displayed = listings
    .filter(l => {
      const matchSearch = search === '' ||
        l.sellerName.toLowerCase().includes(search.toLowerCase()) ||
        l.landAddress.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === 'All' || l.carbonType === filterType;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc')  return a.pricePerTonne - b.pricePerTonne;
      if (sortBy === 'price_desc') return b.pricePerTonne - a.pricePerTonne;
      return new Date(b.listedAt) - new Date(a.listedAt);
    });

  const handleBuy = () => {
    // API: POST /api/businessman-transaction/request-purchase
    toast.success(`Purchase request for ${qty} CC of ${selected.id} submitted!`);
    setConfirmBuy(false);
    setSelected(null);
    setQty(1);
  };

  const containerV = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
  const cardV      = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 26 } } };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#052e16] to-[#14532d] pt-10 pb-16 px-6 sm:px-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-econe-emerald/10 blur-3xl -mr-24 -mt-24" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#22c55e]/10 blur-3xl -ml-16 -mb-16" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-green-300 text-xs font-bold font-mono tracking-wider mb-4">
              <Leaf size={12} /> LIVE CARBON MARKET
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white font-sora">Carbon Marketplace</h1>
            <p className="text-green-200/70 mt-2 text-sm max-w-lg">Browse, discover, and acquire verified carbon credits from certified Indian farmers.</p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div variants={containerV} initial="hidden" animate="show"
            className="flex flex-wrap gap-4 mt-8">
            <StatCard label="Credits Available"   value={mockStats.totalCredits}      icon={<Leaf size={14} />} />
            <StatCard label="Total CO₂ (Tons)"    value={mockStats.totalCarbonAmount} icon={<BarChart2 size={14} />} suffix=" T" />
            <StatCard label="Avg Price / Tonne"   value={mockStats.averagePrice}      icon={<TrendingUp size={14} />} prefix="₹" />
            <StatCard label="Min Price"           value={mockStats.minPrice}          icon={<TrendingUp size={14} />} prefix="₹" />
            <StatCard label="Max Price"           value={mockStats.maxPrice}          icon={<TrendingUp size={14} />} prefix="₹" />
          </motion.div>
        </div>
      </div>

      {/* ── Filter Bar ───────────────────────────────────────────────────── */}
      <div className="sticky top-16 sm:top-20 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row gap-3 items-start md:items-center">
          {/* Search */}
          <div className="relative flex-1 w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search seller or location..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-econe-emerald/50 focus:border-econe-emerald transition-all" />
          </div>

          {/* Type Filter */}
          <div className="relative flex items-center gap-1.5">
            <Filter size={15} className="text-gray-400 shrink-0" />
            <div className="flex gap-1.5 flex-wrap">
              {['All', ...Object.keys(TYPE_CONFIG)].slice(0, 6).map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filterType === t ? 'bg-econe-dark text-white border-econe-dark' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                  {t === 'All' ? 'All Types' : (TYPE_CONFIG[t]?.label || t)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 md:ml-auto">
            <SlidersHorizontal size={15} className="text-gray-400 shrink-0" />
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 text-sm text-gray-700 font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-econe-emerald">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{displayed.length} results</span>
          </div>
        </div>
      </div>

      {/* ── Listings Grid ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array(6).fill(null).map((_, i) => <SkeletonCard key={i} />)}
            </motion.div>
          ) : (
            <motion.div key="grid" variants={containerV} initial="hidden" animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayed.map(listing => {
                const tc = TYPE_CONFIG[listing.carbonType] || {};
                return (
                  <motion.div key={listing.id} variants={cardV}
                    whileHover={{ y: -5, boxShadow: '0 24px 48px -8px rgba(0,0,0,0.12)' }}
                    onClick={() => { setSelected(listing); setQty(1); }}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4 cursor-pointer transition-all group">

                    {/* Type badge + ID */}
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${tc.color}`}>
                        {tc.icon} {tc.label}
                      </span>
                      <span className="font-mono text-xs text-gray-400">{listing.id}</span>
                    </div>

                    {/* Amount */}
                    <div>
                      <h3 className="text-3xl font-bold text-econe-dark leading-none">{listing.carbonAmount.toLocaleString()}</h3>
                      <p className="text-sm text-gray-400 font-medium mt-0.5">Tons CO₂ Equivalent</p>
                    </div>

                    {/* Seller */}
                    <div>
                      <p className="text-sm font-bold text-gray-900">{listing.sellerName}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{listing.landAddress}</p>
                    </div>

                    {/* Price info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Price / Tonne</p>
                        <p className="font-bold text-econe-dark">₹{listing.pricePerTonne.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Total Value</p>
                        <p className="font-bold text-econe-dark">₹{(listing.totalValue / 100000).toFixed(1)}L</p>
                      </div>
                    </div>

                    {/* Trust + Listed time */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <ShieldCheck size={13} className={listing.verificationLevel.includes('Government') ? 'text-blue-500' : 'text-econe-emerald'} />
                        <span className="font-semibold">{listing.verificationLevel}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock size={12} /> {DAYS_AGO(listing.listedAt)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              {displayed.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-3 text-center py-24 text-gray-400">
                  <Leaf size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-semibold">No listings match your filters.</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      <Transition appear show={!!selected && !confirmBuy} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setSelected(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-econe-dark/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end sm:items-center justify-center sm:p-4">
              <Transition.Child as={Fragment}
                enter="ease-out duration-300" enterFrom="opacity-0 translate-y-8 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-8 sm:scale-95">
                <Dialog.Panel className="w-full sm:max-w-2xl bg-white sm:rounded-[2rem] rounded-t-[2rem] shadow-2xl overflow-hidden">
                  {selected && (() => {
                    const tc = TYPE_CONFIG[selected.carbonType] || {};
                    const isBiz = userRole === 'BUSINESSMAN';
                    return (
                      <>
                        {/* Dark header */}
                        <div className="bg-gradient-to-br from-[#052e16] to-[#14532d] px-8 pt-8 pb-6 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-48 h-48 bg-econe-emerald/10 blur-3xl -mr-10 -mt-10" />
                          <button onClick={() => setSelected(null)} className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"><X size={18} /></button>
                          <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${tc.color}`}>{tc.icon} {tc.label}</span>
                              <span className="font-mono text-xs text-green-300">{selected.id}</span>
                            </div>
                            <h2 className="text-4xl font-bold">{selected.carbonAmount.toLocaleString()} <span className="text-xl font-medium text-green-300">Tons CO₂</span></h2>
                            <p className="text-green-200/70 text-sm mt-1">by {selected.sellerName}</p>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                          <p className="text-gray-600 text-sm leading-relaxed">{selected.description}</p>

                          {/* Price grid */}
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: 'Price / Tonne', val: `₹${selected.pricePerTonne.toLocaleString()}` },
                              { label: 'Total Value', val: `₹${selected.totalValue.toLocaleString()}` },
                              { label: 'Valid Until', val: selected.validUntil },
                            ].map(item => (
                              <div key={item.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">{item.label}</p>
                                <p className="font-bold text-gray-900 text-sm">{item.val}</p>
                              </div>
                            ))}
                          </div>

                          {/* Location + Listed */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Land Address</p>
                              <p className="font-semibold text-gray-900 text-sm">{selected.landAddress}</p>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Listed</p>
                              <p className="font-semibold text-gray-900 text-sm">{DAYS_AGO(selected.listedAt)}</p>
                            </div>
                          </div>

                          {/* Verification Chain */}
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Verification Chain</p>
                            <div className="space-y-2">
                              {selected.verificationLevel.includes('NGO') && (
                                <div className="flex items-center gap-3 bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
                                  <CheckCircle size={16} className="text-econe-emerald shrink-0" />
                                  <div><p className="text-[10px] text-gray-500 font-bold uppercase">NGO Verified</p><p className="text-sm font-semibold text-gray-900">Level 1 Audit Complete</p></div>
                                </div>
                              )}
                              {selected.verificationLevel.includes('Government') && (
                                <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                                  <ShieldCheck size={16} className="text-blue-500 shrink-0" />
                                  <div><p className="text-[10px] text-gray-500 font-bold uppercase">Government Approved</p><p className="text-sm font-semibold text-gray-900">MoEF Regulatory Sign-off</p></div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Footer */}
                        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50">
                          {isBiz ? (
                            <button onClick={() => setConfirmBuy(true)}
                              className="w-full py-4 bg-econe-emerald hover:bg-econe-forest text-white rounded-2xl font-bold text-base shadow-lg shadow-econe-emerald/25 flex items-center justify-center gap-2 transition-all">
                              <Star size={18} /> Buy Now
                            </button>
                          ) : userRole === 'GUEST' ? (
                            <div className="space-y-3">
                              <div className="w-full py-3 bg-gray-100 text-gray-400 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border border-gray-200 cursor-default">
                                <AlertCircle size={16} /> Sign in to purchase credits
                              </div>
                              <p className="text-center text-xs text-gray-400">Create a Businessman account to buy carbon credits on EosCarbon.</p>
                            </div>
                          ) : (
                            <div className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-gray-200">
                              <AlertCircle size={16} /> For Purchase: Businessman Accounts Only
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* ── Purchase Confirmation Modal ───────────────────────────────────── */}
      <Transition appear show={confirmBuy} as={Fragment}>
        <Dialog as="div" className="relative z-[110]" onClose={() => setConfirmBuy(false)}>
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
                  {selected && (
                    <div className="space-y-5">
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2 text-sm">
                        <p className="text-gray-500">Credit: <span className="font-bold text-gray-900">{selected.id} ({TYPE_CONFIG[selected.carbonType]?.label})</span></p>
                        <div className="flex items-center gap-3">
                          <label className="text-gray-500 shrink-0">Quantity (CC):</label>
                          <input type="number" min={1} max={selected.carbonAmount} value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-center focus:outline-none focus:border-econe-emerald" />
                        </div>
                        <p className="text-gray-500 pt-2 border-t border-gray-100">Total: <span className="font-bold text-lg text-econe-dark">₹{(qty * selected.pricePerTonne).toLocaleString()}</span></p>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handleBuy} className="flex-1 bg-econe-emerald hover:bg-econe-forest text-white py-3 rounded-xl font-bold shadow-lg shadow-econe-emerald/20 transition-all">Confirm Purchase</button>
                        <button onClick={() => setConfirmBuy(false)} className="px-5 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50">Cancel</button>
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

export default SharedMarketplace;
