import React from 'react';

interface FooterProps {
  onNavigateTab?: (tab: 'board' | 'sprint' | 'evaluator' | 'limbic') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  return (
    <footer className="bg-white border-t-2 border-[#1E1B4B] mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Info */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <span className="w-8 h-8 rounded-lg bg-yellow-300 border-2 border-[#1E1B4B] shadow-badge flex items-center justify-center text-sm font-bold">
            ⚡
          </span>
          <div>
            <div className="font-display font-bold text-[#1E1B4B] text-base">
              Bounter<span className="text-[#4F46E5]">.jam</span> // limbicOS
            </div>
            <p className="text-xs text-[#4B5563]">
              © 2025. Built with vibes, coffee, 90m ultradian sprint rhythms, and clean pull requests.
            </p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-bold text-[#1E1B4B]">
          <button
            onClick={() => onNavigateTab?.('board')}
            className="hover:text-[#4F46E5] transition-colors cursor-pointer"
          >
            Sticky Board
          </button>
          <button
            onClick={() => onNavigateTab?.('sprint')}
            className="hover:text-[#4F46E5] transition-colors cursor-pointer"
          >
            Active Sprint Room
          </button>
          <button
            onClick={() => onNavigateTab?.('evaluator')}
            className="hover:text-[#4F46E5] transition-colors cursor-pointer"
          >
            Peer Review & Escrow
          </button>
          <button
            onClick={() => onNavigateTab?.('limbic')}
            className="hover:text-[#4F46E5] transition-colors cursor-pointer"
          >
            limbicOS Chronotypes
          </button>
          <span className="text-gray-300">•</span>
          <span className="inline-flex items-center gap-1 text-[#5865F2]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Discord Jam Room
          </span>
        </nav>
      </div>
    </footer>
  );
};
