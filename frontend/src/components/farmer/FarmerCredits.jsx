import { useState, Fragment, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { Leaf, PlusCircle, X, CheckCircle, Clock, AlertCircle, Tag, PackageX, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const mockVerifiedLands = [
  { id: 'LND-01', landAddress: 'Khasra 441, Rampur' },
];

const CREDIT_TYPES = [
  { value: 'SOIL_CARBON', label: 'Soil Carbon', icon: '🌱', desc: 'Soil sequestration' },
  { value: 'BIOMASS', label: 'Biomass', icon: '🌿', desc: 'Biomass carbon' },
  { value: 'AGROFORESTRY', label: 'Agroforestry', icon: '🌳', desc: 'Tree-crop systems' },
  { value: 'ORGANIC_FARMING', label: 'Organic Farming', icon: '🥬', desc: 'Organic practices' },
  { value: 'CROP_RESIDUE', label: 'Crop Residue', icon: '🌾', desc: 'Residue management' },
  { value: 'WATER_CONSERVATION', label: 'Water Conservation', icon: '💧', desc: 'Water stewardship' },
  { value: 'RENEWABLE_ENERGY', label: 'Renewable Energy', icon: '☀️', desc: 'Farm energy' },
];

const creditStatusConfig = {
  PENDING: { label: 'Pending', bg: 'bg-amber-50 text-amber-700 ring-amber-200', icon: <Clock size={11} /> },
  VERIFIED: { label: 'Verified', bg: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: <CheckCircle size={11} /> },
  REJECTED: { label: 'Rejected', bg: 'bg-rose-50 text-rose-700 ring-rose-200', icon: <AlertCircle size={11} /> },
  LISTED: { label: 'Listed', bg: 'bg-blue-50 text-blue-700 ring-blue-200', icon: <Tag size={11} /> },
  SOLD: { label: 'Sold', bg: 'bg-purple-50 text-purple-700 ring-purple-200', icon: <CheckCircle size={11} /> },
};

const mockCredits = [
  { id: 'CR-41', projectName: 'Rampur Soil Initiative', carbonCreditType: 'SOIL_CARBON', carbonAmount: 320, validityYears: 5, creditStatus: 'VERIFIED', listedForSale: false, landId: 'LND-01' },
  { id: 'CR-42', projectName: 'Nashik Tree Grid', carbonCreditType: 'AGROFORESTRY', carbonAmount: 500, validityYears: 10, creditStatus: 'PENDING', listedForSale: false, landId: 'LND-02' },
  { id: 'CR-43', projectName: 'Anand Biochar Initiative', carbonCreditType: 'BIOMASS', carbonAmount: 180, validityYears: 3, creditStatus: 'LISTED', listedForSale: true, listPrice: 1150, landId: 'LND-01' },
];

const defaultForm = { landId: 'LND-01', carbonAmount: '', carbonCreditType: 'SOIL_CARBON', projectName: '', projectDescription: '', methodology: '', validityYears: 5, assessmentDate: '', assessmentReportUrl: '' };

const FloatingInput = ({ label, value, onChange, type = 'text', ...props }) => (
  <div className="relative w-full">
    <input type={type} value={value} onChange={onChange} placeholder=" "
      className="peer block w-full px-4 pb-2.5 pt-6 text-sm text-gray-900 bg-white rounded-xl border border-gray-200 focus:border-[#15803d] focus:ring-[#15803d]/20 appearance-none focus:outline-none focus:ring-4 transition-all" {...props} />
    <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none peer-focus:text-[#15803d]">{label}</label>
  </div>
);

const FarmerCredits = ({ externalOpen, onExternalClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [credits, setCredits] = useState(mockCredits);
  const [listingCredit, setListingCredit] = useState(null);
  const [listPrice, setListPrice] = useState('');

  const handledRef = useRef(false);

  useEffect(() => {
    if (externalOpen && !handledRef.current) {
      handledRef.current = true;
      setTimeout(() => { setIsOpen(true); onExternalClose(); handledRef.current = false; }, 0);
    }
  }, [externalOpen, onExternalClose]);

  const f = (field) => ({ value: form[field], onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value })) });

  const filtered = filterStatus === 'All' ? credits : credits.filter(c => c.creditStatus === filterStatus);

  const handleGenerate = async () => {
    if (!form.projectName || !form.carbonAmount) { toast.error('Project name and carbon amount are required.'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    const newCredit = { id: `CR-${50 + credits.length}`, ...form, carbonAmount: parseFloat(form.carbonAmount), creditStatus: 'PENDING', listedForSale: false };
    setCredits(p => [newCredit, ...p]);
    toast.success('Carbon credit submitted for NGO verification!');
    setSubmitting(false);
    setIsOpen(false);
    setForm(defaultForm);
  };

  const handleListForSale = () => {
    const price = parseInt(listPrice);
    if (!price || price <= 0) { toast.error('Enter a valid price.'); return; }
    setCredits(prev => prev.map(c => c.id === listingCredit.id ? { ...c, listedForSale: true, creditStatus: 'LISTED', listPrice: price } : c));
    toast.success(`${listingCredit.id} listed at ₹${price}/CC`);
    setListingCredit(null);
    setListPrice('');
  };

  const handleRemove = (credit) => {
    setCredits(prev => prev.map(c => c.id === credit.id ? { ...c, listedForSale: false, creditStatus: 'VERIFIED', listPrice: undefined } : c));
    toast.success(`${credit.id} removed from marketplace.`);
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">Carbon Credits</h1>
          <p className="text-gray-500 mt-1">All submitted and active carbon sequestration claims.</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-green-700/20 transition-colors">
          <PlusCircle size={17} /> Generate Carbon Credit
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', 'PENDING', 'VERIFIED', 'LISTED', 'REJECTED', 'SOLD'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filterStatus === s ? 'bg-econe-dark text-white border-econe-dark' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            {s === 'All' ? 'All' : (creditStatusConfig[s]?.label || s)}
          </button>
        ))}
      </div>

      {/* Credits Table */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100">
                {['Credit ID', 'Project Name', 'Type', 'Amount (CC)', 'Validity', 'Status', 'Actions'].map(h => (
                  <th key={h} className="p-5 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence>
                {filtered.map((cr, i) => {
                  const sc = creditStatusConfig[cr.creditStatus] || creditStatusConfig.PENDING;
                  const typeObj = CREDIT_TYPES.find(t => t.value === cr.carbonCreditType);
                  return (
                    <motion.tr key={cr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }} className="hover:bg-gray-50/50">
                      <td className="p-5 font-mono text-[#15803d] text-sm font-medium">{cr.id}</td>
                      <td className="p-5 font-semibold text-gray-900 text-sm max-w-[180px] truncate">{cr.projectName}</td>
                      <td className="p-5 text-sm">
                        <span className="flex items-center gap-1.5 text-gray-600">{typeObj?.icon} {typeObj?.label || cr.carbonCreditType}</span>
                      </td>
                      <td className="p-5 font-bold text-gray-900">{cr.carbonAmount}</td>
                      <td className="p-5 text-gray-500 text-sm">{cr.validityYears} yrs</td>
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ${sc.bg}`}>{sc.icon} {sc.label}</span>
                      </td>
                      <td className="p-5">
                        {cr.creditStatus === 'VERIFIED' && !cr.listedForSale && (
                          <button onClick={() => { setListingCredit(cr); setListPrice(''); }} className="text-xs font-bold text-[#15803d] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                            <DollarSign size={13} /> List
                          </button>
                        )}
                        {cr.creditStatus === 'LISTED' && (
                          <button onClick={() => handleRemove(cr)} className="text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                            <PackageX size={13} /> Remove
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && (
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

                    {/* Land Selection */}
                    <section>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Verified Land</h4>
                      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                        <select value={form.landId} onChange={e => setForm(p => ({...p, landId: e.target.value}))}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#15803d]">
                          {mockVerifiedLands.map(l => <option key={l.id} value={l.id}>{l.id} — {l.landAddress}</option>)}
                        </select>
                        <p className="text-xs text-gray-400 mt-2">Only verified lands are selectable.</p>
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

                    {/* Details */}
                    <section>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Project Details</h4>
                      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FloatingInput label="Project Name *" {...f('projectName')} />
                          <FloatingInput label="Carbon Amount (Tons CO₂) *" type="number" {...f('carbonAmount')} />
                        </div>
                        <div className="relative">
                          <textarea value={form.projectDescription} onChange={e => setForm(p => ({...p, projectDescription: e.target.value}))}
                            placeholder="Project Description..." rows={3}
                            className="w-full px-4 py-3 text-sm text-gray-900 bg-white rounded-xl border border-gray-200 focus:border-[#15803d] focus:ring-[#15803d]/20 focus:outline-none focus:ring-4 transition-all" />
                        </div>
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
                    <button onClick={handleGenerate} disabled={submitting}
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
                        <p className="text-gray-500">Amount: <span className="font-bold text-gray-900">{listingCredit.carbonAmount} CC</span></p>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Sale Price (₹ per CC)</label>
                        <input type="number" min={1} value={listPrice} onChange={e => setListPrice(e.target.value)} placeholder="e.g. 1200"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#15803d]/50 focus:border-[#15803d] font-bold" />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handleListForSale} className="flex-1 bg-[#15803d] hover:bg-[#166534] text-white py-3 rounded-xl font-bold shadow-lg shadow-green-700/20">List Now</button>
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
