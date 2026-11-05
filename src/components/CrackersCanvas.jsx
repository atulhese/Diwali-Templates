import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Play, RotateCcw, Volume2, VolumeX, Flame } from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function CrackersCanvas() {
  const canvasRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState('rocket'); // 'rocket' | 'anar' | 'chakri' | 'sparkler'
  const [isSparklerActive, setIsSparklerActive] = useState(false);
  const [isGrandFinaleRunning, setIsGrandFinaleRunning] = useState(false);

  const particlesRef = useRef([]);
  const rocketsRef = useRef([]);
  const anarsRef = useRef([]);
  const chakrisRef = useRef([]);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = Math.max(480, Math.min(600, window.innerHeight * 0.65));
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle Physics Animation Loop
    const loop = () => {
      // Create trailing twilight fade
      ctx.fillStyle = 'rgba(10, 2, 7, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle stars & silhouettes
      drawSkyline(ctx, canvas.width, canvas.height);

      // 1. Process Sparkler if active
      if (isSparklerActive && selectedTool === 'sparkler') {
        const { x, y } = mousePosRef.current;
        for (let i = 0; i < 4; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4 + 1;
          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            color: Math.random() > 0.5 ? '#fef08a' : '#f59e0b',
            decay: Math.random() * 0.04 + 0.03,
            size: Math.random() * 2.5 + 1
          });
        }
        if (Math.random() < 0.2) soundFX.playSparkler();
      }

      // 2. Process Rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        r.x += r.vx;
        r.y += r.vy;
        r.vy += 0.05; // slight deceleration

        // Smoke/spark trail
        particlesRef.current.push({
          x: r.x,
          y: r.y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 2,
          alpha: 0.6,
          color: '#fbbf24',
          decay: 0.06,
          size: 2
        });

        // Explode condition
        if (r.y <= r.targetY || r.vy >= 0) {
          createBurst(r.x, r.y, r.color);
          soundFX.playCrackerBurst();
          rocketsRef.current.splice(i, 1);
        }
      }

      // 3. Process Anars (Flowerpots)
      for (let i = anarsRef.current.length - 1; i >= 0; i--) {
        const a = anarsRef.current[i];
        a.frames--;
        // Shoot fountain sparks
        for (let s = 0; s < 5; s++) {
          const spread = (Math.random() - 0.5) * 2.5;
          const height = -(Math.random() * 8 + 6);
          particlesRef.current.push({
            x: a.x + (Math.random() - 0.5) * 10,
            y: a.y,
            vx: spread,
            vy: height,
            alpha: 1,
            color: ['#fbbf24', '#f87171', '#34d399', '#60a5fa'][Math.floor(Math.random() * 4)],
            decay: Math.random() * 0.03 + 0.02,
            size: Math.random() * 2.5 + 1.2,
            gravity: 0.18
          });
        }
        if (a.frames <= 0) {
          anarsRef.current.splice(i, 1);
        }
      }

      // 4. Process Ground Chakris
      for (let i = chakrisRef.current.length - 1; i >= 0; i--) {
        const c = chakrisRef.current[i];
        c.angle += 0.35;
        c.frames--;
        for (let s = 0; s < 4; s++) {
          const a = c.angle + (s * Math.PI) / 2;
          const speed = Math.random() * 5 + 3;
          particlesRef.current.push({
            x: c.x,
            y: c.y,
            vx: Math.cos(a) * speed,
            vy: Math.sin(a) * speed * 0.4, // squished for ground perspective
            alpha: 1,
            color: Math.random() > 0.4 ? '#f59e0b' : '#ec4899',
            decay: 0.04,
            size: 2
          });
        }
        if (c.frames <= 0) {
          chakrisRef.current.splice(i, 1);
        }
      }

      // 5. Draw and update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.gravity) p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isSparklerActive, selectedTool]);

  const drawSkyline = (ctx, w, h) => {
    // Ground silhouette
    ctx.fillStyle = '#140308';
    ctx.fillRect(0, h - 35, w, 35);
    // Gold decorative temple border on ground
    ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
    ctx.fillRect(0, h - 36, w, 2);
  };

  const createBurst = (x, y, color) => {
    const count = 70;
    const colors = [color, '#ffffff', '#fbbf24', '#f87171', '#34d399'];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 6 + 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        decay: Math.random() * 0.02 + 0.015,
        size: Math.random() * 2.5 + 1.2,
        gravity: 0.06
      });
    }
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'rocket') {
      const startX = x + (Math.random() - 0.5) * 40;
      const startY = canvasRef.current.height - 35;
      const targetY = Math.max(70, y);
      const dy = targetY - startY;
      const vy = -Math.sqrt(Math.abs(dy) * 0.28);
      const vx = (x - startX) / Math.abs(vy * 8);

      rocketsRef.current.push({
        x: startX,
        y: startY,
        vx,
        vy,
        targetY,
        color: ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#a855f7'][Math.floor(Math.random() * 5)]
      });
      soundFX.playDiyaLight();
    } else if (selectedTool === 'anar') {
      anarsRef.current.push({
        x,
        y: canvasRef.current.height - 35,
        frames: 180
      });
      soundFX.playSparkler();
    } else if (selectedTool === 'chakri') {
      chakrisRef.current.push({
        x,
        y: canvasRef.current.height - 35,
        angle: 0,
        frames: 160
      });
      soundFX.playSparkler();
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const triggerGrandFinale = () => {
    if (isGrandFinaleRunning) return;
    setIsGrandFinaleRunning(true);
    soundFX.playBell();

    const w = canvasRef.current.width;
    const h = canvasRef.current.height;

    let count = 0;
    const interval = setInterval(() => {
      count++;
      const x = Math.random() * (w - 100) + 50;
      const targetY = Math.random() * (h * 0.5) + 60;
      rocketsRef.current.push({
        x,
        y: h - 35,
        vx: (Math.random() - 0.5) * 2,
        vy: -Math.sqrt((h - 35 - targetY) * 0.3),
        targetY,
        color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)]
      });

      if (count >= 14) {
        clearInterval(interval);
        setTimeout(() => setIsGrandFinaleRunning(false), 2500);
      }
    }, 280);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% ECO-FRIENDLY & POLLUTION-FREE</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-serif-festive text-gold-gradient">
          Virtual Eco Crackers & Light Show
        </h1>
        <p className="text-amber-100/70 text-xs sm:text-sm">
          Celebrate Diwali with zero smoke, zero pollution, and infinite radiance! Click anywhere on the sky to launch.
        </p>
      </div>

      {/* Cracker Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl festive-glass border border-amber-500/25">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'rocket', label: 'Sky Rocket 🚀', desc: 'Click sky to launch' },
            { id: 'anar', label: 'Color Anar 🌋', desc: 'Fountain flower pot' },
            { id: 'chakri', label: 'Zameen Chakkar 🌀', desc: 'Spinning ground wheel' },
            { id: 'sparkler', label: 'Golden Sparkler ✨', desc: 'Hover wand' }
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => {
                setSelectedTool(tool.id);
                soundFX.playDiyaLight();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedTool === tool.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold border-amber-400 shadow-md scale-105'
                  : 'bg-black/40 border-amber-500/20 text-amber-200/80 hover:bg-white/5'
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={triggerGrandFinale}
            disabled={isGrandFinaleRunning}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-red-600/30 flex items-center space-x-1.5 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isGrandFinaleRunning ? 'Grand Finale Lighting...' : 'Launch Grand Finale Show'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Fireworks Canvas */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl bg-[#090206]">
        
        {/* Canvas instruction badge */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-xl bg-black/60 border border-amber-500/30 text-amber-200 text-xs backdrop-blur-sm pointer-events-none">
          {selectedTool === 'sparkler' ? 'Move your mouse/finger to sizzle the sparkler!' : 'Click anywhere on the sky courtyard to ignite!'}
        </div>

        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsSparklerActive(true)}
          onMouseLeave={() => setIsSparklerActive(false)}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            const rect = canvasRef.current.getBoundingClientRect();
            mousePosRef.current = {
              x: touch.clientX - rect.left,
              y: touch.clientY - rect.top
            };
          }}
          className="w-full cursor-crosshair block"
        />
      </div>

      {/* Safety & Eco Message */}
      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center space-x-3">
        <span className="text-2xl">🌱</span>
        <div>
          <strong className="block text-emerald-300">Clean Air & Green Diwali Pledge:</strong>
          Virtual celebrations save birds and stray animals from acoustic trauma, keep elderly lungs healthy, and eliminate air particulate pollution.
        </div>
      </div>

    </div>
  );
}
