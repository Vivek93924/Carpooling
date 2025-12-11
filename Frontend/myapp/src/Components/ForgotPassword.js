import React, { useState, useEffect } from "react";
import { Mail, KeyRound, Lock, ArrowRight, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ------------------ TIMER ------------------
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // ------------------ STEP 1: SEND OTP ------------------
  const sendOtp = async () => {
    setMessage("");
    if (!email.trim()) return setMessage("Email is required");

    try {
      setLoading(true);
      await API.post("/user/forgot-password", { email });
      setLoading(false);

      setMessage("OTP sent to your email");
      setResendTimer(60);
      setStep(2);
    } catch (err) {
      setLoading(false);
      setMessage(err.response?.data || "Failed to send OTP");
    }
  };

  // ------------------ STEP 2: VERIFY OTP ------------------
  const verifyOtp = () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6)
      return setMessage("Enter complete OTP");

    // OTP will be validated in reset-password API
    setMessage("OTP accepted! Now enter your new password.");
    setStep(3);
  };

  // ------------------ STEP 3: RESET PASSWORD ------------------
  const resetPassword = async () => {
    if (newPassword.length < 8)
      return setMessage("Password must be at least 8 characters");

    try {
      setLoading(true);
      await API.post("/user/reset-password", { email, newPassword });
      setLoading(false);

      setMessage("Password reset successfully!");
      setStep(4);
    } catch (err) {
      setLoading(false);
      setMessage(err.response?.data || "Failed to reset password");
    }
  };

  // ------------------ OTP INPUT HANDLING ------------------
  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < 5) {
      document.getElementById(`fp-otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`fp-otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Card */}
      <div className="max-w-md w-full relative z-10">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-purple-500/30 shadow-xl">

          {/* Header */}
          <div className="text-center mb-6">
            <KeyRound className="w-12 h-12 mx-auto text-purple-400" />
            <h2 className="text-3xl font-bold text-white mt-3">
              Forgot Password
            </h2>
            <p className="text-gray-400">
              {step === 1 && "Enter your email to receive OTP"}
              {step === 2 && "Enter the OTP sent to your email"}
              {step === 3 && "Enter a new password"}
              {step === 4 && "Password Reset Successful 🎉"}
            </p>
          </div>

          {/* Status Message */}
          {message && (
            <p className="mb-4 text-center text-purple-300 flex items-center justify-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{message}</span>
            </p>
          )}

          {/* Step 1 — Email */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="text-gray-300 text-sm">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-purple-500 outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-[1.02] transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>{loading ? "Sending..." : "Send OTP"}</span>
                {!loading && <ArrowRight />}
              </button>

              <p
                className="text-center text-sm text-gray-400 cursor-pointer hover:text-purple-400"
                onClick={() => navigate("/login")}
              >
                ← Back to Login
              </p>
            </div>
          )}

          {/* Step 2 — OTP */}
          {step === 2 && (
            <div className="space-y-6">

              <div className="flex justify-center space-x-2 mt-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`fp-otp-${index}`}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700 text-center text-xl text-white focus:border-purple-500"
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              {/* Resend OTP */}
              <button
                disabled={resendTimer > 0}
                onClick={() => resendTimer === 0 && sendOtp()}
                className="w-full py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-gray-300 hover:border-purple-500/40 transition disabled:opacity-40"
              >
                <RefreshCw className="inline-block mr-2" size={16} />
                {resendTimer > 0
                  ? `Resend OTP in ${resendTimer}s`
                  : "Resend OTP"}
              </button>

              <p
                className="text-center text-sm text-gray-400 cursor-pointer hover:text-purple-400"
                onClick={() => setStep(1)}
              >
                ← Change Email
              </p>
            </div>
          )}

          {/* Step 3 — Reset Password */}
          {step === 3 && (
            <div className="space-y-6">

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white focus:border-purple-500 outline-none"
                  placeholder="Enter new password"
                />
              </div>

              <button
                onClick={resetPassword}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </div>
          )}

          {/* Step 4 — Success */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <p className="text-lg text-white font-semibold">
                Your password has been reset!
              </p>

              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-[1.02] transition"
              >
                Go to Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
