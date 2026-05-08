import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/authService";
import API from "../services/axiosConfig";
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import NeuralBackground from "../components/shared/NeuralBackground";
import Navbar from "../components/shared/Navbar";
import { 
  Crown, BarChart2, CheckCircle2, Users, 
  MapPin, User, Trash2, X, Check, 
  ChevronRight, Activity, ShieldCheck, AlertCircle 
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchStats();
    fetchUsers();
    fetchPendingProperties();
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
      const data = await API.get("/admin/stats");
      setStats(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const data = await API.get("/admin/users");
      setUsers(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchPendingProperties = async () => {
    try {
      const data = await API.get("/admin/pending");
      setPendingProperties(data.data);
    } catch (err) { console.error(err); }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/properties/${id}/approve`);
      fetchPendingProperties();
      fetchStats();
    } catch (err) { alert("Error approving property!"); }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/properties/${id}/reject`);
      fetchPendingProperties();
      fetchStats();
    } catch (err) { alert("Error rejecting property!"); }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`/admin/users/${id}`);
        fetchUsers();
        fetchStats();
      } catch (err) { alert("Error deleting user!"); }
    }
  };

  const getRoleConfig = (role) => {
    switch (role) {
      case "TENANT": return { color: "text-rentora-green", bg: "bg-rentora-green-tint", icon: <User size={12}/> };
      case "OWNER": return { color: "text-rentora-gold-dark", bg: "bg-rentora-gold-light", icon: <ShieldCheck size={12}/> };
      case "ADMIN": return { color: "text-purple-600", bg: "bg-purple-50", icon: <Crown size={12}/> };
      default: return { color: "text-rentora-ink-muted", bg: "bg-rentora-green-pale", icon: <User size={12}/> };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE": return "text-rentora-green bg-rentora-green-tint";
      case "PENDING": return "text-rentora-gold-dark bg-rentora-gold-light";
      case "REJECTED": return "text-red-600 bg-red-50";
      default: return "text-rentora-ink-muted bg-rentora-green-pale";
    }
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: BarChart2 },
    { key: "approvals", label: "Approvals", icon: CheckCircle2 },
    { key: "users", label: "Users", icon: Users },
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
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-rentora-gold/10 blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-20 left-1/2 w-64 h-64 rounded-full bg-rentora-green/10 blur-[80px] pointer-events-none" />
              <p className="text-sm text-rentora-gold font-bold mb-3 uppercase tracking-[0.2em]">Platform Administration</p>
              <h1 className="text-5xl font-bold mb-6 tracking-tight flex items-center gap-4">
                Intelligence Center <Crown size={40} className="text-rentora-gold" />
              </h1>
              <p className="text-white/60 font-light max-w-2xl text-lg leading-relaxed">
                Platform-wide control active. Real-time monitoring of <span className="text-rentora-green font-bold">{stats?.totalUsers || 0} users</span> and <span className="text-rentora-gold font-bold">{stats?.totalProperties || 0} listings</span> across India.
              </p>
            </div>

            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Total Users', value: stats.totalUsers, color: 'text-rentora-ink', icon: Users },
                  { label: 'Tenants', value: stats.totalTenants, color: 'text-rentora-green', icon: User },
                  { label: 'Owners', value: stats.totalOwners, color: 'text-rentora-gold', icon: ShieldCheck },
                  { label: 'Properties', value: stats.totalProperties, color: 'text-rentora-ink-mid', icon: Activity },
                  { label: 'Pending', value: stats.pendingProperties, color: 'text-red-500', icon: AlertCircle },
                  { label: 'Active', value: stats.activeProperties, color: 'text-rentora-green', icon: CheckCircle2 },
                ].map((s, i) => (
                  <div key={i} className="bg-white border border-rentora-border rounded-2xl p-5 shadow-sm hover:shadow-rentora-md transition-all group">
                    <p className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</p>
                    <p className="text-[10px] text-rentora-ink-muted font-bold uppercase tracking-wider">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-rentora-border rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                  <Activity size={20} className="text-rentora-ink" /> Platform Activity
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Total registered users', value: stats?.totalUsers, icon: Users, color: 'text-rentora-ink-mid' },
                    { label: 'Active property listings', value: stats?.activeProperties, icon: CheckCircle2, color: 'text-rentora-green' },
                    { label: 'Pending approvals', value: stats?.pendingProperties, icon: AlertCircle, color: 'text-red-500' },
                    { label: 'Property owners', value: stats?.totalOwners, icon: User, color: 'text-rentora-gold' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-rentora-green-pale/30 border border-rentora-border rounded-2xl hover:border-rentora-border-mid transition-all">
                      <span className="text-sm text-rentora-ink-muted font-medium flex items-center gap-3">
                        <item.icon size={16} className={item.color} /> {item.label}
                      </span>
                      <span className={`font-bold text-lg ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-rentora-border rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-rentora-green-tint rounded-full flex items-center justify-center mb-6 ring-1 ring-rentora-green/10">
                  <ShieldCheck size={40} className="text-rentora-green" />
                </div>
                <h3 className="text-xl font-bold mb-2">Security & Verification</h3>
                <p className="text-sm text-rentora-ink-muted max-w-xs mb-8">
                  Ensure all listings follow Rentora's AI verification standards before approval.
                </p>
                <button onClick={() => setActiveTab('approvals')} className="w-full py-4 bg-rentora-ink text-white rounded-2xl font-bold text-sm shadow-rentora-sm hover:bg-black transition-all">
                  Go to Approvals
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── APPROVALS TAB ── */}
        {activeTab === "approvals" && (
          <div ref={contentRef} className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold text-rentora-ink">Pending Approvals</h2>
                <p className="text-sm text-rentora-ink-muted">{pendingProperties.length} listings awaiting review</p>
              </div>
            </div>

            {pendingProperties.length === 0 ? (
              <div className="bg-white border border-rentora-border rounded-3xl p-20 text-center shadow-sm">
                <CheckCircle2 size={48} className="mx-auto mb-6 text-rentora-green" />
                <h3 className="text-xl font-bold mb-2">Inbox is clear!</h3>
                <p className="text-rentora-ink-muted">All property listings have been reviewed.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pendingProperties.map((property) => (
                  <div key={property.id} className="bg-white border border-rentora-border rounded-3xl p-8 shadow-sm hover:border-rentora-border-mid transition-all">
                    <div className="flex flex-col lg:flex-row justify-between gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(property.status)}`}>
                            {property.status}
                          </span>
                          <span className="text-xs font-bold text-rentora-gold bg-rentora-gold-light px-3 py-1 rounded-full flex items-center gap-1.5">
                            <User size={12} /> {property.owner?.name}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-rentora-ink mb-2">{property.title}</h4>
                        <p className="text-sm text-rentora-ink-muted flex items-center gap-2 mb-4">
                          <MapPin size={14} className="text-red-400" /> {property.city}, {property.address}
                        </p>
                        <div className="text-2xl font-bold text-rentora-green">
                          ₹{property.rent?.toLocaleString()}<span className="text-sm text-rentora-ink-muted font-normal">/month</span>
                        </div>
                        
                        {property.amenities?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-6">
                            {property.amenities.map((a, i) => (
                              <span key={i} className="bg-rentora-ivory border border-rentora-border text-rentora-ink-mid text-[11px] font-bold px-3 py-1 rounded-lg uppercase tracking-tight">
                                {a}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 lg:w-48 justify-center">
                        <button onClick={() => handleApprove(property.id)} className="w-full py-4 bg-rentora-green text-white rounded-2xl font-bold text-sm shadow-sm hover:bg-rentora-green-mid transition-all flex items-center justify-center gap-2">
                          <Check size={18} /> Approve
                        </button>
                        <button onClick={() => handleReject(property.id)} className="w-full py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all flex items-center justify-center gap-2">
                          <X size={18} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === "users" && (
          <div ref={contentRef} className="space-y-8">
            <div className="flex justify-between items-end px-2">
              <div>
                <h2 className="text-2xl font-bold text-rentora-ink">User Management</h2>
                <p className="text-sm text-rentora-ink-muted">{users.length} registered accounts</p>
              </div>
            </div>

            <div className="bg-white border border-rentora-border rounded-3xl shadow-sm overflow-hidden">
              <div className="divide-y divide-rentora-border">
                {users.map((user) => {
                  const cfg = getRoleConfig(user.role);
                  return (
                    <div key={user.id} className="p-6 flex items-center justify-between hover:bg-rentora-green-pale/20 transition-colors">
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 ${cfg.bg} border border-black/5 rounded-2xl flex items-center justify-center text-rentora-ink shadow-sm`}>
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-rentora-ink">{user.name}</p>
                          <p className="text-xs text-rentora-ink-muted">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-bold border border-black/5 shadow-sm ${cfg.bg} ${cfg.color}`}>
                          {cfg.icon} {user.role}
                        </span>
                        {user.role !== "ADMIN" && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <ChevronRight size={16} className="text-rentora-border-mid" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
