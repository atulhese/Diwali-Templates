import React, { useRef, useState, useEffect } from 'react';
import { Palette, Download, RotateCcw, Sparkles, Circle, Stamp } from 'lucide-react';
import { soundFX } from '../utils/audio';

const RANGOLI_COLORS = [
  { name: 'Haldi Gold', hex: '#f59e0b' },
  { name: 'Kumkum Red', hex: '#dc2626' },
  { name: 'Gulal Pink', hex: '#ec4899' },
  { name: 'Peacock Blue', hex: '#0284c7' },
  { name: 'Parrot Green', hex: '#16a34a' },
  { name: 'Temple Purple', hex: '#9333ea' },
  { name: 'White Rice Flour', hex: '#ffffff' },
  { name: 'Marigold Orange', hex: '#ea580c' }
];

const STAMPS = [
  { id: 'diya', symbol: '🪔', label: 'Diya' },
  { id: 'lotus', symbol: '🪷', label: 'Lotus' },
  { id: 'om', symbol: '🕉️', label: 'Om' },
  { id: 'star', symbol: '✨', label: 'Sparkle' },
  { id: 'swastik', symbol: '卐', label: 'Swastik' }
];

export default function RangoliStudio() {
  const canvasRef = useRef(null);
  const [currentColor, setCurrentColor] = useState(RANGOLI_COLORS[0].hex);
  const [brushSize, setBrushSize] = useState(6);
  const [symmetry, setSymmetry] = useState(8); // 8-fold radial symmetry
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState(null);
  const [selectedStamp, setSelectedStamp] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 600;
    canvas.height = 600;

    // Draw traditional dark courtyard background
    ctx.fillStyle = '#170409';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw subtle guide circles
    drawGuidelines(ctx, canvas.width, canvas.height);
    saveState();
  }, []);

  const drawGuidelines = (ctx, w, h) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 6]);

    // Concentric circles
    const cx = w / 2;
    const cy = h / 2;
    [60, 120, 180, 240].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Radial guide lines
    for (let i = 0; i < symmetry; i++) {
      const angle = (Math.PI * 2 * i) / symmetry;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * 260, cy + Math.sin(angle) * 260);
      ctx.stroke();
    }
    ctx.restore();
  };

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory(prev => [...prev.slice(-10), canvas.toDataURL()]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop(); // remove current
    const prevImage = newHistory[newHistory.length - 1];
    setHistory(newHistory);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = prevImage;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    soundFX.playDiyaLight();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#170409';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGuidelines(ctx, canvas.width, canvas.height);
    saveState();
    soundFX.playDiyaLight();
  };

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDraw = (e) => {
    const pos = getPos(e);

    if (selectedStamp) {
      applyStamp(pos.x, pos.y);
      return;
    }

    setIsDrawing(true);
    setLastPos(pos);
  };

  const applyStamp = (clickX, clickY) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const dx = clickX - cx;
    const dy = clickY - cy;
    const radius = Math.sqrt(dx * dx + dy * dy);
    const baseAngle = Math.atan2(dy, dx);

    ctx.font = `${brushSize * 5}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < symmetry; i++) {
      const angle = baseAngle + (i * Math.PI * 2) / symmetry;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      ctx.fillText(selectedStamp.symbol, x, y);
    }
    soundFX.playDiyaLight();
    saveState();
  };

  const draw = (e) => {
    if (!isDrawing || !lastPos || selectedStamp) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const curPos = getPos(e);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const dx1 = lastPos.x - cx;
    const dy1 = lastPos.y - cy;
    const r1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const a1 = Math.atan2(dy1, dx1);

    const dx2 = curPos.x - cx;
    const dy2 = curPos.y - cy;
    const r2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    const a2 = Math.atan2(dy2, dx2);

    ctx.save();
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 6;
    ctx.shadowColor = currentColor;

    for (let i = 0; i < symmetry; i++) {
      const rot = (i * Math.PI * 2) / symmetry;

      // Draw primary radial petal
      const x1 = cx + r1 * Math.cos(a1 + rot);
      const y1 = cy + r1 * Math.sin(a1 + rot);
      const x2 = cx + r2 * Math.cos(a2 + rot);
      const y2 = cy + r2 * Math.sin(a2 + rot);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Mirror reflection for kaleidoscopic symmetry
      const mx1 = cx + r1 * Math.cos(-a1 + rot);
      const my1 = cy + r1 * Math.sin(-a1 + rot);
      const mx2 = cx + r2 * Math.cos(-a2 + rot);
      const my2 = cy + r2 * Math.sin(-a2 + rot);

      ctx.beginPath();
      ctx.moveTo(mx1, my1);
      ctx.lineTo(mx2, my2);
      ctx.stroke();
    }
    ctx.restore();

    setLastPos(curPos);
  };

  const stopDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastPos(null);
      saveState();
    }
  };

  const downloadRangoli = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `shubh-diwali-rangoli-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    soundFX.playDiyaLight();
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>AUSPICIOUS KOLAM & RANGOLI STUDIO</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-serif-festive text-gold-gradient">
          Design Beautiful Sacred Rangoli Patterns
        </h1>
        <p className="text-amber-100/70 text-xs sm:text-sm">
          Draw with traditional gulal powders using automatic radial symmetry. Create mandalas to invite Maa Lakshmi into your home.
        </p>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Tools & Color Palette */}
        <div className="lg:col-span-4 space-y-4 p-5 rounded-3xl festive-glass border border-amber-500/25">
          
          {/* Rangoli Powder Colors */}
          <div>
            <label className="block text-xs font-bold text-amber-200 mb-2">
              Festive Powder Colors
            </label>
            <div className="grid grid-cols-4 gap-2">
              {RANGOLI_COLORS.map(c => (
                <button
                  key={c.hex}
                  onClick={() => {
                    setCurrentColor(c.hex);
                    setSelectedStamp(null);
                    soundFX.playDiyaLight();
                  }}
                  title={c.name}
                  className={`h-9 rounded-xl border flex items-center justify-center transition-transform ${
                    currentColor === c.hex && !selectedStamp
                      ? 'scale-110 border-white ring-2 ring-amber-400 shadow-lg'
                      : 'border-black/40 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {currentColor === c.hex && !selectedStamp && (
                    <span className="w-2 h-2 rounded-full bg-slate-900" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Stamp Embellishments */}
          <div>
            <label className="block text-xs font-bold text-amber-200 mb-2">
              Sacred Stamp Motifs
            </label>
            <div className="grid grid-cols-5 gap-2">
              {STAMPS.map(stamp => {
                const isSelected = selectedStamp?.id === stamp.id;
                return (
                  <button
                    key={stamp.id}
                    onClick={() => {
                      setSelectedStamp(isSelected ? null : stamp);
                      soundFX.playDiyaLight();
                    }}
                    title={stamp.label}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-amber-500/30 border-amber-400 scale-105 shadow-md'
                        : 'bg-black/40 border-amber-500/20 hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xl block">{stamp.symbol}</span>
                    <span className="text-[9px] text-amber-200/60 block truncate mt-0.5">{stamp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Radial Symmetry Points */}
          <div>
            <div className="flex justify-between text-xs text-amber-200 mb-1.5 font-bold">
              <span>Radial Symmetry</span>
              <span className="font-mono text-amber-400">{symmetry}-Fold</span>
            </div>
            <div className="flex space-x-2">
              {[4, 6, 8, 12].map(sym => (
                <button
                  key={sym}
                  onClick={() => setSymmetry(sym)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    symmetry === sym
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-black/40 border-amber-500/20 text-amber-200/70 hover:bg-white/5'
                  }`}
                >
                  {sym}x
                </button>
              ))}
            </div>
          </div>

          {/* Brush Thickness */}
          <div>
            <div className="flex justify-between text-xs text-amber-200 mb-1.5 font-bold">
              <span>Powder Width</span>
              <span className="font-mono text-amber-400">{brushSize}px</span>
            </div>
            <input
              type="range"
              min="2"
              max="24"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Canvas Actions */}
          <div className="pt-2 border-t border-amber-500/20 flex flex-col gap-2">
            <div className="flex space-x-2">
              <button
                onClick={handleUndo}
                disabled={history.length <= 1}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200 border border-amber-500/20 text-xs font-semibold flex items-center justify-center space-x-1 disabled:opacity-40"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>
              <button
                onClick={clearCanvas}
                className="flex-1 py-2 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-500/30 text-xs font-semibold"
              >
                Clear Canvas
              </button>
            </div>

            <button
              onClick={downloadRangoli}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg flex items-center justify-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download Rangoli Artwork (PNG)</span>
            </button>
          </div>
        </div>

        {/* Right: Drawing Canvas Container */}
        <div className="lg:col-span-8 flex flex-col items-center justify-center">
          <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.15)] bg-[#170409]">
            <canvas
              ref={canvasRef}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
              className="cursor-crosshair block touch-none max-w-full h-auto aspect-square"
              style={{ width: '560px', height: '560px' }}
            />
          </div>
          <p className="text-[11px] text-amber-300/60 mt-2 text-center">
            Tip: Draw a single petal curve, and the mandala symmetry mirrors it all the way around!
          </p>
        </div>

      </div>

    </div>
  );
}
