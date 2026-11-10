import React from 'react';
import { MapPin, Route, Navigation, ShieldCheck, Compass, Radio } from 'lucide-react';

export const AuthJourneyBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Drifting Ambient Luminous Mesh Orbs */}
      <div className="absolute -top-32 -left-32 w-[560px] h-[560px] bg-gradient-to-br from-empoway-terracotta/30 via-empoway-peach/25 to-transparent rounded-full blur-3xl animate-drift-orb-1" />
      <div className="absolute -bottom-40 -right-40 w-[620px] h-[620px] bg-gradient-to-tl from-empoway-caramel/30 via-empoway-champagne/25 to-transparent rounded-full blur-3xl animate-drift-orb-2" />
      <div className="absolute top-1/4 -right-24 w-[450px] h-[450px] bg-empoway-peach/20 dark:bg-empoway-terracotta/15 rounded-full blur-[100px] animate-pulse-glow" />
      <div
        className="absolute bottom-1/4 -left-20 w-[460px] h-[460px] bg-empoway-blush/25 dark:bg-empoway-caramel/15 rounded-full blur-[110px] animate-pulse-glow"
        style={{ animationDelay: '2.5s' }}
      />

      {/* 2. Cartographic Dot Matrix with Center Radial Fade Mask */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#b96f54_1.3px,transparent_1.3px)] [background-size:28px_28px] opacity-[0.11] dark:opacity-[0.07]"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, #000 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, #000 70%, transparent 100%)'
        }}
      />

      {/* 3. Global Rotating Colombo Radar Scanner */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] sm:w-[980px] lg:w-[1360px] h-[720px] sm:h-[980px] lg:h-[1360px] rounded-full">
        {/* Concentric radar range rings */}
        <div className="absolute inset-0 rounded-full border border-empoway-terracotta/15 dark:border-empoway-peach/8" />
        <div className="absolute inset-[15%] rounded-full border border-dashed border-empoway-terracotta/12 dark:border-empoway-peach/6" />
        <div className="absolute inset-[30%] rounded-full border border-empoway-terracotta/10 dark:border-empoway-peach/6" />
        <div className="absolute inset-[45%] rounded-full border border-dashed border-empoway-terracotta/10 dark:border-empoway-peach/5" />

        {/* Crosshair axis lines */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-empoway-terracotta/20 to-transparent" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-empoway-terracotta/20 to-transparent" />

        {/* Rotating radar sweep beam */}
        <div
          className="absolute inset-0 rounded-full animate-radar-sweep"
          style={{
            background:
              'conic-gradient(from 0deg, transparent 0deg, transparent 280deg, rgba(185, 111, 84, 0.05) 320deg, rgba(185, 111, 84, 0.22) 360deg)'
          }}
        />
      </div>

      {/* 4. Animated Flowing Transit / Journey Route SVG Lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="routeGradA" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B96F54" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#E9A58D" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#B98255" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="routeGradB" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E8D3AE" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#B96F54" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#E9A58D" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="routeGradC" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#B96F54" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E9A58D" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Route 1: Flowing from Fort (NW) across through Colombo South (SE) */}
        <path
          d="M -50,180 C 280,240 220,620 540,680 C 860,740 1080,440 1420,530 C 1680,600 1850,780 2000,860"
          fill="none"
          stroke="url(#routeGradA)"
          strokeWidth="3"
          strokeDasharray="12 16"
          className="animate-flow-dash"
        />

        {/* Route 2: Flowing Coastal Highway from SW up to NE */}
        <path
          d="M -40,880 C 260,820 380,360 820,310 C 1220,260 1380,720 1720,440 C 1880,310 1960,190 2020,90"
          fill="none"
          stroke="url(#routeGradB)"
          strokeWidth="2.5"
          strokeDasharray="10 14"
          className="animate-flow-dash-reverse"
        />

        {/* Route 3: Gentle Transverse Connector Path */}
        <path
          d="M 80,-40 C 180,320 420,470 720,520 C 1040,570 1340,300 1680,390 C 1820,430 1920,880 1980,1120"
          fill="none"
          stroke="url(#routeGradC)"
          strokeWidth="2"
          strokeDasharray="8 12"
          className="animate-flow-dash-slow"
        />

        {/* Colombo Network Node Junctions (Glowing Waypoint Markers) */}
        <g>
          <circle cx="260" cy="235" r="5" fill="#B96F54" opacity="0.9" />
          <circle cx="260" cy="235" r="14" fill="none" stroke="#B96F54" strokeWidth="1.5" opacity="0.5" />

          <circle cx="250" cy="825" r="5" fill="#B98255" opacity="0.9" />
          <circle cx="250" cy="825" r="14" fill="none" stroke="#B98255" strokeWidth="1.5" opacity="0.5" />

          <circle cx="1660" cy="410" r="5" fill="#E9A58D" opacity="0.9" />
          <circle cx="1660" cy="410" r="14" fill="none" stroke="#E9A58D" strokeWidth="1.5" opacity="0.5" />

          <circle cx="1690" cy="620" r="5" fill="#10B981" opacity="0.9" />
          <circle cx="1690" cy="620" r="14" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.5" />
        </g>
      </svg>

      {/* 5. Floating Colombo Accessibility Waypoint Badges (Visible on 2xl+ widescreen desktops where margins are wide) */}
      {/* Waypoint 1: Top-Left (Fort Mobility Hub) */}
      <div className="hidden 2xl:flex items-center gap-3.5 p-4 rounded-2xl bg-white/90 dark:bg-[#1a120e]/95 backdrop-blur-md border border-empoway-blush dark:border-white/10 shadow-elevated max-w-[270px] absolute left-12 top-28 animate-float-slow">
        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-empoway-terracotta/20 to-empoway-peach/25 text-empoway-terracotta flex items-center justify-center shrink-0 border border-empoway-terracotta/25 shadow-2xs">
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#1a120e] animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#1a120e]" />
          <MapPin className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-empoway-terracotta">Colombo 01</span>
            <span className="text-[10px] text-empoway-muted/60">•</span>
            <span className="text-[10px] font-mono text-empoway-muted dark:text-empoway-cream/70">6.934° N</span>
          </div>
          <p className="text-xs font-bold text-empoway-coffee dark:text-white truncate">Fort Transit Station</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">Step-Free Ramps & Audio</p>
        </div>
      </div>

      {/* Waypoint 2: Bottom-Left (Galle Face Coastal Promenade) */}
      <div className="hidden 2xl:flex items-center gap-3.5 p-4 rounded-2xl bg-white/90 dark:bg-[#1a120e]/95 backdrop-blur-md border border-empoway-blush dark:border-white/10 shadow-elevated max-w-[270px] absolute left-14 bottom-24 animate-float-reverse">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-empoway-caramel/20 to-empoway-champagne/25 text-empoway-caramel flex items-center justify-center shrink-0 border border-empoway-caramel/25 shadow-2xs">
          <Route className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-empoway-caramel">Scenic Corridor</span>
          </div>
          <p className="text-xs font-bold text-empoway-coffee dark:text-white truncate">Galle Face Promenade</p>
          <p className="text-[11px] text-empoway-muted dark:text-empoway-cream/70 font-medium truncate">Wide Tactile Paving</p>
        </div>
      </div>

      {/* Waypoint 3: Top-Right (Lotus Tower Plaza) */}
      <div className="hidden 2xl:flex items-center gap-3.5 p-4 rounded-2xl bg-white/90 dark:bg-[#1a120e]/95 backdrop-blur-md border border-empoway-blush dark:border-white/10 shadow-elevated max-w-[270px] absolute right-12 top-28 animate-float-reverse">
        <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-empoway-peach/25 to-empoway-terracotta/20 text-empoway-terracotta flex items-center justify-center shrink-0 border border-empoway-peach/30 shadow-2xs">
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#1a120e] animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#1a120e]" />
          <Navigation className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Verified Landmark</span>
          </div>
          <p className="text-xs font-bold text-empoway-coffee dark:text-white truncate">Lotus Tower Plaza</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold truncate">Braille Elevators • Restrooms</p>
        </div>
      </div>

      {/* Waypoint 4: Bottom-Right (Colombo Community Verification) */}
      <div className="hidden 2xl:flex items-center gap-3.5 p-4 rounded-2xl bg-white/90 dark:bg-[#1a120e]/95 backdrop-blur-md border border-empoway-blush dark:border-white/10 shadow-elevated max-w-[270px] absolute right-14 bottom-24 animate-float-slow">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/25 shadow-2xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Colombo Network</span>
          </div>
          <p className="text-xs font-bold text-empoway-coffee dark:text-white truncate">104 Verified Places</p>
          <p className="text-[11px] text-empoway-terracotta font-medium truncate">Expanding Across Sri Lanka</p>
        </div>
      </div>

      {/* 6. Subtle Perimeter Cartographic HUD Telemetry */}
      <div className="hidden md:flex items-center justify-between px-8 py-3 absolute top-2 inset-x-0 text-[11px] font-mono text-empoway-muted/70 dark:text-empoway-cream/55">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-empoway-terracotta animate-pulse" />
          <span>EMPOWAY ACCESSIBILITY RADAR</span>
          <span>•</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">LIVE ROUTE SYNC</span>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <span>LAT 06°55'44"N</span>
          <span>LON 79°51'36"E</span>
          <span>ELEV 8M</span>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between px-8 py-3 absolute bottom-2 inset-x-0 text-[11px] font-mono text-empoway-muted/65 dark:text-empoway-cream/50">
        <div className="flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-empoway-caramel animate-spin" style={{ animationDuration: '30s' }} />
          <span>COLOMBO PILOT v1.0</span>
          <span>•</span>
          <span>STEP-FREE MAPPING</span>
        </div>
        <div>
          <span>EMPOWERING EVERY JOURNEY</span>
        </div>
      </div>
    </div>
  );
};

export default AuthJourneyBackground;
