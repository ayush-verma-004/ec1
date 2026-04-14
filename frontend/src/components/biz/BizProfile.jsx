import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

const FloatingInput = ({ label, value, onChange, disabled, type = 'text', hint, error, ...props }) => (
  <div className="relative w-full">
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder=" "
      className={`peer block w-full px-4 pb-2.5 pt-6 text-sm rounded-xl border appearance-none focus:outline-none focus:ring-4 transition-all ${
        disabled
          ? 'text-gray-500 bg-gray-50 border-gray-100 cursor-default'
          : error
          ? 'text-gray-900 bg-white border-red-300 focus:border-red-500 focus:ring-red-500/20'
          : 'text-gray-900 bg-white border-gray-200 focus:border-econe-emerald focus:ring-econe-emerald/20'
      }`}
      {...props}
    />
    <label className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 pointer-events-none peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 ${
      disabled ? 'text-gray-400' : error ? 'text-red-500 peer-focus:text-red-500' : 'text-gray-500 peer-focus:text-econe-emerald'
    }`}>{label}</label>
    {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    {!error && hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
);

const mockProfile = {
  fullName: 'Rajiv Mehta',
  phoneNumber: '9876543210',
  companyName: 'IndusTrade Corporation',
  gstNumber: '29ABCDE1234F1Z5',
  panNumber: 'ABCDE1234F',
  bankAccountNumber: '0041010001234',
  ifscCode: 'HDFC0000041',
  addressLine1: '12 Commerce Avenue',
  addressLine2: 'Tower B, 5th Floor',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560001',
  businessType: 'Manufacturing',
  interestedCommodities: ['Soil Carbon', 'Forestry'],
};

const businessTypes = ['Manufacturing', 'Technology', 'Agriculture', 'Energy', 'Logistics', 'Finance', 'Retail', 'Other'];

const BizProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(mockProfile);
  const [errors, setErrors] = useState({});
  const [commodityInput, setCommodityInput] = useState('');

  const f = (field) => ({
    value: form[field],
    onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value })),
    disabled: !isEditing,
    error: errors[field],
  });

  const validate = () => {
    const e = {};
    if (!form.phoneNumber.match(/^\d{10}$/)) e.phoneNumber = '10 digits required';
    if (!form.gstNumber.match(/^\d{2}[A-Z]{5}\d{4}[A-Z]\d[Z][A-Z\d]$/)) e.gstNumber = 'Invalid GST format';
    if (!form.panNumber.match(/^[A-Z]{5}\d{4}[A-Z]$/)) e.panNumber = 'Invalid PAN format (e.g. ABCDE1234F)';
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = '6 digits required';
    if (!form.ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) e.ifscCode = 'Invalid IFSC format';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) { toast.error('Please fix validation errors.'); return; }
    await new Promise(r => setTimeout(r, 700));
    // API: PUT /api/businessman-profile/update-businessman
    toast.success('Business profile updated successfully!', { style: { background: '#022c22', color: '#fff' }, iconTheme: { primary: '#10b981', secondary: '#fff' } });
    setIsEditing(false);
  };

  const addCommodity = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = commodityInput.trim();
      if (val && !form.interestedCommodities.includes(val)) {
        setForm(p => ({ ...p, interestedCommodities: [...p.interestedCommodities, val] }));
      }
      setCommodityInput('');
    }
  };
  const removeCommodity = (idx) => isEditing && setForm(p => ({ ...p, interestedCommodities: p.interestedCommodities.filter((_, i) => i !== idx) }));

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">Business Profile</h1>
          <p className="text-gray-500 mt-1">Manage your company details, legal identity, and preferences.</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
            <Edit3 size={17} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => { setIsEditing(false); setErrors({}); }} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-econe-emerald hover:bg-econe-forest text-white rounded-xl font-bold shadow-lg shadow-econe-emerald/25 transition-all">
              <Save size={17} /> Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left — Identity Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <div className="bg-gradient-to-br from-econe-dark to-[#1f2937] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-5 p-6 pointer-events-none"><Briefcase size={120} strokeWidth={0.8} /></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-econe-forest to-econe-emerald flex items-center justify-center shadow-lg">
                <Briefcase size={40} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-sora mt-1">{form.companyName || '—'}</h3>
                <p className="text-gray-400 text-sm mt-1">{form.fullName}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-econe-emerald/20 text-econe-emerald text-[10px] font-bold uppercase tracking-widest rounded-full mt-2">
                  Corporate Buyer
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-8 space-y-3 border-t border-white/10 pt-6 text-sm">
              {[
                { label: 'GST', val: form.gstNumber },
                { label: 'PAN', val: form.panNumber },
                { label: 'IFSC', val: form.ifscCode },
                { label: 'City', val: `${form.city}, ${form.state}` },
              ].map(item => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-gray-400">{item.label}:</span>
                  <span className="font-mono truncate max-w-[140px]" title={item.val}>{item.val || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right — Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">

            {/* Personal / Business */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Personal & Business</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FloatingInput label="Full Name" {...f('fullName')} />
                <FloatingInput label="Phone Number (10 digits)" {...f('phoneNumber')} maxLength={10} hint="Exactly 10 digits" />
                <div className="md:col-span-2">
                  <FloatingInput label="Company Name" {...f('companyName')} />
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Legal / Tax */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Legal & Tax Identity</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FloatingInput label="GST Number" {...f('gstNumber')} hint="e.g., 29ABCDE1234F1Z5" />
                <FloatingInput label="PAN Number" {...f('panNumber')} hint="e.g., ABCDE1234F" />
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Financial */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Financial Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FloatingInput label="Bank Account Number" {...f('bankAccountNumber')} />
                <FloatingInput label="IFSC Code" {...f('ifscCode')} hint="e.g., HDFC0000041" />
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Address */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Business Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <FloatingInput label="Address Line 1" {...f('addressLine1')} />
                <FloatingInput label="Address Line 2" {...f('addressLine2')} />
              </div>
              <div className="grid grid-cols-3 gap-5">
                <FloatingInput label="City" {...f('city')} />
                <FloatingInput label="State" {...f('state')} />
                <FloatingInput label="Pincode (6 digits)" {...f('pincode')} maxLength={6} />
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Industry */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Industry</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">Business Type</label>
                  <select
                    disabled={!isEditing}
                    value={form.businessType}
                    onChange={e => setForm(p => ({...p, businessType: e.target.value}))}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-econe-emerald/50 transition-all ${!isEditing ? 'bg-gray-50 border-gray-100 text-gray-500 cursor-default' : 'bg-white border-gray-200 text-gray-900'}`}
                  >
                    {businessTypes.map(bt => <option key={bt}>{bt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2">Interested Commodities</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.interestedCommodities.map((c, idx) => (
                      <div key={idx} className="bg-econe-emerald/10 text-econe-forest border border-econe-emerald/20 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                        {c}
                        {isEditing && <button type="button" onClick={() => removeCommodity(idx)}><X size={13} /></button>}
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <input
                      type="text" value={commodityInput} onChange={e => setCommodityInput(e.target.value)} onKeyDown={addCommodity}
                      placeholder="Type and press Enter..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-econe-emerald"
                    />
                  )}
                </div>
              </div>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BizProfile;
