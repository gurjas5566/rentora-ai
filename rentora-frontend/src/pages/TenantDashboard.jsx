import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/authService';
import API from '../services/axiosConfig';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import NeuralBackground from "../components/shared/NeuralBackground";
import TenantMessaging from '../components/tenant/TenantMessaging';
import Navbar from "../components/shared/Navbar";
import {
  Home, Calendar, MessageSquare, Bot,
  LogOut, Search, ChevronRight,
  MapPin, Clock, CheckCircle, XCircle,
  Send, User, TrendingUp
} from 'lucide-react';

const TenantDashboard = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [messages, setMessages] = useState([]);
  const contentRef = useRef(null);

  // AI Chat
  const [chatMessages, setChatMessages] = useState([{
    role: 'assistant',
    content: "Hi! I'm your Rentora AI assistant. Ask me anything about rentals in India! 🏠"
  }]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    fetchSchedules();
    fetchMessages();
  }, []);

  // Animate content on tab change
  useGSAP(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [activeTab]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (err) { console.error(err); }
  };

  const fetchSchedules = async () => {
    try {
      const data = await API.get('/schedules/my-visits');
      setSchedules(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async () => {
    try {
      const data = await API.get('/messages/sent');
      setMessages(data.data);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);
    try {
      const res = await API.post('/ai/chat', { message: userMsg });
      setChatMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong!' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const map = {
      CONFIRMED: {
        color: 'text-rentora-green', bg: 'bg-rentora-green-tint',
        icon: <CheckCircle size={13}/>, label: 'Confirmed'
      },
      PENDING: {
        color: 'text-rentora-gold-dark', bg: 'bg-rentora-gold-light',
        icon: <Clock size={13}/>, label: 'Pending'
      },
      CANCELLED: {
        color: 'text-red-800', bg: 'bg-red-100',
        icon: <XCircle size={13}/>, label: 'Cancelled'
      },
      COMPLETED: {
        color: 'text-rentora-green', bg: 'bg-rentora-green-tint',
        icon: <CheckCircle size={13}/>, label: 'Completed'
      },
    };
    return map[status] || {
      color: 'text-rentora-ink-muted', bg: 'bg-rentora-green-pale',
      icon: null, label: status
    };
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Home },
    { key: 'visits', label: 'My Visits', icon: Calendar },
    { key: 'messages', label: 'Messages', icon: MessageSquare },
    { key: 'chat', label: 'AI Assistant', icon: Bot },
  ];

  const confirmedVisits = schedules.filter(s => s.status === 'CONFIRMED').length;

  return (
    <div className="min-h-screen bg-rentora-ivory text-rentora-ink font-poppins relative">
      <NeuralBackground />
      <Navbar />

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-20 relative z-10">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-10">
          <div className="flex gap-1 bg-rentora-green-pale border border-rentora-border rounded-2xl p-1.5 shadow-sm">
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key 
                    ? 'bg-white text-rentora-green shadow-sm ring-1 ring-black/5' 
                    : 'text-rentora-ink-muted hover:text-rentora-green hover:bg-white/50'
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
        {activeTab === 'overview' && (
          <div ref={contentRef} className="space-y-8">
            {/* Welcome header */}
            <div className="bg-gradient-to-br from-rentora-ink to-rentora-ink-mid rounded-[40px] p-12 text-white relative overflow-hidden shadow-rentora-lg border border-white/10">
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-rentora-green/20 blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-20 left-1/2 w-64 h-64 rounded-full bg-rentora-gold/10 blur-[80px] pointer-events-none" />
              <p className="text-sm text-rentora-gold font-bold mb-3 uppercase tracking-[0.2em]">Intelligence Center</p>
              <h1 className="text-5xl font-bold mb-6 tracking-tight">
                Welcome back, {profile?.name || 'Tenant'}! 👋
              </h1>
              <p className="text-white/60 font-light max-w-2xl text-lg leading-relaxed">
                Your AI-powered rental companion is active. You have <span className="text-rentora-gold font-bold">{confirmedVisits} confirmed visits</span> scheduled for this week.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Visits Booked', value: schedules.length, icon: Calendar, color: 'text-rentora-green', bg: 'bg-rentora-green-tint' },
                { label: 'Messages Sent', value: messages.length, icon: MessageSquare, color: 'text-rentora-gold', bg: 'bg-rentora-gold-light' },
                { label: 'Confirmed Visits', value: confirmedVisits, icon: CheckCircle, color: 'text-rentora-green-soft', bg: 'bg-rentora-green-pale' },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-rentora-border rounded-2xl p-6 shadow-sm hover:shadow-rentora-md transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-rentora-ink-muted font-semibold uppercase tracking-wider">{stat.label}</span>
                    <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <stat.icon size={18} className={stat.color} />
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-rentora-ink tracking-tight">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent visits */}
              <div className="lg:col-span-8 bg-white border border-rentora-border rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-lg font-bold flex items-center gap-3">
                    <Calendar size={20} className="text-rentora-green" />
                    Upcoming Visits
                  </h2>
                  <button onClick={() => setActiveTab('visits')} className="text-xs font-bold text-rentora-green uppercase tracking-wider hover:underline flex items-center gap-1">
                    View All <ChevronRight size={14} />
                  </button>
                </div>

                {schedules.length === 0 ? (
                  <div className="text-center py-16 bg-rentora-green-pale/30 rounded-2xl border border-dashed border-rentora-border">
                    <Calendar size={40} className="mx-auto mb-4 text-rentora-border-mid" />
                    <p className="text-rentora-ink-muted mb-6">No visits booked yet</p>
                    <button onClick={() => navigate('/properties')} className="px-6 py-3 bg-rentora-green text-white rounded-xl font-bold text-sm shadow-rentora-sm hover:bg-rentora-green-mid transition-all">
                      Browse Properties
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {schedules.slice(0, 3).map(s => {
                      const cfg = getStatusConfig(s.status);
                      return (
                        <div key={s.id} className="flex items-center justify-between p-5 bg-rentora-green-pale/50 border border-rentora-border rounded-2xl hover:border-rentora-border-mid transition-all group">
                          <div>
                            <p className="font-bold text-rentora-ink mb-1 group-hover:text-rentora-green transition-colors">{s.property?.title}</p>
                            <p className="text-xs text-rentora-ink-muted flex items-center gap-2">
                              <Clock size={12} />
                              {new Date(s.visitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold ${cfg.bg} ${cfg.color} border border-black/5 shadow-sm`}>
                            {cfg.icon} {cfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick actions */}
              <div className="lg:col-span-4 space-y-6">
                <h2 className="text-lg font-bold flex items-center gap-3 px-2">
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  {[
                    { icon: Search, label: 'Find a Property', desc: 'Browse AI-verified listings', color: 'text-rentora-green', bg: 'bg-rentora-green-tint', action: () => navigate('/properties') },
                    { icon: Bot, label: 'AI Rental Advisor', desc: 'Ask about market trends', color: 'text-rentora-gold', bg: 'bg-rentora-gold-light', action: () => setActiveTab('chat') },
                    { icon: MessageSquare, label: 'Inbox', desc: `${messages.length} messages sent`, color: 'text-rentora-green-soft', bg: 'bg-rentora-green-pale', action: () => setActiveTab('messages') },
                    { icon: TrendingUp, label: 'Rent Analysis', desc: 'Is your rent fair?', color: 'text-purple-600', bg: 'bg-purple-50', action: () => setActiveTab('chat') },
                  ].map((action, i) => (
                    <button key={i} className="w-full flex items-center gap-4 p-5 bg-white border border-rentora-border rounded-2xl hover:border-rentora-border-mid hover:shadow-rentora-sm transition-all text-left group" onClick={action.action}>
                      <div className={`w-12 h-12 ${action.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <action.icon size={20} className={action.color} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-rentora-ink group-hover:text-rentora-green transition-colors">{action.label}</p>
                        <p className="text-xs text-rentora-ink-muted">{action.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-rentora-ink-muted group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── VISITS TAB ── */}
        {activeTab === 'visits' && (
          <div ref={contentRef} className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-rentora-ink">My Visit Bookings</h2>
                <p className="text-sm text-rentora-ink-muted">{schedules.length} visits scheduled</p>
              </div>
              <button onClick={() => navigate('/properties')} className="flex items-center gap-2 px-6 py-3 bg-rentora-green text-white rounded-xl font-bold text-sm shadow-rentora-sm hover:bg-rentora-green-mid transition-all">
                <Search size={16} /> Book New Visit
              </button>
            </div>

            {schedules.length === 0 ? (
              <div className="bg-white border border-rentora-border rounded-3xl p-20 text-center shadow-sm">
                <Calendar size={48} className="mx-auto mb-6 text-rentora-border-mid" />
                <h3 className="text-xl font-bold mb-2">No visits booked yet</h3>
                <p className="text-rentora-ink-muted mb-8">Your journey to a new home starts with a visit!</p>
                <button onClick={() => navigate('/properties')} className="px-8 py-3 bg-rentora-green text-white rounded-xl font-bold shadow-rentora-sm hover:bg-rentora-green-mid transition-all">
                  Browse Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schedules.map(s => {
                  const cfg = getStatusConfig(s.status);
                  return (
                    <div key={s.id} className="bg-white border border-rentora-border rounded-2xl p-6 shadow-sm hover:shadow-rentora-md transition-all group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 ${cfg.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                          <Home size={24} className={cfg.color} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-rentora-ink group-hover:text-rentora-green transition-colors">{s.property?.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-rentora-ink-muted mt-1">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {s.property?.city}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-6 border-t border-rentora-border">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Calendar size={14} className="text-rentora-green" />
                          {new Date(s.visitDate).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
       {activeTab === 'messages' && (
        <div ref= {contentRef}> 
        <TenantMessaging profile={profile} />
        </div>
       )}

        {/* ── AI CHAT TAB ── */}
        {activeTab === 'chat' && (
          <div ref={contentRef} className="max-w-4xl mx-auto space-y-8">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-rentora-green text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-rentora-md animate-bounce-slow">
                <Bot size={32} />
              </div>
              <h2 className="text-2xl font-bold text-rentora-ink">Rentora AI Assistant</h2>
              <p className="text-rentora-ink-muted">Your personalized advisor for the Indian rental market.</p>
            </div>

            <div className="bg-white border border-rentora-border rounded-[32px] overflow-hidden shadow-rentora-lg h-[650px] flex flex-col relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rentora-green via-rentora-gold to-rentora-green" />
              
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-rentora-ivory/30">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-rentora-green text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot size={14} />
                      </div>
                    )}
                    <div className={`max-w-[75%] px-6 py-4 text-sm leading-relaxed shadow-sm transition-all ${
                      msg.role === 'user' 
                        ? 'bg-rentora-green text-white rounded-[24px] rounded-br-none' 
                        : 'bg-white border border-rentora-border text-rentora-ink rounded-[24px] rounded-bl-none font-light'
                    }`}>
                      {msg.content}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-rentora-gold text-white flex items-center justify-center flex-shrink-0 shadow-sm font-bold text-xs uppercase tracking-tighter">
                        {profile?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex items-end gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-rentora-green text-white flex items-center justify-center shadow-sm">
                      <Bot size={14} />
                    </div>
                    <div className="bg-white border border-rentora-border px-6 py-4 rounded-[24px] rounded-bl-none shadow-sm flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-rentora-green rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-rentora-green rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-rentora-green rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions */}
              <div className="px-8 py-4 border-t border-rentora-border bg-white flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {['Best areas in Mumbai?', 'Fair rent in Bandra?', 'Negotiation tips', 'Agreement checklist'].map(prompt => (
                  <button key={prompt} onClick={() => setChatInput(prompt)} className="px-4 py-2 rounded-full border border-rentora-border text-xs font-bold text-rentora-ink-muted hover:border-rentora-green hover:text-rentora-green transition-all bg-rentora-ivory/50">
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-white border-t border-rentora-border">
                <div className="relative flex items-center gap-3 bg-rentora-green-pale border border-rentora-border rounded-2xl p-2 px-4 focus-within:ring-4 focus-within:ring-rentora-green/5 focus-within:border-rentora-green transition-all">
                  <input
                    type="text"
                    className="w-full bg-transparent border-none outline-none text-sm py-2 px-2 text-rentora-ink font-light"
                    placeholder="Ask Rentora AI anything..."
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !chatLoading && handleSendChat()}
                  />
                  <button
                    className="w-10 h-10 bg-rentora-green text-white rounded-xl flex items-center justify-center hover:bg-rentora-green-mid disabled:opacity-50 transition-all shadow-rentora-sm cursor-pointer"
                    onClick={handleSendChat}
                    disabled={chatLoading || !chatInput.trim()}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default TenantDashboard;