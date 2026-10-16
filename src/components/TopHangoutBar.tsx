import React, { useState } from 'react';
import { AVATAR_CHARLIE, AVATAR_SARAH, AVATAR_DAVE } from '../data/mockData';
import { soundEngine } from '../utils/audio';

interface TopHangoutBarProps {
  onOpenVoiceModal?: () => void;
  onNavigateToSprint?: () => void;
}

export const TopHangoutBar: React.FC<TopHangoutBarProps> = ({
  onOpenVoiceModal,
  onNavigateToSprint,
}) => {
  const [isPlayingAmbient, setIsPlayingAmbient] = useState(false);
  const [activeCoders] = useState(42);

  const toggleSound = () => {
    const newState = soundEngine.toggleAmbient();
    setIsPlayingAmbient(newState);
  };

  return (
    <div className="bg-[#4F46E5] text-white border-b-2 border-[#1E1B4B] px-3 py-2 text-xs md:text-sm font-semibold sticky top-0 z-50 shadow-pop">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Live Jam Room Status */}
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-300 text-[#1E1B4B] font-bold text-xs uppercase tracking-wider shadow-badge">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            🎧 Live Jam Room
          </span>
          <span className="flex items-center gap-1 font-medium text-white/95 text-xs sm:text-sm">
            <strong className="text-yellow-200">{activeCoders} vibe coders</strong> jamming in Discord Voice
          </span>
          <div className="hidden sm:flex -space-x-2 items-center pl-1">
            <img
              alt="Charlie avatar"
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full border-2 border-[#4F46E5] object-cover"
              src={AVATAR_CHARLIE}
            />
            <img
              alt="Sarah avatar"
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full border-2 border-[#4F46E5] object-cover"
              src={AVATAR_SARAH}
            />
            <img
              alt="Dave avatar"
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full border-2 border-[#4F46E5] object-cover"
              src={AVATAR_DAVE}
            />
            <span className="w-6 h-6 rounded-full bg-white text-[#4F46E5] font-extrabold text-[10px] flex items-center justify-center border-2 border-[#4F46E5]">
              +39
            </span>
          </div>
        </div>

        {/* Right Live Stats & Audio Stream Toggle */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <button
            onClick={onNavigateToSprint}
            className="hidden lg:inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-full border border-white/20 transition-colors cursor-pointer"
          >
            🔥 <strong>34 bounties</strong> claimed today!
          </button>

          <button
            onClick={toggleSound}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition-all shadow-badge ${
              isPlayingAmbient
                ? 'bg-emerald-400 text-[#1E1B4B]'
                : 'bg-white text-[#4F46E5] hover:bg-yellow-300'
            }`}
            title="Toggle Ambient Focus Beats"
          >
            <span className="material-symbols-outlined text-sm">
              {isPlayingAmbient ? 'volume_up' : 'headphones'}
            </span>
            <span>{isPlayingAmbient ? 'Ambient Flow Playing' : 'Join Voice Stream'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
