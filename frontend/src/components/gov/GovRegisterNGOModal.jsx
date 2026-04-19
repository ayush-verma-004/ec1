import { useState, useEffect, Fragment } from 'react';
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

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setOtpCode(['', '', '', '', '', '']);
      setRegisteredEmail('');
      setErrors({});
      setIsSubmitting(false);
      setIsVerifying(false);
    }
  }, [isOpen]);

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
    // Only allow numbers
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue && value !== '') return; // Block non-numeric
    
    const char = cleanValue.slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = char;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (char && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otpCode];
      pastedData.split('').forEach((char, idx) => {
        if (idx < 6) newOtp[idx] = char;
      });
      setOtpCode(newOtp);
      // Focus last filled or next empty
      const nextIdx = Math.min(pastedData.length, 5);
      document.getElementById(`otp-${nextIdx}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please resolve the form errors before submitting.");
      return;
    }

    setIsSubmitting(true);
    
    const cleanedEmail = formData.email.trim();
    const requestBody = {
      email: cleanedEmail,
      password: formData.temporaryPassword,
      profile: {
        organizationName: formData.organizationName.trim(),
        registrationNumber: formData.registrationNumber.trim(),
        contactPersonName: formData.contactPersonName.trim(),
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
      setRegisteredEmail(cleanedEmail);
      
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
        email: registeredEmail.trim(),
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
              <Dialog.Panel className={`w-full ${step === 'otp' ? 'max-w-xs' : 'max-w-4xl'} transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all border border-slate-100`}>
                
                {/* Header */}
                <div className={`px-6 py-4 flex items-center justify-between border-b border-slate-50 ${step === 'otp' ? 'bg-slate-50/50' : 'bg-white'} sticky top-0 z-20`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${step === 'otp' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-bold text-slate-900 leading-tight">
                        {step === 'form' ? 'Onboard NGO Partner' : 'Verification'}
                      </Dialog.Title>
                      {step === 'form' && <p className="text-[11px] text-slate-500 font-medium">Add a new organization to the network.</p>}
                    </div>
                  </div>
                  <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {step === 'form' ? (
                  <>
                    {/* Form Body */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto bg-slate-50/30">
                      <div className="space-y-8">
                        {/* Section A: Credentials */}
                        <section>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">1</span>
                            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Account Credentials</h4>
                          </div>
                          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FloatingInput 
                              label="Email Address" 
                              type="email" 
                              required 
                              value={formData.email} 
                              onChange={(e) => setFormData({...formData, email: e.target.value})} 
                              error={errors.email}
                            />
                            <FloatingInput 
                              label="Account Password" 
                              type="text" 
                              required 
                              value={formData.temporaryPassword} 
                              onChange={(e) => setFormData({...formData, temporaryPassword: e.target.value})} 
                              error={errors.temporaryPassword}
                              hint="Min 8 chars."
                            />
                          </div>
                        </section>

                        {/* Section B: Organization Details */}
                        <section>
                           <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">2</span>
                            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Organization Details</h4>
                          </div>
                          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <FloatingInput 
                                label="NGO Name" 
                                required 
                                value={formData.organizationName} 
                                onChange={(e) => setFormData({...formData, organizationName: e.target.value})} 
                                error={errors.organizationName}
                              />
                              <FloatingInput 
                                label="Registration #" 
                                required 
                                value={formData.registrationNumber} 
                                onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} 
                                error={errors.registrationNumber}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <FloatingInput 
                                label="Years of Operation" 
                                type="number"
                                required 
                                value={formData.yearsOfOperation} 
                                onChange={(e) => setFormData({...formData, yearsOfOperation: e.target.value})} 
                                error={errors.yearsOfOperation}
                              />
                              <FloatingInput 
                                label="Website URL" 
                                type="url"
                                value={formData.website} 
                                onChange={(e) => setFormData({...formData, website: e.target.value})} 
                              />
                            </div>
                            
                            <div>
                               <div className="relative w-full">
                                <input
                                  type="text"
                                  value={focusInput}
                                  onChange={(e) => setFocusInput(e.target.value)}
                                  onKeyDown={handleAddFocusArea}
                                  placeholder=" "
                                  className="peer block w-full px-4 pb-2.5 pt-6 text-sm text-slate-900 bg-white rounded-xl border border-slate-200 focus:border-emerald-600 focus:ring-emerald-600/10 appearance-none focus:outline-none focus:ring-4 transition-all"
                                />
                                <label className="absolute text-sm text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 pointer-events-none peer-focus:text-emerald-600">
                                  Expertise Areas
                                </label>
                                
                                {formData.focusAreas.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-3">
                                    {formData.focusAreas.map((area, idx) => (
                                      <div key={idx} className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-200">
                                        {area}
                                        <button type="button" onClick={() => removeFocusArea(idx)} className="hover:text-rose-600 transition-colors">
                                          <XCircle className="w-3.5 h-3.5" />
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
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">3</span>
                            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Contact</h4>
                          </div>
                          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FloatingInput label="Admin Name" required value={formData.contactPersonName} onChange={(e) => setFormData({...formData, contactPersonName: e.target.value})} error={errors.contactPersonName} />
                            <FloatingInput label="Mobile Number" type="tel" required value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value.replace(/\D/g, '')})} error={errors.phoneNumber} maxLength={10} />
                          </div>
                        </section>

                        {/* Section D: Address */}
                        <section>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-6 h-6 rounded bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">4</span>
                            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Location</h4>
                          </div>
                          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-5">
                            <FloatingInput label="Address Line 1" required value={formData.addressLine1} onChange={(e) => setFormData({...formData, addressLine1: e.target.value})} error={errors.addressLine1} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                              <FloatingInput label="City" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} error={errors.city} />
                              <FloatingInput label="State" required value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} error={errors.state} />
                              <FloatingInput label="Pincode" required maxLength={6} value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value.replace(/\D/g, '')})} error={errors.pincode} />
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>

                    {/* Footer Action */}
                    <div className="bg-white px-6 py-4 border-t border-slate-100 flex gap-3 justify-end items-center">
                      <button onClick={handleClose} type="button" disabled={isSubmitting} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest px-4">Cancel</button>
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        type="button"
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-all disabled:opacity-70 disabled:cursor-wait"
                      >
                        {isSubmitting ? 'Onboarding...' : 'Register NGO'}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Compact OTP Body */}
                    <div className="p-6 flex flex-col items-center text-center space-y-5">
                       <div className="text-center space-y-1">
                         <h4 className="text-base font-bold text-slate-900">Enter OTP Code</h4>
                         <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                           We've sent a code to <span className="text-slate-900 font-bold underline">{registeredEmail}</span>
                         </p>
                       </div>

                        <div className="flex gap-2 justify-center py-2">
                          {otpCode.map((digit, idx) => (
                            <input
                              key={idx}
                              id={`otp-${idx}`}
                              type="text"
                              autoComplete="one-time-code"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(idx, e)}
                              onPaste={handlePaste}
                              onFocus={(e) => e.target.select()}
                              className="w-10 h-10 text-center text-xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:border-emerald-600 focus:bg-white outline-none transition-all shadow-inner"
                            />
                          ))}
                        </div>

                       <div className="w-full space-y-3 pt-2">
                         <button
                           onClick={handleVerifyOtp}
                           disabled={isVerifying}
                           className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-all text-sm disabled:opacity-70"
                         >
                           {isVerifying ? 'Verifying...' : 'Validate & Activate'}
                         </button>
                         <button
                           onClick={handleClose}
                           disabled={isVerifying}
                           className="w-full py-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest"
                         >
                           Continue Later
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
