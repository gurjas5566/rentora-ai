import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import Logo from "./Logo";
import { 
  Menu, X, LogIn, Rocket, LayoutGrid, Sparkles, Tag, 
  LogOut, LayoutDashboard, Search, User
} from "lucide-react";

const Navbar = ({ onScrollToSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, user, logoutUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (role === "TENANT") return "/tenant/dashboard";
    if (role === "OWNER") return "/owner/dashboard";
    if (role === "ADMIN") return "/admin/dashboard";
    return "/";
  };

  const isHomePage = location.pathname === "/";

  const navLinks = [
    { name: "Marketplace", icon: <LayoutGrid size={16} />, id: "marketplace", path: "/properties" },
    { name: "AI Insights", icon: <Sparkles size={16} />, id: "ai-insights" },
    { name: "Pricing", icon: <Tag size={16} />, id: "pricing" }
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 px-6 ${
      isScrolled || !isHomePage
        ? "h-20 bg-white/80 backdrop-blur-lg border-b border-rentora-border shadow-sm" 
        : "h-24 bg-transparent"
    }`}>
      <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between">
        {/* Logo Only */}
        <div className="flex items-center cursor-pointer group" onClick={() => navigate("/")}>
          <div className="relative">
            <Logo size={150} className="group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-rentora-green/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((l) => (
            <button 
              key={l.name} 
              onClick={() => {
                if (isHomePage && l.id && onScrollToSection) {
                  onScrollToSection(l.id);
                } else if (l.path) {
                  navigate(l.path);
                } else {
                  navigate("/");
                  setTimeout(() => {
                    const el = document.getElementById(l.id);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className="text-sm font-medium text-rentora-ink-mid hover:text-rentora-green transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {l.icon} {l.name}
            </button>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {role ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2.5 px-3 py-1.5 bg-rentora-ivory border border-rentora-border rounded-full shadow-sm">
                <div className="w-7 h-7 rounded-full bg-rentora-green text-white flex items-center justify-center">
                  <User size={14} />
                </div>
                <span className="text-xs font-bold text-rentora-ink-mid hidden lg:block">{user?.name || "User"}</span>
              </div>
              <button 
                onClick={() => navigate(getDashboardPath())}
                className="flex items-center gap-2 px-5 py-2.5 bg-rentora-green-pale text-rentora-green-mid border border-rentora-border rounded-xl text-sm font-semibold hover:bg-rentora-green-tint transition-all cursor-pointer"
              >
                <LayoutDashboard size={16} /> Dashboard
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-red-600 bg-red-50/50 border border-red-100 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <>
              <button 
                className="text-rentora-green border-[1.5px] border-rentora-border-mid px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-rentora-green-tint transition-all flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                <LogIn size={16} /> Login
              </button>
              <button 
                className="bg-rentora-green text-rentora-ivory px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-rentora-green-mid hover:-translate-y-px hover:shadow-rentora-md transition-all flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/register")}
              >
                <Rocket size={16} /> Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="md:hidden text-rentora-green p-2 cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-[80px] left-0 w-full bg-white border-b border-rentora-border shadow-xl z-[90] md:hidden flex flex-col p-6 gap-4 animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((l) => (
            <button 
              key={l.name} 
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (isHomePage && l.id && onScrollToSection) {
                  onScrollToSection(l.id);
                } else if (l.path) {
                  navigate(l.path);
                } else {
                  navigate("/");
                }
              }}
              className="text-left text-base font-semibold text-rentora-ink-mid flex items-center gap-3 cursor-pointer"
            >
              {l.icon} {l.name}
            </button>
          ))}
          <div className="h-px bg-rentora-border my-2" />
          {role ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 px-4 py-3 bg-rentora-ivory border border-rentora-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-rentora-green text-white flex items-center justify-center">
                  <User size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-rentora-green uppercase tracking-wider">Logged in as</span>
                  <span className="text-sm font-bold text-rentora-ink">{user?.name || "User"}</span>
                </div>
              </div>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); navigate(getDashboardPath()); }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-rentora-green-pale text-rentora-green-mid rounded-xl font-bold border border-rentora-border cursor-pointer"
              >
                <LayoutDashboard size={18} /> My Dashboard
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-bold border border-red-100 cursor-pointer"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); navigate("/login"); }}
                className="w-full py-3.5 border border-rentora-border-mid rounded-xl font-semibold text-rentora-green cursor-pointer flex items-center justify-center gap-2"
              >
                <LogIn size={18} /> Login
              </button>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); navigate("/register"); }}
                className="w-full py-3.5 bg-rentora-green text-white rounded-xl font-bold cursor-pointer flex items-center justify-center gap-2"
              >
                <Rocket size={18} /> Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
