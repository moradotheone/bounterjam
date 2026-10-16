import React from 'react';
import { AVATAR_CHARLIE } from '../data/mockData';

export type ActiveTab = 'board' | 'sprint' | 'evaluator' | 'limbic';

interface TopNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenPinModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  activeTab,
  onTabChange,
  onOpenPinModal,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b-2 border-[#1E1B4B] sticky top-9 z-40 transition-all">
      <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-7xl mx-auto h-16">
        {/* Left: Brand Logo & Interactive Mood Switcher */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={() => onTabChange('board')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <span className="w-9 h-9 rounded-xl bg-yellow-300 border-2 border-[#1E1B4B] shadow-pop flex items-center justify-center text-xl font-bold group-hover:rotate-12 transition-transform">
              ⚡
            </span>
            <span className="text-2xl font-display font-bold tracking-tight text-[#1E1B4B]">
              Bounter<span className="text-[#4F46E5] font-extrabold">.jam</span>
            </span>
          </button>

          {/* Navigation Mode Tool Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-[#F5F3FF] border-2 border-[#1E1B4B] rounded-full p-1 shadow-badge">
            <button
              onClick={() => onTabChange('board')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'board'
                  ? 'bg-white text-[#1E1B4B] border border-[#1E1B4B] shadow-badge'
                  : 'text-[#4B5563] hover:text-[#1E1B4B]'
              }`}
            >
              <span>📌</span> Sticky View
            </button>
            <button
              onClick={() => onTabChange('sprint')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sprint'
                  ? 'bg-white text-[#1E1B4B] border border-[#1E1B4B] shadow-badge'
                  : 'text-[#4B5563] hover:text-[#1E1B4B]'
              }`}
            >
              <span>🚀</span> Active Sprint #042
            </button>
            <button
              onClick={() => onTabChange('evaluator')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'evaluator'
                  ? 'bg-white text-[#1E1B4B] border border-[#1E1B4B] shadow-badge'
                  : 'text-[#4B5563] hover:text-[#1E1B4B]'
              }`}
            >
              <span>⚖️</span> Peer Review
            </button>
            <button
              onClick={() => onTabChange('limbic')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'limbic'
                  ? 'bg-yellow-300 text-[#1E1B4B] border border-[#1E1B4B] shadow-badge'
                  : 'text-[#4B5563] hover:text-[#1E1B4B]'
              }`}
            >
              <span>🧠</span> limbicOS Flow
            </button>
          </div>
        </div>

        {/* Search Jam Canvas */}
        <div className="hidden md:flex items-center bg-[#EEF2FF] border-2 border-[#1E1B4B] rounded-full px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-[#4F46E5] w-60 shadow-badge">
          <span className="material-symbols-outlined text-[#4B5563] text-lg mr-1.5">search</span>
          <input
            className="w-full bg-transparent border-0 p-0 text-xs font-semibold text-[#1E1B4B] placeholder:text-[#4B5563]/80 focus:ring-0 focus:outline-none"
            placeholder="Find gigs, tech stacks..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="text-[10px] font-bold bg-white text-[#1E1B4B] px-1.5 py-0.5 rounded border border-[#1E1B4B] shadow-badge">
            ⌘K
          </span>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-3">
          {/* Venmo / Escrow Balance Pill */}
          <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-[#BBF7D0] border-2 border-[#1E1B4B] shadow-badge text-xs font-bold text-[#1E1B4B]">
            <span className="text-sm">💸</span>
            <span>Escrow: $18,400 ready</span>
          </div>

          {/* Post a Sticky Note Bounty CTA */}
          <button
            onClick={onOpenPinModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-yellow-300 hover:bg-yellow-400 text-[#1E1B4B] font-display font-bold text-sm border-2 border-[#1E1B4B] shadow-pop hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-badge active:translate-x-1 active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <span className="text-base font-extrabold">+</span>
            <span>Drop a Sticky Bounty</span>
          </button>

          {/* Profile Avatar with Maker Pin */}
          <div
            onClick={() => onTabChange('limbic')}
            className="relative cursor-pointer group"
            title="Switch to limbicOS profile"
          >
            <div className="w-10 h-10 rounded-full border-2 border-[#1E1B4B] overflow-hidden bg-[#FBCFE8] shadow-badge">
              <img
                className="w-full h-full object-cover"
                alt="Maker avatar"
                referrerPolicy="no-referrer"
                src={AVATAR_CHARLIE}
              />
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#1E1B4B] flex items-center justify-center text-[8px]"
              title="Online Jamming"
            >
              ⚡
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
