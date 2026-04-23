import { useState } from 'react';
import { Building, MapPin, Edit3, X, Save, ShieldCheck, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useEffect } from 'react';

// Floating Input Helper
const FloatingInput = ({ label, type = "text", value, onChange, disabled, ...props }) => (
  <div className="relative w-full">
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder=" "
      className={`peer block w-full px-4 pb-2.5 pt-6 text-sm bg-white rounded-xl border ${
        disabled ? 'text-gray-500 border-gray-100 bg-gray-50/50 cursor-not-allowed' : 'text-gray-900 border-gray-200 focus:border-[#12b76a] focus:ring-[#12b76a]/20'
      } appearance-none focus:outline-none focus:ring-4 transition-all`}
      {...props}
    />
    <label
      className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none ${
        disabled ? 'text-gray-400' : 'text-gray-500 peer-focus:text-[#12b76a]'
      }`}
    >
      {label}
    </label>
  </div>
);

const emptyNgoProfile = {
  organizationName: '',
  registrationNumber: '',
  yearsOfOperation: '',
  website: '',
  contactPersonName: '',
  phoneNumber: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  latitude: '',
  longitude: '',
  allowedRadiusKm: '',
  focusAreas: []
};

const NgoProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyNgoProfile);
  const [focusInput, setFocusInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/ngo-profile/ngo');
        if (response.data) {
          setFormData(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setIsEditing(true);
        } else {
          toast.error('Failed to fetch profile.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleAddFocusArea = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = focusInput.trim();
      if (val && !formData.focusAreas.includes(val)) {
        setFormData(prev => ({ ...prev, focusAreas: [...prev.focusAreas, val] }));
      }
      setFocusInput('');
    }
  };

  const removeFocusArea = (idxToRem) => {
    if(!isEditing) return;
    setFormData(prev => ({
      ...prev, focusAreas: prev.focusAreas.filter((_, idx) => idx !== idxToRem)
    }));
  };

  const handleSave = async () => {
    try {
      const payload = { 
        ...formData, 
        yearsOfOperation: parseInt(formData.yearsOfOperation),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        allowedRadiusKm: parseFloat(formData.allowedRadiusKm)
      };
      await api.put('/ngo-profile/create', payload);
      toast.success('Successfully updated NGO Profile!', { style: { background: '#12b76a', color: '#fff' }});
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save profile.');
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Organization Profile</h1>
          <p className="text-gray-500 mt-1">Manage registration identity and contact data.</p>
        </div>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm">
            <Edit3 size={18} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
             <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all">Cancel</button>
             <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-[#12b76a] hover:bg-[#0fa65e] text-white rounded-xl font-bold shadow-lg shadow-[#12b76a]/20 transition-all">
               <Save size={18} /> Save Changes
             </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Pane - ID Badge */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#111827] to-[#1f2937] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <ShieldCheck size={120} strokeWidth={1} />
             </div>
             
             <div className="relative z-10 flex flex-col items-center text-center space-y-4">
               <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/20 backdrop-blur-md">
                 <Building size={40} className="text-[#12b76a]" />
               </div>
               <div>
                  <h3 className="text-2xl font-bold font-sora mt-2">{formData.organizationName || 'NGO Name'}</h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#12b76a]/20 text-[#12b76a] text-[10px] font-bold uppercase tracking-widest rounded-full mt-2">
                    <CheckCircle size={12} /> Level 1 Verifier
                  </div>
               </div>
             </div>

             <div className="relative z-10 mt-10 space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Reg No:</span>
                  <span className="font-mono">{formData.registrationNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Years Active:</span>
                  <span className="font-bold">{formData.yearsOfOperation || 0}</span>
                </div>
                <div className="flex max-w-full overflow-hidden text-sm justify-between">
                  <span className="text-gray-400 mr-2">Location:</span>
                  <span className="truncate">{formData.city}, {formData.state}</span>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Right Pane - Form Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
             
             {/* Account Details */}
             <section>
               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Account Level</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <FloatingInput label="Organization Name" value={formData.organizationName} disabled={!isEditing} onChange={e=>setFormData({...formData, organizationName: e.target.value})} />
                 <FloatingInput label="Registration Number" value={formData.registrationNumber} disabled={!isEditing} onChange={e=>setFormData({...formData, registrationNumber: e.target.value})} />
                 <FloatingInput label="Years of Operation" type="number" value={formData.yearsOfOperation} disabled={!isEditing} onChange={e=>setFormData({...formData, yearsOfOperation: e.target.value})} />
                 <FloatingInput label="Website" type="url" value={formData.website} disabled={!isEditing} onChange={e=>setFormData({...formData, website: e.target.value})} />
               </div>
               
               <div className="mt-5">
                 <p className="text-sm text-gray-500 mb-2">Focus Areas</p>
                 <div className="flex flex-wrap gap-2 mb-3">
                   {formData.focusAreas.map((area, idx) => (
                      <div key={idx} className="bg-[#12b76a]/10 text-[#0fa65e] px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2">
                        {area}
                        {isEditing && <button type="button" onClick={() => removeFocusArea(idx)}><X size={14}/></button>}
                      </div>
                   ))}
                 </div>
                 {isEditing && (
                   <input 
                     type="text" value={focusInput} onChange={e=>setFocusInput(e.target.value)} onKeyDown={handleAddFocusArea}
                     placeholder="Type area and press Enter..."
                     className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#12b76a]"
                   />
                 )}
               </div>
             </section>

             <hr className="border-gray-100" />

             {/* Contact details */}
             <section>
               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Person</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <FloatingInput label="Name" value={formData.contactPersonName} disabled={!isEditing} onChange={e=>setFormData({...formData, contactPersonName: e.target.value})} />
                 <FloatingInput label="Phone Number" value={formData.phoneNumber} disabled={!isEditing} onChange={e=>setFormData({...formData, phoneNumber: e.target.value})} />
               </div>
             </section>

             <hr className="border-gray-100" />

             {/* Location Details */}
             <section>
               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Registered Address</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                 <FloatingInput label="Address Line 1" value={formData.addressLine1} disabled={!isEditing} onChange={e=>setFormData({...formData, addressLine1: e.target.value})} />
                 <FloatingInput label="Address Line 2" value={formData.addressLine2} disabled={!isEditing} onChange={e=>setFormData({...formData, addressLine2: e.target.value})} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                 <FloatingInput label="City" value={formData.city} disabled={!isEditing} onChange={e=>setFormData({...formData, city: e.target.value})} />
                 <FloatingInput label="State" value={formData.state} disabled={!isEditing} onChange={e=>setFormData({...formData, state: e.target.value})} />
                 <FloatingInput label="Pincode" value={formData.pincode} disabled={!isEditing} onChange={e=>setFormData({...formData, pincode: e.target.value})} />
               </div>
               <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-5">
                 <FloatingInput label="Latitude" type="number" step="0.0001" value={formData.latitude} disabled={!isEditing} onChange={e=>setFormData({...formData, latitude: e.target.value})} />
                 <FloatingInput label="Longitude" type="number" step="0.0001" value={formData.longitude} disabled={!isEditing} onChange={e=>setFormData({...formData, longitude: e.target.value})} />
                 <FloatingInput label="Radius (KM)" type="number" step="0.1" value={formData.allowedRadiusKm} disabled={!isEditing} onChange={e=>setFormData({...formData, allowedRadiusKm: e.target.value})} />
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

export default NgoProfile;
