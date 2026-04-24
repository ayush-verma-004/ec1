import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, MapPin, Phone, Building, Hash, Edit3, Check, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const GovProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    departmentName: '',
    officerName: '',
    designation: '',
    employeeId: '',
    phoneNumber: '',
    officeAddress: '',
    bankAccountNumber: '',
    ifscCode: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/government-profile/government');
        if (response.data) {
          setProfileData(response.data);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/government-profile/update', profileData);
      toast.success('Officer profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20, staggerChildren: 0.1 } }
  };

  return (
    <motion.div 
      className="p-6 sm:p-10 max-w-6xl mx-auto space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-econe-emerald"></div>
        </div>
      ) : (
        <>
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-3xl font-bold text-econe-dark">Officer Profile</h1>
          <p className="text-gray-500 mt-1">Manage your regulatory authorization ID.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Pane - ID Card / Badge */}
        <motion.div 
          className="lg:col-span-4"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="glass-dark bg-econe-dark text-white rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-econe-dark/30">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-econe-emerald/20 rounded-full blur-[40px] -ml-10 -mb-10" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-econe-emerald to-white p-1 rounded-full shadow-xl mb-6">
                <div className="w-full h-full bg-econe-dark rounded-full flex items-center justify-center">
                  <User className="text-white w-10 h-10" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-1">{profileData.officerName}</h2>
              <p className="text-econe-emerald font-medium text-sm mb-6">{profileData.designation}</p>
              
              <div className="w-full h-px bg-white/10 mb-6" />
              
              <div className="w-full space-y-3">
                <div className="flex items-center gap-3 text-white/70 text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                  <Building size={16} className="text-econe-emerald" />
                  <span className="truncate">{profileData.departmentName}</span>
                </div>
                <div className="flex items-center justify-center pt-4">
                  <div className="w-32 h-8 bg-white/20 rounded flex flex-col justify-between p-1 opacity-50">
                    <div className="w-full h-1 bg-white/40" />
                    <div className="w-full h-1 bg-white/40" />
                    <div className="w-1/2 h-1 bg-white/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Pane - Details / Form */}
        <div className="lg:col-span-8 glass bg-white/80 rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl relative">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-econe-dark flex items-center gap-2">
              <Shield className="text-econe-emerald w-5 h-5" /> 
              Authorization Details
            </h3>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
              >
                <Edit3 size={16} /> Edit Profile
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              <InputField 
                icon={<User size={18} />} 
                label="Officer Name" 
                name="officerName" 
                value={profileData.officerName} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />
              
              <InputField 
                icon={<Shield size={18} />} 
                label="Designation" 
                name="designation" 
                value={profileData.designation} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />

              <InputField 
                icon={<Building size={18} />} 
                label="Department Name" 
                name="departmentName" 
                value={profileData.departmentName} 
                onChange={handleChange} 
                readOnly={!isEditing} 
                className="md:col-span-2"
              />

              <InputField 
                icon={<Hash size={18} />} 
                label="Employee ID / Badge ID" 
                name="employeeId" 
                value={profileData.employeeId} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />

              <InputField 
                icon={<Phone size={18} />} 
                label="Phone Number" 
                name="phoneNumber" 
                value={profileData.phoneNumber} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />

              <InputField 
                icon={<MapPin size={18} />} 
                label="Office Address" 
                name="officeAddress" 
                value={profileData.officeAddress} 
                onChange={handleChange} 
                readOnly={!isEditing} 
                className="md:col-span-2"
              />

              <div className="md:col-span-2 pt-4 border-t border-gray-100 mt-2">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Financial Details</h4>
              </div>

              <InputField 
                icon={<Building size={18} />} 
                label="Bank Account Number" 
                name="bankAccountNumber" 
                value={profileData.bankAccountNumber} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />

              <InputField 
                icon={<Hash size={18} />} 
                label="IFSC Code" 
                name="ifscCode" 
                value={profileData.ifscCode} 
                onChange={handleChange} 
                readOnly={!isEditing} 
              />

            </div>

            <AnimatePresence>
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-6"
                >
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-econe-emerald to-econe-forest text-white rounded-xl font-semibold shadow-lg shadow-econe-emerald/20 hover:shadow-econe-emerald/40 transition-all"
                  >
                    <Check size={18} /> Update Profile
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

      </div>
      </>
      )}
    </motion.div>
  );
};

// Reusable Input Field component for the Form with Floating Underline Animation
const InputField = ({ label, icon, readOnly, className = "", ...props }) => {
  return (
    <div className={`relative pt-2 ${className}`}>
      <div className="flex items-center gap-3 mb-1">
        <div className={`text-gray-400 ${!readOnly && 'group-focus-within:text-econe-emerald transition-colors'}`}>
          {icon}
        </div>
        <label className={`text-xs font-semibold uppercase tracking-wider ${readOnly ? 'text-gray-400' : 'text-gray-500'}`}>
          {label}
        </label>
      </div>
      <div className="relative">
        <input
          {...props}
          readOnly={readOnly}
          className={`block w-full py-2 bg-transparent border-0 appearance-none focus:outline-none focus:ring-0 peer ${
            readOnly 
              ? 'text-econe-dark font-medium cursor-default border-transparent' 
              : 'text-econe-dark font-semibold border-b-2 border-gray-200 focus:border-econe-emerald cursor-text'
          }`}
        />
        {/* Floating Underline Animation */}
        {!readOnly && (
          <div className="absolute bottom-0 left-0 h-0.5 bg-econe-emerald w-0 peer-focus:w-full transition-all duration-300" />
        )}
      </div>
    </div>
  );
};

export default GovProfile;
