import React, { useState } from 'react';
import { BookOpen, Clock, Sparkles, CheckCircle2, Flame, Bell, Heart } from 'lucide-react';
import { soundFX } from '../utils/audio';

const DAYS_CALENDAR = [
  {
    dayNum: "Day 1",
    name: "Dhanteras (Dhanatrayodashi)",
    date: "Nov 06, 2026",
    muhurat: "06:12 PM - 08:08 PM (Pradosh Kaal)",
    significance: "Worship of Lord Dhanvantari (God of Ayurveda) & purchasing auspicious gold, silver, brass utensils.",
    vidhi: "Place 13 earthen lamps filled with mustard oil facing south outside home to prevent premature demise (Yamadeep)."
  },
  {
    dayNum: "Day 2",
    name: "Narak Chaturdashi / Choti Diwali",
    date: "Nov 07, 2026",
    muhurat: "Abhyanga Snan: 05:08 AM - 06:38 AM",
    significance: "Celebration of Lord Krishna's victory over Narakasura. Eradication of negative energies.",
    vidhi: "Apply holy Ubtan (gram flour, sandalwood, turmeric) before sunrise bath to purify physical body."
  },
  {
    dayNum: "Day 3",
    name: "Deepavali & Mahalakshmi Pujan",
    date: "Nov 08, 2026",
    muhurat: "Pradosh Kaal: 05:48 PM - 08:24 PM | Nishita Kaal: 11:38 PM - 12:31 AM",
    significance: "Main Diwali festival. Arrival of Lord Rama in Ayodhya and welcome of Goddess Lakshmi & Ganesha.",
    vidhi: "Consecrate brass idols, offer lotus flowers, kheer, batasha, fresh fruits, light 21 ghee diyas, recite Shri Suktam."
  },
  {
    dayNum: "Day 4",
    name: "Govardhan Puja / Annakoot",
    date: "Nov 09, 2026",
    muhurat: "Morning: 06:36 AM - 08:47 AM | Afternoon: 03:22 PM - 05:33 PM",
    significance: "Devotion to Lord Krishna lifting Mount Govardhan to shield Gokul residents from Indra's storm.",
    vidhi: "Prepare Chhappan Bhog (56 sacred food delicacies) and worship sacred cows with vermillion and garlands."
  },
  {
    dayNum: "Day 5",
    name: "Bhai Dooj (Yama Dwitiya)",
    date: "Nov 10, 2026",
    muhurat: "Aparahna Kaal: 01:10 PM - 03:22 PM",
    significance: "Sacred bond of protection between brother and sister, commemorating Yamraj visiting sister Yamuna.",
    vidhi: "Sister applies auspicious saffron Roli-chawal tilak on brother's forehead, brother presents affectionate gifts."
  }
];

const PUJA_STEPS = [
  { step: 1, title: "Purification & Asana", desc: "Sprinkle Gangajal over the puja altar, idols, and oneself. Chant: 'Om Pavitrah Pavitro Vaa'." },
  { step: 2, title: "Ganesha Avahan", desc: "Invoke Lord Ganesha first for obstacle-free spiritual proceedings. Offer dub grass and modak." },
  { step: 3, title: "Kalash Sthapana", desc: "Place copper/brass kalash filled with water, betel nut, coin, mango leaves, and a coconut with red cloth." },
  { step: 4, title: "Lakshmi Dhyan & Abhishek", desc: "Bathe the deities with Panchamrit (milk, curd, ghee, honey, sugar) followed by pure water." },
  { step: 5, title: "Vastra & Shringar", desc: "Adorn idols with yellow/red cloth, sandalwood paste, kumkum, and fresh lotus/marigold garlands." },
  { step: 6, title: "Naivedya & Deep Daan", desc: "Offer Kaju Katli sweets, dry fruits, betel leaves (Paan), and light the central Akhand Brass Diya." },
  { step: 7, title: "Maha Aarti & Pushpanjali", desc: "Ring the auspicious temple bell and sing 'Om Jai Lakshmi Mata' followed by offering flowers." }
];

export default function PujaMuhurat() {
  const [activeDay, setActiveDay] = useState(2); // Main Diwali default
  const [flowerCount, setFlowerCount] = useState(3);
  const [prasadCount, setPrasadCount] = useState(2);
  const [bellRinging, setBellRinging] = useState(false);

  const offerFlower = () => {
    soundFX.playDiyaLight();
    setFlowerCount(prev => prev + 1);
  };

  const offerPrasad = () => {
    soundFX.playDiyaLight();
    setPrasadCount(prev => prev + 1);
  };

  const ringBell = () => {
    setBellRinging(true);
    soundFX.playBell();
    setTimeout(() => setBellRinging(false), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>VEDIC PANCHANG & SHUBH MUHURAT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-serif-festive text-gold-gradient">
          Diwali Puja Vidhi & Auspicious Muhurat 2026
        </h1>
        <p className="text-amber-100/70 text-xs sm:text-sm">
          Comprehensive 5-day Panchang timings, Pradosh Kaal Muhurat, and step-by-step Lakshmi-Ganesh worship rituals.
        </p>
      </div>

      {/* 5-Day Festive Timeline */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {DAYS_CALENDAR.map((d, index) => {
          const isSelected = activeDay === index;
          return (
            <button
              key={d.dayNum}
              onClick={() => {
                setActiveDay(index);
                soundFX.playDiyaLight();
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-500/30 to-red-600/30 border-amber-400 text-amber-100 shadow-lg scale-102 font-bold'
                  : 'bg-black/40 border-amber-500/20 text-amber-200/70 hover:bg-white/5'
              }`}
            >
              <span className="text-[10px] text-amber-400 uppercase font-mono block font-bold">{d.dayNum}</span>
              <h4 className="text-xs font-bold truncate mt-0.5">{d.name.split('(')[0]}</h4>
              <span className="text-[10px] text-amber-200/50 block mt-1">{d.date}</span>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Spotlight Card */}
      {DAYS_CALENDAR[activeDay] && (
        <div className="p-6 sm:p-8 rounded-3xl festive-glass-gold border border-amber-500/30 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase">{DAYS_CALENDAR[activeDay].dayNum} • {DAYS_CALENDAR[activeDay].date}</span>
              <h2 className="text-2xl font-bold font-serif-festive text-amber-100">
                {DAYS_CALENDAR[activeDay].name}
              </h2>
            </div>

            <div className="px-4 py-2 rounded-xl bg-black/60 border border-amber-400 text-amber-300 text-xs font-bold flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{DAYS_CALENDAR[activeDay].muhurat}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-200/80 pt-2">
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-400 uppercase">Spiritual Significance:</span>
              <p className="leading-relaxed">{DAYS_CALENDAR[activeDay].significance}</p>
            </div>
            <div className="p-4 rounded-2xl bg-black/40 border border-amber-500/20 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-400 uppercase">Auspicious Vidhi:</span>
              <p className="leading-relaxed">{DAYS_CALENDAR[activeDay].vidhi}</p>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Puja Altar & Interactive Offerings */}
      <div className="p-6 sm:p-8 rounded-3xl festive-glass border border-amber-500/30 text-center space-y-6">
        <div>
          <span className="text-xs uppercase font-mono text-amber-400 tracking-wider font-bold">INTERACTIVE SHRINE</span>
          <h3 className="text-2xl font-bold font-serif-festive text-gold-gradient mt-1">
            Offer Virtual Prasad, Flowers & Ring Temple Bell
          </h3>
          <p className="text-xs text-amber-200/70 max-w-lg mx-auto mt-1">
            Pay reverence to Goddess Mahalakshmi and Lord Ganesha from wherever you are in the world.
          </p>
        </div>

        {/* Shrine Display */}
        <div className="relative max-w-md mx-auto aspect-[16/10] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl flex items-center justify-center bg-gradient-to-b from-[#2d0915] to-[#120308]">
          <div className="text-center space-y-2 p-4">
            <div className="text-6xl animate-float">🪔 🕉️ 🪷</div>
            <h4 className="font-serif-festive text-lg font-bold text-amber-200">
              Shree Maha Lakshmi & Ganesha
            </h4>
            <div className="flex justify-center space-x-3 text-xs text-amber-300/80 font-mono">
              <span>🌸 Offered: {flowerCount}</span>
              <span>🍬 Prasad: {prasadCount}</span>
            </div>
          </div>
        </div>

        {/* Offering Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={offerFlower}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-transform flex items-center space-x-1.5"
          >
            <span>🌸</span>
            <span>Offer Sacred Lotus / Marigold</span>
          </button>

          <button
            onClick={offerPrasad}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg hover:scale-105 transition-transform flex items-center space-x-1.5"
          >
            <span>🍬</span>
            <span>Offer Desi Ghee Ladoo & Modak</span>
          </button>

          <button
            onClick={ringBell}
            className={`px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs shadow-lg hover:scale-105 transition-all flex items-center space-x-1.5 ${
              bellRinging ? 'scale-110 bg-amber-500 text-slate-950' : ''
            }`}
          >
            <Bell className={`w-4 h-4 ${bellRinging ? 'animate-bounce' : ''}`} />
            <span>Ring Temple Ghanti</span>
          </button>
        </div>
      </div>

      {/* Step by Step Puja Vidhi */}
      <div className="p-6 rounded-3xl festive-glass border border-amber-500/20 space-y-4">
        <h3 className="font-serif-festive text-xl font-bold text-amber-200">
          Step-by-Step Lakshmi Puja Vidhi
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PUJA_STEPS.map((s) => (
            <div
              key={s.step}
              className="p-4 rounded-2xl bg-black/40 border border-amber-500/15 flex items-start space-x-3"
            >
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-400/30">
                {s.step}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-amber-100">{s.title}</h4>
                <p className="text-[11px] text-amber-200/70 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
