import React, { useState } from 'react';
import { PeerReviewItem } from '../types';
import { soundEngine } from '../utils/audio';

interface PeerReviewViewProps {
  queue: PeerReviewItem[];
  onBackToBoard: () => void;
}

export const PeerReviewView: React.FC<PeerReviewViewProps> = ({
  queue: initialQueue,
  onBackToBoard,
}) => {
  const [queue, setQueue] = useState<PeerReviewItem[]>(initialQueue);
  const [selectedId, setSelectedId] = useState<string>(initialQueue[0]?.id || '');
  const [queryInput, setQueryInput] = useState('wireless headphones');
  const [isSimulatingQuery, setIsSimulatingQuery] = useState(false);
  const [queryLatency, setQueryLatency] = useState('180ms');
  const [showLogModal, setShowLogModal] = useState(false);
  const [feedbackPrompt, setFeedbackPrompt] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeItem = queue.find((item) => item.id === selectedId) || queue[0];

  const handleKudos = (type: 'cleanCode' | 'speedyShip' | 'pixelWizard' | 'rockSolid') => {
    soundEngine.playChime('kudos');
    setQueue((prev) =>
      prev.map((item) => {
        if (item.id === activeItem.id) {
          return {
            ...item,
            kudos: {
              ...item.kudos,
              [type]: item.kudos[type] + 1,
            },
          };
        }
        return item;
      })
    );
  };

  const handleRunVectorQuery = () => {
    setIsSimulatingQuery(true);
    soundEngine.playChime('click');
    setTimeout(() => {
      const randomLatency = Math.floor(Math.random() * 80) + 140;
      setQueryLatency(`${randomLatency}ms`);
      setIsSimulatingQuery(false);
      soundEngine.playChime('success');
    }, 450);
  };

  const handleSignOff = () => {
    soundEngine.playChime('transition');
    setActionNotice(
      `✓ Peer sign-off confirmed! Escrow funds ($${activeItem.reward} USDC) automatically released to @${activeItem.sprinter.handle}. You earned +50 Karma XP and a $${activeItem.validatorSplit.toFixed(2)} validator split.`
    );
    setQueue((prev) =>
      prev.map((item) => (item.id === activeItem.id ? { ...item, status: 'verified' } : item))
    );
  };

  const handleRequestRevision = () => {
    if (!feedbackPrompt.trim()) return;
    soundEngine.playChime('click');
    setActionNotice(
      `12-hour grace period initiated for @${activeItem.sprinter.handle}. Constructive note sent: "${feedbackPrompt}".`
    );
    setShowFeedbackModal(false);
    setFeedbackPrompt('');
    setQueue((prev) =>
      prev.map((item) => (item.id === activeItem.id ? { ...item, status: 'revision_requested' } : item))
    );
  };

  const handleEscalateArbitration = () => {
    soundEngine.playChime('transition');
    setActionNotice(
      `Dispute escalated to 3-Peer Arbitration Panel. Staked community reviewers have been summoned for consensus vote.`
    );
    setQueue((prev) =>
      prev.map((item) => (item.id === activeItem.id ? { ...item, status: 'arbitration_needed' } : item))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* EVALUATOR HERO & AMBIENT COMMUNITY STRIP */}
      <section className="border-b-2 border-[#1E1B4B] bg-white py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] border-2 border-[#1E1B4B] shadow-badge flex items-center justify-center text-[#4F46E5] text-2xl">
              ⚖️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#1E1B4B] tracking-tight">
                  Peer Review & DoD Verification Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-[#4F46E5] border border-[#4F46E5]/20 shadow-badge">
                  Phase 3: Consensus
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                Inspect objective acceptance criteria, trigger smart escrow payouts, and arbitrate weekend sprint handoffs.
              </p>
            </div>
          </div>

          {/* Ambient Voice Lounge & Live Metrics */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-emerald-400 text-xs font-bold text-[#1E1B4B] shadow-badge">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="material-symbols-outlined text-base text-emerald-600">headset_mic</span>
              <span>Voice Lounge: #peer-review (4 active)</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEF3C7] border border-amber-300 text-amber-900 text-xs font-bold shadow-badge">
              <span>⭐</span>
              <span>1,420 Karma XP</span>
              <span>·</span>
              <span className="text-[#1E1B4B]">Trusted Arbiter</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] border-2 border-[#1E1B4B] text-xs font-bold shadow-badge">
              <span className="material-symbols-outlined text-base text-[#4F46E5]">payments</span>
              <span className="text-gray-600">Validator Split:</span>
              <span className="text-[#1E1B4B] font-extrabold">$48.00 USDC</span>
            </div>

            <button
              onClick={onBackToBoard}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-[#1E1B4B] shadow-badge text-xs font-bold text-[#1E1B4B] cursor-pointer"
            >
              ← Board
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace (Split View) */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 w-full flex-1">
        {actionNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-100 border-2 border-[#1E1B4B] shadow-pop animate-in fade-in flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📢</span>
              <p className="text-xs sm:text-sm font-bold text-[#1E1B4B]">{actionNotice}</p>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-xs font-bold px-3 py-1 bg-white border border-[#1E1B4B] rounded-xl cursor-pointer"
            >
              OK
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANE: PENDING PEER REVIEW QUEUE (4 Columns) */}
          <aside className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-4 border-2 border-[#1E1B4B] shadow-pop flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4F46E5] text-lg">pending_actions</span>
                <h2 className="font-display font-bold text-sm text-[#1E1B4B]">Pending Peer Queue</h2>
                <span className="w-5 h-5 rounded-full bg-yellow-300 border border-[#1E1B4B] text-[11px] font-bold flex items-center justify-center">
                  {queue.length}
                </span>
              </div>
              <span className="text-xs text-[#4B5563] font-semibold">Priority: Urgency</span>
            </div>

            {/* Queue Items */}
            <div className="flex flex-col gap-3">
              {queue.map((item) => {
                const isSelected = item.id === activeItem.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedId(item.id);
                      soundEngine.playChime('click');
                    }}
                    className={`relative rounded-2xl border-2 border-[#1E1B4B] p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-yellow-100 shadow-pop ring-2 ring-[#4F46E5]'
                        : 'bg-white hover:bg-yellow-50 shadow-badge'
                    }`}
                  >
                    <div className="absolute -top-2.5 right-3 bg-[#F97316] text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-[#1E1B4B] shadow-badge">
                      <span className="material-symbols-outlined text-[12px] animate-spin">schedule</span>
                      <span>{item.autoReleaseTimeLeft}</span>
                    </div>

                    <div className="flex items-center justify-between mb-2 pt-1">
                      <div className="flex items-center gap-2">
                        <img
                          alt={item.sprinter.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-[#1E1B4B]"
                          src={item.sprinter.avatar}
                        />
                        <div>
                          <div className="text-xs font-bold text-[#1E1B4B]">@{item.sprinter.handle}</div>
                          <div className="text-[10px] text-gray-500 font-medium">
                            Sprinter · {item.sprinter.tag}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-display font-extrabold text-[#4F46E5]">
                          ${item.reward} USDC
                        </div>
                        <div className="text-[10px] text-emerald-700 font-bold">
                          +${item.validatorSplit.toFixed(2)} split
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-[#1E1B4B] mb-2">{item.title}</h3>

                    <div className="p-2 rounded-xl bg-white/80 border border-[#1E1B4B] text-[11px] text-[#4B5563] mb-2 flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-orange-600 text-sm mt-0.5">
                        timer_off
                      </span>
                      <p className="leading-tight">
                        Poster <strong>@{item.poster.handle}</strong> AFK for {item.poster.afkHours}h. Peer sign-off triggers escrow release.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-[11px]">
                      <div className="flex items-center gap-1">
                        {item.tags.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="text-[#4F46E5] font-bold flex items-center gap-0.5">
                        Inspect →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Evaluator Mandate Box */}
            <div className="rounded-2xl p-3.5 bg-white border-2 border-[#1E1B4B] shadow-badge text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#4F46E5] text-lg mt-0.5">gavel</span>
              <div className="leading-relaxed text-[#1E1B4B]">
                <strong>Evaluator Mandate:</strong> Verify strictly against the objective DoR/DoD checklist. Never introduce post-hoc requirements.
              </div>
            </div>
          </aside>

          {/* RIGHT PANE: OBJECTIVE DoD INSPECTION & VERIFICATION TERMINAL (8 Columns) */}
          <section className="lg:col-span-8 flex flex-col gap-5">
            {/* Header Banner for Sprint */}
            <div className="bg-white rounded-3xl border-2 border-[#1E1B4B] p-5 shadow-pop">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b-2 border-dashed border-[#1E1B4B]/20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-[#4F46E5] border border-indigo-300">
                      Sprint {activeItem.sprintNumber}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-[#4B5563]">Submitted by @{activeItem.sprinter.handle}</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-display font-extrabold text-[#1E1B4B] tracking-tight">
                    {activeItem.title}
                  </h2>
                </div>

                {/* Escrow Vault Card Badge */}
                <div className="flex items-center gap-3 bg-[#FAF8F5] px-4 py-2 rounded-2xl border-2 border-[#1E1B4B] shadow-badge">
                  <div className="w-9 h-9 rounded-xl bg-yellow-300 border border-[#1E1B4B] flex items-center justify-center text-lg">
                    🔒
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">
                      Vault Escrow
                    </div>
                    <div className="text-sm sm:text-base font-display font-extrabold text-[#1E1B4B]">
                      ${activeItem.reward}.00 USDC
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
                <a
                  href={activeItem.prUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl border-2 border-[#1E1B4B] bg-white hover:bg-yellow-50 transition-all shadow-badge group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#1E1B4B] text-lg">merge_type</span>
                    <div>
                      <div className="text-xs font-bold text-[#1E1B4B]">GitHub PR #18</div>
                      <div className="text-[10px] text-emerald-700 font-bold">{activeItem.prDiff}</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-sm group-hover:translate-x-0.5 transition-transform">
                    open_in_new
                  </span>
                </a>

                <a
                  href={activeItem.previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl border-2 border-[#1E1B4B] bg-white hover:bg-yellow-50 transition-all shadow-badge group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#4F46E5] text-lg">preview</span>
                    <div>
                      <div className="text-xs font-bold text-[#1E1B4B]">Vercel Preview</div>
                      <div className="text-[10px] text-[#4B5563] truncate max-w-[110px]">
                        {activeItem.previewUrl.replace('https://', '')}
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-sm group-hover:translate-x-0.5 transition-transform">
                    open_in_new
                  </span>
                </a>

                <a
                  href={activeItem.loomUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-2xl border-2 border-[#1E1B4B] bg-white hover:bg-yellow-50 transition-all shadow-badge group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#F97316] text-lg">videocam</span>
                    <div>
                      <div className="text-xs font-bold text-[#1E1B4B]">60s Loom Demo</div>
                      <div className="text-[10px] text-[#4B5563]">0:58 min · Audio HD</div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-sm group-hover:scale-110 transition-transform">
                    play_circle
                  </span>
                </a>
              </div>
            </div>

            {/* Embedded Deliverable Showcase Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Live Interactive Sandbox Simulator (7 Cols) */}
              <div className="md:col-span-7 bg-white rounded-3xl border-2 border-[#1E1B4B] p-4 shadow-pop flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      <span className="text-[11px] font-mono text-[#4B5563] ml-2">
                        preview.bounter.xyz/auth-sandbox
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#ECFDF5] text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                      Online 200 OK
                    </span>
                  </div>

                  {/* Interactive pgvector query simulation */}
                  <div className="p-3 bg-[#FAF8F5] rounded-2xl border-2 border-[#1E1B4B] shadow-badge space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1E1B4B] flex items-center gap-1">
                        <span>🧪 Live pgvector Cosine Query Benchmark:</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-[#4F46E5] bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        Latency: {queryLatency}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 px-3 py-1.5 bg-white border border-[#1E1B4B] rounded-xl text-xs font-medium focus:outline-none"
                        value={queryInput}
                        onChange={(e) => setQueryInput(e.target.value)}
                        placeholder="Search query string..."
                      />
                      <button
                        onClick={handleRunVectorQuery}
                        disabled={isSimulatingQuery}
                        className="px-3 py-1.5 bg-yellow-300 hover:bg-yellow-400 border border-[#1E1B4B] rounded-xl text-xs font-bold shadow-badge cursor-pointer"
                      >
                        {isSimulatingQuery ? 'Querying...' : 'Run Query'}
                      </button>
                    </div>

                    {/* Results table sample */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-[11px]">
                      <div className="bg-gray-50 px-3 py-1 border-b border-gray-200 font-bold text-gray-600 flex justify-between">
                        <span>Nearest Match Product</span>
                        <span>Cosine Distance</span>
                      </div>
                      <div className="p-2 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-[#1E1B4B]">Sony WH-1000XM5</span>
                          <span className="font-mono text-emerald-600 font-bold">0.965 similarity</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-[#1E1B4B]">Bose Noise Cancelling 700</span>
                          <span className="font-mono text-emerald-600 font-bold">0.942 similarity</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 text-[11px] text-[#4B5563]">
                  <span>Branch: <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">feat/auth-vector-bridge</code></span>
                  <span className="text-emerald-700 font-bold">SSL & PKCE Cookies Validated ✓</span>
                </div>
              </div>

              {/* Loom 60s Demo & Sprinter's Verification Note (5 Cols) */}
              <div className="md:col-span-5 bg-white rounded-3xl border-2 border-[#1E1B4B] p-4 shadow-pop flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#F97316] text-base">play_circle</span>
                      <span className="text-xs font-bold text-[#1E1B4B]">Walkthrough Demo</span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">58 sec</span>
                  </div>

                  <div className="relative rounded-2xl overflow-hidden aspect-video border-2 border-[#1E1B4B] bg-[#1E1B4B] flex items-center justify-center group mb-3 shadow-badge">
                    <img
                      src="/src/assets/images/sprint_vector_preview_1792185156866.jpg"
                      alt="Loom video thumbnail"
                      className="absolute inset-0 w-full h-full object-cover opacity-75"
                    />
                    <div className="w-10 h-10 rounded-full bg-white shadow-pop flex items-center justify-center text-[#4F46E5] z-10">
                      <span className="material-symbols-outlined text-2xl">play_arrow</span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-0.5 text-[10px] text-white flex items-center justify-between">
                      <span>Dave demoing cookie session & pgvector</span>
                      <span>1080p</span>
                    </div>
                  </div>
                </div>

                {/* Sprinter's Verification Note */}
                <div className="bg-[#FAF8F5] rounded-2xl p-3 border-2 border-[#1E1B4B] shadow-badge">
                  <div className="text-xs font-bold text-[#1E1B4B] mb-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-[#4F46E5]">chat_bubble</span>
                    Dave&apos;s Sprint Note:
                  </div>
                  <p className="text-[11px] text-[#4B5563] leading-relaxed">
                    &quot;{activeItem.sprinterNote}&quot;
                  </p>
                </div>
              </div>
            </div>

            {/* Automated CI/CD Bot Telemetry */}
            <div className="bg-white rounded-3xl border-2 border-[#1E1B4B] p-4 shadow-pop flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-400 flex items-center justify-center text-emerald-700 font-bold text-xl">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[#1E1B4B]">GitHub Action Run #412</span>
                    <span className="px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                      Passed
                    </span>
                  </div>
                  <p className="text-xs text-[#4B5563]">
                    12/12 unit tests passing · TypeScript zero errors · Bundle size +14.2kb
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLogModal(true)}
                className="px-3 py-1.5 rounded-xl border border-[#1E1B4B] text-xs font-bold hover:bg-gray-100 text-[#1E1B4B] transition-colors flex items-center gap-1 shadow-badge cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">terminal</span>
                <span>View Full CI Logs</span>
              </button>
            </div>

            {/* Objective Definition of Done (DoD) Criteria */}
            <div className="bg-white rounded-3xl border-2 border-[#1E1B4B] p-5 shadow-pop space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-display font-extrabold text-base sm:text-lg text-[#1E1B4B]">
                    Objective DoD Verification Criteria
                  </h3>
                  <p className="text-xs text-[#4B5563]">
                    Evaluator must objectively check all items specified in the initial contract.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] border border-emerald-400 shadow-badge">
                  {activeItem.criteria.length} of {activeItem.criteria.length} Ready
                </span>
              </div>

              <div className="space-y-2.5">
                {activeItem.criteria.map((crit) => (
                  <div
                    key={crit.id}
                    className="p-3.5 rounded-2xl border-2 border-[#1E1B4B] bg-[#FAF8F5] shadow-badge"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs sm:text-sm font-bold text-[#1E1B4B]">{crit.title}</span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        {crit.verifierNote}
                      </span>
                    </div>
                    <p className="text-xs text-[#4B5563]">{crit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Praise Stickers & Kudos Tray */}
            <div className="bg-white rounded-3xl border-2 border-[#1E1B4B] p-4 shadow-pop">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-bold text-[#1E1B4B] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-500 text-base">sentiment_satisfied</span>
                  Attach Community Kudos & Praise Stickers
                </span>
                <span className="text-[11px] text-[#4B5563]">Boosts sprinter profile karma</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => handleKudos('cleanCode')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#1E1B4B] hover:bg-yellow-100 bg-[#FAF8F5] text-xs font-bold shadow-badge active:scale-95 transition-all cursor-pointer"
                >
                  <span className="text-base">🧼</span>
                  <span>Clean Code</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded-full border border-[#1E1B4B]">
                    +{activeItem.kudos.cleanCode}
                  </span>
                </button>

                <button
                  onClick={() => handleKudos('speedyShip')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#1E1B4B] bg-yellow-300 text-[#1E1B4B] text-xs font-bold shadow-badge active:scale-95 transition-all cursor-pointer"
                >
                  <span className="text-base">⚡</span>
                  <span>Speedy Ship</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded-full border border-[#1E1B4B]">
                    +{activeItem.kudos.speedyShip}
                  </span>
                </button>

                <button
                  onClick={() => handleKudos('pixelWizard')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#1E1B4B] hover:bg-yellow-100 bg-[#FAF8F5] text-xs font-bold shadow-badge active:scale-95 transition-all cursor-pointer"
                >
                  <span className="text-base">🎨</span>
                  <span>Pixel Wizard</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded-full border border-[#1E1B4B]">
                    +{activeItem.kudos.pixelWizard}
                  </span>
                </button>

                <button
                  onClick={() => handleKudos('rockSolid')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[#1E1B4B] hover:bg-yellow-100 bg-[#FAF8F5] text-xs font-bold shadow-badge active:scale-95 transition-all cursor-pointer"
                >
                  <span className="text-base">💎</span>
                  <span>Rock Solid Tests</span>
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded-full border border-[#1E1B4B]">
                    +{activeItem.kudos.rockSolid}
                  </span>
                </button>
              </div>
            </div>

            {/* Evaluator Action Matrix / Decision Panel */}
            <div className="bg-white rounded-3xl border-2 border-[#1E1B4B] p-5 shadow-pop-lg flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-base font-display font-extrabold text-[#1E1B4B]">
                    Evaluator Verdict Sign-off
                  </div>
                  <p className="text-xs text-[#4B5563]">
                    Your sign-off immediately unlocks the escrow funds since the founder is away (&gt;22h).
                  </p>
                </div>
                <div className="text-right sm:text-right w-full sm:w-auto">
                  <span className="text-xs text-emerald-800 font-bold bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-emerald-300 shadow-badge">
                    Reward: +50 Karma XP & ${activeItem.validatorSplit.toFixed(2)} Split
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1-Click Peer Sign-off & Escrow Trigger */}
                <button
                  onClick={handleSignOff}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-display font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm shadow-pop border-2 border-[#1E1B4B] active:translate-x-0.5 active:translate-y-0.5 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">verified</span>
                    <span>1-Click Peer Sign-off</span>
                  </div>
                  <span className="text-[10px] opacity-90 font-medium">Auto-trigger Smart Escrow</span>
                </button>

                {/* Flag Missing Criteria / 12h Grace */}
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="bg-amber-100 hover:bg-amber-200 border-2 border-[#1E1B4B] text-amber-900 font-display font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm shadow-pop active:translate-x-0.5 active:translate-y-0.5 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">edit_note</span>
                    <span>Request 12h Fix</span>
                  </div>
                  <span className="text-[10px] opacity-90 font-medium">Send constructive feedback</span>
                </button>

                {/* Escalate to 3-Peer Arbitration Panel */}
                <button
                  onClick={handleEscalateArbitration}
                  className="bg-white hover:bg-gray-100 border-2 border-[#1E1B4B] text-[#1E1B4B] font-display font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm shadow-pop active:translate-x-0.5 active:translate-y-0.5 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">balance</span>
                    <span>Escalate Dispute</span>
                  </div>
                  <span className="text-[10px] opacity-75 font-medium">Summon 3-peer consensus</span>
                </button>
              </div>

              <div className="text-[11px] text-center text-[#4B5563] pt-1">
                Protected by Bounter Smart Escrow Guarantee & Community Arbiter Protocol v2.1
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* CI Logs Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1E1B4B] text-white rounded-3xl border-2 border-white/20 p-6 max-w-2xl w-full shadow-pop-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-3">
              <h3 className="font-mono font-bold text-sm text-emerald-400">
                GitHub Action CI Run #412 — Log Output
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <pre className="p-3 bg-black/50 rounded-xl font-mono text-xs text-gray-300 overflow-x-auto max-h-80 custom-scroll space-y-1">
              {`> jest --ci --coverage --testPathPattern=auth.test.ts
PASS src/__tests__/auth.test.ts
  ✓ validates Google OAuth callback PKCE exchange (42 ms)
  ✓ verifies session cookie encryption and httpOnly flags (18 ms)
  ✓ tests supabase token refresh cycle (25 ms)

PASS src/__tests__/vector.test.ts
  ✓ creates ivfflat index on doc_embeddings (85 ms)
  ✓ executes cosine distance top-5 nearest neighbor query in 180ms (180 ms)
  ✓ asserts pgvector query response under 300ms SLA (12 ms)

Test Suites: 2 passed, 2 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        1.452 s
All tests passed with exit code 0.`}
            </pre>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-4 py-2 bg-yellow-300 text-[#1E1B4B] font-bold text-xs rounded-xl border border-black cursor-pointer"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Revision Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border-2 border-[#1E1B4B] p-6 max-w-lg w-full shadow-pop-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1B4B] mb-3">
              <h3 className="font-display font-bold text-base text-[#1E1B4B]">
                Request 12-Hour Fix Grace Period
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-gray-500 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#4B5563] mb-3">
              Explain clearly what objective criteria is missing so @{activeItem.sprinter.handle} can patch it before auto-release expires:
            </p>
            <textarea
              rows={3}
              className="w-full p-3 border-2 border-[#1E1B4B] rounded-xl text-xs focus:outline-none mb-4"
              placeholder="e.g. Please ensure the Google OAuth redirect handles the error parameter if user cancels..."
              value={feedbackPrompt}
              onChange={(e) => setFeedbackPrompt(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestRevision}
                disabled={!feedbackPrompt.trim()}
                className="px-5 py-2 bg-[#F97316] text-white rounded-xl text-xs font-bold border-2 border-[#1E1B4B] shadow-badge cursor-pointer"
              >
                Send 12h Grace Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
