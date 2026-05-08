import { useState, useRef } from "react";
import { AlertTriangle, Home, Building2, CheckCircle2, ShieldCheck, Zap, Users } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Logo from "../components/shared/Logo";
import NeuralBackground from "../components/shared/NeuralBackground";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const formRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "TENANT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useGSAP(() => {
    gsap.from(".reg-anim", {
      y: 15,
      opacity: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power3.out",
      delay: 0.1
    });
    
    gsap.from(".side-anim", {
      x: -20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    });
  }, { scope: formRef });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      gsap.fromTo(".reg-card", { x: -8 }, { x: 8, duration: 0.1, repeat: 5, yoyo: true });
      return;
    }

    setLoading(true);

    try {
      const data = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      loginUser(data.token, data.role);

      if (data.role === "TENANT") navigate("/tenant/dashboard");
      else if (data.role === "OWNER") navigate("/owner/dashboard");
    } catch (err) {
      setError(err.response?.data || "Registration failed!");
      gsap.fromTo(".reg-card", { x: -8 }, { x: 8, duration: 0.1, repeat: 5, yoyo: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={formRef} className="relative h-screen bg-rentora-ivory flex overflow-hidden">
      {/* ── BACKGROUND ── */}
      <NeuralBackground />

      {/* ── LEFT SIDE (Marketing/Benefits) ── */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-12 xl:p-20 relative z-10 bg-rentora-green/5 border-r border-rentora-border">
        <div className="max-w-md">
          <div className="side-anim flex items-center mb-8 xl:mb-12 group cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              <Logo size={150} className="group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-rentora-green/20 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>
          </div>
          
          <h2 className="side-anim text-3xl xl:text-4xl font-bold text-rentora-ink mb-3 xl:mb-5 leading-tight">
            Start your <span className="text-rentora-green">smarter</span> rental journey today.
          </h2>
          
          <p className="side-anim text-base text-rentora-ink-mid mb-6 xl:mb-8 font-light leading-relaxed">
            Join the elite community using AI to redefine the rental experience.
          </p>
          
          <div className="side-anim space-y-3 xl:space-y-4">
            {[
              { icon: Users, text: "Community of 50k+ Users" },
              { icon: ShieldCheck, text: "Digital Agreements" },
              { icon: Zap, text: "AI Price Negotiation" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-rentora-border group-hover:scale-110 group-hover:border-rentora-green/30 transition-all text-rentora-green">
                  <item.icon size={20} />
                </div>
                <span className="font-bold text-sm text-rentora-ink">{item.text}</span>
              </div>
            ))}
          </div>
          
          <div className="side-anim mt-8 xl:mt-10 p-5 bg-white/40 backdrop-blur-md border border-white/60 rounded-3xl flex items-center gap-4 shadow-xl shadow-rentora-green/5">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-rentora-ivory overflow-hidden shadow-sm">
                  <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <p className="text-xs text-rentora-ink-mid font-medium">
                Join <span className="text-rentora-green font-extrabold">1,200+</span> new users
              </p>
              <p className="text-[10px] text-rentora-ink/40 font-bold uppercase tracking-wider">Active this week</p>
            </div>
          </div>
          </div>
        </div>

      {/* ── RIGHT SIDE (Form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 3xl:p-40 relative z-10 overflow-hidden">
        {/* Mobile Logo */}
        <div className="lg:hidden flex flex-col items-center mb-6 reg-anim">
          <Logo size={36} />
          <h1 className="text-xl font-bold text-rentora-ink mt-2">Rentora<span className="text-rentora-green"> Account</span></h1>
        </div>

        <div className="reg-card w-full max-w-[500px] bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[32px] p-10 lg:p-12 relative">
          {/* Subtle Gradient Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-rentora-green/10 blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rentora-gold/10 blur-[80px]" />

          <div className="mb-8 reg-anim text-center lg:text-left">
            <h3 className="text-3xl font-bold text-rentora-ink mb-2">Create Account</h3>
            <p className="text-rentora-ink-mid text-sm font-light">Enter your details to get started.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-3 rounded-lg mb-4 text-[13px] flex items-center gap-2 reg-anim">
              <AlertTriangle size={16} className="shrink-0" /> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 xl:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:gap-4">
              <div className="reg-anim">
                <label className="block text-rentora-ink-mid text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/50 border border-rentora-border focus:border-rentora-green focus:ring-4 focus:ring-rentora-green/5 rounded-xl px-6 py-4 outline-none transition-all placeholder:text-rentora-ink/20 text-base"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="reg-anim">
                <label className="block text-rentora-ink-mid text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/50 border border-rentora-border focus:border-rentora-green focus:ring-4 focus:ring-rentora-green/5 rounded-xl px-6 py-4 outline-none transition-all placeholder:text-rentora-ink/20 text-base"
                  placeholder="john@rentora.ai"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="reg-anim">
              <label className="block text-rentora-ink-mid text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                I want to...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "TENANT" })}
                  className={`py-3.5 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                    formData.role === "TENANT"
                      ? "border-rentora-green bg-rentora-green/5 text-rentora-green shadow-sm"
                      : "border-rentora-border text-rentora-ink-mid hover:border-rentora-border-mid bg-white/30"
                  }`}
                >
                  <Home size={14} /> Rent Home
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "OWNER" })}
                  className={`py-3.5 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                    formData.role === "OWNER"
                      ? "border-rentora-green bg-rentora-green/5 text-rentora-green shadow-sm"
                      : "border-rentora-border text-rentora-ink-mid hover:border-rentora-border-mid bg-white/30"
                  }`}
                >
                  <Building2 size={14} /> List Home
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xl:gap-4">
              <div className="reg-anim">
                <label className="block text-rentora-ink-mid text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/50 border border-rentora-border focus:border-rentora-green focus:ring-4 focus:ring-rentora-green/5 rounded-xl px-6 py-4 outline-none transition-all placeholder:text-rentora-ink/20 text-base"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="reg-anim">
                <label className="block text-rentora-ink-mid text-xs font-bold uppercase tracking-widest mb-2 ml-1">
                  Confirm
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-white/50 border border-rentora-border focus:border-rentora-green focus:ring-4 focus:ring-rentora-green/5 rounded-xl px-6 py-4 outline-none transition-all placeholder:text-rentora-ink/20 text-base"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rentora-green cursor-pointer text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 transition-all duration-200 mt-4"
            >
              {loading ? "Processing..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <p className="reg-anim text-center text-rentora-ink-mid text-md mt-6 xl:mt-8">
            Already a member?{" "}
            <Link
              to="/login"
              className="text-rentora-green font-bold hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};


export default RegisterPage;

