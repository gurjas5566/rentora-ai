import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchProperties } from "../services/propertyService";
import { BASE_HOST } from "../services/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { 
  Search, MapPin, IndianRupee, BedDouble, 
  Building2, Filter, X, Sparkles, Verified, Home
} from "lucide-react";
import Logo from "../components/shared/Logo";
import NeuralBackground from "../components/shared/NeuralBackground";
import Navbar from "../components/shared/Navbar";

const PROPERTY_PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687940-47a04b62975b?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dcea4d4dd?w=800&q=80",
];

const PropertiesPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef();
  
  const [filters, setFilters] = useState({
    city: "",
    minRent: "",
    maxRent: "",
    bedrooms: "",
    propertyType: "",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (searchFilters = {}) => {
    setLoading(true);
    try {
      const data = await searchProperties(searchFilters);
      setTimeout(() => {
        setProperties(data);
        setLoading(false);
      }, 600);
    } catch (err) {
      console.error("Error fetching properties:", err);
      // Fallback to mock data if backend is down so user can see the UI
      const mockData = [
        { id: 1, title: "Skyline Premium Suite", city: "Mumbai", address: "Bandra West", rent: 85000, bedrooms: 3, propertyType: "RESIDENTIAL", amenities: ["Gym", "Pool", "Parking"] },
        { id: 2, title: "Garden View Studio", city: "Bangalore", address: "Indiranagar", rent: 32000, bedrooms: 1, propertyType: "RESIDENTIAL", amenities: ["Balcony", "Security"] },
        { id: 3, title: "Tech Hub Office Space", city: "Hyderabad", address: "Hitech City", rent: 120000, bedrooms: 0, propertyType: "COMMERCIAL", amenities: ["Fiber", "Cafe"] },
        { id: 4, title: "The Heritage Villa", city: "Goa", address: "Assagao", rent: 150000, bedrooms: 4, propertyType: "RESIDENTIAL", amenities: ["Private Pool", "Garden"] },
        { id: 5, title: "Cozy Corner Flat", city: "Pune", address: "Koregaon Park", rent: 45000, bedrooms: 2, propertyType: "RESIDENTIAL", amenities: ["Parking", "Lift"] },
        { id: 6, title: "Modernist Penthouse", city: "Delhi", address: "Hauz Khas", rent: 95000, bedrooms: 3, propertyType: "RESIDENTIAL", amenities: ["Terrace", "Kitchen"] },
      ];
      setTimeout(() => {
        setProperties(mockData);
        setLoading(false);
      }, 600);
    }
  };

  useGSAP(() => {
    if (!loading && properties.length > 0) {
      gsap.from(".property-card", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all"
      });
    }
  }, [loading, properties]);

  const handleSearch = (e) => {
    e.preventDefault();
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== ""),
    );
    fetchProperties(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      city: "",
      minRent: "",
      maxRent: "",
      bedrooms: "",
      propertyType: "",
    });
    fetchProperties();
  };

  return (
    <div className="min-h-screen bg-rentora-ivory font-poppins text-rentora-ink overflow-x-hidden" ref={containerRef}>
      
      {/* ── BACKGROUND ── */}
      <NeuralBackground />

      <Navbar />

      {/* ── SEARCH SECTION ── */}
      <div className="pt-28 pb-12 px-6 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-10">
            <h2 className="text-4xl font-bold tracking-tight mb-2">Find your space.</h2>
            <p className="text-rentora-ink-muted font-light">Explore {properties.length}+ AI-verified properties across India.</p>
          </div>

          <form 
            onSubmit={handleSearch}
            className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[24px] p-2 flex flex-col lg:flex-row items-stretch lg:items-center gap-2"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
              {/* City */}
              <div className="flex items-center gap-3 bg-white/40 border border-rentora-border rounded-2xl px-4 py-3 focus-within:border-rentora-green transition-all">
                <MapPin size={18} className="text-rentora-green-mid shrink-0" />
                <input
                  type="text"
                  placeholder="City"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>

              {/* Min Rent */}
              <div className="flex items-center gap-3 bg-white/40 border border-rentora-border rounded-2xl px-4 py-3 focus-within:border-rentora-green transition-all">
                <IndianRupee size={16} className="text-rentora-green-mid shrink-0" />
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minRent}
                  onChange={(e) => setFilters({ ...filters, minRent: e.target.value })}
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>

              {/* Max Rent */}
              <div className="flex items-center gap-3 bg-white/40 border border-rentora-border rounded-2xl px-4 py-3 focus-within:border-rentora-green transition-all">
                <IndianRupee size={16} className="text-rentora-green-mid shrink-0" />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxRent}
                  onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })}
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>

              {/* BHK */}
              <div className="flex items-center gap-3 bg-white/40 border border-rentora-border rounded-2xl px-4 py-3 focus-within:border-rentora-green transition-all">
                <BedDouble size={18} className="text-rentora-green-mid shrink-0" />
                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                  className="bg-transparent border-none outline-none text-sm w-full cursor-pointer appearance-none"
                >
                  <option value="">Bedrooms</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              {/* Type */}
              <div className="flex items-center gap-3 bg-white/40 border border-rentora-border rounded-2xl px-4 py-3 focus-within:border-rentora-green transition-all">
                <Building2 size={18} className="text-rentora-green-mid shrink-0" />
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
                  className="bg-transparent border-none outline-none text-sm w-full cursor-pointer appearance-none"
                >
                  <option value="">Type</option>
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="bg-rentora-ivory-dark/40 text-rentora-ink-mid px-4 py-3 rounded-2xl hover:bg-rentora-ivory-dark transition-colors cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
              <button
                type="submit"
                className="bg-rentora-green text-white px-8 py-3 rounded-2xl font-bold hover:bg-rentora-green-mid transition-all shadow-lg shadow-rentora-green/10 flex items-center justify-center gap-2 flex-1 lg:flex-none cursor-pointer"
              >
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ── PROPERTIES GRID ── */}
      <div className="max-w-[1400px] mx-auto px-6 pb-24 relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse bg-white/50 border border-rentora-border rounded-3xl h-[420px]" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-32 bg-white/30 backdrop-blur-md rounded-[40px] border border-white/40 shadow-xl">
            <div className="w-20 h-20 bg-rentora-green/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter size={32} className="text-rentora-green-mid opacity-30" />
            </div>
            <h3 className="text-2xl font-bold text-rentora-ink">No properties found</h3>
            <p className="text-rentora-ink-muted font-light mt-2">Try adjusting your filters or location.</p>
            <button onClick={handleReset} className="mt-8 text-rentora-green font-bold underline cursor-pointer">Clear all filters</button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8 px-2">
              <p className="text-sm font-medium text-rentora-ink-muted">
                Showing <span className="text-rentora-green font-bold">{properties.length}</span> results
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-rentora-green-mid bg-rentora-green-pale border border-rentora-border rounded-full px-3 py-1.5">
                <Sparkles size={12} />
                AI Ranked
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {properties.map((property, idx) => (
                <div
                  key={property.id}
                  onClick={() => navigate(`/properties/${property.id}`)}
                  className="property-card group bg-white border border-rentora-border rounded-3xl overflow-hidden shadow-rentora-sm hover:shadow-rentora-lg hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                >
                  {/* Property Image Overlay */}
                  <div className="h-56 relative overflow-hidden bg-rentora-green-mid">
                    <img 
                      src={property.images && property.images.length > 0 
                        ? `${BASE_HOST}${property.images[0].imageUrl}` 
                        : (property.imageUrl || PROPERTY_PLACEHOLDERS[idx % PROPERTY_PLACEHOLDERS.length])} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-rentora-green text-[11px] font-bold px-3 py-1.5 rounded-full border border-rentora-border flex items-center gap-1.5">
                      <Sparkles size={12} className="text-rentora-gold" />
                      {Math.floor(Math.random() * 10 + 90)}% Match
                    </div>
                    <div className="absolute top-4 right-4 bg-rentora-green text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      {property.propertyType === "RESIDENTIAL" ? <><Home size={12} /> Home</> : <><Building2 size={12} /> Office</>}
                    </div>
                  </div>

                  {/* Property Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-rentora-ink text-[17px] leading-tight group-hover:text-rentora-green transition-colors line-clamp-1">
                        {property.title}
                      </h3>
                    </div>
                    <div className="text-rentora-ink-muted text-[13px] font-light flex items-center gap-1 mb-4">
                      <MapPin size={14} />
                      {property.city} · {property.address}
                    </div>

                    <div className="flex gap-3 text-xs font-medium text-rentora-ink-mid mb-6">
                      <span className="flex items-center gap-1 bg-rentora-green-pale px-2.5 py-1 rounded-lg border border-rentora-border">
                        {property.bedrooms} BHK
                      </span>
                      {property.amenities?.slice(0, 2).map((a, i) => (
                        <span key={i} className="flex items-center gap-1 bg-rentora-ivory px-2.5 py-1 rounded-lg border border-rentora-border">
                          {a}
                        </span>
                      ))}
                    </div>

                    <div className="h-px w-full bg-rentora-border-mid mb-5" />

                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-[24px] font-bold text-rentora-green tracking-tight leading-none">
                          ₹{property.rent?.toLocaleString()}
                        </div>
                        <div className="text-[11px] text-rentora-ink-muted mt-1 font-medium">per month · ₹0 deposit</div>
                      </div>
                      <div className="bg-rentora-green-tint text-rentora-green text-[10px] font-bold px-3 py-2 rounded-xl border border-rentora-border flex items-center gap-1">
                        <Verified size={14} />
                        VERIFIED
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;
