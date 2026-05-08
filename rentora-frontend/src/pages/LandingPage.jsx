import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { 
  Sparkles, Cpu, ShieldCheck, CalendarCheck, MessageSquare, MapPin, 
  Search, Bot, BarChart2, Bed, Bath, Ruler, Brain, Target, Globe,
  Check, Star, ArrowRight
} from "lucide-react";
import Logo from "../components/shared/Logo";
import NeuralBackground from "../components/shared/NeuralBackground";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { getAllProperties } from "../services/propertyService";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");
  const [previewSearch, setPreviewSearch] = useState("2BHK under ₹40k in Mumbai");
  const [dynamicProperties, setDynamicProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await getAllProperties();
        if (data && data.length > 0) {
          setDynamicProperties(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Backend unreachable, using premium mock data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroData();
  }, []);

  useGSAP(() => {
    // Hero Animations
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-title span", {
      y: 60,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
    })
    .from(".hero-sub", {
      y: 20,
      opacity: 0,
      duration: 0.8
    }, "-=0.6")
    .from(".hero-search", {
      scale: 0.95,
      opacity: 0,
      duration: 0.6
    }, "-=0.4")
    .from(".hero-stats > div", {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6
    }, "-=0.4")
    .from(".ai-card", {
      x: 40,
      opacity: 0,
      duration: 1,
    }, "-=1");

    // Floating Animation for the Card
    gsap.to(".ai-card-floating", {
      y: 20,
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });

    // Scroll Animations
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
    });

  }, { scope: containerRef });

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const features = [
    { icon: <Sparkles className="text-rentora-green" />, title: "AI Price Estimator", desc: "Know the fair market rent before you negotiate. Trained on 50,000+ listings." },
    { icon: <Cpu className="text-rentora-green" />, title: "Smart Match Engine", desc: "Tell us your lifestyle. We surface only the properties that genuinely fit." },
    { icon: <ShieldCheck className="text-rentora-green" />, title: "Verified Listings", desc: "Every property is owner-verified. No ghost listings, no brokers, no surprises." },
    { icon: <CalendarCheck className="text-rentora-green" />, title: "Instant Booking", desc: "One click to schedule. Owners confirm in real time. No back-and-forth." },
    { icon: <MessageSquare className="text-rentora-green" />, title: "Direct Owner Chat", desc: "Message owners directly inside the platform. Zero middlemen." },
    { icon: <MapPin className="text-rentora-green" />, title: "Neighbourhood Insights", desc: "Commute time, safety score, nearby schools — all before you visit." },
  ];

  const properties = dynamicProperties.length > 0 ? dynamicProperties.map((p, i) => ({
    tag: i === 0 ? "Best Match" : i === 1 ? "Good Deal" : "High Demand",
    name: p.title || p.name,
    city: p.city || p.location || "Mumbai",
    price: `₹${(p.rent || p.price || 0).toLocaleString()}`,
    beds: p.bedrooms || 2,
    baths: p.bathrooms || 2,
    sqft: p.areaSqft || p.area || "1,200",
    img: p.imageUrl || PROPERTY_IMAGES[i % 3]
  })) : [
    { tag: "Best Match", name: "2 BHK in Andheri West", city: "Mumbai", price: "₹38,500", beds: 2, baths: 2, sqft: "1,200", img: PROPERTY_IMAGES[0] },
    { tag: "Good Deal", name: "2 BHK in Bandra East", city: "Mumbai", price: "₹42,000", beds: 2, baths: 2, sqft: "1,150", img: PROPERTY_IMAGES[1] },
    { tag: "High Demand", name: "3 BHK in Powai", city: "Mumbai", price: "₹48,000", beds: 3, baths: 3, sqft: "1,600", img: PROPERTY_IMAGES[2] },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-rentora-ivory text-rentora-ink font-poppins overflow-x-hidden">
      <Navbar onScrollToSection={scrollToSection} />
      
      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center pt-20 px-6">
        <NeuralBackground />
        
        <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* LEFT */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rentora-green/5 border border-rentora-green/10 rounded-full text-rentora-green text-sm font-medium mb-6">
              Trusted by 50,000+ Renters
            </div>
            
            <h1 className="hero-title text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
              <span className="block">Rent Smarter.</span>
              <span className="block text-rentora-green italic">Live Better.</span>
            </h1>
            
            <p className="hero-sub text-lg text-rentora-ink-muted max-w-xl mx-auto lg:mx-0 mb-10 font-light leading-relaxed">
              Rentora AI finds your perfect home using machine learning — verified listings, fair rent estimates, and zero broker fees.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10">
              <button 
                onClick={() => navigate("/properties")}
                className="group w-full sm:w-auto px-10 py-5 bg-rentora-green text-white rounded-2xl font-bold text-lg hover:bg-rentora-green-mid transition-all shadow-rentora-lg flex items-center justify-center gap-3"
              >
                Find Your Home
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => scrollToSection("ai-insights")}
                className="w-full sm:w-auto px-10 py-5 bg-white text-rentora-ink rounded-2xl font-bold text-lg hover:bg-rentora-ivory transition-all border border-rentora-border shadow-rentora-sm"
              >
                How it works
              </button>
            </div>
            
            <div className="hero-stats flex flex-wrap justify-center lg:justify-start gap-8 opacity-80">
              <div>
                <div className="text-2xl font-bold">12k+</div>
                <div className="text-xs uppercase tracking-wider text-rentora-ink-muted">Listings</div>
              </div>
              <div>
                <div className="text-2xl font-bold">₹0</div>
                <div className="text-xs uppercase tracking-wider text-rentora-ink-muted">Brokerage (always)</div>
              </div>
              <div>
                <div className="text-2xl font-bold">4.9/5</div>
                <div className="text-xs uppercase tracking-wider text-rentora-ink-muted">User Rating</div>
              </div>
            </div>
          </div>
          
          {/* RIGHT SIDE — PRODUCT PREVIEW */}
          <div className="relative hidden lg:flex justify-center items-center ai-card">
            <div className="ai-card-floating w-[420px] bg-white rounded-[40px] shadow-2xl border border-rentora-border p-8 relative overflow-hidden group">
              {/* Background accent */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-rentora-green/5 rounded-full blur-3xl pointer-events-none"></div>
              
              {/* Top Search Bar (Functional UI) */}
              <div className="relative mb-8">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate(`/properties?city=${previewSearch || "Mumbai"}`);
                  }}
                  className="w-full bg-rentora-ivory border border-rentora-border rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm focus-within:border-rentora-green transition-all"
                >
                  <Search size={18} className="text-rentora-green" />
                  <input 
                    type="text"
                    placeholder="Try: 2BHK in Andheri"
                    className="w-full bg-transparent border-none outline-none text-sm text-rentora-ink py-1"
                    value={previewSearch}
                    onChange={(e) => setPreviewSearch(e.target.value)}
                  />
                  <button type="submit" className="hidden">Search</button>
                </form>
              </div>

              {/* Label */}
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px flex-1 bg-rentora-border"></div>
                <span className="text-[10px] font-bold text-rentora-ink-muted uppercase tracking-[2px]">Ranked by AI</span>
                <div className="h-px flex-1 bg-rentora-border"></div>
              </div>

              {/* Results List */}
              <div className="space-y-[-16px]">
                {properties.map((p, i) => (
                  <div 
                    key={i} 
                    className={`relative bg-white border rounded-3xl p-5 shadow-rentora-sm transform transition-all duration-500 
                      ${i === 0 ? "z-30 border-2 border-rentora-green scale-100 shadow-rentora-lg group-hover:-translate-y-1" : ""}
                      ${i === 1 ? "z-20 border-rentora-border translate-y-4 scale-[0.96] opacity-90" : ""}
                      ${i === 2 ? "z-10 border-rentora-border translate-y-8 scale-[0.92] opacity-60" : ""}
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className={`font-bold text-rentora-ink ${i === 0 ? "text-base" : "text-sm"}`}>{p.name}</h4>
                        {i === 0 && <p className="text-[10px] text-rentora-ink-muted font-light">Recently listed & AI verified</p>}
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-sm
                        ${i === 0 ? "bg-rentora-green text-white border-rentora-green" : ""}
                        ${i === 1 ? "bg-rentora-gold/20 text-rentora-gold-dark border-rentora-gold/10" : ""}
                        ${i === 2 ? "bg-rentora-ink/5 text-rentora-ink-muted border-rentora-border" : ""}
                      `}>
                        {p.tag}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`font-bold ${i === 0 ? "text-lg text-rentora-green" : "text-sm text-rentora-ink"}`}>
                        {p.price}
                      </span>
                      <span className="text-[10px] text-rentora-ink-muted italic">
                        {100 - (i * 4)}% Match
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interaction Hint */}
              <div className="mt-16 text-center">
                <p className="text-[10px] text-rentora-ink-muted font-light flex items-center justify-center gap-2">
                  <Sparkles size={10} className="text-rentora-gold" />
                  Neural engine sorting live listings
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* ── FEATURES SECTION ── */}
      <section id="ai-insights" className="py-24 px-6 bg-white relative">
        <div className="max-w-[1200px] mx-auto">
          <div className="reveal text-center mb-16">
            <h2 className="text-rentora-gold font-bold text-sm uppercase tracking-[4px] mb-4">Features</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-rentora-ink mb-6">Designed for your lifestyle</h3>
            <p className="text-rentora-ink-muted max-w-2xl mx-auto font-light">
              We've combined artificial intelligence with local expertise to create a rental experience that's fast, fair, and transparent.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="reveal group p-8 bg-rentora-ivory/50 rounded-3xl border border-rentora-border hover:bg-white hover:shadow-rentora-lg hover:border-rentora-green/20 transition-all duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h4 className="text-xl font-bold text-rentora-ink mb-3">{f.title}</h4>
                <p className="text-rentora-ink-muted text-sm font-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ── MARKETPLACE PREVIEW ── */}
      <section id="marketplace" className="py-24 px-6 bg-rentora-green-pale">
        <div className="max-w-[1200px] mx-auto">
          <div className="reveal flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div className="max-w-xl">
              <h2 className="text-rentora-green font-bold text-sm uppercase tracking-[4px] mb-4">Marketplace</h2>
              <h3 className="text-4xl font-bold text-rentora-ink">Explore top-rated homes</h3>
            </div>
            <button 
              onClick={() => navigate("/properties")}
              className="flex items-center gap-2 text-rentora-green font-bold hover:gap-3 transition-all cursor-pointer"
            >
              Browse All <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((p, i) => (
              <div key={i} className="reveal group bg-white rounded-3xl overflow-hidden border border-rentora-border shadow-rentora-sm hover:shadow-rentora-lg transition-all">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-rentora-green border border-rentora-green/10">
                    {p.tag}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-rentora-ink mb-1">{p.name}</h4>
                      <p className="text-sm text-rentora-ink-muted flex items-center gap-1">
                        <MapPin size={14} /> {p.city}
                      </p>
                    </div>
                    <div className="text-lg font-bold text-rentora-green">{p.price}</div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-rentora-ink-muted mb-6">
                    <span className="flex items-center gap-1.5"><Bed size={16} /> {p.beds}</span>
                    <span className="flex items-center gap-1.5"><Bath size={16} /> {p.baths}</span>
                    <span className="flex items-center gap-1.5"><Ruler size={16} /> {p.sqft}</span>
                  </div>
                  <button 
                    onClick={() => navigate("/properties")}
                    className="w-full py-3 bg-rentora-ivory border border-rentora-border rounded-xl font-bold text-rentora-ink hover:bg-rentora-green hover:text-white hover:border-rentora-green transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="py-24 px-6 bg-white overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="reveal text-center mb-16">
            <h2 className="text-rentora-gold font-bold text-sm uppercase tracking-[4px] mb-4">Pricing</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-rentora-ink">Choose your plan</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="reveal p-10 rounded-[40px] bg-rentora-ivory/50 border border-rentora-border flex flex-col">
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-rentora-ink mb-2">Standard</h4>
                <p className="text-rentora-ink-muted font-light mb-6">Perfect for quick house hunting.</p>
                <div className="text-4xl font-bold text-rentora-ink">₹0 <span className="text-sm font-normal opacity-50 italic">forever</span></div>
              </div>
              <div className="space-y-4 mb-10 flex-1">
                {["Unlimited Browsing", "AI Price Valuation", "Standard Support", "Verified Listings"].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-rentora-ink-mid">
                    <Check size={18} className="text-rentora-green" /> {f}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate("/register")}
                className="w-full py-4 bg-white border border-rentora-border rounded-2xl font-bold text-rentora-ink hover:border-rentora-green transition-all cursor-pointer"
              >
                Join Free
              </button>
            </div>
            
            {/* Premium Plan */}
            <div className="reveal p-10 rounded-[40px] bg-rentora-ink text-white border border-rentora-ink shadow-rentora-lg flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-rentora-gold text-rentora-ink px-6 py-2 rounded-bl-2xl text-[10px] font-bold uppercase tracking-widest">Recommended</div>
              <div className="mb-8">
                <h4 className="text-2xl font-bold mb-2">Gold Member</h4>
                <p className="text-white/60 font-light mb-6">For the serious renter who wants the best.</p>
                <div className="text-4xl font-bold">₹499 <span className="text-sm font-normal opacity-50">/month</span></div>
              </div>
              <div className="space-y-4 mb-10 flex-1">
                {["Early Access to Listings", "AI Negotiation Assistant", "Priority Visit Booking", "Verified Tenant Badge", "Premium Chat Support"].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Star size={18} className="text-rentora-gold fill-rentora-gold" /> {f}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate("/register")}
                className="w-full py-4 bg-rentora-gold text-rentora-ink rounded-2xl font-bold hover:bg-white hover:text-rentora-ink transition-all shadow-rentora-md cursor-pointer"
              >
                Upgrade to Gold
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* ── TRUST / CTA SECTION ── */}
      <section className="py-24 px-6 bg-rentora-green relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rentora-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-[1000px] mx-auto text-center relative z-10">
          <p className="text-white/40 font-bold text-xs uppercase tracking-[4px] mb-6">Start your journey</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            The future of renting is here. <br/> Join the movement.
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-12 font-light text-lg">
            Every listing is owner-verified. Every price is AI-benchmarked. No fake listings, no inflated rents, no brokerage.
          </p>
          <button 
            onClick={() => navigate("/register")}
            className="px-12 py-5 bg-white text-rentora-green rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-rentora-lg cursor-pointer"
          >
            Get Started Free
          </button>
        </div>
      </section>
      
      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
};

export default LandingPage;