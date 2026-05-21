import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/authService";
import API, { BASE_HOST } from "../services/axiosConfig";
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import NeuralBackground from "../components/shared/NeuralBackground";
import Navbar from "../components/shared/Navbar";
import OwnerMessaging from "../components/owner/OwnerMessaging";
import { 
  Plus, Home, MessageSquare, Calendar, BarChart3, 
  MapPin, Trash2, CheckCircle2, AlertCircle, 
  ChevronRight, Camera, Upload, Settings, 
  Clock, DollarSign, Layers, ShieldCheck
} from "lucide-react";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [listings, setListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [visits, setVisits] = useState([]);
  const [isAddingListing, setIsAddingListing] = useState(false);
  const contentRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    pincode: "",
    rent: "",
    areaSqft: "",
    propertyType: "APARTMENT",
    bedrooms: "1",
    furnishing: "UNFURNISHED",
    description: "",
    amenities: "",
    images: [],
  });
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchListings();
    fetchInquiries();
    fetchVisits();
  }, []);

  useGSAP(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) { console.error(err); }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/owner/stats");
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchListings = async () => {
    try {
      const res = await API.get("/owner/listings");
      let data = res.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { console.error("Failed to parse listings JSON", e); }
      }
      setListings(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Fetch listings error:", err); 
      setListings([]);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await API.get("/owner/inquiries");
      let data = res.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { console.error("Failed to parse inquiries JSON", e); }
      }
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Fetch inquiries error:", err); 
      setInquiries([]);
    }
  };

  const fetchVisits = async () => {
    try {
      const res = await API.get("/owner/visits");
      let data = res.data;
      if (typeof data === 'string') {
        try { data = JSON.parse(data); } catch (e) { console.error("Failed to parse visits JSON", e); }
      }
      setVisits(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Fetch visits error:", err); 
      setVisits([]);
    }
  };

  const handleSubmitListing = async (e) => {
    e.preventDefault();
    try {
      const { images, ...formDataWithoutImages } = formData;
      const propertyPayload = {
        ...formDataWithoutImages,
        amenities: formData.amenities ? formData.amenities.split(",").map((s) => s.trim()).filter(s => s !== "") : [],
      };
      const res = await API.post("/properties", propertyPayload);
      const propertyId = res.data.id;

      // Upload images if any
      if (formData.images && formData.images.length > 0) {
        const imageFormData = new FormData();
        Array.from(formData.images).forEach(file => {
          imageFormData.append("files", file);
        });
        await API.post(`/properties/${propertyId}/images`, imageFormData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      }

      setIsAddingListing(false);
      setFormData({ 
        title: "", address: "", city: "", pincode: "", rent: "", areaSqft: "", 
        propertyType: "APARTMENT", bedrooms: "1", furnishing: "UNFURNISHED", 
        description: "", amenities: "", images: [] 
      });
      setPreviews([]);
      fetchListings();
      fetchStats();
    } catch (err) { 
      console.error(err);
      const errorMsg = err.response?.data || err.message || "Error adding property!";
      alert(errorMsg); 
    }
  };

  const handleDeleteListing = async (id) => {
    if (window.confirm("Delete this listing?")) {
      try {
        await API.delete(`/properties/${id}`);
        fetchListings();
        fetchStats();
      } catch (err) { alert("Error deleting listing!"); }
    }
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "listings", label: "My Listings", icon: Home },
    { key: "inquiries", label: "Inquiries", icon: MessageSquare },
    { key: "visits", label: "Visits", icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-rentora-ivory text-rentora-ink font-poppins relative">
      <NeuralBackground />
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-1 bg-rentora-green-pale border border-rentora-border rounded-2xl p-1.5 shadow-sm">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key 
                    ? 'bg-rentora-ink text-white shadow-md' 
                    : 'text-rentora-ink-muted hover:text-rentora-ink hover:bg-white/50'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div ref={contentRef} className="space-y-8">
            <div className="bg-gradient-to-br from-rentora-ink to-rentora-ink-mid rounded-[40px] p-12 text-white relative overflow-hidden shadow-rentora-lg border border-white/10">
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-rentora-green/10 blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-rentora-gold/10 blur-[80px] pointer-events-none" />
              <p className="text-sm text-rentora-gold font-bold mb-3 uppercase tracking-[0.2em]">Asset Portfolio</p>
              <h1 className="text-5xl font-bold mb-6 tracking-tight">
                Welcome back, {profile?.name || "Owner"} 👋
              </h1>
              <p className="text-white/60 font-light max-w-2xl text-lg leading-relaxed">
                Your properties are being optimized by Rentora AI. You have <span className="text-rentora-green font-bold">{inquiries.length} active inquiries</span> awaiting your response.
              </p>
            </div>

            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Listings', value: stats.totalProperties, icon: Home, color: 'text-rentora-ink' },
                  { label: 'Active', value: stats.activeProperties, icon: CheckCircle2, color: 'text-rentora-green' },
                  { label: 'Total Inquiries', value: inquiries.length, icon: MessageSquare, color: 'text-rentora-gold-dark' },
                  { label: 'Total Visits', value: visits.length, icon: Calendar, color: 'text-rentora-ink-mid' },
                ].map((s, i) => (
                  <div key={i} className="bg-white border border-rentora-border rounded-3xl p-8 shadow-sm hover:shadow-rentora-md transition-all group">
                    <div className={`w-12 h-12 rounded-2xl bg-rentora-green-pale flex items-center justify-center mb-4 ${s.color}`}>
                      <s.icon size={24} />
                    </div>
                    <p className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</p>
                    <p className="text-[10px] text-rentora-ink-muted font-bold uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white border border-rentora-border rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold flex items-center gap-3">
                    <Clock size={20} className="text-rentora-ink" /> Recent Activity
                  </h3>
                  <button onClick={() => setActiveTab('listings')} className="text-xs font-bold text-rentora-gold hover:underline">View All</button>
                </div>
                <div className="space-y-4">
                  {listings.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-rentora-green-pale/30 border border-rentora-border rounded-2xl hover:border-rentora-border-mid transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl border border-rentora-border flex items-center justify-center text-rentora-ink group-hover:bg-rentora-ink group-hover:text-white transition-colors">
                          <Home size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-rentora-ink">{item.title}</p>
                          <p className="text-[10px] text-rentora-ink-muted uppercase tracking-wider">{item.city}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-rentora-green">₹{item.rent?.toLocaleString()}</p>
                        <p className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${item.status === 'ACTIVE' ? 'text-rentora-green border-rentora-green/20' : 'text-rentora-gold-dark border-rentora-gold/20'}`}>
                          {item.status}
                        </p>
                      </div>
                    </div>
                  ))}
                  {listings.length === 0 && <p className="text-center py-10 text-rentora-ink-muted italic text-sm">No listings found.</p>}
                </div>
              </div>

              <div className="bg-white border border-rentora-border rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-rentora-gold-light rounded-full flex items-center justify-center mb-6 ring-1 ring-rentora-gold/10">
                  <Plus size={40} className="text-rentora-gold-dark" />
                </div>
                <h3 className="text-xl font-bold mb-2">Grow your portfolio</h3>
                <p className="text-sm text-rentora-ink-muted max-w-xs mb-8">
                  Ready to list a new property? Our AI will help you find the perfect tenant.
                </p>
                <button onClick={() => { setActiveTab('listings'); setIsAddingListing(true); }} className="w-full py-4 bg-rentora-ink text-white rounded-2xl font-bold text-sm shadow-rentora-sm hover:bg-black transition-all">
                  Create New Listing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── LISTINGS TAB ── */}
        {activeTab === "listings" && (
          <div ref={contentRef} className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-rentora-ink">Your Properties</h2>
                <p className="text-sm text-rentora-ink-muted">Manage and monitor your property listings</p>
              </div>
              {!isAddingListing && (
                <button 
                  onClick={() => setIsAddingListing(true)}
                  className="px-6 py-3 bg-rentora-ink text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-rentora-sm hover:bg-black transition-all"
                >
                  <Plus size={18} /> Add Property
                </button>
              )}
            </div>

            {isAddingListing ? (
              <div className="bg-white border border-rentora-border rounded-3xl p-8 lg:p-12 shadow-rentora-lg relative">
                <button onClick={() => setIsAddingListing(false)} className="absolute top-6 right-6 p-2 text-rentora-ink-muted hover:text-rentora-ink">
                  <Plus size={24} className="rotate-45" />
                </button>
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-rentora-ink mb-2">New Property Details</h3>
                  <p className="text-sm text-rentora-ink-muted mb-10">Fill in the information below to list your property on Rentora.</p>
                  
                  <form onSubmit={handleSubmitListing} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-rentora-ink-muted uppercase tracking-wider">Property Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Luxury 2BHK in Bandra" 
                          className="w-full bg-rentora-ivory border border-rentora-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-rentora-green/20 outline-none transition-all"
                          value={formData.title} 
                          onChange={(e) => setFormData({...formData, title: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-rentora-ink-muted uppercase tracking-wider">Property Type</label>
                        <select 
                          className="w-full bg-rentora-ivory border border-rentora-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-rentora-green/20 outline-none transition-all"
                          value={formData.propertyType} 
                          onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                        >
                          <option value="APARTMENT">Apartment</option>
                          <option value="HOUSE">House</option>
                          <option value="VILLA">Villa</option>
                          <option value="OFFICE">Office</option>
                          <option value="RESIDENTIAL">Residential (Other)</option>
                          <option value="COMMERCIAL">Commercial (Other)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-rentora-ink-muted uppercase tracking-wider">Address</label>
                      <input 
                        type="text" 
                        placeholder="Street address, building name" 
                        className="w-full bg-rentora-ivory border border-rentora-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-rentora-green/20 outline-none transition-all"
                        value={formData.address} 
                        onChange={(e) => setFormData({...formData, address: e.target.value})} 
                        required 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-rentora-ink-muted uppercase tracking-wider">City</label>
                        <input 
                          type="text" 
                          placeholder="Mumbai" 
                          className="w-full bg-rentora-ivory border border-rentora-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-rentora-green/20 outline-none transition-all"
                          value={formData.city} 
                          onChange={(e) => setFormData({...formData, city: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-rentora-ink-muted uppercase tracking-wider">Pincode</label>
                        <input 
                          type="text" 
                          placeholder="400001" 
                          className="w-full bg-rentora-ivory border border-rentora-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-rentora-green/20 outline-none transition-all"
                          value={formData.pincode} 
                          onChange={(e) => setFormData({...formData, pincode: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-rentora-ink-muted uppercase tracking-wider">Rent (₹)</label>
                        <input 
                          type="number" 
                          placeholder="45000" 
                          className="w-full bg-rentora-ivory border border-rentora-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-rentora-green/20 outline-none transition-all font-bold text-rentora-green"
                          value={formData.rent} 
                          onChange={(e) => setFormData({...formData, rent: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-rentora-ink-muted uppercase tracking-wider">Area (Sqft)</label>
                        <input 
                          type="number" 
                          placeholder="1200" 
                          className="w-full bg-rentora-ivory border border-rentora-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-rentora-green/20 outline-none transition-all"
                          value={formData.areaSqft} 
                          onChange={(e) => setFormData({...formData, areaSqft: e.target.value})} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-rentora-ink-muted uppercase tracking-wider">Bedrooms</label>
                        <select 
                          className="w-full bg-rentora-ivory border border-rentora-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-rentora-green/20 outline-none transition-all"
                          value={formData.bedrooms} 
                          onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                        >
                          <option value="1">1 BHK</option>
                          <option value="2">2 BHK</option>
                          <option value="3">3 BHK</option>
                          <option value="4">4+ BHK</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-rentora-ink-muted uppercase tracking-wider">Furnishing</label>
                        <select 
                          className="w-full bg-rentora-ivory border border-rentora-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-rentora-green/20 outline-none transition-all"
                          value={formData.furnishing} 
                          onChange={(e) => setFormData({...formData, furnishing: e.target.value})}
                        >
                          <option value="UNFURNISHED">Unfurnished</option>
                          <option value="SEMI_FURNISHED">Semi-furnished</option>
                          <option value="FULLY_FURNISHED">Fully-furnished</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-rentora-ink-muted uppercase tracking-wider">Description</label>
                      <textarea 
                        placeholder="Describe your property (e.g. Near metro station, well ventilated...)" 
                        className="w-full bg-rentora-ivory border border-rentora-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-rentora-green/20 outline-none transition-all min-h-[80px]"
                        value={formData.description} 
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-rentora-ink-muted uppercase tracking-wider">Amenities (Comma separated)</label>
                      <textarea 
                        placeholder="WiFi, Gym, Parking, Pool" 
                        className="w-full bg-rentora-ivory border border-rentora-border rounded-xl px-4 py-3.5 text-sm focus:ring-2 focus:ring-rentora-green/20 outline-none transition-all min-h-[100px]"
                        value={formData.amenities} 
                        onChange={(e) => setFormData({...formData, amenities: e.target.value})} 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-rentora-ink-muted uppercase tracking-wider">Property Images</label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-rentora-border rounded-2xl cursor-pointer bg-rentora-ivory hover:bg-rentora-green-pale/50 transition-all">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-rentora-ink-muted" />
                            <p className="text-xs text-rentora-ink-muted">
                              <span className="font-bold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-[10px] text-rentora-ink-muted">Selected: {formData.images?.length || 0} files</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            multiple 
                            accept="image/*"
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              setFormData({...formData, images: e.target.files});
                              const newPreviews = files.map(file => URL.createObjectURL(file));
                              setPreviews(newPreviews);
                            }}
                          />
                        </label>
                      </div>
                      {previews.length > 0 && (
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-4">
                          {previews.map((url, i) => (
                            <div key={i} className="aspect-square rounded-lg overflow-hidden border border-rentora-border bg-white relative group">
                              <img src={url} className="w-full h-full object-cover" alt="preview" />
                              <button 
                                type="button"
                                onClick={() => {
                                  const updatedPreviews = previews.filter((_, index) => index !== i);
                                  setPreviews(updatedPreviews);
                                  // Note: removing from FileList is tricky, usually we just filter during upload
                                }}
                                className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Plus size={12} className="rotate-45" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button type="submit" className="flex-1 py-4 bg-rentora-ink text-white rounded-2xl font-bold text-sm shadow-rentora-sm hover:bg-black transition-all">
                        Publish Listing
                      </button>
                      <button type="button" onClick={() => setIsAddingListing(false)} className="px-8 py-4 bg-rentora-green-pale text-rentora-ink-mid rounded-2xl font-bold text-sm hover:bg-rentora-border transition-all">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings?.map((item) => (
                  <div key={item.id} className="bg-white border border-rentora-border rounded-3xl overflow-hidden shadow-sm hover:shadow-rentora-md transition-all group relative">
                    <div className="h-48 bg-rentora-green-pale relative overflow-hidden">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={`${BASE_HOST}${item.images[0].imageUrl}`} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          alt={item.title}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-rentora-ink-muted opacity-20 group-hover:scale-110 transition-transform duration-500">
                          <Home size={64} />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md ${item.status === 'ACTIVE' ? 'bg-rentora-green/10 text-rentora-green border-rentora-green/20' : 'bg-rentora-gold/10 text-rentora-gold-dark border-rentora-gold/20'}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-rentora-ink mb-1 truncate">{item.title}</h4>
                      <p className="text-[10px] text-rentora-ink-muted uppercase tracking-wider mb-4 flex items-center gap-1.5">
                        <MapPin size={12} className="text-red-400" /> {item.city}
                      </p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-lg font-bold text-rentora-green">₹{item.rent?.toLocaleString()}</p>
                          <p className="text-[10px] text-rentora-ink-muted font-medium">{item.areaSqft} Sqft • {item.propertyType}</p>
                        </div>
                        <button 
                          onClick={() => handleDeleteListing(item.id)}
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {listings.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-white border border-rentora-border rounded-3xl shadow-sm">
                    <Home size={48} className="mx-auto mb-4 text-rentora-green-pale" />
                    <h3 className="text-lg font-bold text-rentora-ink">No properties listed yet</h3>
                    <p className="text-sm text-rentora-ink-muted mt-2">Start by adding your first property.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── INQUIRIES TAB ── */}
        {activeTab === 'inquiries' && (
          <div className="space-y-8" ref={contentRef}>
            <div className="mb-5">
              <h2 className="text-[22px] font-bold text-rentora-ink mb-1">
                Messages
              </h2>
              <p className="text-sm text-rentora-ink-muted">
                Chat with tenants directly 
              </p>
            </div>
            <OwnerMessaging profile={profile}/>
          </div>
)}



        {/* ── VISITS TAB ── */}
        {activeTab === "visits" && (
          <div ref={contentRef} className="space-y-8">
            <h2 className="text-2xl font-bold text-rentora-ink">Visit Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visits?.length > 0 ? (
                visits.map((visit) => (
                  <div key={visit.id} className="bg-white border border-rentora-border rounded-3xl p-8 shadow-sm hover:border-rentora-border-mid transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-rentora-green-tint rounded-2xl flex items-center justify-center text-rentora-green">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-rentora-ink">{visit.tenant?.name}</p>
                          <p className="text-[10px] text-rentora-ink-muted uppercase tracking-wider">Scheduled Visit</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-rentora-green/10 text-rentora-green text-[10px] font-bold border border-rentora-green/20">
                        CONFIRMED
                      </span>
                    </div>
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-sm font-medium text-rentora-ink-mid">
                          <Clock size={16} className="text-rentora-gold" /> 
                          {new Date(visit.visitDate).toLocaleString('en-IN', { 
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit' 
                          })}
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-rentora-ink-mid">
                          <Home size={16} className="text-rentora-ink" /> {visit.property?.title}
                        </div>
                        <div className="flex items-center gap-3 text-[12px] text-rentora-ink-muted">
                          <MapPin size={14} /> {visit.property?.address}, {visit.property?.city}
                        </div>
                      </div>
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-rentora-ivory border border-rentora-border rounded-xl text-[11px] font-bold text-rentora-ink hover:bg-rentora-border transition-all uppercase tracking-tight">Reschedule</button>
                      <button className="flex-1 py-3 bg-red-50 text-red-500 rounded-xl text-[11px] font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-tight">Cancel</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white border border-rentora-border rounded-3xl shadow-sm">
                  <Calendar size={48} className="mx-auto mb-4 text-rentora-green-pale" />
                  <h3 className="text-lg font-bold text-rentora-ink">No visits scheduled</h3>
                  <p className="text-sm text-rentora-ink-muted mt-2">Your visit calendar is currently empty.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
