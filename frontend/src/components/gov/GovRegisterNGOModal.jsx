import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Building, Plus, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const FloatingInput = ({ label, type = "text", value, onChange, error, hint, required, ...props }) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        className={`peer block w-full px-4 pb-2.5 pt-6 text-sm text-gray-900 bg-white rounded-xl border ${
          error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-econe-emerald focus:ring-econe-emerald/20'
        } appearance-none focus:outline-none focus:ring-4 transition-all`}
        {...props}
      />
      <label
        className={`absolute text-sm duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none ${
          error ? 'text-red-500' : 'text-gray-500 peer-focus:text-econe-emerald'
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error ? (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
      ) : null}
    </div>
  );
};

const GovRegisterNGOModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    temporaryPassword: '',
    organizationName: '',
    registrationNumber: '',
    yearsOfOperation: '',
    website: '',
    focusAreas: [],
    contactPersonName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    allowedRadius: ''
  });

  const [focusInput, setFocusInput] = useState('');
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState('form'); // 'form' or 'otp'
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const validate = () => {
    let newErrors = {};

    if (!formData.email.match(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = "Valid email is required";
    if (formData.temporaryPassword.length < 8) newErrors.temporaryPassword = "Minimum 8 characters required";
    if (!formData.organizationName.trim()) newErrors.organizationName = "NGO Name is required";
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = "Registration Number is required";
    
    const years = parseInt(formData.yearsOfOperation);
    if (isNaN(years) || years <= 0) newErrors.yearsOfOperation = "Must be a positive number";
    
    if (!formData.contactPersonName.trim()) newErrors.contactPersonName = "Contact Person is required";
    
    if (!formData.phoneNumber.match(/^\d{10}$/)) newErrors.phoneNumber = "Must be exactly 10 digits";
    if (!formData.pincode.match(/^\d{6}$/)) newErrors.pincode = "Must be exactly 6 digits";
    
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address Line 1 is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFocusArea = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = focusInput.trim();
      if (val && !formData.focusAreas.includes(val)) {
        setFormData(prev => ({ ...prev, focusAreas: [...prev.focusAreas, val] }));
      }
      setFocusInput('');
    }
  };

  const removeFocusArea = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please resolve the form errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    
    const requestBody = {
      email: formData.email,
      password: formData.temporaryPassword,
      profile: {
        organizationName: formData.organizationName,
        registrationNumber: formData.registrationNumber,
        contactPersonName: formData.contactPersonName,
        phoneNumber: formData.phoneNumber,
        address: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        focusAreas: formData.focusAreas,
        website: formData.website,
        yearsOfOperation: parseInt(formData.yearsOfOperation),
        latitude: parseFloat(formData.latitude) || 0,
        longitude: parseFloat(formData.longitude) || 0,
        allowedRadiusKm: parseFloat(formData.allowedRadius) || 100
      }
    };

    try {
      await api.post('/government/ngo', requestBody);
      setRegisteredEmail(formData.email);
      
      toast.success("Account Created! OTP Sent to Partner Email.", {
        style: { borderRadius: '12px', background: '#022c22', color: '#fff' },
        iconTheme: { primary: '#10b981', secondary: '#fff' },
      });
      
      setStep('otp'); // Switch to OTP step
    } catch (error) {
       toast.error(error.response?.data?.message || "Failed to onboard NGO partner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otpCode.join('');
    if (fullOtp.length < 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsVerifying(true);
    try {
      await api.post('/auth/verify-otp', {
        email: registeredEmail,
        otp: fullOtp
      });

      toast.success("NGO Account Verified & Active!", {
        style: { borderRadius: '12px', background: '#10b981', color: '#fff' },
      });

      // Finally close and reset
      handleClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: '',
      temporaryPassword: '',
      organizationName: '',
      registrationNumber: '',
      yearsOfOperation: '',
      website: '',
      focusAreas: [],
      contactPersonName: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      latitude: '',
      longitude: '',
      allowedRadius: ''
    });
    setStep('form');
    setOtpCode(['', '', '', '', '', '']);
    setRegisteredEmail('');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[150]" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-econe-dark/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 y-4"
              enterTo="opacity-100 scale-100 y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 y-0"
              leaveTo="opacity-0 scale-95 y-4"
            >
              <Dialog.Panel className={`w-full ${step === 'otp' ? 'max-w-md' : 'max-w-4xl'} transform overflow-hidden rounded-[2rem] bg-[#f8fafc] text-left align-middle shadow-2xl transition-all`}>
                
                {/* Header */}
                <div className="bg-white px-8 py-6 flex items-center justify-between border-b border-gray-100 sticky top-0 z-20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-econe-emerald/10 rounded-xl">
                      <Building className="w-6 h-6 text-econe-emerald" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-econe-dark">
                        {step === 'form' ? 'Register Verification Partner' : 'Verify NGO Account'}
                      </Dialog.Title>
                      <p className="text-sm text-gray-500 mt-1">
                        {step === 'form' 
                          ? 'Onboard a new NGO to audit and verify carbon credits on Econe.' 
                          : `Enter the verification code sent to ${registeredEmail}`}
                      </p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {step === 'form' ? (
                  <>
                    {/* Form Body */}
                    <div className="p-8 max-h-[75vh] overflow-y-auto">
                      <div className="space-y-10">
                        {/* Section A: Credentials */}
                        <section>
                          <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 pl-1">A. Account Credentials</h4>
                          <div className="glass bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FloatingInput 
                              label="Email Address" 
                              type="email" 
                              required 
                              value={formData.email} 
                              onChange={(e) => setFormData({...formData, email: e.target.value})} 
                              error={errors.email}
                            />
                            <FloatingInput 
                              label="Temporary Password" 
                              type="text" 
                              required 
                              value={formData.temporaryPassword} 
                              onChange={(e) => setFormData({...formData, temporaryPassword: e.target.value})} 
                              error={errors.temporaryPassword}
                              hint="Minimum 8 characters. NGO must change this upon first login."
                            />
                          </div>
                        </section>

                        {/* Section B: Organization Details */}
                        <section>
                          <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 pl-1">B. Organization Details</h4>
                          <div className="glass bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FloatingInput 
                                label="Organization Name (NGO)" 
                                required 
                                value={formData.organizationName} 
                                onChange={(e) => setFormData({...formData, organizationName: e.target.value})} 
                                error={errors.organizationName}
                              />
                              <FloatingInput 
                                label="Registration Number" 
                                required 
                                value={formData.registrationNumber} 
                                onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} 
                                error={errors.registrationNumber}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FloatingInput 
                                label="Years of Operation" 
                                type="number"
                                required 
                                value={formData.yearsOfOperation} 
                                onChange={(e) => setFormData({...formData, yearsOfOperation: e.target.value})} 
                                error={errors.yearsOfOperation}
                                hint="Must be a positive numeric value."
                              />
                              <FloatingInput 
                                label="Website URL" 
                                type="url"
                                value={formData.website} 
                                onChange={(e) => setFormData({...formData, website: e.target.value})} 
                                hint="Optional but recommended for public profiles."
                              />
                            </div>
                            
                            {/* Focus Areas Dynamic Input */}
                            <div>
                               <div className="relative w-full">
                                <input
                                  type="text"
                                  value={focusInput}
                                  onChange={(e) => setFocusInput(e.target.value)}
                                  onKeyDown={handleAddFocusArea}
                                  placeholder=" "
                                  className="peer block w-full px-4 pb-2.5 pt-6 text-sm text-gray-900 bg-white rounded-xl border border-gray-200 focus:border-econe-emerald focus:ring-econe-emerald/20 appearance-none focus:outline-none focus:ring-4 transition-all"
                                />
                                <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none peer-focus:text-econe-emerald">
                                  Focus Areas (Press Enter to Add)
                                </label>
                                <p className="mt-1.5 text-xs text-gray-400">Examples: Reforestation, Soil Health, Direct Air Capture</p>
                                
                                {/* Tags Display */}
                                {formData.focusAreas.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mt-4">
                                    {formData.focusAreas.map((area, idx) => (
                                      <div key={idx} className="bg-econe-emerald/10 text-econe-forest px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 border border-econe-emerald/20">
                                        {area}
                                        <button type="button" onClick={() => removeFocusArea(idx)} className="hover:text-red-500 transition-colors">
                                          <XCircle className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </section>

                        {/* Section C: Contact */}
                        <section>
                          <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 pl-1">C. Contact Information</h4>
                          <div className="glass bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FloatingInput 
                              label="Contact Person Name" 
                              required 
                              value={formData.contactPersonName} 
                              onChange={(e) => setFormData({...formData, contactPersonName: e.target.value})} 
                              error={errors.contactPersonName}
                            />
                            <FloatingInput 
                              label="Phone Number" 
                              type="tel" 
                              required 
                              value={formData.phoneNumber} 
                              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/g, '')})} 
                              error={errors.phoneNumber}
                              maxLength={10}
                              hint="Must be exactly 10 digits."
                            />
                          </div>
                        </section>

                        {/* Section D: Location */}
                        <section>
                          <h4 className="text-sm font-bold text-gray-400 tracking-widest uppercase mb-4 pl-1">D. Location & Address</h4>
                          <div className="glass bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FloatingInput 
                                label="Address Line 1" 
                                required 
                                value={formData.addressLine1} 
                                onChange={(e) => setFormData({...formData, addressLine1: e.target.value})} 
                                error={errors.addressLine1}
                              />
                              <FloatingInput 
                                label="Address Line 2" 
                                value={formData.addressLine2} 
                                onChange={(e) => setFormData({...formData, addressLine2: e.target.value})} 
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <FloatingInput 
                                label="City" 
                                required 
                                value={formData.city} 
                                onChange={(e) => setFormData({...formData, city: e.target.value})} 
                                error={errors.city}
                              />
                              <FloatingInput 
                                label="State / Province" 
                                required 
                                value={formData.state} 
                                onChange={(e) => setFormData({...formData, state: e.target.value})} 
                                error={errors.state}
                              />
                              <FloatingInput 
                                label="Pincode" 
                                required 
                                maxLength={6}
                                value={formData.pincode} 
                                onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} 
                                error={errors.pincode}
                                hint="6 digits max."
                              />
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="bg-white px-8 py-6 border-t border-gray-100 sticky bottom-0 z-20 flex gap-4 justify-end">
                      <button
                        onClick={handleClose}
                        type="button"
                        disabled={isSubmitting}
                        className="px-6 py-3 font-bold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        type="button"
                        className="px-8 py-3 w-full sm:w-auto flex justify-center items-center gap-2 font-bold text-white bg-econe-emerald hover:bg-econe-forest rounded-xl shadow-lg shadow-econe-emerald/20 transition-all disabled:opacity-70 disabled:cursor-wait"
                      >
                        {isSubmitting ? 'Onboarding NGO...' : 'Register Target NGO'}
                        {!isSubmitting && <Plus className="w-5 h-5" />}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* OTP Body */}
                    <div className="p-8 flex flex-col items-center text-center space-y-6">
                       <div className="w-20 h-20 bg-econe-emerald/10 rounded-3xl flex items-center justify-center">
                          <Plus className="w-10 h-10 text-econe-emerald rotate-45" />
                       </div>
                       
                       <div className="max-w-md space-y-2">
                         <h4 className="text-xl font-bold text-econe-dark">Check the NGO's Email</h4>
                         <p className="text-gray-500">
                           A 6-digit verification code has been sent to <span className="text-econe-emerald font-semibold">{registeredEmail}</span>. 
                           Ask the NGO for the code to activate their account now.
                         </p>
                       </div>

                       {/* OTP Input Group */}
                       <div className="flex gap-3 sm:gap-4 justify-center py-4">
                         {otpCode.map((digit, idx) => (
                           <input
                             key={idx}
                             id={`otp-${idx}`}
                             type="text"
                             inputMode="numeric"
                             maxLength={1}
                             value={digit}
                             onChange={(e) => handleOtpChange(idx, e.target.value)}
                             onKeyDown={(e) => handleKeyDown(idx, e)}
                             className="w-12 h-14 sm:w-16 sm:h-20 text-center text-2xl font-bold text-econe-dark bg-white border-2 border-gray-100 rounded-2xl focus:border-econe-emerald focus:ring-4 focus:ring-econe-emerald/10 outline-none transition-all shadow-sm"
                           />
                         ))}
                       </div>

                       <div className="w-full max-w-sm space-y-4 pt-4">
                         <button
                           onClick={handleVerifyOtp}
                           disabled={isVerifying}
                           className="w-full py-4 bg-econe-emerald hover:bg-econe-forest text-white font-bold rounded-2xl shadow-xl shadow-econe-emerald/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                         >
                           {isVerifying ? 'Verifying Account...' : 'Activate Account Now'}
                         </button>
                         <button
                           onClick={handleClose}
                           disabled={isVerifying}
                           className="w-full py-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
                         >
                           Skip For Now (NGO can verify later)
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
  );
};

export default GovRegisterNGOModal;
