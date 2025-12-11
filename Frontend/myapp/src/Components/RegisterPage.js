import React, { useState } from 'react';
import { Car, Users, Eye, EyeOff, AlertCircle, Mail, Phone, Lock, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import API from '../api/api'; // use your API instance

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState('driver');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    carModel: '',
    licensePlate: '',
    vehicleCapacity: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone number must be 10 digits';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';

    if (selectedRole === 'driver') {
      if (!formData.carModel.trim()) newErrors.carModel = 'Car model is required';
      if (!formData.licensePlate.trim()) newErrors.licensePlate = 'License plate is required';
      if (!formData.vehicleCapacity.trim()) newErrors.vehicleCapacity = 'Vehicle capacity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: selectedRole.toUpperCase(), // DRIVER or PASSENGER
          vehicleModel: selectedRole === 'driver' ? formData.carModel : null,
          licensePlate: selectedRole === 'driver' ? formData.licensePlate : null,
          capacity: selectedRole === 'driver' ? parseInt(formData.vehicleCapacity) : null
      };


      const response = await API.post('/auth/register', payload);

      alert(response.data.message);

      // Store JWT token if returned
      if (response.data.token) localStorage.setItem('token', response.data.token);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        carModel: '',
        licensePlate: '',
        vehicleCapacity: ''
      });

      // Optionally navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-xl w-full relative z-10">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Car className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SmartRide
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Create Your Account</h1>
            <p className="text-gray-400 text-sm">Join SmartRide and start your journey</p>
          </div>

          {/* Role Selection Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setSelectedRole('passenger')}
              className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                selectedRole === 'passenger'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-slate-800/50 text-gray-400 border border-slate-700 hover:border-purple-500/50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Passenger</span>
            </button>
            <button
              onClick={() => setSelectedRole('driver')}
              className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                selectedRole === 'driver'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/50'
                  : 'bg-slate-800/50 text-gray-400 border border-slate-700 hover:border-pink-500/50'
              }`}
            >
              <Car className="w-5 h-5" />
              <span>Driver</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
                    placeholder="+91 9876543210"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Driver Fields */}
            {selectedRole === 'driver' && (
              <>
                <div className="pt-2">
                  <h3 className="text-base font-semibold text-purple-400 mb-3">Vehicle Details</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Car Model</label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        name="carModel"
                        value={formData.carModel}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
                        placeholder="Swift Dzire"
                      />
                    </div>
                    {errors.carModel && <p className="mt-1 text-xs text-red-400">{errors.carModel}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">License Plate</label>
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="3" y="6" width="18" height="12" rx="2" strokeWidth="2" />
                      </svg>
                      <input
                        type="text"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition uppercase"
                        placeholder="KA-01-AB-1234"
                      />
                    </div>
                    {errors.licensePlate && <p className="mt-1 text-xs text-red-400">{errors.licensePlate}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Vehicle Capacity</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      name="vehicleCapacity"
                      value={formData.vehicleCapacity}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
                      placeholder="Total seats available"
                    />
                  </div>
                  {errors.vehicleCapacity && (
                    <p className="mt-1 text-xs text-red-400 flex items-center space-x-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.vehicleCapacity}</span>
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Terms */}
            <div className="flex items-start space-x-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-800/50 text-purple-500 focus:ring-purple-500 focus:ring-offset-slate-900"
                required
              />
              <label htmlFor="terms" className="text-xs text-gray-400">
                I agree to the{' '}
                <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Terms & Conditions</span>{' '}
                and{' '}
                <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-[1.02] shadow-lg"

            >
              Register Now
            </button>

            <div className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <span className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer">Log in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
