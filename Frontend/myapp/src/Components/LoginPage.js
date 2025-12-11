import React, { useState, useEffect } from 'react';
import { Car, Mail, Lock, ArrowRight, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import API from '../api/api';

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();

  // ------------------- Resend Timer -------------------
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // ------------------- Step 1: Send OTP -------------------
  const handleEmailSubmit = async () => {
    setError('');
    if (!email.trim()) return setError('Email is required');
    if (!/\S+@\S+\.\S+/.test(email)) return setError('Please enter a valid email');

    try {
      setLoading(true);
      await API.post('/auth/send-otp', { email }, { withCredentials: true });
      setLoading(false);
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data || 'Failed to send OTP');
    }
  };

  // ------------------- Step 2: Verify OTP -------------------
  // ------------------- Step 2: Verify OTP -------------------
  const handleVerifyOtp = async () => {
    setError('');
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return setError('Please enter complete OTP');

    try {
      setLoading(true);
      const response = await API.post('/auth/verify-otp', { email, otp: otpValue }, { withCredentials: true });
      setLoading(false);

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      // Role-based navigation after OTP verification
      if (user.password && user.password.includes('Temp')) {
        alert('OTP verified! Redirecting to your dashboard...');
        if (user.role === 'DRIVER') navigate('/driver-dashboard');
        else if (user.role === 'PASSENGER') navigate('/passenger-dashboard');
        else navigate('/home');
      } else {
        setStep(3); // ask for password
      }

    } catch (err) {
      setLoading(false);
      setError(err.response?.data || 'Failed to verify OTP');
    }
  };

  // ------------------- Step 3: Login with Password -------------------
  const handlePasswordSubmit = async () => {
    setError('');
    if (!password) return setError('Password is required');
    if (password.length < 8) return setError('Password must be at least 8 characters');

    try {
      setLoading(true);
      const response = await API.post('/auth/login', { email, password }, { withCredentials: true });
      setLoading(false);

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('role', user.role);

      // Role-based navigation after password login
      if (user.role === 'DRIVER') {
        navigate('/driver-dashboard');
      } else if (user.role === 'PASSENGER') {
        navigate('/passenger-dashboard');
      } else {
        navigate('/home');
      }

    } catch (err) {
      setLoading(false);
      setError(err.response?.data || 'Login failed');
    }
  };



  // ------------------- Resend OTP -------------------
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setResendTimer(60);
    try {
      await API.post('/auth/send-otp', { email }, { withCredentials: true });
      alert('OTP resent successfully!');
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  // ------------------- OTP Input Handlers -------------------
  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-purple-500/30">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Car className="w-10 h-10 text-purple-400" />
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                SmartRide
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">
              {step === 1 && 'Enter your email to continue'}
              {step === 2 && 'Verify your identity'}
              {step === 3 && 'Enter your password'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-slate-700 text-gray-400'
              }`}>
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-slate-700 text-gray-400'
              }`}>
                {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <div className={`w-16 h-1 rounded ${step >= 3 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-700'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                step >= 3 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-slate-700 text-gray-400'
              }`}>
                3
              </div>
            </div>
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
                    placeholder="your.email@example.com"
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </p>
                )}
              </div>

              <button
                onClick={handleEmailSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Processing...' : 'Continue'}</span>
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <span className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer">
                    Register
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
                  Enter 6-digit OTP
                </label>
                <p className="text-xs text-gray-500 text-center mb-4">
                  We've sent a verification code to {email}
                </p>
                <div className="flex justify-center space-x-2 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-purple-500 focus:outline-none transition"
                    />
                  ))}
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-400 flex items-center justify-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0}
                  className="w-full py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-gray-300 font-semibold hover:border-purple-500/50 transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>
                    {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend Code'}
                  </span>
                </button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full text-center text-sm text-gray-400 hover:text-purple-400 transition"
              >
                ← Change email
              </button>

              <div className="text-center pt-2">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <span className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer">
                    Register
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Password */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-sm text-gray-400">
                  Verification successful for
                </p>
                <p className="text-white font-semibold">{email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition"
                    placeholder="Enter your password"
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-400 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </p>
                )}
              </div>

              <div className="text-right">
                   <span
                     className="text-sm text-purple-400 hover:text-purple-300 cursor-pointer"
                     onClick={() => navigate("/forgot-password")}
                   >
                     Forgot password?
                   </span>
                 </div>

              <button
                onClick={handlePasswordSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-center text-sm text-gray-400 hover:text-purple-400 transition"
              >
                ← Start over
              </button>

              <div className="text-center pt-2">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{' '}
                  <span className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer">
                    Register
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}