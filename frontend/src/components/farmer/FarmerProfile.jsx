import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Edit3, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useEffect } from 'react';

const soilTypes = ['Loamy', 'Sandy', 'Clay', 'Black', 'Red', 'Alluvial'];

const emptyProfile = {
  fullName: '', phoneNumber: '', aadharNumber: '',
  village: '', district: '', state: '', pincode: '',
  landAreaAcres: '', soilType: 'Loamy', irrigationAvailable: false,
  bankAccountNumber: '', ifscCode: '',
  cropTypes: [],
};

const FloatingInput = ({ label, value, onChange, disabled, type = 'text', error, hint, ...props }) => (
  <div className="relative w-full">
    <input type={type} value={value} onChange={onChange} disabled={disabled} placeholder=" "
      className={`peer block w-full px-4 pb-2.5 pt-6 text-sm rounded-xl border appearance-none focus:outline-none focus:ring-4 transition-all ${
        disabled ? 'text-gray-500 bg-gray-50 border-gray-100 cursor-default' : error ? 'text-gray-900 bg-white border-red-300 focus:border-red-500 focus:ring-red-300/20' : 'text-gray-900 bg-white border-gray-200 focus:border-[#15803d] focus:ring-[#15803d]/20'
      }`} {...props} />
    <label className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 pointer-events-none peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 ${disabled ? 'text-gray-400' : error ? 'text-red-500' : 'text-gray-500 peer-focus:text-[#15803d]'}`}>{label}</label>
    {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    {!error && hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
);



const FarmerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [form, setForm] = useState(emptyProfile);
  const [errors, setErrors] = useState({});
  const [cropInput, setCropInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/farmer-profile/get-farmer');
        if (response.data) {
          setForm(response.data);
          setProfileExists(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setProfileExists(false);
          setIsEditing(true); // Auto edit if new
        } else {
          toast.error('Failed to fetch profile.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const f = (field) => ({
    value: form[field],
    onChange: (e) => setForm(p => ({ ...p, [field]: e.target.value })),
    disabled: !isEditing,
    error: errors[field],
  });

  const validate = () => {
    const e = {};
    if (!form.phoneNumber.match(/^\d{10}$/)) e.phoneNumber = 'Exactly 10 digits required';
    if (!form.aadharNumber.match(/^\d{12}$/)) e.aadharNumber = 'Exactly 12 digits required';
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = 'Exactly 6 digits required';
    if (!form.ifscCode.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) e.ifscCode = 'Invalid IFSC format';
    if (!form.landAreaAcres || parseFloat(form.landAreaAcres) <= 0) e.landAreaAcres = 'Must be a positive number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) { toast.error('Please fix the validation errors.'); return; }
    try {
      const payload = { ...form, landAreaAcres: parseFloat(form.landAreaAcres) };
      if (profileExists) {
        await api.put('/farmer-profile/update-farmer', payload);
        toast.success('Profile updated successfully!', { style: { background: '#15803d', color: '#fff' }, iconTheme: { primary: '#fff', secondary: '#15803d' } });
      } else {
        await api.post('/farmer-profile/create-farmer', payload);
        toast.success('Profile created successfully!', { style: { background: '#15803d', color: '#fff' }, iconTheme: { primary: '#fff', secondary: '#15803d' } });
        setProfileExists(true);
      }
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save profile.');
    }
  };

  const addCrop = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = cropInput.trim();
      if (val && !form.cropTypes.includes(val)) setForm(p => ({ ...p, cropTypes: [...p.cropTypes, val] }));
      setCropInput('');
    }
  };
  const removeCrop = (idx) => isEditing && setForm(p => ({ ...p, cropTypes: p.cropTypes.filter((_, i) => i !== idx) }));

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-econe-emerald"></div>
        </div>
      ) : (
        <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">Farmer Profile</h1>
          <p className="text-gray-500 mt-1">Your personal, farm, and banking details.</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 shadow-sm">
            <Edit3 size={17} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button onClick={() => { setIsEditing(false); setErrors({}); }} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-[#15803d] hover:bg-[#166534] text-white rounded-xl font-bold shadow-lg shadow-green-700/20">
              <Save size={17} /> {profileExists ? 'Update Profile' : 'Create Profile'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Identity Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#052e16] to-[#14532d] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute bottom-0 right-0 opacity-5 p-6 pointer-events-none"><Sprout size={130} strokeWidth={0.7} /></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/20">
                <Sprout size={40} className="text-[#4ade80]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-sora">{form.fullName || '—'}</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#22c55e]/20 text-[#4ade80] text-[10px] font-bold uppercase tracking-widest rounded-full mt-2">
                  Carbon Farmer
                </div>
              </div>
            </div>
            <div className="relative z-10 mt-8 space-y-3 border-t border-white/10 pt-6 text-sm">
              {[
                { label: 'Village', val: form.village },
                { label: 'District', val: form.district },
                { label: 'State', val: form.state },
                { label: 'Land Area', val: `${form.landAreaAcres} Acres` },
                { label: 'Soil', val: form.soilType },
                { label: 'Irrigation', val: form.irrigationAvailable ? '✅ Available' : '❌ Not Available' },
              ].map(item => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-gray-400">{item.label}:</span>
                  <span className="font-semibold truncate max-w-[120px]">{item.val || '—'}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">

            {/* Personal */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Personal</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2"><FloatingInput label="Full Name" {...f('fullName')} /></div>
                <FloatingInput label="Phone Number" {...f('phoneNumber')} maxLength={10} hint="10 digits" />
                <FloatingInput label="Aadhar Number" {...f('aadharNumber')} maxLength={12} hint="12 digits" />
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Address */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FloatingInput label="Village" {...f('village')} />
                <FloatingInput label="District" {...f('district')} />
                <FloatingInput label="State" {...f('state')} />
                <FloatingInput label="Pincode (6 digits)" {...f('pincode')} maxLength={6} />
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Farm Details */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Farm Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                <FloatingInput label="Land Area (Acres)" type="number" step="0.1" {...f('landAreaAcres')} />
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1.5">Soil Type</label>
                  <select disabled={!isEditing} value={form.soilType} onChange={e => setForm(p => ({...p, soilType: e.target.value}))}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${!isEditing ? 'bg-gray-50 border-gray-100 text-gray-500 cursor-default' : 'bg-white border-gray-200 text-gray-900 focus:border-[#15803d]'}`}>
                    {soilTypes.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1.5">Irrigation Available</label>
                  <button type="button" disabled={!isEditing} onClick={() => isEditing && setForm(p => ({...p, irrigationAvailable: !p.irrigationAvailable}))}
                    className={`relative inline-flex items-center h-10 rounded-full w-20 transition-colors ${form.irrigationAvailable ? 'bg-[#15803d]' : 'bg-gray-200'} ${!isEditing ? 'cursor-default opacity-60' : 'cursor-pointer'}`}>
                    <span className={`inline-block w-8 h-8 bg-white rounded-full shadow transform transition-transform ${form.irrigationAvailable ? 'translate-x-11' : 'translate-x-1'}`} />
                    <span className={`absolute text-[10px] font-bold ${form.irrigationAvailable ? 'left-2 text-white' : 'right-2 text-gray-500'}`}>{form.irrigationAvailable ? 'YES' : 'NO'}</span>
                  </button>
                </div>
              </div>

              {/* Crop Types */}
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-2">Crop Types Grown</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.cropTypes.map((crop, idx) => (
                    <div key={idx} className="bg-[#15803d]/10 text-[#15803d] border border-[#15803d]/20 px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                      {crop} {isEditing && <button type="button" onClick={() => removeCrop(idx)}><X size={13} /></button>}
                    </div>
                  ))}
                </div>
                {isEditing && <input type="text" value={cropInput} onChange={e => setCropInput(e.target.value)} onKeyDown={addCrop} placeholder="Type crop name & press Enter..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#15803d]" />}
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Banking */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Banking Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FloatingInput label="Bank Account Number" {...f('bankAccountNumber')} />
                <FloatingInput label="IFSC Code" {...f('ifscCode')} hint="e.g. SBIN0002044" />
              </div>
            </section>

          </div>
        </motion.div>
      </div>
      </>
      )}
    </div>
  );
};

export default FarmerProfile;
