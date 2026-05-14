import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, ArrowRight, Sparkles, Send 
} from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Marketplace', href: '/properties' },
      { name: 'AI Insights', href: '#ai-insights' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Rent Estimator', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Press Kit', href: '#' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Safety', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ]
  };

  return (
    <footer className="bg-[#050A05] text-white pt-24 pb-12 px-6 relative overflow-hidden">
      {/* Architectural Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[length:80px_80px]"></div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-rentora-green/20 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
      <div className="absolute -bottom-48 -right-48 w-[800px] h-[800px] bg-rentora-gold/10 rounded-full blur-[180px] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Top Section: Newsletter and Brand */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5">
            <div className="mb-8 scale-110 origin-left">
              <Logo size={180} />
            </div>
            <p className="text-rentora-ink-muted text-lg font-light leading-relaxed mb-10 max-w-md">
              India's smartest AI-powered rental platform. We're redefining how you find, verify, and move into your next home.
            </p>
            <div className="flex gap-4">
              {[
                { name: 'Facebook', src: '/assets/facebook.png', href: '#' },
                { name: 'Twitter', src: '/assets/twitter.png', href: '#' },
                { name: 'Instagram', src: '/assets/instagram.png', href: '#' }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -4, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center transition-colors hover:border-rentora-gold/50"
                >
                  <img 
                    src={social.src} 
                    alt={social.name} 
                    className="w-5 h-5 object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity" 
                  />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-rentora-gold/20 rounded-full blur-3xl group-hover:bg-rentora-gold/30 transition-all duration-700"></div>
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rentora-green/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles size={20} className="text-rentora-gold" />
                  <span className="text-rentora-gold font-bold text-xs uppercase tracking-[3px]">Newsletter</span>
                </div>
                <h3 className="text-3xl font-bold mb-6">Stay ahead of the market</h3>
                <p className="text-white/50 font-light mb-8 max-w-sm">Get early access to premium listings and AI-driven market reports every week.</p>
                
                <form className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" />
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-rentora-green transition-all"
                    />
                  </div>
                  <button className="bg-rentora-green hover:bg-rentora-green-mid text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group">
                    Subscribe
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 pt-20 border-t border-white/10">
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-rentora-gold font-bold mb-8 uppercase tracking-[4px] text-[10px]">Contact Info</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-rentora-green/20 transition-colors">
                  <Mail size={18} className="text-rentora-green" />
                </div>
                <div>
                  <div className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-1">Email</div>
                  <div className="text-sm font-light text-white/70 group-hover:text-white transition-colors">hello@rentora.ai</div>
                </div>
              </div>
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-rentora-gold/20 transition-colors">
                  <Phone size={18} className="text-rentora-gold" />
                </div>
                <div>
                  <div className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-1">Support</div>
                  <div className="text-sm font-light text-white/70 group-hover:text-white transition-colors">+91 800-RENTORA</div>
                </div>
              </div>
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <MapPin size={18} className="text-white/60" />
                </div>
                <div>
                  <div className="text-[10px] text-white/30 uppercase font-bold tracking-wider mb-1">Location</div>
                  <div className="text-sm font-light text-white/70 group-hover:text-white transition-colors">BKC, Mumbai, India</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-rentora-gold font-bold mb-8 uppercase tracking-[4px] text-[10px]">Platform</h4>
            <ul className="space-y-4">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/50 hover:text-white text-sm font-light transition-all hover:pl-2 flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-rentora-green opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-rentora-gold font-bold mb-8 uppercase tracking-[4px] text-[10px]">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/50 hover:text-white text-sm font-light transition-all hover:pl-2 flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-rentora-gold opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-rentora-gold font-bold mb-8 uppercase tracking-[4px] text-[10px]">Support</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-white/50 hover:text-white text-sm font-light transition-all hover:pl-2 flex items-center gap-2 group">
                    <div className="w-1 h-1 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section: Legal */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-white/20 text-xs tracking-wide">
            <p>© {currentYear} Rentora AI. All rights reserved.</p>
            <span className="opacity-20">•</span>
            <p>Built with ❤️ in India.</p>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase font-bold tracking-widest">
              <span>Status:</span>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-rentora-green/10 border border-rentora-green/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-rentora-green animate-pulse"></div>
                <span className="text-rentora-green">Systems Operational</span>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ y: -5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors group"
            >
              <ArrowRight size={20} className="-rotate-90 text-white/40 group-hover:text-white" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;