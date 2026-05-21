import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPropertyById } from "../services/propertyService";
import API, { BASE_HOST } from "../services/axiosConfig";
import Navbar from "../components/shared/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, MapPin, Bed, Bath, Square, User, Star, 
  MessageSquare, Calendar, Sparkles, ChevronRight, ChevronLeft,
  Info, Shield, Clock, Heart, Share2, Map, Check,
  Bot, Lock, ArrowLeft
} from "lucide-react";

// ─── Property images map ──────────────────────────────
const UNSPLASH_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=80",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=80",
];

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  // Action states
  const [message, setMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitBooked, setVisitBooked] = useState(false);
  const [aiPrice, setAiPrice] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);

  // Derived images array for gallery
  const allImages = property?.images?.length > 0 
    ? property.images.map(img => `${BASE_HOST}${img.imageUrl}`)
    : [
        property?.imageUrl || UNSPLASH_IMAGES[id ? id.charCodeAt(0) % UNSPLASH_IMAGES.length : 0],
        ...UNSPLASH_IMAGES.slice(1, 5)
      ];

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentImageIndex((prev) => (prev + newDirection + allImages.length) % allImages.length);
  };

  useEffect(() => {
    if (allImages.length <= 1) return;
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [allImages.length]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };


  useEffect(() => {
    fetchProperty();
    fetchReviews();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const data = await getPropertyById(id);
      setProperty(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await API.get(`/reviews/property/${id}`);
      setReviews(data.data.reviews || []);
      setAvgRating(data.data.averageRating || 0);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const requireLogin = () => {
    setShowLoginPrompt(true);
    setTimeout(() => setShowLoginPrompt(false), 3000);
  };

  const handleSendMessage = async () => {
    if (!role) {
      requireLogin();
      return;
    }
    try {
      await API.post("/messages", {
        propertyId: id,
        content: message,
      });
      setMessageSent(true);
      setMessage("");
    } catch (err) {
      alert("Error sending message!");
    }
  };

  const handleBookVisit = async () => {
    if (!role) {
      requireLogin();
      return;
    }
    try {
      await API.post("/schedules", {
        propertyId: id,
        visitDate: visitDate,
      });
      setVisitBooked(true);
    } catch (err) {
      alert("Error booking visit!");
    }
  };

  const handleAIPrice = async () => {
    setAiLoading(true);
    try {
      const response = await API.post("/ai/estimate-price", {
        city: `${property.city} - ${property.address}`,
        bedrooms: property.bedrooms,
        areaSqft: property.areaSqft || 800,
        furnishing: property.furnishing || "Semi-Furnished",
        amenities: property.amenities || [],
      });
      setAiPrice(response.data.estimate);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-rentora-ivory flex items-center justify-center font-poppins">
        <div className="text-center">
          <div className="w-12 h-12 border-[3px] border-rentora-green-tint border-t-rentora-green rounded-full animate-spin mx-auto mb-4" />
          <p className="text-rentora-ink-muted text-sm">Loading property...</p>
        </div>
      </div>
    );

  if (!property)
    return (
      <div className="min-h-screen bg-rentora-ivory flex items-center justify-center font-poppins">
        <p className="text-rentora-ink-muted">Property not found!</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-rentora-ivory font-poppins text-rentora-ink pb-15">
      <Navbar />

      {/* ── HERO SECTION — Image + Details ── */}
      <div className="max-w-[1100px] mx-auto px-[6%] pt-24 mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-rentora-ink-muted hover:text-rentora-green transition-colors text-sm font-semibold mb-4 cursor-pointer group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Listings
        </button>
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 items-start">
          {/* LEFT — Image */}
          <div>
            <div className="rounded-[20px] overflow-hidden h-[420px] relative shadow-rentora-md group bg-rentora-ink">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={currentImageIndex}
                  src={allImages[currentImageIndex]}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentNode.style.background =
                      "linear-gradient(135deg, #2D6A3F, #4A8C5C)";
                  }}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 z-10 cursor-pointer"
                onClick={() => paginate(-1)}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 z-10 cursor-pointer"
                onClick={() => paginate(1)}
              >
                <ChevronRight size={24} />
              </button>

              {/* Status badge */}
              <div
                className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white backdrop-blur-[4px] bg-[#2D9A4E]/90 z-10"
              >
                ✓ Available
              </div>
              {/* Property type badge */}
              <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rentora-ivory/95 text-rentora-green border border-rentora-border-mid">
                {property.propertyType}
              </div>
            </div>

            {/* Thumbnail row */}
            <div className="grid grid-cols-5 gap-2 mt-2.5">
              {allImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => {
                    const newDirection = i > currentImageIndex ? 1 : -1;
                    setDirection(newDirection);
                    setCurrentImageIndex(i);
                  }}
                  className={`rounded-xl overflow-hidden h-[70px] cursor-pointer transition-all duration-300 border-2 ${
                    currentImageIndex === i ? "border-rentora-green opacity-100 scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentNode.style.background =
                        "var(--color-rentora-green-tint)";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Details + Actions */}
          <div>
            {/* Title */}
            <h1 className="text-[26px] font-bold text-rentora-ink leading-tight mb-2 tracking-[-0.5px]">
              {property.title}
            </h1>

            {/* Location */}
            <p className="text-sm text-rentora-ink-muted mb-4 flex items-center gap-1">
              <span className="flex items-center gap-1.5"><MapPin size={16} /> {property.address}, {property.city}</span>
              {property.pincode && ` - ${property.pincode}`}
            </p>

            {/* Rating */}
            {avgRating > 0 && (
              <div className="flex items-center gap-1.5 mb-4">
                <div className="flex gap-[2px]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-[14px] ${
                        star <= Math.round(avgRating)
                          ? "text-[#B8962E]"
                          : "text-[#DDD]"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-[13px] font-semibold text-rentora-ink">
                  {avgRating}
                </span>
                <span className="text-[13px] text-rentora-ink-muted">
                  ({reviews.length} reviews)
                </span>
              </div>
            )}

            {/* Price box */}
            <div className="bg-white border border-rentora-border rounded-2xl p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[32px] font-bold text-rentora-green tracking-[-1px]">
                    ₹{property.rent?.toLocaleString()}
                  </span>
                  <span className="text-sm text-rentora-ink-muted">/month</span>
                </div>
                {property.deposit && (
                  <div className="text-right">
                    <p className="text-[11px] text-rentora-ink-muted mb-[2px]">
                      Deposit
                    </p>
                    <p className="text-base font-semibold text-rentora-ink">
                      ₹{property.deposit?.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: "Bedrooms", value: `${property.bedrooms} BHK` },
                {
                  label: "Area",
                  value: property.areaSqft
                    ? `${property.areaSqft} sqft`
                    : "N/A",
                },
                { label: "Furnishing", value: property.furnishing || "N/A" },
              ].map((spec, i) => (
                <div
                  key={i}
                  className="bg-white border border-rentora-border rounded-xl p-3 text-center"
                >
                  <p className="text-[11px] text-rentora-ink-muted mb-1 font-medium">
                    {spec.label}
                  </p>
                  <p className="text-[13px] font-semibold text-rentora-ink">
                    {spec.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {property.amenities.map((a, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-rentora-green-pale border border-rentora-border text-rentora-green-mid"
                  >
                    ✓ {a}
                  </span>
                ))}
              </div>
            )}

            {/* Owner info */}
            <div className="flex items-center gap-2.5 mb-5 py-3 px-4 bg-white border border-rentora-border rounded-xl">
              <div className="w-10 h-10 bg-rentora-green-tint rounded-full flex items-center justify-center text-lg shrink-0">
                <User size={24} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-rentora-ink">
                  {property.owner?.name}
                </p>
                <p className="text-[11px] text-rentora-ink-muted">
                  Property Owner · Verified ✓
                </p>
              </div>
            </div>

            {/* Action buttons */}
            {role !== "OWNER" && role !== "ADMIN" && (
              <div className="flex flex-col gap-3">
                <button
                  className="w-full py-4 bg-gradient-to-r from-rentora-green to-rentora-green-mid text-white rounded-2xl text-[15px] font-bold shadow-rentora-sm hover:shadow-rentora-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                  onClick={() => {
                    if (!role) {
                      requireLogin();
                      return;
                    }
                    setActiveTab("contact");
                    document
                      .getElementById("actions-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <MessageSquare size={18} className="group-hover:scale-110 transition-transform" /> Contact Owner
                </button>
                <button
                  className="w-full py-4 bg-white border border-rentora-border text-rentora-ink rounded-2xl text-[15px] font-bold shadow-sm hover:bg-rentora-ivory hover:border-rentora-border-mid hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  onClick={() => {
                    if (!role) {
                      requireLogin();
                      return;
                    }
                    setActiveTab("visit");
                    document
                      .getElementById("actions-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <Calendar size={18} className="text-rentora-green" /> Book a Visit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── TABS SECTION ── */}
      <div className="max-w-[1100px] mx-auto mt-10 px-[6%]">
        {/* Tab navigation */}
        <div className="flex border-b border-rentora-border mb-8 gap-1">
          {[
            { key: "details", label: "Details" },
            { key: "ai", label: <span className="flex items-center gap-1.5"><Bot size={16} /> AI Analysis</span> },
            { key: "reviews", label: `Reviews (${reviews.length})` },
            ...(role === "TENANT"
              ? [
                  { key: "contact", label: <span className="flex items-center gap-1.5"><MessageSquare size={16} /> Contact</span> },
                  { key: "visit", label: <span className="flex items-center gap-1.5"><Calendar size={16} /> Visit</span> },
                ]
              : []),
          ].map((tab) => (
            <button
              key={tab.key}
              className={`px-5 py-2.5 border-none bg-transparent text-[14px] font-medium cursor-pointer border-b-2 transition-all duration-200 ${
                activeTab === tab.key
                  ? "text-rentora-green border-b-rentora-green"
                  : "text-rentora-ink-muted border-b-transparent hover:text-rentora-green"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div id="actions-section" className="pb-[60px]">
          {/* Details tab */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-[18px] font-semibold text-rentora-ink mb-4">
                  Property Details
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Property Type", value: property.propertyType },
                    { label: "Bedrooms", value: `${property.bedrooms} BHK` },
                    {
                      label: "Area",
                      value: property.areaSqft
                        ? `${property.areaSqft} sqft`
                        : "N/A",
                    },
                    {
                      label: "Furnishing",
                      value: property.furnishing || "N/A",
                    },
                    { label: "Year Built", value: property.yearBuilt || "N/A" },
                    { label: "Status", value: property.status },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between py-3 border-b border-rentora-border"
                    >
                      <span className="text-[14px] text-rentora-ink-muted">
                        {item.label}
                      </span>
                      <span className="text-[14px] font-medium text-rentora-ink">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {property.description && (
                  <>
                    <h3 className="text-[18px] font-semibold text-rentora-ink mb-4">
                      About this property
                    </h3>
                    <p className="text-[14px] leading-[1.8] text-rentora-ink-muted font-light">
                      {property.description}
                    </p>
                  </>
                )}

                {property.amenities?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-[18px] font-semibold text-rentora-ink mb-4">
                      Amenities
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {property.amenities.map((a, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-rentora-border rounded-[10px] text-[13px] text-rentora-ink"
                        >
                          <span className="text-rentora-green">✓</span>
                          {a}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Analysis tab */}
          {activeTab === "ai" && (
            <div className="max-w-[600px]">
              <h3 className="text-[18px] font-semibold text-rentora-ink mb-2">
                <span className="flex items-center gap-1.5"><Bot size={18} /> AI Price Analysis</span>
              </h3>
              <p className="text-[14px] text-rentora-ink-muted mb-6 leading-[1.6]">
                Get an AI-powered fair price estimate for this property based on
                location, size and amenities.
              </p>

              {aiPrice ? (
                <div className="bg-white border border-rentora-border rounded-2xl p-6">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-10 h-10 bg-rentora-green-tint rounded-[10px] flex items-center justify-center text-[18px]">
                      <Bot size={20} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-rentora-green">
                        AI Analysis Complete
                      </p>
                      <p className="text-[11px] text-rentora-ink-muted">
                        Based on market data
                      </p>
                    </div>
                  </div>
                  <p className="text-[14px] leading-[1.7] text-rentora-ink-mid">
                    {aiPrice}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleAIPrice}
                  disabled={aiLoading}
                  className={`px-8 py-3.5 text-white border-none rounded-xl text-[15px] font-semibold cursor-pointer transition-all duration-200 ${
                    aiLoading ? "bg-[#ccc] cursor-not-allowed" : "bg-rentora-green"
                  }`}
                >
                  {aiLoading ? "Analyzing..." : <span className="flex items-center gap-1.5"><Sparkles size={16} /> Get AI Price Estimate</span>}
                </button>
              )}
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <div className="max-w-[600px]">
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <p className="text-[48px] font-bold text-rentora-green leading-none">
                    {avgRating || "—"}
                  </p>
                  <div className="flex gap-[2px] mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-[16px] ${
                          star <= Math.round(avgRating)
                            ? "text-[#B8962E]"
                            : "text-[#DDD]"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-[12px] text-rentora-ink-muted mt-1">
                    {reviews.length} reviews
                  </p>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-10 text-rentora-ink-muted">
                  <p className="text-[32px] mb-2">✦</p>
                  <p className="text-[14px]">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="py-4 border-b border-rentora-border last:border-b-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-[36px] h-[36px] bg-rentora-green-tint rounded-full flex items-center justify-center text-[14px] font-semibold text-rentora-green">
                          {review.tenant?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-rentora-ink">
                            {review.tenant?.name}
                          </p>
                          <div className="flex gap-[2px]">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-[11px] ${
                                  star <= review.rating
                                    ? "text-[#B8962E]"
                                    : "text-[#DDD]"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[12px] text-rentora-ink-muted">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-[14px] text-rentora-ink-mid leading-[1.6] font-light">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Contact tab */}
          {activeTab === "contact" && role === "TENANT" && (
            <div className="max-w-[500px]">
              <h3 className="text-[18px] font-semibold text-rentora-ink mb-2">
                Contact Owner
              </h3>
              <p className="text-[14px] text-rentora-ink-muted mb-6">
                Send a message directly to {property.owner?.name}
              </p>

              {messageSent ? (
                <div className="bg-rentora-green-tint border border-rentora-border-mid rounded-2xl p-6 text-center">
                  <p className="text-[32px] mb-2">✓</p>
                  <p className="font-semibold text-rentora-green text-[16px]">
                    Message sent!
                  </p>
                  <p className="text-[13px] text-rentora-ink-muted mt-1">
                    The owner will get back to you soon.
                  </p>
                </div>
              ) : (
                <>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3.5 border-[1.5px] border-rentora-border rounded-[10px] outline-none text-[14px] text-rentora-ink bg-white transition-colors duration-200 focus:border-rentora-green-soft resize-none h-[120px]"
                    placeholder={`Hi ${property.owner?.name}, I'm interested in ${property.title}. Is it still available?`}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="w-full py-3.5 bg-rentora-green text-rentora-ivory border-none rounded-[12px] text-[15px] font-semibold cursor-pointer transition-all duration-200 hover:bg-rentora-green-mid hover:-translate-y-[1px] hover:shadow-[0_6px_20px_rgba(30,77,43,0.25)] mt-3"
                  >
                    Send Message
                  </button>
                </>
              )}
            </div>
          )}

          {/* Visit tab */}
          {activeTab === "visit" && role === "TENANT" && (
            <div className="max-w-[500px]">
              <h3 className="text-[18px] font-semibold text-rentora-ink mb-2">
                Book a Visit
              </h3>
              <p className="text-[14px] text-rentora-ink-muted mb-6">
                Schedule a property visit at your convenience
              </p>

              {visitBooked ? (
                <div className="bg-rentora-green-tint border border-rentora-border-mid rounded-2xl p-6 text-center">
                  <div className="mb-2"><Calendar size={32} /></div>
                  <p className="font-semibold text-rentora-green text-[16px]">
                    Visit requested!
                  </p>
                  <p className="text-[13px] text-rentora-ink-muted mt-1">
                    The owner will confirm your visit soon.
                  </p>
                </div>
              ) : (
                <>
              <div className="space-y-6">
                <div>
                  <label className="text-[12px] font-bold text-rentora-green uppercase tracking-[1.5px] block mb-3 ml-1">
                    Select a Day
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'today', label: 'Today', date: new Date().toISOString().split('T')[0] },
                      { id: 'tomorrow', label: 'Tomorrow', date: new Date(Date.now() + 86400000).toISOString().split('T')[0] }
                    ].map((day) => (
                      <button
                        key={day.id}
                        onClick={() => {
                          setVisitDate(prev => {
                            const time = prev.split('T')[1] || '10:00';
                            return `${day.date}T${time}`;
                          });
                        }}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
                          visitDate.startsWith(day.date)
                            ? "border-rentora-green bg-rentora-green/5 text-rentora-green shadow-sm"
                            : "border-rentora-border text-rentora-ink-mid hover:border-rentora-border-mid bg-white"
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                    <div className="relative flex-1">
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          setVisitDate(prev => {
                            const time = prev.split('T')[1] || '10:00';
                            return `${e.target.value}T${time}`;
                          });
                        }}
                        className="w-full py-3 px-4 rounded-xl border-2 border-rentora-border font-bold text-sm text-rentora-ink-mid outline-none bg-white focus:border-rentora-green transition-all appearance-none h-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[12px] font-bold text-rentora-green uppercase tracking-[1.5px] block mb-3 ml-1">
                    Select Time (9 AM - 8 PM)
                  </label>
                  <div className="grid grid-cols-4 gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
                    {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => {
                      const timeString = `${hour.toString().padStart(2, '0')}:00`;
                      const displayTime = hour <= 12 ? (hour === 12 ? "12 PM" : `${hour} AM`) : `${hour - 12} PM`;
                      return (
                        <button
                          key={hour}
                          onClick={() => {
                            setVisitDate(prev => {
                              const date = prev.split('T')[0] || new Date().toISOString().split('T')[0];
                              return `${date}T${timeString}`;
                            });
                          }}
                          className={`py-2.5 rounded-lg border-2 font-bold text-[11px] transition-all cursor-pointer ${
                            visitDate.includes(`T${timeString}`)
                              ? "border-rentora-green bg-rentora-green/5 text-rentora-green shadow-sm"
                              : "border-rentora-border text-rentora-ink-mid hover:border-rentora-border-mid bg-white"
                          }`}
                        >
                          {displayTime}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-rentora-ivory/50 rounded-2xl border border-dashed border-rentora-border">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-rentora-green shadow-sm shrink-0 mt-0.5">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-[13px] text-rentora-ink font-bold">Booking Summary</p>
                      <p className="text-[12px] text-rentora-ink-muted leading-relaxed">
                        {visitDate ? (
                          <span className="flex flex-col">
                            <span>{new Date(visitDate.split('T')[0]).toLocaleDateString('en-IN', { dateStyle: 'full' })}</span>
                            <span className="text-rentora-green font-bold">At {visitDate.split('T')[1]}</span>
                          </span>
                        ) : "Select a date and time to see summary."}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBookVisit}
                  disabled={!visitDate || !visitDate.includes('T')}
                  className="w-full py-4.5 bg-gradient-to-r from-rentora-green to-rentora-green-mid text-white border-none rounded-2xl text-[16px] font-bold cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-rentora-green/20 hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Visit Request
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Login prompt toast */}
      {showLoginPrompt && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-rentora-ink text-white px-6 py-3 rounded-[12px] text-[14px] font-medium z-[999] flex items-center gap-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] animate-slide-up">
          <span><Lock size={14} className="inline mr-1" /></span>
          <span>Please login to continue</span>
          <button
            onClick={() => navigate("/login")}
            className="bg-rentora-green border-none text-white px-3.5 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer ml-2"
          >
            Login →
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
