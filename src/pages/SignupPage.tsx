import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  ShoppingBag,
  ArrowRight,
  Shield,
} from "lucide-react";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // New State for OTP
  const [step, setStep] = useState<"details" | "otp">("details"); // New State for Step

  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOtp = async () => {
    // Frontend Validation
    if (!name || !email || !mobile || !password) {
      setError("All fields are required");
      return;
    }
    // ... existing regex checks ...
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email address");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError(
        "Invalid Indian mobile number (must be 10 digits starting with 6-9)"
      );
      return;
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      setError(
        "Password must be 8+ chars, with 1 Uppercase, 1 Lowercase, 1 Number, and 1 Symbol (@$!%*?&)"
      );
      return;
    }

    try {
      await api.post("/auth/signup/request-otp", {
        name,
        email,
        mobile,
        password,
      });
      setStep("otp");
      setError("");
    } catch (err: unknown) {
      const error = err as {
        response?: {
          data?: { errors?: Array<{ msg: string }>; message?: string };
        };
      };
      const msg = error.response?.data?.errors
        ? error.response.data.errors[0].msg
        : error.response?.data?.message || "Failed to send OTP";
      setError(msg);
    }
  };

  const handleVerifySignup = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const { data } = await api.post("/auth/signup/verify", {
        name,
        email,
        mobile,
        password,
        otp,
      });
      register(data);
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Verification failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (step === "details") {
      await handleRequestOtp();
    } else {
      await handleVerifySignup();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl mb-4 shadow-xl">
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            SAS A1 Beef Stall
          </h1>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl border-2 border-gray-100 dark:border-dark-border overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary-600 to-accent-600 px-8 py-10 text-white overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            </div>
            <div className="relative">
              <h2 className="text-3xl font-black mb-2">
                {step === "details" ? "Create Account" : "Verify OTP"}
              </h2>
              <p className="text-white/80 font-medium">
                {step === "details"
                  ? "Join us for fresh quality meats"
                  : "We sent a code to your email"}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-semibold">
                  {error}
                </div>
              )}

              {step === "details" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 font-medium"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 font-medium"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        maxLength={10}
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 font-medium"
                        placeholder="98XXXXXXXX"
                        value={mobile}
                        onChange={(e) =>
                          setMobile(e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 font-medium"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-2xl mb-4">
                      <Shield className="w-8 h-8 text-primary-600" />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We sent a <span className="font-bold">6-digit code</span>{" "}
                      to
                    </p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 text-center text-3xl font-black tracking-widest"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-lg py-4 group flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-6 h-6" />
                ) : step === "details" ? (
                  <>
                    Send Verification Code
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    Verify & Create Account
                    <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </>
                )}
              </button>

              {step === "otp" && (
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="w-full text-center text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
                >
                  ← Go Back
                </button>
              )}
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
