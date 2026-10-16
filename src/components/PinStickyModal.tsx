import React, { useState } from 'react';
import { Bounty, BountyColor, EnergyLevel } from '../types';
import { soundEngine } from '../utils/audio';
import { AVATAR_CHARLIE } from '../data/mockData';

interface PinStickyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBounty: (bounty: Bounty) => void;
}

export const PinStickyModal: React.FC<PinStickyModalProps> = ({
  isOpen,
  onClose,
  onAddBounty,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [title, setTitle] = useState('Wire Supabase Auth with Google OAuth + index PDF embeddings table');
  const [reward, setReward] = useState<number>(180);
  const [expiryHours, setExpiryHours] = useState<number>(24);
  const [selectedTags, setSelectedTags] = useState<string[]>(['#Supabase', '#Nextjs', '#VibeCoding']);
  const [colorScheme, setColorScheme] = useState<BountyColor>('yellow');
  const [energyType, setEnergyType] = useState<EnergyLevel>('creacion');

  // DoR fields
  const [repoUrl, setRepoUrl] = useState('https://github.com/charlie/supabase-starter-monorepo');
  const [loomUrl, setLoomUrl] = useState('https://loom.com/share/928c0b24982a17');
  const [secretsNote, setSecretsNote] = useState('Secure Staging Anon Key attached in vault');

  // DoD checklist items
  const [dodList, setDodList] = useState<string[]>([
    'PR Opened & Clean Git History with zero console errors',
    'Vercel Deployment Preview Active with responsive layout',
    'Automated Tests Passing (CI checks green on GitHub)',
    'Clean Responsive UI tested on mobile viewport',
  ]);
  const [customDodInput, setCustomDodInput] = useState('');
  const [covenantAccepted, setCovenantAccepted] = useState(true);

  if (!isOpen) return null;

  const handleAddCustomDod = () => {
    if (!customDodInput.trim()) return;
    setDodList([...dodList, customDodInput.trim()]);
    setCustomDodInput('');
    soundEngine.playChime('click');
  };

  const handleRemoveDod = (index: number) => {
    setDodList(dodList.filter((_, i) => i !== index));
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    const newBounty: Bounty = {
      id: `bounty-${Date.now()}`,
      title,
      poster: {
        name: 'You (Creator)',
        handle: 'creator_vibe',
        role: 'Indie Builder',
        avatar: AVATAR_CHARLIE,
        isVerified: true,
      },
      reward,
      rewardCurrency: 'USDC',
      escrowStatus: 'locked',
      durationLabel: `${expiryHours}h sprint`,
      expiryHours,
      timeLeft: `Ends in ${expiryHours}h`,
      tags: selectedTags.length > 0 ? selectedTags : ['#WeekendSprint', '#VibeCoding'],
      colorScheme,
      energyType,
      dor: {
        summary: `Repo: ${repoUrl}. Loom: ${loomUrl}. ${secretsNote}`,
        repoUrl,
        hasSecrets: true,
        loomUrl,
      },
      dod: dodList.map((item, idx) => ({
        id: `dod-${Date.now()}-${idx}`,
        text: item,
        done: false,
        requiredByPoster: true,
      })),
      chatCount: 0,
      activeSprinters: 0,
    };

    soundEngine.playChime('success');
    onAddBounty(newBounty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-[#1E1B4B]/40 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-white border-2 border-[#1E1B4B] rounded-3xl shadow-pop-xl flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="px-6 md:px-8 pt-6 pb-4 border-b-2 border-[#1E1B4B] bg-[#FAF8F5] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-[#FEF08A] text-[#1E1B4B] text-xs font-bold flex items-center gap-1 border border-[#1E1B4B] shadow-badge">
                <span className="material-symbols-outlined text-xs">push_pin</span>
                BOUNTER JAM WIZARD
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#10B981] text-xs font-semibold border border-[#10B981]/30">
                ⚡ Instant Escrow Guard
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#1E1B4B] flex items-center gap-2">
              Pin a Weekend Need in 3 Mins <span>📌</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] max-w-2xl font-medium">
              Zero corporate RFP theater. Lock USDC in escrow, define clear starter inputs (DoR), set objective win criteria (DoD), and let a vibe coder ship it this weekend.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#4B5563] hover:text-[#1E1B4B] hover:bg-[#F4EFEA] rounded-full transition-colors cursor-pointer"
            title="Close Modal"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* 4-Step Interactive Navigation Pill Train */}
        <div className="px-6 md:px-8 py-3 bg-[#F4EFEA]/70 border-b-2 border-[#1E1B4B] overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max text-xs font-bold">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1E1B4B] transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-[#4F46E5] text-white shadow-badge'
                  : 'bg-white text-[#1E1B4B] hover:bg-yellow-100'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">1</span>
              <span>Bounty Basics & Escrow</span>
            </button>
            <span className="material-symbols-outlined text-[#4B5563] text-sm">arrow_forward</span>

            <button
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1E1B4B] transition-all cursor-pointer ${
                currentStep === 2
                  ? 'bg-[#4F46E5] text-white shadow-badge'
                  : 'bg-white text-[#1E1B4B] hover:bg-yellow-100'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">2</span>
              <span>Definition of Ready (DoR)</span>
            </button>
            <span className="material-symbols-outlined text-[#4B5563] text-sm">arrow_forward</span>

            <button
              onClick={() => setCurrentStep(3)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1E1B4B] transition-all cursor-pointer ${
                currentStep === 3
                  ? 'bg-[#4F46E5] text-white shadow-badge'
                  : 'bg-white text-[#1E1B4B] hover:bg-yellow-100'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">3</span>
              <span>Definition of Done (DoD)</span>
            </button>
            <span className="material-symbols-outlined text-[#4B5563] text-sm">arrow_forward</span>

            <button
              onClick={() => setCurrentStep(4)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1E1B4B] transition-all cursor-pointer ${
                currentStep === 4
                  ? 'bg-[#4F46E5] text-white shadow-badge'
                  : 'bg-white text-[#1E1B4B] hover:bg-yellow-100'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">4</span>
              <span>Review & Lock</span>
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body Form */}
        <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scroll">
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              {/* Title Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#1E1B4B] flex items-center gap-1.5">
                    <span>Micro-Bounty Title</span>
                    <span className="text-red-600">*</span>
                  </label>
                  <span className="text-xs text-[#4B5563]">Precise & action-oriented</span>
                </div>
                <input
                  className="w-full px-4 py-3 bg-white border-2 border-[#1E1B4B] rounded-xl text-sm font-medium text-[#1E1B4B] shadow-badge focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
                  placeholder="e.g. Wire Supabase Auth with Google OAuth + index PDF embeddings table"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Sticky Note Color Palette & Energy Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
                    Sticky Note Color & Post-it Mood
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { key: 'yellow', bg: 'bg-[#FEF08A]', label: 'Canary Yellow' },
                      { key: 'pink', bg: 'bg-[#FBCFE8]', label: 'Bubblegum' },
                      { key: 'mint', bg: 'bg-[#BBF7D0]', label: 'Fresh Mint' },
                      { key: 'cyan', bg: 'bg-[#BAE6FD]', label: 'Sky Cyan' },
                      { key: 'peach', bg: 'bg-[#FFEDD5]', label: 'Pastel Peach' },
                      { key: 'lavender', bg: 'bg-[#DDD6FE]', label: 'Lavender' },
                    ].map((col) => (
                      <button
                        key={col.key}
                        type="button"
                        onClick={() => setColorScheme(col.key as BountyColor)}
                        className={`w-8 h-8 rounded-full border-2 border-[#1E1B4B] ${col.bg} transition-transform ${
                          colorScheme === col.key ? 'scale-125 shadow-badge ring-2 ring-[#4F46E5]' : 'hover:scale-110'
                        }`}
                        title={col.label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1B4B] mb-1.5">
                    limbicOS Energy Level
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                    {[
                      { key: 'creacion', label: 'Creación', desc: 'High Deep Work', emoji: '⚡' },
                      { key: 'mantenimiento', label: 'Mantenimiento', desc: 'Routine / Algorithmic', emoji: '🛠️' },
                      { key: 'descompresion', label: 'Descompresión', desc: 'Creative / Chill', emoji: '🌿' },
                    ].map((eng) => (
                      <button
                        key={eng.key}
                        type="button"
                        onClick={() => setEnergyType(eng.key as EnergyLevel)}
                        className={`p-2 rounded-xl border-2 border-[#1E1B4B] text-center transition-all ${
                          energyType === eng.key
                            ? 'bg-yellow-300 shadow-badge text-[#1E1B4B]'
                            : 'bg-white text-[#4B5563] hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-sm">{eng.emoji}</div>
                        <div className="leading-tight">{eng.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Tags */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#4B5563]">Vibe & Tech Stack Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    '#Nextjs',
                    '#Supabase',
                    '#Tailwind',
                    '#React',
                    '#Stripe',
                    '#VibeCoding',
                    '#Make',
                    '#beehiiv',
                    '#CanvasAPI',
                    '#FirstTimerWelcome',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full border-2 border-[#1E1B4B] text-xs font-bold transition-all shadow-badge ${
                        selectedTags.includes(tag)
                          ? 'bg-[#4F46E5] text-white'
                          : 'bg-white text-[#1E1B4B] hover:bg-yellow-100'
                      }`}
                    >
                      {tag} {selectedTags.includes(tag) && '✓'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Escrow Reward & Sprint Hard Expiry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-2xl bg-[#F4EFEA]/60 border-2 border-[#1E1B4B]">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-[#1E1B4B] flex items-center gap-1">
                      <span className="material-symbols-outlined text-base text-[#4F46E5]">payments</span>
                      <span>Escrow Bounty Reward</span>
                    </label>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                      🔒 100% Locked in Escrow
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-2.5 text-lg font-bold text-[#4F46E5]">$</span>
                      <input
                        className="w-full pl-8 pr-14 py-2 bg-white border-2 border-[#1E1B4B] rounded-xl text-lg font-extrabold text-[#1E1B4B] focus:outline-none"
                        type="number"
                        min={20}
                        step={10}
                        value={reward}
                        onChange={(e) => setReward(Number(e.target.value) || 0)}
                      />
                      <span className="absolute right-3.5 top-3 text-xs font-bold text-[#4B5563]">USDC</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#4B5563]">
                    $0 platform fee. Sprinter gets 100% upon DoD completion.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1E1B4B] flex items-center gap-1">
                    <span className="material-symbols-outlined text-base text-orange-500">timer</span>
                    <span>Sprint Hard Expiry</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    {[
                      { hours: 12, label: '⚡ 12h Quickie' },
                      { hours: 24, label: '⚡ 24h Sprint' },
                      { hours: 48, label: '⚡ 48h Weekend' },
                      { hours: 72, label: '⚡ 72h Max Cap' },
                    ].map((item) => (
                      <button
                        key={item.hours}
                        type="button"
                        onClick={() => setExpiryHours(item.hours)}
                        className={`py-2 px-2.5 text-center rounded-xl border-2 border-[#1E1B4B] transition-all ${
                          expiryHours === item.hours
                            ? 'bg-yellow-300 shadow-badge text-[#1E1B4B]'
                            : 'bg-white text-[#4B5563] hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#4B5563]">
                    Unclaimed or unsubmitted sprints auto-refund to your wallet.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl border-2 border-[#1E1B4B] bg-[#EEF2FF] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#4F46E5] text-white flex items-center justify-center text-xs font-bold">
                      DoR
                    </span>
                    <h3 className="font-display font-bold text-base text-[#1E1B4B]">
                      Definition of Ready (Starter Assets)
                    </h3>
                  </div>
                  <span className="text-xs text-[#4F46E5] font-bold">Prevents Blockers</span>
                </div>
                <p className="text-xs text-[#4B5563]">
                  Every sprinter needs clean unblocking assets before claiming. Vibe coders should be able to run <code>npm run dev</code> on minute one:
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                      Starter GitHub Repository or Sandbox Link
                    </label>
                    <input
                      className="w-full px-3 py-2 bg-white border-2 border-[#1E1B4B] rounded-xl text-xs font-mono text-[#1E1B4B] focus:outline-none"
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                        Sandbox API Keys / Test Secrets
                      </label>
                      <input
                        className="w-full px-3 py-2 bg-white border-2 border-[#1E1B4B] rounded-xl text-xs text-[#1E1B4B] focus:outline-none"
                        type="text"
                        value={secretsNote}
                        onChange={(e) => setSecretsNote(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                        60-Second Loom Walkthrough or Brief Link
                      </label>
                      <input
                        className="w-full px-3 py-2 bg-white border-2 border-[#1E1B4B] rounded-xl text-xs text-[#1E1B4B] focus:outline-none"
                        type="text"
                        value={loomUrl}
                        onChange={(e) => setLoomUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl border-2 border-[#1E1B4B] bg-[#FEF3C7]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#F97316] text-white flex items-center justify-center text-xs font-bold">
                      DoD
                    </span>
                    <h3 className="font-display font-bold text-base text-[#1E1B4B]">
                      Definition of Done (Objective Checklist)
                    </h3>
                  </div>
                  <span className="text-xs text-[#F97316] font-bold">Zero Ambiguity</span>
                </div>
                <p className="text-xs text-[#4B5563]">
                  When automated tests and CI pass these checklist items, smart contract escrow auto-unlocks without subjective friction.
                </p>

                <div className="space-y-2">
                  {dodList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border-2 border-[#1E1B4B] shadow-badge text-xs font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveDod(idx)}
                        className="text-red-500 hover:text-red-700 font-bold px-1"
                        title="Remove requirement"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Custom Criterion */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    className="flex-1 px-3 py-2 bg-white border-2 border-[#1E1B4B] rounded-xl text-xs placeholder:text-[#4B5563]/60 focus:outline-none"
                    placeholder="+ Add a custom DoD test criterion..."
                    type="text"
                    value={customDodInput}
                    onChange={(e) => setCustomDodInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustomDod()}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomDod}
                    className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 border-2 border-[#1E1B4B] rounded-xl text-xs font-bold text-[#1E1B4B] shadow-badge cursor-pointer"
                  >
                    Add Rule
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in">
              {/* Summary Card */}
              <div className="p-4 rounded-2xl border-2 border-[#1E1B4B] bg-white shadow-pop space-y-3">
                <div className="flex items-center justify-between border-b-2 border-dashed border-[#1E1B4B]/20 pb-3">
                  <div>
                    <span className="text-xs font-bold text-[#4B5563]">Reviewing New Sticky Bounty:</span>
                    <h3 className="font-display font-extrabold text-lg text-[#1E1B4B]">{title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display font-extrabold text-[#4F46E5]">${reward}</div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                      Escrow Vault
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                  <div className="p-2 rounded-lg bg-gray-50 border border-[#1E1B4B]">
                    <span className="text-[10px] text-gray-500 block">Sprint Window</span>
                    {expiryHours} Hours Max
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 border border-[#1E1B4B]">
                    <span className="text-[10px] text-gray-500 block">Energy Level</span>
                    {energyType.toUpperCase()}
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 border border-[#1E1B4B]">
                    <span className="text-[10px] text-gray-500 block">DoD Rules</span>
                    {dodList.length} Criteria
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 border border-[#1E1B4B]">
                    <span className="text-[10px] text-gray-500 block">Starter Repo</span>
                    Linked ✓
                  </div>
                </div>

                {/* Covenant Checkbox */}
                <div className="p-3 rounded-xl bg-[#F4EFEA] border-2 border-[#1E1B4B] flex items-start gap-2.5">
                  <input
                    id="modal-covenant"
                    type="checkbox"
                    checked={covenantAccepted}
                    onChange={(e) => setCovenantAccepted(e.target.checked)}
                    className="mt-1 rounded text-[#4F46E5] border-2 border-[#1E1B4B] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="modal-covenant" className="text-xs text-[#1E1B4B] cursor-pointer">
                    <span className="font-bold">Zero Ambiguity Covenant:</span> I confirm all required starter assets are provided. I acknowledge that if all specified Definition of Done (DoD) criteria are validated by automated tests and CI within the sprint window, smart contract escrow funds will auto-release without delays.
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer Actions */}
        <div className="px-6 md:px-8 py-4 bg-[#FAF8F5] border-t-2 border-[#1E1B4B] flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#4B5563] font-semibold">
            <span className="material-symbols-outlined text-base text-[#10B981]">shield</span>
            <span>Escrow protected by Multi-Sig & GitHub Bot Validator</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep - 1) as 1 | 2 | 3)}
                className="px-4 py-2.5 border-2 border-[#1E1B4B] rounded-xl text-xs font-bold text-[#1E1B4B] hover:bg-gray-100 transition-all cursor-pointer"
              >
                Back
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep + 1) as 2 | 3 | 4)}
                className="px-6 py-2.5 bg-yellow-300 hover:bg-yellow-400 border-2 border-[#1E1B4B] rounded-xl text-xs font-bold text-[#1E1B4B] shadow-pop hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                disabled={!covenantAccepted || !title.trim()}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-[#F97316] hover:bg-orange-600 disabled:opacity-50 text-white border-2 border-[#1E1B4B] rounded-xl text-sm font-display font-bold shadow-pop hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Lock ${reward} & Broadcast to Jam Board 🚀</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
