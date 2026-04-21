import { useState, Fragment, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Leaf, PlusCircle, X, CheckCircle, Clock, AlertCircle, Tag, PackageX, DollarSign, ShieldCheck, ShieldX } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { getUserId } from '../../utils/auth';

const CREDIT_TYPES = [
  { value: 'SOIL_CARBON',        label: 'Soil Carbon',        icon: '🌱', desc: 'Soil sequestration' },
  { value: 'BIOMASS',            label: 'Biomass',            icon: '🌿', desc: 'Biomass carbon' },
  { value: 'AGROFORESTRY',       label: 'Agroforestry',       icon: '🌳', desc: 'Tree-crop systems' },
  { value: 'ORGANIC_FARMING',    label: 'Organic Farming',    icon: '🥬', desc: 'Organic practices' },
  { value: 'CROP_RESIDUE',       label: 'Crop Residue',       icon: '🌾', desc: 'Residue management' },
  { value: 'WATER_CONSERVATION', label: 'Water Conservation', icon: '💧', desc: 'Water stewardship' },
  { value: 'RENEWABLE_ENERGY',   label: 'Renewable Energy',   icon: '☀️', desc: 'Farm energy' },
];

// Maps backend status enum → display config
const creditStatusConfig = {
  PENDING_NGO_VERIFICATION: { label: 'Pending NGO',  bg: 'bg-amber-50 text-amber-700 ring-amber-200',    icon: <Clock size={11} /> },
  PENDING_GOV_VERIFICATION: { label: 'Pending Gov.', bg: 'bg-blue-50 text-blue-700 ring-blue-200',       icon: <Clock size={11} /> },
  ACTIVE:                   { label: 'Active',        bg: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: <ShieldCheck size={11} /> },
  LISTED_FOR_SALE:          { label: 'Listed',        bg: 'bg-indigo-50 text-indigo-700 ring-indigo-200', icon: <Tag size={11} /> },
  NGO_REJECTED:             { label: 'NGO Rejected',  bg: 'bg-rose-50 text-rose-700 ring-rose-200',       icon: <AlertCircle size={11} /> },
  GOV_REJECTED:             { label: 'Gov Rejected',  bg: 'bg-rose-50 text-rose-700 ring-rose-200',       icon: <ShieldX size={11} /> },
  SOLD:                     { label: 'Sold',           bg: 'bg-purple-50 text-purple-700 ring-purple-200', icon: <CheckCircle size={11} /> },
};

const FILTER_TABS = [
  { key: 'All',                   label: 'All' },
  { key: 'PENDING_NGO_VERIFICATION', label: 'Pending NGO' },
  { key: 'PENDING_GOV_VERIFICATION', label: 'Pending Gov.' },
  { key: 'ACTIVE',               label: 'Active' },
  { key: 'LISTED_FOR_SALE',      label: 'Listed' },
  { key: 'NGO_REJECTED',         label: 'Rejected' },
];

const defaultForm = {
  landId: '', carbonAmount: '', carbonCreditType: 'SOIL_CARBON',
  projectName: '', projectDescription: '', methodology: '',
  validityYears: 5, assessmentDate: '', assessmentReportUrl: ''
};

const FloatingInput = ({ label, value, onChange, type = 'text', ...props }) => (
  <div className="relative w-full">
    <input type={type} value={value} onChange={onChange} placeholder=" "
      className="peer block w-full px-4 pb-2.5 pt-6 text-sm text-gray-900 bg-white rounded-xl border border-gray-200 focus:border-[#15803d] focus:ring-[#15803d]/20 appearance-none focus:outline-none focus:ring-4 transition-all" {...props} />
    <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none peer-focus:text-[#15803d]">{label}</label>
  </div>
);

const FarmerCredits = ({ externalOpen, onExternalClose }) => {
  const [isOpen, setIsOpen]           = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [form, setForm]               = useState(defaultForm);
  const [submitting, setSubmitting]   = useState(false);
  const [loading, setLoading]         = useState(true);
  const [credits, setCredits]         = useState([]);
  const [lands, setLands]             = useState([]);
  const [listingCredit, setListingCredit] = useState(null);
  const [listPrice, setListPrice]     = useState('');
  const [listSubmitting, setListSubmitting] = useState(false);

  const handledRef = useRef(false);

  useEffect(() => {
    if (externalOpen && !handledRef.current) {
      handledRef.current = true;
      setTimeout(() => { setIsOpen(true); onExternalClose(); handledRef.current = false; }, 0);
    }
  }, [externalOpen, onExternalClose]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = getUserId();
      const [creditsRes, landsRes] = await Promise.all([
        api.get('/farmer-carbon/my-credits'),
        api.get(`/farmer-land/farmer/${userId}`)
      ]);
      setCredits(creditsRes.data);
      setLands(landsRes.data);
    } catch (error) {
      toast.error('Failed to load portal data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const f = (field) => ({ value: form[field], onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value })) });

  // Filter using actual backend status field
  const filtered = filterStatus === 'All'
    ? credits
    : credits.filter(c => c.status === filterStatus);

  const handleGenerate = async () => {
    if (!form.projectName || !form.carbonAmount || !form.landId) {
      toast.error('Required fields missing.'); return;
    }
    setSubmitting(true);
    try {
      await api.post('/farmer-carbon/create', {
        landId:             form.landId,
        carbonAmount:       parseFloat(form.carbonAmount),
        carbonType:         form.carbonCreditType,     // backend field name
        projectName:        form.projectName,
        projectDescription: form.projectDescription,
        methodology:        form.methodology,
        validityYears:      form.validityYears,
        assessmentDate:     form.assessmentDate || new Date().toISOString(),
        assessmentReport:   form.assessmentReportUrl,
      });
      toast.success('Carbon credit submitted for NGO verification!');
      setIsOpen(false);
      setForm(defaultForm);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Generation failed');
    } finally {
      setSubmitting(false);
    }
  };

  // Real API call for listing
  const handleListForSale = async () => {
    const price = parseFloat(listPrice);
    if (!price || price <= 0) { toast.error('Enter a valid price.'); return; }
    setListSubmitting(true);
    try {
      await api.put('/farmer-carbon/list-for-sale', {
        carbonCreditId: listingCredit.id,
        pricePerTonne:  price,
      });
      toast.success(`Credit listed at ₹${price}/tonne!`);
      setListingCredit(null);
      setListPrice('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to list credit');
    } finally {
      setListSubmitting(false);
    }
  };

  // Real API call for removing from sale
  const handleRemove = async (credit) => {
    try {
      await api.put(`/farmer-carbon/remove-from-sale/${credit.id}`);
      toast.success(`${credit.id} removed from marketplace.`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove listing');
    }
  };

  const verifiedLands = lands.filter(l => l.status === 'VERIFIED');

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">Carbon Credits</h1>
          <p className="text-gray-500 mt-1">All submitted and active carbon sequestration claims.</p>
        </div>
        <button
          onClick={() => { if (verifiedLands.length === 0) { toast.error('You need at least one verified land to create a carbon credit.'); return; } setIsOpen(true); }}
          className="flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-green-700/20 transition-colors"
        >
          <PlusCircle size={17} /> Generate Carbon Credit
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setFilterStatus(key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filterStatus === key ? 'bg-econe-dark text-white border-econe-dark' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Credits Table */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100">
                {['Credit ID', 'Project Name', 'Type', 'Amount (CC)', 'Status', 'Verification', 'Actions'].map(h => (
                  <th key={h} className="p-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                      <p className="text-xs text-emerald-800 font-bold">Fetching credits...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filtered.map((cr, i) => {
                    const sc = creditStatusConfig[cr.status] || creditStatusConfig.PENDING_NGO_VERIFICATION;
                    const typeObj = CREDIT_TYPES.find(t => t.value === cr.carbonType);
                    return (
                      <motion.tr key={cr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-50/50">
                        <td className="p-5 font-mono text-[#15803d] text-sm font-medium">{cr.id}</td>
                        <td className="p-5 font-semibold text-gray-900 text-sm max-w-[180px] truncate">{cr.projectName}</td>
                        <td className="p-5 text-sm">
                          <span className="flex items-center gap-1.5 text-gray-600">{typeObj?.icon} {typeObj?.label || cr.carbonType}</span>
                        </td>
                        <td className="p-5 font-bold text-gray-900">{cr.carbonAmount}</td>
                        <td className="p-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${sc.bg}`}>{sc.icon} {sc.label}</span>
                        </td>
                        <td className="p-5 text-xs font-semibold text-gray-500">{cr.verificationLevel || 'NONE'}</td>
                        <td className="p-5">
                          {cr.status === 'ACTIVE' && (
                            <button onClick={() => { setListingCredit(cr); setListPrice(''); }}
                              className="text-xs font-bold text-[#15803d] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                              <DollarSign size={13} /> List for Sale
                            </button>
                          )}
                          {cr.status === 'LISTED_FOR_SALE' && (
                            <button onClick={() => handleRemove(cr)}
                              className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                              <PackageX size={13} /> Remove
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan="7" className="p-12 text-center text-gray-400">No credits found for this filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Credit Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setIsOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-econe-dark/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-2xl bg-[#f8fafc] rounded-[2rem] shadow-2xl overflow-hidden">
                  <div className="bg-white px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                    <Dialog.Title as="h3" className="text-xl font-bold text-econe-dark flex items-center gap-3">
                      <Leaf className="text-[#15803d]" size={22} /> Generate Carbon Credit
                    </Dialog.Title>
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400"><X size={18} /></button>
                  </div>

                  <div className="p-8 space-y-8 max-h-[75vh] overflow-y-auto">

                    {/* Land Selection — only verified lands */}
                    <section>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Verified Land</h4>
                      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                        {verifiedLands.length === 0 ? (
                          <p className="text-sm text-rose-500 font-semibold text-center py-2">⚠️ No verified lands available. Please get your land verified by an NGO first.</p>
                        ) : (
                          <select value={form.landId} onChange={e => setForm(p => ({...p, landId: e.target.value}))}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#15803d]">
                            <option value="">Select a verified land parcel...</option>
                            {verifiedLands.map(l => (
                              <option key={l.id} value={l.id}>{l.landAddress} ({l.landArea} Acres)</option>
                            ))}
                          </select>
                        )}
                        <p className="text-xs text-gray-400 mt-2">Only NGO-verified lands are eligible for carbon credit registration.</p>
                      </div>
                    </section>

                    {/* Credit Type Tiles */}
                    <section>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Carbon Credit Type</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {CREDIT_TYPES.map(ct => (
                          <button key={ct.value} type="button" onClick={() => setForm(p => ({...p, carbonCreditType: ct.value}))}
                            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${form.carbonCreditType === ct.value ? 'border-[#15803d] bg-[#15803d]/5 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-300'}`}>
                            <span className="text-2xl">{ct.icon}</span>
                            <span className={`text-xs font-bold ${form.carbonCreditType === ct.value ? 'text-[#15803d]' : 'text-gray-700'}`}>{ct.label}</span>
                          </button>
                        ))}
                      </div>
                    </section>

                    {/* Project Details */}
                    <section>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Project Details</h4>
                      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FloatingInput label="Project Name *" {...f('projectName')} />
                          <FloatingInput label="Carbon Amount (Tons CO₂) *" type="number" {...f('carbonAmount')} />
                        </div>
                        <textarea value={form.projectDescription} onChange={e => setForm(p => ({...p, projectDescription: e.target.value}))}
                          placeholder="Project Description..." rows={3}
                          className="w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-xl border border-gray-200 focus:border-[#15803d] focus:ring-[#15803d]/20 focus:outline-none focus:ring-4 transition-all" />
                        <FloatingInput label="Methodology" {...f('methodology')} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1.5">Validity (Years)</label>
                            <input type="number" min={1} max={10} value={form.validityYears} onChange={e => setForm(p => ({...p, validityYears: parseInt(e.target.value)}))}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#15803d] font-bold text-center" />
                          </div>
                          <FloatingInput label="Assessment Date" type="date" {...f('assessmentDate')} />
                          <FloatingInput label="Report URL (Optional)" {...f('assessmentReportUrl')} />
                        </div>
                      </div>
                    </section>
                  </div>

                  <div className="bg-white px-8 py-5 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0">
                    <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50">Cancel</button>
                    <button onClick={handleGenerate} disabled={submitting || verifiedLands.length === 0}
                      className="px-7 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl font-bold shadow-lg shadow-green-700/20 disabled:opacity-70 disabled:cursor-wait min-w-[160px] flex justify-center">
                      {submitting ? 'Submitting…' : 'Generate Credit'}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* List for Sale Modal */}
      <Transition appear show={!!listingCredit} as={Fragment}>
        <Dialog as="div" className="relative z-[110]" onClose={() => setListingCredit(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-econe-dark/60 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-econe-dark flex items-center gap-3"><Tag className="text-[#15803d]" /> List for Sale</h3>
                    <button onClick={() => setListingCredit(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-full"><X size={17} /></button>
                  </div>
                  {listingCredit && (
                    <div className="space-y-5">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm space-y-1">
                        <p className="text-gray-500">Credit: <span className="font-bold text-gray-900">{listingCredit.id}</span></p>
                        <p className="text-gray-500">Project: <span className="font-bold text-gray-900">{listingCredit.projectName}</span></p>
                        <p className="text-gray-500">Amount: <span className="font-bold text-gray-900">{listingCredit.carbonAmount} CC</span></p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Sale Price (₹ per tonne CO₂)</label>
                        <input type="number" min={1} value={listPrice} onChange={e => setListPrice(e.target.value)} placeholder="e.g. 1200"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/50 focus:border-[#15803d] font-bold" />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handleListForSale} disabled={listSubmitting} className="flex-1 bg-[#15803d] hover:bg-[#166534] text-white py-3 rounded-xl font-bold shadow-lg shadow-green-700/20 disabled:opacity-60">
                          {listSubmitting ? 'Listing…' : 'List Now'}
                        </button>
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

export default FarmerCredits;
