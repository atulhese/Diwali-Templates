import React from 'react';
import { 
  ShoppingBag, 
  Flame, 
  Sparkles, 
  Palette, 
  Calendar, 
  BookOpen, 
  Send, 
  Package, 
  Volume2, 
  VolumeX, 
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  setIsCartOpen, 
  setIsAddProductOpen,
  isMuted,
  setIsMuted
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFX.setMuted(next);
    if (!next) {
      soundFX.playBell();
    }
  };

  const navItems = [
    { id: 'store', label: 'Diwali Shopping', icon: ShoppingBag, badge: 'Sale' },
    { id: 'diyas', label: 'Light Diyas', icon: Flame },
    { id: 'crackers', label: 'Virtual Crackers', icon: Sparkles, badge: 'Eco' },
    { id: 'rangoli', label: 'Rangoli Studio', icon: Palette },
    { id: 'events', label: 'Events & Mela', icon: Calendar },
    { id: 'puja', label: 'Puja Vidhi', icon: BookOpen },
    { id: 'greetings', label: 'Wishes & Cards', icon: Send },
    { id: 'orders', label: 'My Orders', icon: Package }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    soundFX.playDiyaLight();
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#160408]/90 border-b border-amber-500/20 shadow-lg shadow-black/40">
      {/* Top Auspicious Announcement Bar */}
      <div className="bg-gradient-to-r from-red-900 via-amber-700 to-red-900 text-amber-100 text-xs py-1 px-4 text-center font-medium tracking-wide border-b border-amber-400/20 flex items-center justify-center space-x-2">
        <span className="animate-pulse">✨</span>
        <span>SHUBH DEEPAVALI 2026: Use code <strong className="text-amber-200 underline font-bold">DIWALI2026</strong> for 25% OFF + Free Brass Diya on orders over ₹999!</span>
        <span className="animate-pulse">🪔</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('store')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 via-red-600 to-amber-400 p-0.5 shadow-lg shadow-amber-600/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#1e070d] rounded-full flex items-center justify-center">
                <span className="text-2xl animate-flame-flicker">🪔</span>
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-2xl font-black font-serif-festive text-gold-gradient tracking-wide">
                  DEEPAVALI
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold uppercase">
                  Utsav
                </span>
              </div>
              <p className="text-[10px] text-amber-200/60 tracking-widest uppercase font-medium">
                Festival of Joy & Prosperity
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/25 to-red-600/25 text-amber-200 border border-amber-400/40 shadow-sm shadow-amber-500/20'
                      : 'text-amber-100/70 hover:text-amber-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-amber-300/60'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-red-600 text-white font-bold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? "Unmute Diwali Aarti & Sounds" : "Mute Sounds"}
              className={`p-2.5 rounded-xl border transition-all ${
                isMuted 
                  ? 'bg-neutral-800/80 border-neutral-700 text-neutral-400' 
                  : 'bg-amber-500/15 border-amber-400/30 text-amber-300 hover:bg-amber-500/25'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />}
            </button>

            {/* Add Product Button (Requested Feature) */}
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/30 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>+ Add Product</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => {
                soundFX.playDiyaLight();
                setIsCartOpen(true);
              }}
              className="relative flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs font-black shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-amber-200 hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#1c060d] border-b border-amber-500/30 px-4 pt-2 pb-4 space-y-1 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold'
                      : 'text-amber-100/80 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1 rounded bg-red-600 text-white font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-amber-500/20 flex justify-between">
            <button
              onClick={() => {
                setIsAddProductOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 font-semibold text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Diwali Product</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
