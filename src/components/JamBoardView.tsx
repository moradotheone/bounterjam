import React, { useState } from 'react';
import { Bounty, EnergyLevel } from '../types';
import { soundEngine } from '../utils/audio';

interface JamBoardViewProps {
  bounties: Bounty[];
  onSelectBounty: (bounty: Bounty) => void;
  onOpenPinModal: () => void;
  onToggleDodItem: (bountyId: string, dodId: string) => void;
  searchQuery: string;
}

export const JamBoardView: React.FC<JamBoardViewProps> = ({
  bounties,
  onSelectBounty,
  onOpenPinModal,
  onToggleDodItem,
  searchQuery,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('deadline');
  const [activeEnergyFilter, setActiveEnergyFilter] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Filter logic
  const filteredBounties = bounties
    .filter((b) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = b.title.toLowerCase().includes(q);
        const matchesTag = b.tags.some((t) => t.toLowerCase().includes(q));
        const matchesPoster = b.poster.handle.toLowerCase().includes(q);
        if (!matchesTitle && !matchesTag && !matchesPoster) return false;
      }

      // Energy filter
      if (activeEnergyFilter !== 'all' && b.energyType !== activeEnergyFilter) {
        return false;
      }

      // Category tab
      if (activeCategory === 'beginner') {
        return b.reward <= 150 || b.tags.includes('#FirstTimerWelcome');
      }
      if (activeCategory === 'vibecoding') {
        return b.tags.includes('#VibeCoding') || b.tags.includes('#Tailwind') || b.tags.includes('#React');
      }
      if (activeCategory === 'ai') {
        return b.tags.includes('#Supabase') || b.tags.includes('#AI') || b.title.toLowerCase().includes('cursor') || b.title.toLowerCase().includes('vector');
      }
      if (activeCategory === 'quickies') {
        return b.expiryHours <= 18;
      }
      if (activeCategory === 'nocode') {
        return b.tags.includes('#Make') || b.tags.includes('#beehiiv') || b.tags.includes('#Automation');
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') return a.expiryHours - b.expiryHours;
      if (sortBy === 'reward') return b.reward - a.reward;
      if (sortBy === 'chat') return b.chatCount - a.chatCount;
      return 0;
    });

  const getWashiClass = (colorScheme: string) => {
    switch (colorScheme) {
      case 'pink':
        return 'washi-tape-pink';
      case 'mint':
        return 'washi-tape-mint';
      case 'cyan':
        return 'washi-tape-blue';
      case 'peach':
      case 'lavender':
      case 'yellow':
      default:
        return 'washi-tape';
    }
  };

  const getBgClass = (colorScheme: string) => {
    switch (colorScheme) {
      case 'pink':
        return 'bg-[#FBCFE8]';
      case 'mint':
        return 'bg-[#BBF7D0]';
      case 'cyan':
        return 'bg-[#BAE6FD]';
      case 'peach':
        return 'bg-[#FFEDD5]';
      case 'lavender':
        return 'bg-[#DDD6FE]';
      case 'yellow':
      default:
        return 'bg-[#FEF08A]';
    }
  };

  const getTiltClass = (idx: number) => {
    const tilts = ['tilt-left-sm', 'tilt-right-sm', 'tilt-left-md', 'tilt-right-md'];
    return tilts[idx % tilts.length];
  };

  return (
    <div className="relative">
      {/* FLOATING COLLABORATIVE CURSORS (FigJam style) */}
      <div className="pointer-events-none absolute inset-0 max-w-7xl mx-auto overflow-hidden z-20 hidden md:block">
        <div className="absolute top-12 left-12 flex items-start gap-1 transform -rotate-3 transition-transform">
          <svg className="w-5 h-5 text-pink-500 drop-shadow" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
          <span className="bg-pink-500 text-white font-bold text-xs px-2.5 py-1 rounded-full rounded-tl-none shadow-badge border border-[#1E1B4B] flex items-center gap-1">
            <span>✨ Sarah is claiming a gig...</span>
          </span>
        </div>

        <div className="absolute top-28 right-16 flex items-start gap-1 transform rotate-2">
          <svg className="w-5 h-5 text-indigo-600 drop-shadow" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
          <span className="bg-indigo-600 text-white font-bold text-xs px-2.5 py-1 rounded-full rounded-tl-none shadow-badge border border-[#1E1B4B] flex items-center gap-1">
            <span>💻 Alex: &quot;Browsing Next.js sprints&quot;</span>
          </span>
        </div>

        <div className="absolute bottom-40 right-28 flex items-start gap-1 transform -rotate-2">
          <svg className="w-5 h-5 text-emerald-600 drop-shadow" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
          <span className="bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-full rounded-tl-none shadow-badge border border-[#1E1B4B] text-[11px]">
            🟢 Dave vibe-coding in VS Code
          </span>
        </div>
      </div>

      {/* HERO SECTION: THE CREATOR MOODBOARD */}
      <section className="pt-10 pb-8 md:pt-14 md:pb-10 px-4 max-w-7xl mx-auto relative">
        <div className="relative bg-white/80 backdrop-blur-sm border-2 border-[#1E1B4B] rounded-3xl p-6 md:p-12 shadow-pop-xl max-w-5xl mx-auto text-center overflow-hidden">
          {/* Washi tape at top */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-44 h-7 washi-tape rotate-1 z-10" />
          <div className="absolute top-3 right-4 rotate-12 text-3xl">🧷</div>
          <div className="absolute top-4 left-4 -rotate-12 text-2xl">✨</div>

          {/* Floating Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF08A] border-2 border-[#1E1B4B] shadow-badge font-display font-semibold text-xs text-[#1E1B4B] -rotate-1 hover:rotate-0 transition-transform">
              ⚡ 72h max sprints
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BBF7D0] border-2 border-[#1E1B4B] shadow-badge font-display font-semibold text-xs text-[#1E1B4B] rotate-2 hover:rotate-0 transition-transform">
              💸 Instant Venmo / Crypto Escrow
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBCFE8] border-2 border-[#1E1B4B] shadow-badge font-display font-semibold text-xs text-[#1E1B4B] -rotate-2 hover:rotate-0 transition-transform">
              🤝 Zero ghosting guarantee
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BAE6FD] border-2 border-[#1E1B4B] shadow-badge font-display font-semibold text-xs text-[#1E1B4B] rotate-1 hover:rotate-0 transition-transform">
              🧠 90m Limbic Cycles
            </span>
          </div>

          {/* Mega Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-[#1E1B4B] tracking-tight mb-4 leading-tight">
            Turn weekend ideas into cash. <br />
            <span className="relative inline-block text-[#4F46E5] underline decoration-yellow-400 decoration-wavy decoration-4">
              No boring resumes,
            </span>{' '}
            just pure vibes & clean code.
          </h1>

          {/* Handwritten Sticky Callout Note */}
          <div className="max-w-2xl mx-auto relative mb-6">
            <p className="text-base sm:text-lg text-[#4B5563] leading-relaxed font-medium">
              The collaborative moodboard where solo founders post micro-needs and creators ship them over a single weekend. Clear Definition of Ready. Crystal Definition of Done. Zero friction.
            </p>
            <span className="font-hand text-2xl text-[#F97316] font-bold inline-block rotate-3 mt-1">
              P.S. Escrow is locked tight before anyone codes! ✨🤙
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById('bounty-board');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#4F46E5] hover:bg-indigo-700 text-white font-display font-bold text-base border-2 border-[#1E1B4B] shadow-pop hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-badge active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <span>🚀</span>
              <span>Snag a Weekend Bounty</span>
            </button>
            <button
              onClick={onOpenPinModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-yellow-300 hover:bg-yellow-400 text-[#1E1B4B] font-display font-bold text-base border-2 border-[#1E1B4B] shadow-pop hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-badge active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <span>📝</span>
              <span>Pin Your Need in 3 Mins</span>
              <span className="text-xs bg-white text-[#1E1B4B] px-2 py-0.5 rounded-full border border-[#1E1B4B] shadow-badge font-bold">
                $0 Fee
              </span>
            </button>
          </div>

          {/* Live Maker Avatars Pulse */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-indigo-200 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#4B5563]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[#1E1B4B] font-bold">142 makers online jamming right now</span>
            </div>
            <span>•</span>
            <span className="text-[#1E1B4B]">
              Average claim-to-ship time: <strong>14.6 hours</strong>
            </span>
            <span>•</span>
            <span className="text-[#1E1B4B]">
              Discord Community: <strong>2,480 builders</strong>
            </span>
          </div>
        </div>
      </section>

      {/* SOCIAL COMMUNITY BAR: MAKER SPOTLIGHT & RECENT WINS */}
      <section className="py-6 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Maker of the Week Spotlight */}
          <div className="bg-[#FBCFE8] border-2 border-[#1E1B4B] rounded-2xl p-4 shadow-pop tilt-left-sm hover:rotate-0 transition-transform relative">
            <div className="absolute -top-3 left-1/3 w-24 h-6 washi-tape-pink rotate-2" />
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-pink-900 bg-white/70 px-2 py-0.5 rounded-full border border-[#1E1B4B]">
                👑 Maker of the Week
              </span>
              <span className="font-hand text-xl font-bold text-pink-900">4 sprints shipped! ⚡</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl border-2 border-[#1E1B4B] overflow-hidden bg-white shadow-badge shrink-0">
                <img
                  alt="Charlie builds"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  src={bounties[0]?.poster.avatar}
                />
              </div>
              <div>
                <div className="font-bold text-[#1E1B4B] text-sm flex items-center gap-1">
                  @charlie_builds <span className="text-xs">⭐️</span>
                </div>
                <p className="text-xs text-[#1E1B4B]/80 mt-0.5">
                  &quot;Turned 2 Supabase auth bounties into $360 on Saturday morning. Zero meetings, pure vibe coding.&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Live DoD Drop with Loom Preview */}
          <div className="bg-[#BBF7D0] border-2 border-[#1E1B4B] rounded-2xl p-4 shadow-pop tilt-right-sm hover:rotate-0 transition-transform relative">
            <div className="absolute -top-3 right-1/4 w-28 h-6 washi-tape-mint -rotate-1" />
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-emerald-900 bg-white/70 px-2 py-0.5 rounded-full border border-[#1E1B4B]">
                🎥 Just Shipped (DoD Verified)
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded border border-emerald-800/20">
                +$250 Released
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <div
                onClick={() => soundEngine.playChime('transition')}
                className="w-20 h-14 rounded-lg bg-emerald-950 border-2 border-[#1E1B4B] shadow-badge relative flex items-center justify-center overflow-hidden shrink-0 group cursor-pointer"
                title="Play Demo Walkthrough"
              >
                <span className="material-symbols-outlined text-white text-2xl group-hover:scale-110 transition-transform">
                  play_circle
                </span>
                <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 text-white font-mono px-1 rounded">
                  1:12
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E1B4B]">Make.com Webhook + beehiiv sync</div>
                <p className="text-[11px] text-[#1E1B4B]/80 mt-0.5">
                  Shipped in 5.2h by <strong>@alexgrowth</strong>. Pull request merged & auto-tested!
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Discord Voice Jam Room Live Stage */}
          <div
            className="bg-[#BAE6FD] border-2 border-[#1E1B4B] rounded-2xl p-4 shadow-pop tilt-left-sm hover:rotate-0 transition-transform relative"
            id="discord-hub"
          >
            <div className="absolute -top-3 left-1/4 w-28 h-6 washi-tape-blue rotate-2" />
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold text-xs uppercase tracking-wider text-cyan-950 bg-white/70 px-2 py-0.5 rounded-full border border-[#1E1B4B] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Discord Jam Stage
              </span>
              <span className="text-xs font-bold text-cyan-900">42 online</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#1E1B4B]">Room #weekend-hustle</div>
                <p className="text-[11px] text-[#1E1B4B]/80 mt-0.5">Playing lofi hiphop beats & live screen shares</p>
              </div>
              <button
                onClick={() => soundEngine.toggleAmbient()}
                className="px-3 py-1.5 rounded-xl bg-[#5865F2] text-white font-bold text-xs border-2 border-[#1E1B4B] shadow-badge hover:bg-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Hop In</span> 🎧
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER PILLS (THE CORKBOARD FILTER CHIPS) */}
      <section className="py-4 px-4 max-w-7xl mx-auto sticky top-24 z-30" id="bounty-board">
        <div className="bg-white/95 backdrop-blur-md border-2 border-[#1E1B4B] rounded-2xl p-3 shadow-pop flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl font-display font-bold text-xs border-2 border-[#1E1B4B] transition-all shrink-0 cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-yellow-300 text-[#1E1B4B] shadow-badge'
                  : 'bg-white hover:bg-yellow-100 text-[#1E1B4B]'
              }`}
            >
              All Jam Stickies ({bounties.length}) 📌
            </button>
            <button
              onClick={() => setActiveCategory('beginner')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs border-2 border-[#1E1B4B] transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                activeCategory === 'beginner'
                  ? 'bg-[#BBF7D0] text-[#1E1B4B] shadow-badge font-bold'
                  : 'bg-white hover:bg-[#BBF7D0] text-[#1E1B4B]'
              }`}
            >
              <span>✨</span> Beginner Friendly ($50-$150)
            </button>
            <button
              onClick={() => setActiveCategory('vibecoding')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs border-2 border-[#1E1B4B] transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                activeCategory === 'vibecoding'
                  ? 'bg-[#FBCFE8] text-[#1E1B4B] shadow-badge font-bold'
                  : 'bg-white hover:bg-[#FBCFE8] text-[#1E1B4B]'
              }`}
            >
              <span>🎨</span> Vibe Coding & UI
            </button>
            <button
              onClick={() => setActiveCategory('ai')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs border-2 border-[#1E1B4B] transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                activeCategory === 'ai'
                  ? 'bg-[#BAE6FD] text-[#1E1B4B] shadow-badge font-bold'
                  : 'bg-white hover:bg-[#BAE6FD] text-[#1E1B4B]'
              }`}
            >
              <span>🤖</span> AI & Cursor Workflows
            </button>
            <button
              onClick={() => setActiveCategory('quickies')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs border-2 border-[#1E1B4B] transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                activeCategory === 'quickies'
                  ? 'bg-[#FEF08A] text-[#1E1B4B] shadow-badge font-bold'
                  : 'bg-white hover:bg-yellow-100 text-[#1E1B4B]'
              }`}
            >
              <span>⚡</span> Quickies (&lt;18h)
            </button>
            <button
              onClick={() => setActiveCategory('nocode')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs border-2 border-[#1E1B4B] transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                activeCategory === 'nocode'
                  ? 'bg-[#DDD6FE] text-[#1E1B4B] shadow-badge font-bold'
                  : 'bg-white hover:bg-[#DDD6FE] text-[#1E1B4B]'
              }`}
            >
              <span>🛠️</span> No-Code & Automations
            </button>
          </div>

          {/* Quick Sort / View Selector */}
          <div className="flex items-center gap-2 text-xs font-bold shrink-0 self-end md:self-auto">
            <span className="text-[#4B5563]">Organize:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F5F3FF] border-2 border-[#1E1B4B] rounded-xl px-2.5 py-1 text-xs font-bold text-[#1E1B4B] shadow-badge focus:ring-0 focus:border-[#1E1B4B] cursor-pointer"
            >
              <option value="deadline">⚡ Shortest Deadline first</option>
              <option value="reward">💰 Highest Bounty Bag</option>
              <option value="chat">🔥 Most Active Chat</option>
            </select>
          </div>
        </div>

        {/* Optional limbicOS Energy Mode Toggles */}
        <div className="flex items-center gap-2 mt-2 px-2 text-xs">
          <span className="font-bold text-[#1E1B4B] flex items-center gap-1">
            <span>🧠 Limbic Energy:</span>
          </span>
          <button
            onClick={() => setActiveEnergyFilter('all')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              activeEnergyFilter === 'all' ? 'bg-[#1E1B4B] text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            All Levels
          </button>
          <button
            onClick={() => setActiveEnergyFilter('creacion')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              activeEnergyFilter === 'creacion' ? 'bg-[#4F46E5] text-white' : 'bg-indigo-50 text-indigo-800'
            }`}
          >
            ⚡ Creación (Deep Work)
          </button>
          <button
            onClick={() => setActiveEnergyFilter('mantenimiento')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              activeEnergyFilter === 'mantenimiento' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'
            }`}
          >
            🛠️ Mantenimiento (Routine)
          </button>
          <button
            onClick={() => setActiveEnergyFilter('descompresion')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
              activeEnergyFilter === 'descompresion' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            🌿 Descompresión (Relax)
          </button>
        </div>
      </section>

      {/* THE WEEKEND JAM BOARD (STICKY NOTE BOUNTY CARDS) */}
      <section className="py-8 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📌</span>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#1E1B4B]">
                The Weekend Jam Board
              </h2>
              <span className="bg-yellow-300 text-[#1E1B4B] font-bold text-xs px-2.5 py-1 rounded-full border-2 border-[#1E1B4B] shadow-badge">
                {filteredBounties.length} Open for Claim
              </span>
            </div>
            <p className="text-sm text-[#4B5563] mt-1 font-medium">
              Pick a post-it note, jump into chat with the poster, and ship before Sunday night.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-hand text-xl text-[#4F46E5] font-bold">
            <span>Click checkbox to simulate DoD testing!</span> ↘️
          </div>
        </div>

        {/* The Sticky Notes Grid (Rotated, Colorful, Tactile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBounties.slice(0, visibleCount).map((bounty, idx) => (
            <div
              key={bounty.id}
              className={`${getBgClass(
                bounty.colorScheme
              )} border-2 border-[#1E1B4B] rounded-2xl p-5 shadow-sticky ${getTiltClass(
                idx
              )} tilt-hover transition-all duration-200 flex flex-col justify-between relative group`}
            >
              {/* Washi Tape Pin top-center */}
              <div
                className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-32 h-6 ${getWashiClass(
                  bounty.colorScheme
                )} rotate-1 z-10`}
              />
              <div className="absolute top-2 right-2 text-xl opacity-80 group-hover:scale-125 transition-transform">
                📌
              </div>

              <div>
                {/* Header Meta: Poster Info + Bounty Bag */}
                <div className="flex items-start justify-between gap-3 mb-3 pt-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full border-2 border-[#1E1B4B] overflow-hidden bg-white shadow-badge shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        alt={bounty.poster.name}
                        referrerPolicy="no-referrer"
                        src={bounty.poster.avatar}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#1E1B4B] text-sm">@{bounty.poster.handle}</span>
                        {bounty.poster.isVerified && <span className="text-xs" title="Verified Poster">⭐</span>}
                      </div>
                      <span className="text-[11px] font-semibold text-[#4B5563]">{bounty.poster.role}</span>
                    </div>
                  </div>

                  {/* Reward Pill */}
                  <div className="text-right">
                    <div className="text-2xl font-display font-extrabold text-[#4F46E5]">
                      ${bounty.reward}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-emerald-800 bg-white/80 px-2 py-0.5 rounded-full border border-[#1E1B4B] shadow-badge">
                      🔒 In Escrow
                    </span>
                  </div>
                </div>

                {/* Timer Badge & Energy Tag */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#1E1B4B] text-xs font-bold text-amber-900 shadow-badge">
                    <span>⚡ {bounty.durationLabel}</span>
                    <span>•</span>
                    <span className="text-red-600 font-extrabold">{bounty.timeLeft}</span>
                  </div>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-white/80 border border-[#1E1B4B] text-[#1E1B4B]">
                    {bounty.energyType === 'creacion' && '⚡ Creación'}
                    {bounty.energyType === 'mantenimiento' && '🛠️ Mantenimiento'}
                    {bounty.energyType === 'descompresion' && '🌿 Descompresión'}
                  </span>
                </div>

                {/* Sticky Note Headline */}
                <h3
                  onClick={() => onSelectBounty(bounty)}
                  className="text-lg font-display font-bold text-[#1E1B4B] mb-2 leading-snug group-hover:text-[#4F46E5] transition-colors cursor-pointer"
                >
                  {bounty.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {bounty.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-lg bg-white/70 border border-[#1E1B4B] text-[11px] font-bold text-[#1E1B4B] shadow-badge"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* The Handshake Checklist Box (DoR + DoD) */}
                <div className="bg-white/85 rounded-xl p-3 border-2 border-[#1E1B4B] shadow-badge space-y-2.5 text-xs mb-4">
                  <div>
                    <div className="font-display font-bold text-[#4F46E5] flex items-center gap-1 mb-0.5">
                      <span>📦 What I give you (DoR):</span>
                    </div>
                    <p className="text-[#4B5563] text-[11px] pl-3 border-l-2 border-yellow-400">
                      {bounty.dor.summary}
                    </p>
                  </div>

                  <div className="border-t border-dashed border-gray-300 pt-2">
                    <div className="font-display font-bold text-emerald-700 flex items-center gap-1 mb-1">
                      <span>🚀 What you ship (DoD Checklist):</span>
                    </div>
                    <div className="space-y-1.5 pl-1">
                      {bounty.dod.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-2 cursor-pointer text-[11px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={item.done}
                            onChange={() => {
                              onToggleDodItem(bounty.id, item.id);
                              soundEngine.playChime(item.done ? 'click' : 'success');
                            }}
                            className="rounded border-[#1E1B4B] text-[#4F46E5] focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span
                            className={
                              item.done
                                ? 'line-through text-gray-400 font-medium'
                                : 'text-[#1E1B4B] font-semibold'
                            }
                          >
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer: Active chatters + Snag Button */}
              <div className="pt-2 border-t-2 border-dashed border-[#1E1B4B]/20 flex items-center justify-between">
                <div className="flex items-center text-xs font-bold text-[#1E1B4B]">
                  <span className="material-symbols-outlined text-sm mr-1 text-[#5865F2]">forum</span>
                  {bounty.chatCount} jamming in chat
                </div>
                <button
                  onClick={() => onSelectBounty(bounty)}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white font-display font-bold text-xs border-2 border-[#1E1B4B] shadow-badge hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
                >
                  <span>Snag this Gig</span> 🤙
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Post-its CTA */}
        {visibleCount < filteredBounties.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F5F3FF] border-2 border-[#1E1B4B] font-display font-bold text-sm text-[#1E1B4B] shadow-pop hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
            >
              <span>📜 Unfold More Sticky Sprints</span>
              <span className="material-symbols-outlined text-base">expand_more</span>
            </button>
          </div>
        )}
      </section>

      {/* WHY BOUNTER JAM FEELS DIFFERENT */}
      <section className="py-14 px-4 max-w-7xl mx-auto border-t-2 border-[#1E1B4B] mt-8">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-300 text-[#1E1B4B] font-display font-bold text-xs border-2 border-[#1E1B4B] shadow-badge mb-2">
            ⚡ THE CREATOR MANIFESTO
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#1E1B4B]">
            Freelance boards are dead. <br className="hidden sm:inline" />
            Long live the weekend jam.
          </h2>
          <p className="text-sm sm:text-base text-[#4B5563] mt-2 font-medium">
            No 40-page PDFs, no corporate RFP bidding wars, no endless interviews. Just makers helping makers ship code and getting paid instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border-2 border-[#1E1B4B] rounded-2xl p-5 shadow-pop hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-[#FEF08A] border-2 border-[#1E1B4B] shadow-badge flex items-center justify-center text-2xl mb-3">
              🤝
            </div>
            <h3 className="font-display font-bold text-base text-[#1E1B4B] mb-1.5">Zero Intimidation</h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Every gig has exact inputs (DoR) and clear pass/fail checklist items (DoD). No ambiguity.
            </p>
          </div>

          <div className="bg-white border-2 border-[#1E1B4B] rounded-2xl p-5 shadow-pop hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-[#FBCFE8] border-2 border-[#1E1B4B] shadow-badge flex items-center justify-center text-2xl mb-3">
              ⚡
            </div>
            <h3 className="font-display font-bold text-base text-[#1E1B4B] mb-1.5">Strict &lt;72h Turnaround</h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Sprints are weekend sized. Claim Friday night, ship Saturday, spend your rewards on Sunday.
            </p>
          </div>

          <div className="bg-white border-2 border-[#1E1B4B] rounded-2xl p-5 shadow-pop hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-[#BBF7D0] border-2 border-[#1E1B4B] shadow-badge flex items-center justify-center text-2xl mb-3">
              🔒
            </div>
            <h3 className="font-display font-bold text-base text-[#1E1B4B] mb-1.5">Locked Smart Escrow</h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Funds are held upfront. Once your PR satisfies the DoD checklist, funds auto-release.
            </p>
          </div>

          <div className="bg-white border-2 border-[#1E1B4B] rounded-2xl p-5 shadow-pop hover:-translate-y-1 transition-transform">
            <div className="w-12 h-12 rounded-xl bg-[#BAE6FD] border-2 border-[#1E1B4B] shadow-badge flex items-center justify-center text-2xl mb-3">
              👾
            </div>
            <h3 className="font-display font-bold text-base text-[#1E1B4B] mb-1.5">Discord Vibe Hangouts</h3>
            <p className="text-xs text-[#4B5563] leading-relaxed">
              Don&apos;t code alone in silence. Hop in voice chat, share your screen, swap tips, and make friends.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
