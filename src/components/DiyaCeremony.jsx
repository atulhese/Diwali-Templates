import React, { useState } from 'react';
import { Flame, Sparkles, RotateCcw, Heart, Share2 } from 'lucide-react';
import { soundFX } from '../utils/audio';

const MANTRAS = [
  "Tamasoma Jyotirgamaya - Lead us from darkness into light.",
  "Om Shreem Mahalakshmiyei Namaha - Abundance and divine grace.",
  "Shubham Karoti Kalyanam - Health, welfare and spiritual wealth.",
  "Deepo Jyoti Parabrahma - The flame represents supreme knowledge.",
  "Sarve Bhavantu Sukhinah - May all beings be peaceful and happy.",
  "Asatoma Sadgamaya - Lead us from falsehood to truth."
];

export default function DiyaCeremony() {
  const TOTAL_DIYAS = 21;
  const [litDiyas, setLitDiyas] = useState(new Set([0, 1, 2]));
  const [dedication, setDedication] = useState('');
  const [activeMantra, setActiveMantra] = useState(MANTRAS[0]);
  const [prayerList, setPrayerList] = useState([
    { name: "Aarav", prayer: "Good health and happiness for my parents." },
    { name: "Sunita", prayer: "Peace, wisdom and kindness in everyone's home." }
  ]);

  const toggleDiya = (index) => {
    const next = new Set(litDiyas);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
      soundFX.playDiyaLight();
      setActiveMantra(MANTRAS[index % MANTRAS.length]);
    }
    setLitDiyas(next);
  };

  const lightAllDiyas = () => {
    soundFX.playBell();
    const all = new Set();
    for (let i = 0; i < TOTAL_DIYAS; i++) all.add(i);
    setLitDiyas(all);
  };

  const resetDiyas = () => {
    setLitDiyas(new Set());
  };

  const handleAddPrayer = (e) => {
    e.preventDefault();
    if (!dedication.trim()) return;
    soundFX.playDiyaLight();
    setPrayerList([{ name: "Devotee", prayer: dedication.trim() }, ...prayerList]);
    setDedication('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>VIRTUAL DEEPOTSAV CEREMONY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-serif-festive text-gold-gradient">
          Light a Sacred Diya for Peace & Prosperity
        </h1>
        <p className="text-amber-100/70 text-xs sm:text-sm">
          Click on any terracotta lamp to ignite its divine flame. Each lamp dispels darkness, ignorance, and welcomes Goddess Mahalakshmi into your life.
        </p>
      </div>

      {/* Main Diya Courtyard */}
      <div className="relative rounded-3xl festive-glass-gold p-6 sm:p-10 border border-amber-500/30 shadow-2xl overflow-hidden">
        
        {/* Glow ambient effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Status & Control Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-amber-500/20 gap-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="text-2xl animate-flame-flicker">🪔</div>
            <div>
              <div className="text-xs uppercase tracking-wider text-amber-300/80 font-bold">
                Diyas Illuminated
              </div>
              <div className="text-2xl font-bold font-serif-festive text-amber-200">
                {litDiyas.size} / {TOTAL_DIYAS}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={lightAllDiyas}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition-transform hover:scale-105 flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Light All 21 Lamps (Maha Deepam)</span>
            </button>

            <button
              onClick={resetDiyas}
              title="Extinguish all"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300/80 border border-amber-500/20"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Chanted Mantra */}
        <div className="my-6 p-4 rounded-2xl bg-black/50 border border-amber-500/30 text-center relative z-10">
          <span className="text-[10px] text-amber-400/80 uppercase tracking-widest font-bold block mb-1">
            SACRED DIWALI SUTRA
          </span>
          <p className="font-serif-festive text-base sm:text-lg text-amber-200 italic">
            "{activeMantra}"
          </p>
        </div>

        {/* Interactive Diyas Matrix */}
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-4 sm:gap-6 py-4 relative z-10 justify-items-center">
          {Array.from({ length: TOTAL_DIYAS }).map((_, index) => {
            const isLit = litDiyas.has(index);
            return (
              <div
                key={index}
                onClick={() => toggleDiya(index)}
                className="group cursor-pointer flex flex-col items-center select-none"
              >
                {/* Flame & Glow */}
                <div className="relative w-12 h-14 flex items-end justify-center">
                  {isLit && (
                    <div className="absolute top-0 flex flex-col items-center animate-flame-flicker">
                      {/* Flickering Outer Flame */}
                      <div className="w-5 h-8 bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-100 rounded-full blur-[1px] shadow-[0_0_20px_#f59e0b]" />
                      {/* Inner Core */}
                      <div className="absolute bottom-1 w-2 h-4 bg-white rounded-full opacity-90" />
                    </div>
                  )}

                  {/* Terracotta Diya Bowl Base */}
                  <div className={`relative transition-all duration-300 ${isLit ? 'scale-105' : 'opacity-60 group-hover:opacity-90'}`}>
                    <svg
                      width="54"
                      height="30"
                      viewBox="0 0 60 34"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 10C12 28 48 28 57 10C51 32 9 32 3 10Z"
                        fill={isLit ? "#b45309" : "#571c14"}
                        stroke={isLit ? "#f59e0b" : "#78350f"}
                        strokeWidth="2"
                      />
                      <ellipse
                        cx="30"
                        cy="11"
                        rx="26"
                        ry="6"
                        fill={isLit ? "#78350f" : "#3b110a"}
                        stroke={isLit ? "#d97706" : "#451a03"}
                      />
                      {/* Golden decorative rim */}
                      <circle cx="30" cy="11" r="2.5" fill={isLit ? "#fef08a" : "#92400e"} />
                    </svg>
                  </div>
                </div>

                <span className="text-[10px] text-amber-300/60 mt-1 font-mono">
                  Diya #{index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Community Prayer Dedication Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Dedicate your Diya */}
        <div className="lg:col-span-5 p-6 rounded-3xl festive-glass border border-amber-500/20 space-y-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <h3 className="font-serif-festive text-base font-bold text-amber-200">
              Dedicate a Diya Prayer
            </h3>
          </div>
          <p className="text-xs text-amber-200/70">
            Write a sacred wish, blessing for family, or peace message to attach to your lamp.
          </p>

          <form onSubmit={handleAddPrayer} className="space-y-3">
            <textarea
              rows={3}
              value={dedication}
              onChange={(e) => setDedication(e.target.value)}
              placeholder="e.g. May our family be blessed with good health, harmony, and wisdom..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md hover:scale-[1.02]"
            >
              Attach Prayer & Light Lamp 🪔
            </button>
          </form>
        </div>

        {/* Right: Dedicated Prayers Feed */}
        <div className="lg:col-span-7 p-6 rounded-3xl festive-glass border border-amber-500/20 space-y-3">
          <h3 className="font-serif-festive text-base font-bold text-amber-200">
            Devotee Prayers & Blessings
          </h3>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {prayerList.map((p, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-black/40 border border-amber-500/15 flex items-start space-x-3 text-xs"
              >
                <span className="text-xl">🪔</span>
                <div>
                  <div className="font-bold text-amber-300">{p.name}</div>
                  <p className="text-amber-100/80 mt-0.5">{p.prayer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
