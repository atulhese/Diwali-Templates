import React, { useState, useEffect } from 'react';
import { Send, Copy, Check, Heart, Sparkles, MessageCircle, Share2 } from 'lucide-react';
import { soundFX } from '../utils/audio';

const WISH_TEMPLATES = [
  "May the divine glow of Diwali diyas illuminate your life with infinite health, happiness, prosperity, and peace. Shubh Deepavali! 🪔✨",
  "Wishing you and your beloved family a sparkling Diwali filled with moments of laughter, pure ghee sweets, and endless joy. Happy Diwali! 🍬🌸",
  "May Goddess Mahalakshmi bless your home with wealth, Lord Ganesha remove every obstacle, and Goddess Saraswati grant wisdom this New Year! 🕉️🪔",
  "Let us celebrate the victory of light over darkness and good over evil. Have a radiant, green, and blessed Diwali! 🎇🪷"
];

const CARD_THEMES = [
  { id: 'gold', name: 'Royal Gold & Diya', bg: 'from-[#421408] via-[#240a04] to-[#120402]', border: 'border-amber-400', accent: 'text-amber-300' },
  { id: 'crimson', name: 'Imperial Maroon', bg: 'from-[#4a0818] via-[#26050e] to-[#140207]', border: 'border-red-500', accent: 'text-red-300' },
  { id: 'night', name: 'Midnight Peacock', bg: 'from-[#082f49] via-[#0c192c] to-[#040810]', border: 'border-cyan-400', accent: 'text-cyan-300' },
  { id: 'purple', name: 'Royal Amethyst', bg: 'from-[#3b0764] via-[#1e0536] to-[#0d0218]', border: 'border-purple-400', accent: 'text-purple-300' }
];

export default function GreetingMaker() {
  const [recipient, setRecipient] = useState('Dearest Family & Friends');
  const [sender, setSender] = useState('With love, Aarav & Family');
  const [message, setMessage] = useState(WISH_TEMPLATES[0]);
  const [selectedTheme, setSelectedTheme] = useState(CARD_THEMES[0]);
  const [isCopied, setIsCopied] = useState(false);

  // Community Wishes Board State
  const [wishes, setWishes] = useState([]);
  const [newWishName, setNewWishName] = useState('');
  const [newWishCity, setNewWishCity] = useState('');
  const [newWishMsg, setNewWishMsg] = useState('');

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      const res = await fetch('/api/wishes');
      const data = await res.json();
      setWishes(data);
    } catch (err) {
      console.error('Error fetching wishes:', err);
    }
  };

  const handlePostWish = async (e) => {
    e.preventDefault();
    if (!newWishName || !newWishMsg) return;

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWishName,
          city: newWishCity || 'India',
          message: newWishMsg
        })
      });
      const created = await res.json();
      setWishes([created, ...wishes]);
      setNewWishName('');
      setNewWishCity('');
      setNewWishMsg('');
      soundFX.playDiyaLight();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeWish = async (id) => {
    try {
      const res = await fetch(`/api/wishes/${id}/like`, { method: 'POST' });
      const updated = await res.json();
      setWishes(wishes.map(w => w.id === id ? updated : w));
      soundFX.playDiyaLight();
    } catch (err) {
      console.error(err);
    }
  };

  const copyCardWish = () => {
    const text = `🪔 *Shubh Deepavali 2026* 🪔\n\nDear ${recipient},\n\n"${message}"\n\n- ${sender}`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    soundFX.playDiyaLight();
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
          <Send className="w-3.5 h-3.5 text-amber-400" />
          <span>FESTIVE GREETINGS & CARD MAKER</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-serif-festive text-gold-gradient">
          Diwali Wishes & Greeting Card Studio
        </h1>
        <p className="text-amber-100/70 text-xs sm:text-sm">
          Customize personalized greeting cards to send to loved ones, and post on the global community Diwali blessings wall.
        </p>
      </div>

      {/* Greeting Card Creator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Customizer Controls */}
        <div className="lg:col-span-5 space-y-4 p-6 rounded-3xl festive-glass border border-amber-500/25">
          <h3 className="font-serif-festive text-base font-bold text-amber-200">
            Card Customization
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-amber-200 font-semibold mb-1">To (Recipient)</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. My Dear Family"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-amber-200 font-semibold mb-1">From (Sender)</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. Aarav, Meera & Kids"
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-amber-200 font-semibold mb-1">Card Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {CARD_THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`p-2 rounded-xl border text-xs text-left transition-all ${
                      selectedTheme.id === theme.id
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 font-bold'
                        : 'border-white/10 bg-black/40 text-amber-200/70'
                    }`}
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-amber-200 font-semibold mb-1">Festive Wish Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none"
              />
            </div>

            {/* Quick Templates */}
            <div>
              <label className="block text-amber-200/80 mb-1">Quick Blessing Templates</label>
              <div className="space-y-1">
                {WISH_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMessage(tmpl)}
                    className="w-full text-left p-1.5 rounded-lg bg-black/30 hover:bg-black/60 border border-amber-500/15 text-[11px] text-amber-200/80 truncate block"
                  >
                    "{tmpl.slice(0, 50)}..."
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={copyCardWish}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center space-x-1.5 hover:scale-[1.02]"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{isCopied ? 'Copied Card Wish Text!' : 'Copy Festive Card Wish'}</span>
            </button>
          </div>
        </div>

        {/* Right: Live Greeting Card Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div
            className={`w-full max-w-md aspect-[4/5] rounded-3xl p-8 bg-gradient-to-br ${selectedTheme.bg} border-2 ${selectedTheme.border} shadow-[0_0_40px_rgba(245,158,11,0.2)] flex flex-col justify-between text-center relative overflow-hidden`}
          >
            {/* Corner Decorative Motifs */}
            <div className="absolute top-3 left-3 text-2xl opacity-60">🪷</div>
            <div className="absolute top-3 right-3 text-2xl opacity-60">🪷</div>
            <div className="absolute bottom-3 left-3 text-2xl opacity-60">🪔</div>
            <div className="absolute bottom-3 right-3 text-2xl opacity-60">🪔</div>

            {/* Card Header */}
            <div className="space-y-2 pt-4">
              <div className="text-5xl animate-flame-flicker inline-block">🪔</div>
              <h2 className="text-2xl font-black font-serif-festive text-gold-gradient tracking-wide">
                SHUBH DEEPAVALI
              </h2>
              <p className="text-xs text-amber-300 font-semibold tracking-widest uppercase">
                To: {recipient}
              </p>
            </div>

            {/* Card Body */}
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 backdrop-blur-sm">
              <p className="font-serif-festive text-sm sm:text-base text-amber-100 italic leading-relaxed">
                "{message}"
              </p>
            </div>

            {/* Card Footer */}
            <div className="pb-4">
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-2" />
              <p className="text-xs font-serif-festive text-amber-300/90 font-bold">
                {sender}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Community Global Wishes Wall */}
      <div className="space-y-6 pt-6 border-t border-amber-500/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-serif-festive text-2xl font-bold text-amber-100">
              Global Diwali Community Blessings Wall
            </h3>
            <p className="text-xs text-amber-200/60">
              Share your heartfelt wishes with devotees and friends worldwide!
            </p>
          </div>
        </div>

        {/* Post a Wish Form */}
        <form onSubmit={handlePostWish} className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-amber-500/30 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-3">
            <input
              type="text"
              required
              value={newWishName}
              onChange={(e) => setNewWishName(e.target.value)}
              placeholder="Your Name *"
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-3">
            <input
              type="text"
              value={newWishCity}
              onChange={(e) => setNewWishCity(e.target.value)}
              placeholder="City (e.g. Mumbai, London)"
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-4">
            <input
              type="text"
              required
              value={newWishMsg}
              onChange={(e) => setNewWishMsg(e.target.value)}
              placeholder="Your Diwali blessing & wish message... *"
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold shadow-md hover:scale-105 transition-transform"
            >
              Post Wish ✨
            </button>
          </div>
        </form>

        {/* Wishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wishes.map(w => (
            <div
              key={w.id}
              className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-amber-400 font-bold">
                  <span>🪔 {w.name}</span>
                  <span className="text-[10px] text-amber-200/50 font-normal">{w.city}</span>
                </div>
                <p className="text-amber-100/90 leading-relaxed italic">
                  "{w.message}"
                </p>
              </div>

              <div className="pt-2 border-t border-amber-500/10 flex justify-between items-center text-[11px] text-amber-200/50">
                <span>{w.date}</span>
                <button
                  onClick={() => handleLikeWish(w.id)}
                  className="flex items-center space-x-1 text-rose-400 hover:text-rose-300 font-bold"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{w.likes || 1} Blessings</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
