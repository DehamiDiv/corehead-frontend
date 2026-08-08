"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  Check, 
  X, 
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  
  // Visibility and UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form Fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation States
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const id = "google-gsi-client";
    const google = (window as any).google;

    const initializeGoogleSignIn = () => {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.warn("Google Client ID not configured.");
        return;
      }

      try {
        const gg = (window as any).google;
        gg.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleLoginCallback,
        });

        gg.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { 
            type: "standard",
            theme: "outline", 
            size: "large", 
            width: 432, // Fits the signup form width
            text: "signup_with",
            shape: "rectangular"
          }
        );
      } catch (err) {
        console.error("Failed to initialize Google Sign-In:", err);
      }
    };

    if (document.getElementById(id)) {
      if (google) initializeGoogleSignIn();
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeGoogleSignIn();
    };
    document.head.appendChild(script);
  }, []);

  const handleGoogleLoginCallback = async (response: any) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const { credential } = response;
      const data = await api.googleLogin({ credential });

      // PERSIST AUTH STATE
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      // SET COOKIES for middleware
      document.cookie = `auth_token=${data.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `user_role=${data.user.role}; path=/; max-age=86400; SameSite=Lax`;

      setSuccess("Registration and login successful! Redirecting...");

      // ROLE-BASED REDIRECTION
      const isAdmin = data.user.role?.toLowerCase() === 'admin' || data.user.role?.toLowerCase() === 'administrator';
      setTimeout(() => {
        if (isAdmin) {
          router.push('/admin');
        } else {
          router.push('/blog'); 
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Google Sign-In failed.");
      setIsLoading(false);
    }
  };

  // Password Validation Criteria
  const criteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    special: /[@$!%*?&]/.test(formData.password),
  };

  const strengthScore = Object.values(criteria).filter(Boolean).length;

  const getStrengthText = () => {
    if (formData.password.length === 0) return "";
    if (strengthScore <= 2) return "Weak";
    if (strengthScore <= 4) return "Medium";
    return "Strong";
  };

  const getStrengthColorText = () => {
    if (strengthScore <= 2) return "text-red-500";
    if (strengthScore <= 4) return "text-amber-500";
    return "text-emerald-500";
  };

  const getStrengthColorBar = () => {
    if (strengthScore <= 2) return "bg-red-500";
    if (strengthScore <= 4) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const isPasswordStrong = () => {
    return strengthScore === 5;
  };

  // Field validation rules
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "firstName": {
        if (!value.trim()) return "First name is required.";
        if (value.trim().length < 2) return "First name must be at least 2 characters.";
        if (value.trim().length > 50) return "First name cannot exceed 50 characters.";
        const nameRegex = /^[\p{L}\s'\-\.]+$/u;
        if (!nameRegex.test(value.trim())) {
          return "Only letters, spaces, hyphens, periods, or apostrophes.";
        }
        return "";
      }
      case "lastName": {
        if (!value.trim()) return ""; // Optional
        if (value.trim().length < 2) return "Last name must be at least 2 characters.";
        if (value.trim().length > 50) return "Last name cannot exceed 50 characters.";
        const nameRegex = /^[\p{L}\s'\-\.]+$/u;
        if (!nameRegex.test(value.trim())) {
          return "Only letters, spaces, hyphens, periods, or apostrophes.";
        }
        return "";
      }
      case "email": {
        if (!value) return "Email address is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Please enter a valid email format.";
        return "";
      }
      case "password": {
        if (!value) return "Password is required.";
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!strongPasswordRegex.test(value)) {
          return "Password is not strong enough yet.";
        }
        return "";
      }
      case "confirmPassword": {
        if (!value) return "Please confirm your password.";
        if (value !== formData.password) return "Passwords do not match.";
        return "";
      }
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Live field validation
      const errorMsg = validateField(name, value);
      setErrors((prevErr) => ({ ...prevErr, [name]: errorMsg }));
      
      // Update confirmPassword error if password itself changes
      if (name === "password" && updated.confirmPassword) {
        const confirmErr = value === updated.confirmPassword ? "" : "Passwords do not match.";
        setErrors((prevErr) => ({ ...prevErr, confirmPassword: confirmErr }));
      }
      
      return updated;
    });
    setError(""); // Clear form level error when typing
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errorMsg = validateField(field, (formData as any)[field]);
    setErrors((prevErr) => ({ ...prevErr, [field]: errorMsg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Touch all fields to show any existing validation errors
    const allTouched = {
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    };
    setTouched(allTouched);

    const allErrors = {
      firstName: validateField("firstName", formData.firstName),
      lastName: validateField("lastName", formData.lastName),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      confirmPassword: validateField("confirmPassword", formData.confirmPassword),
    };
    setErrors(allErrors);

    const hasErrors = Object.values(allErrors).some((err) => err !== "");
    if (hasErrors) {
      setError("Please satisfy all validation requirements before submitting.");
      return;
    }

    setIsLoading(true);

    // Combine First & Last name for DB compatibility
    const fullName = formData.lastName.trim()
      ? `${formData.firstName.trim()} ${formData.lastName.trim()}`
      : formData.firstName.trim();

    try {
      await api.register({
        name: fullName,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Account created successfully! We've sent an OTP to your email.");
      
      // Redirect to verification page
      setTimeout(() => {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-300 flex flex-col font-sans relative overflow-hidden">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 pointer-events-none animate-pulse duration-10000"></div>

      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex items-center justify-between mx-auto max-w-7xl relative z-10">
        <Link href="/" className="flex items-center transition-transform hover:scale-[1.02]">
          <Image 
            src="/logo.png" 
            alt="CoreHead Logo" 
            width={220} 
            height={55} 
            className="h-14 w-auto object-contain" 
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-slate-700">Already have an account?</span>
          <Link 
            href="/login"
            className="px-5 py-2 text-sm font-bold text-blue-700 transition-all bg-white/60 backdrop-blur-md border border-white/50 rounded-full hover:bg-white hover:text-blue-800 shadow-sm hover:shadow-md"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 pb-20 relative z-10">
        <div className="w-full max-w-lg bg-white/50 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 md:p-10 transition-all duration-300 hover:shadow-indigo-500/10">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2 bg-blue-100/80 rounded-full text-blue-700 mb-3 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
              Join CoreHead
            </h1>
            <p className="text-slate-600 text-sm">
              Create an account and start building stunning web layouts instantly
            </p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <p className="font-medium">{success}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Split Names Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1">
                <label
                  htmlFor="firstName"
                  className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1"
                >
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={() => handleBlur("firstName")}
                    required
                    className={`w-full pl-9 pr-9 py-2.5 bg-white/70 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm ${
                      touched.firstName
                        ? errors.firstName
                          ? "border-red-300 focus:ring-red-400"
                          : "border-emerald-300 focus:ring-emerald-400"
                        : "border-slate-200 focus:ring-blue-400"
                    }`}
                  />
                  {touched.firstName && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 transition-all">
                      {errors.firstName ? (
                        <X className="w-4 h-4 text-red-500" />
                      ) : (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </span>
                  )}
                </div>
                {touched.firstName && errors.firstName && (
                  <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <label
                  htmlFor="lastName"
                  className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1"
                >
                  Last Name <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={() => handleBlur("lastName")}
                    className={`w-full pl-9 pr-9 py-2.5 bg-white/70 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm ${
                      touched.lastName && formData.lastName
                        ? errors.lastName
                          ? "border-red-300 focus:ring-red-400"
                          : "border-emerald-300 focus:ring-emerald-400"
                        : "border-slate-200 focus:ring-blue-400"
                    }`}
                  />
                  {touched.lastName && formData.lastName && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {errors.lastName ? (
                        <X className="w-4 h-4 text-red-500" />
                      ) : (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </span>
                  )}
                </div>
                {touched.lastName && errors.lastName && (
                  <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => handleBlur("email")}
                  required
                  className={`w-full pl-9 pr-9 py-2.5 bg-white/70 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm ${
                    touched.email
                      ? errors.email
                        ? "border-red-300 focus:ring-red-400"
                        : "border-emerald-300 focus:ring-emerald-400"
                      : "border-slate-200 focus:ring-blue-400"
                  }`}
                />
                {touched.email && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {errors.email ? (
                      <X className="w-4 h-4 text-red-500" />
                    ) : (
                      <Check className="w-4 h-4 text-emerald-500" />
                    )}
                  </span>
                )}
              </div>
              {touched.email && errors.email && (
                <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Choose a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => {
                    handleBlur("password");
                    // Wait briefly before closing requirements card so clicks are registerable
                    setTimeout(() => {
                      if (document.activeElement?.id !== "password") {
                        setIsPasswordFocused(false);
                      }
                    }, 250);
                  }}
                  required
                  className={`w-full pl-9 pr-9 py-2.5 bg-white/70 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm ${
                    touched.password
                      ? isPasswordStrong()
                        ? "border-emerald-300 focus:ring-emerald-400"
                        : "border-red-300 focus:ring-red-400"
                      : "border-slate-200 focus:ring-blue-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Password strength checklist drop-down card */}
              {(isPasswordFocused || formData.password.length > 0) && (
                <div className="mt-2.5 p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 transition-all duration-300 animate-in fade-in slide-in-from-top-1">
                  
                  {/* Real-time bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      <span>Password Strength</span>
                      <span className={getStrengthColorText()}>{getStrengthText()}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColorBar()}`}
                        style={{ width: `${(strengthScore / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Checklist criteria */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-1.5 text-[10px] text-slate-600 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      {criteria.length ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span className={criteria.length ? "text-emerald-700 font-semibold" : ""}>Min. 8 characters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {criteria.uppercase ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span className={criteria.uppercase ? "text-emerald-700 font-semibold" : ""}>One uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {criteria.lowercase ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span className={criteria.lowercase ? "text-emerald-700 font-semibold" : ""}>One lowercase letter</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {criteria.number ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span className={criteria.number ? "text-emerald-700 font-semibold" : ""}>One number (0-9)</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:col-span-2">
                      {criteria.special ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span className={criteria.special ? "text-emerald-700 font-semibold" : ""}>One special character (@$!%*?&)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  required
                  className={`w-full pl-9 pr-9 py-2.5 bg-white/70 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm ${
                    touched.confirmPassword
                      ? errors.confirmPassword
                        ? "border-red-300 focus:ring-red-400"
                        : "border-emerald-300 focus:ring-emerald-400"
                      : "border-slate-200 focus:ring-blue-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-[10px] text-red-500 ml-1 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4 flex items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase">or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Google Sign In Button */}
            <div className="w-full flex justify-center">
              <div id="google-signin-btn" className="w-full max-w-[432px]"></div>
            </div>

            {/* Back to Login Link */}
            <p className="text-center text-sm text-slate-600 mt-3 pt-1">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-700 hover:text-blue-800 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

