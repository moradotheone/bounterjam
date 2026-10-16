import React, { useState, useEffect } from 'react';
import { SprintRoomState } from '../types';
import { soundEngine } from '../utils/audio';

interface SprintRoomViewProps {
  sprint: SprintRoomState;
  onNavigateToEvaluator: () => void;
  onBackToBoard: () => void;
}

export const SprintRoomView: React.FC<SprintRoomViewProps> = ({
  sprint,
  onNavigateToEvaluator,
  onBackToBoard,
}) => {
  const [seconds, setSeconds] = useState(sprint.secondsRemaining);
  const [dodItems, setDodItems] = useState(sprint.dodItems);
  const [messages, setMessages] = useState(sprint.messages);
  const [chatInput, setChatInput] = useState('');
  const [showSecrets, setShowSecrets] = useState(false);
  const [showLoomModal, setShowLoomModal] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(sprint.isAudioMuted);
  const [submission, setSubmission] = useState(sprint.submission);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [releaseSuccess, setReleaseSuccess] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${h}h ${m < 10 ? '0' : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  const completedDodCount = dodItems.filter((i) => i.done).length;
  const dodPercentage = Math.round((completedDodCount / dodItems.length) * 100);

  const toggleDod = (id: string) => {
    setDodItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = !item.done;
          soundEngine.playChime(next ? 'success' : 'click');
          return { ...item, done: next };
        }
        return item;
      })
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: {
        name: 'You (Sprinter)',
        handle: 'dave_vibe',
        role: 'sprinter' as const,
        avatar: sprint.activeCollaborators.sprinter.avatar,
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: chatInput.trim(),
    };

    setMessages([...messages, newMsg]);
    setChatInput('');
    soundEngine.playChime('click');

    // Simulated quick response from poster or CI bot
    setTimeout(() => {
      const replies = [
        'Awesome work Dave! Checking the PR diff right now.',
        'Looks super crisp. The vector indexing latency test is blazing fast!',
        'Testing Google OAuth callback on staging... session verified! 🚀',
      ];
      const botReply = {
        id: `msg-auto-${Date.now()}`,
        sender: {
          name: 'Sarah Vibe',
          handle: 'sarah_vibe',
          role: 'poster' as const,
          avatar: sprint.activeCollaborators.poster.avatar,
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: replies[Math.floor(Math.random() * replies.length)],
      };
      setMessages((curr) => [...curr, botReply]);
      soundEngine.playChime('kudos');
    }, 1800);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(label);
    soundEngine.playChime('click');
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleReleaseEscrow = () => {
    soundEngine.playChime('transition');
    setReleaseSuccess(true);
    setSubmission((prev) => ({ ...prev, isApproved: true }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Live Sprint Status Banner / HUD */}
      <section className="bg-white border-b-2 border-[#1E1B4B] py-3 px-4 md:px-8 sticky top-24 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Sprint Countdown Pill */}
          <div className="flex items-center gap-2.5 bg-[#FEF3C7] px-4 py-1.5 rounded-full border-2 border-[#1E1B4B] shadow-badge">
            <span className="material-symbols-outlined text-amber-800 text-base">schedule</span>
            <span className="text-xs md:text-sm font-bold text-amber-900 font-mono">
              ⏳ {formatTime(seconds)} remaining
            </span>
            <span className="text-xs bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded border border-[#1E1B4B]">
              72h Sprint
            </span>
          </div>

          {/* Escrow Status Pill */}
          <div className="flex items-center gap-2 bg-[#ECFDF5] px-3.5 py-1.5 rounded-full border-2 border-[#1E1B4B] shadow-badge">
            <span className="material-symbols-outlined text-emerald-600 text-base">lock</span>
            <span className="text-xs md:text-sm font-bold text-[#1E1B4B]">
              {releaseSuccess ? '🎉 $180.00 USDC Released!' : '🔒 $180.00 USDC Locked in Vault'}
            </span>
            <span className="text-xs text-[#4B5563] font-medium border-l border-gray-300 pl-2">
              Smart Escrow
            </span>
          </div>

          {/* Ambient Audio Room Capsule */}
          <div className="flex items-center gap-3 bg-[#F4EFEA] px-3.5 py-1.5 rounded-full border border-[#1E1B4B] text-xs font-semibold text-[#4B5563] flex-1 max-w-md">
            <div className="flex items-center gap-1.5 truncate">
              <span className="material-symbols-outlined text-[#4F46E5] text-base">headphones</span>
              <span className="text-[#1E1B4B] font-bold truncate">#weekend-hustle</span>
              <span className="hidden xl:inline text-xs text-[#4B5563]">• Lofi chill beats</span>
              <span className="inline-flex items-center gap-1 text-xs text-[#4F46E5] font-medium ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] animate-ping" /> 3 makers
              </span>
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <button
                onClick={() => {
                  soundEngine.toggleAmbient();
                  setIsAudioMuted(!isAudioMuted);
                }}
                className="p-1 hover:text-[#1E1B4B] transition-colors rounded cursor-pointer"
                title="Toggle audio stream"
              >
                <span className="material-symbols-outlined text-sm">
                  {isAudioMuted ? 'volume_off' : 'volume_up'}
                </span>
              </button>
            </div>
          </div>

          {/* Back button & Collaborators Quick Glance */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex -space-x-2">
                <img
                  className="w-8 h-8 rounded-full border-2 border-[#1E1B4B] object-cover"
                  alt="Poster: @sarah_vibe"
                  referrerPolicy="no-referrer"
                  src={sprint.activeCollaborators.poster.avatar}
                  title="Poster: @sarah_vibe"
                />
                <img
                  className="w-8 h-8 rounded-full border-2 border-[#1E1B4B] object-cover"
                  alt="Sprinter: @dave_vibe"
                  referrerPolicy="no-referrer"
                  src={sprint.activeCollaborators.sprinter.avatar}
                  title="Sprinter: @dave_vibe"
                />
              </div>
              <span className="text-xs font-bold text-[#1E1B4B]">Sprint Duo Active</span>
            </div>

            <button
              onClick={onBackToBoard}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-[#1E1B4B] shadow-badge text-xs font-bold text-[#1E1B4B] flex items-center gap-1 cursor-pointer"
            >
              <span>← Board</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Workspace Canvas: Two-Column Studio Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-6">
        {releaseSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-500 shadow-pop animate-in fade-in flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <h3 className="font-display font-extrabold text-[#1E1B4B] text-lg">
                  Escrow Released! $180.00 USDC Transferred
                </h3>
                <p className="text-xs text-emerald-900 font-medium">
                  The sprint deliverable passed all Definition of Done criteria. Funds have auto-transferred to Dave&apos;s wallet.
                </p>
              </div>
            </div>
            <button
              onClick={() => setReleaseSuccess(false)}
              className="px-3 py-1.5 bg-white text-emerald-900 text-xs font-bold rounded-xl border border-emerald-400 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: The Spec & Live Definition of Done Checklist (cols 1-7) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Card 1: What I Give You (Definition of Ready) */}
            <article className="bg-white rounded-3xl border-2 border-[#1E1B4B] p-5 md:p-6 shadow-pop">
              <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-[#1E1B4B]/20 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#F4EFEA] text-[#1E1B4B] flex items-center justify-center font-bold text-base border-2 border-[#1E1B4B] shadow-badge">
                    📦
                  </span>
                  <div>
                    <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#1E1B4B]">
                      What I Give You (Definition of Ready)
                    </h2>
                    <p className="text-xs text-[#4B5563]">
                      Clean boilerplate, pre-configured secrets, and interactive product brief.
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-[#ECFDF5] text-[#10B981] font-bold px-3 py-1 rounded-full border border-emerald-400 shadow-badge">
                  DoR Verified ✓
                </span>
              </div>

              {/* DoR Sub-Items */}
              <div className="space-y-4">
                {/* Repository Fork Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#FAF8F5] rounded-2xl border-2 border-[#1E1B4B] shadow-badge gap-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#1E1B4B] text-2xl">folder</span>
                    <div>
                      <span className="text-xs font-bold text-[#1E1B4B] block">Clean GitHub Repo Starter</span>
                      <span className="text-xs text-[#4B5563] font-mono">
                        github.com/sarah-vibe/bounter-rag-starter
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(sprint.dor.cloneUrl, 'repo')}
                      className="px-3 py-1.5 bg-white hover:bg-yellow-100 border border-[#1E1B4B] rounded-xl text-xs font-bold text-[#1E1B4B] flex items-center gap-1.5 shadow-badge transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">content_copy</span>
                      <span>{copyFeedback === 'repo' ? 'Copied!' : 'Clone URL'}</span>
                    </button>
                    <a
                      href={sprint.dor.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-[#4F46E5] hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-badge transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">fork_right</span>
                      <span>Fork Starter</span>
                    </a>
                  </div>
                </div>

                {/* Staging Credentials Drawer */}
                <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border-2 border-[#1E1B4B] shadow-badge">
                  <div
                    onClick={() => setShowSecrets(!showSecrets)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#F97316] text-2xl">key</span>
                      <div>
                        <span className="text-xs font-bold text-[#1E1B4B] block">
                          Staging Supabase Credentials
                        </span>
                        <span className="text-xs text-[#4B5563]">
                          Pre-provisioned sandbox with pgvector extension enabled
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#4B5563] hover:text-[#1E1B4B]">
                      <span>{showSecrets ? 'Hide Keys' : 'Show Keys'}</span>
                      <span className="material-symbols-outlined text-base">
                        {showSecrets ? 'expand_less' : 'expand_more'}
                      </span>
                    </div>
                  </div>

                  {showSecrets && (
                    <div className="mt-3 pt-3 border-t-2 border-dashed border-[#1E1B4B]/20 space-y-2">
                      {sprint.dor.secrets.map((sec, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white p-2 rounded-xl border border-[#1E1B4B] text-xs font-mono text-[#4B5563]"
                        >
                          <span className="truncate">
                            {sec.key}={sec.value}
                          </span>
                          <button
                            onClick={() => copyToClipboard(sec.value, `secret-${idx}`)}
                            className="text-[#4F46E5] hover:text-indigo-900 font-bold text-xs pl-2 cursor-pointer"
                          >
                            {copyFeedback === `secret-${idx}` ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Embedded 60s Loom Demo Video Player Card */}
                <div className="relative overflow-hidden rounded-2xl border-2 border-[#1E1B4B] bg-[#1E1B4B] text-white shadow-badge group">
                  <div
                    onClick={() => setShowLoomModal(true)}
                    className="relative h-44 w-full bg-cover bg-center flex items-center justify-center cursor-pointer"
                    style={{
                      backgroundImage: `url('/src/assets/images/sprint_vector_preview_1792185156866.jpg')`,
                    }}
                  >
                    <div className="absolute inset-0 bg-[#1E1B4B]/60 backdrop-blur-[1px] transition-opacity group-hover:bg-[#1E1B4B]/40" />
                    <button className="relative z-10 w-12 h-12 rounded-full bg-[#F97316] hover:bg-orange-600 text-white flex items-center justify-center shadow-pop transition-transform transform group-hover:scale-110 active:scale-95 cursor-pointer">
                      <span className="material-symbols-outlined text-2xl">play_arrow</span>
                    </button>
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#1E1B4B]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>Poster&apos;s 60s Loom Brief</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs text-white/90">
                      <span className="font-medium">&quot;Here is exactly how the PDF vectors should index&quot;</span>
                      <span className="font-mono bg-[#1E1B4B]/80 px-2 py-0.5 rounded">00:58</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Card 2: Live Definition of Done (DoD) Checklist */}
            <article className="bg-white rounded-3xl border-2 border-[#1E1B4B] p-5 md:p-6 shadow-pop">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b-2 border-dashed border-[#1E1B4B]/20 mb-5 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center font-bold text-base shadow-badge">
                      ✓
                    </span>
                    <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#1E1B4B]">
                      Live Definition of Done (DoD)
                    </h2>
                  </div>
                  <p className="text-xs text-[#4B5563] mt-0.5">
                    Real-time contract verification milestones. Tick off as you code to verify deliverables.
                  </p>
                </div>

                {/* Progress Bar Micro-widget */}
                <div className="flex items-center gap-3 bg-[#F4EFEA] px-3.5 py-1.5 rounded-xl border-2 border-[#1E1B4B] shadow-badge self-start sm:self-auto">
                  <div className="w-24 h-2.5 rounded-full bg-gray-200 overflow-hidden border border-[#1E1B4B]">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${dodPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#1E1B4B]">
                    {completedDodCount} of {dodItems.length} Done
                  </span>
                </div>
              </div>

              {/* Interactive DoD Checklist Items */}
              <div className="space-y-3">
                {dodItems.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 border-[#1E1B4B] transition-all cursor-pointer shadow-badge ${
                      item.done ? 'bg-[#ECFDF5]' : 'bg-[#FAF8F5] hover:bg-yellow-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleDod(item.id)}
                      className="mt-1 w-4 h-4 rounded border-2 border-[#1E1B4B] text-[#4F46E5] focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            item.done ? 'line-through text-gray-500' : 'text-[#1E1B4B]'
                          }`}
                        >
                          {item.text}
                        </span>
                        {item.done ? (
                          <span className="text-[11px] text-emerald-800 font-bold bg-emerald-200 px-2 py-0.5 rounded-full">
                            Passed ✓
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Time Extension & Emergency Peer Assist Footer */}
              <div className="mt-5 pt-4 border-t-2 border-dashed border-[#1E1B4B]/20 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    setSeconds((prev) => prev + 12 * 3600);
                    soundEngine.playChime('success');
                  }}
                  className="px-3.5 py-1.5 rounded-xl border-2 border-[#1E1B4B] bg-white hover:bg-yellow-100 text-xs font-bold text-[#1E1B4B] shadow-badge flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-amber-600 text-base">more_time</span>
                  <span>Request +12h Extension</span>
                </button>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#4B5563]">
                  <span className="material-symbols-outlined text-sm text-emerald-600">shield</span>
                  <span>Protected by Escrow Guarantee</span>
                </div>
              </div>
            </article>
          </div>

          {/* RIGHT COLUMN: Collaborative Stream & Deliverable Submission Panel (cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Card 3: Collaborative Live Sprint Chat Thread */}
            <article className="bg-white rounded-3xl border-2 border-[#1E1B4B] p-5 shadow-pop flex flex-col h-[480px]">
              <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#1E1B4B]/20 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="font-display font-bold text-sm text-[#1E1B4B]">Sprint Room Stream</h2>
                </div>
                <div className="flex items-center gap-1 bg-[#F4EFEA] px-2.5 py-0.5 rounded-full border border-[#1E1B4B] text-[11px] font-bold text-[#4B5563]">
                  <span className="material-symbols-outlined text-xs">sensors</span>
                  <span>Realtime WebSocket</span>
                </div>
              </div>

              {/* Message History Container */}
              <div className="flex-1 overflow-y-auto custom-scroll pr-1 space-y-3.5">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-2.5 text-xs">
                    {msg.sender.avatar ? (
                      <img
                        src={msg.sender.avatar}
                        alt={msg.sender.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover border border-[#1E1B4B] mt-0.5 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-purple-200 border border-[#1E1B4B] flex items-center justify-center font-bold text-[10px] shrink-0">
                        🤖
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#1E1B4B]">@{msg.sender.handle}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            msg.sender.role === 'poster'
                              ? 'bg-indigo-100 text-[#4F46E5]'
                              : msg.sender.role === 'sprinter'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {msg.sender.role}
                        </span>
                        <span className="text-[10px] text-gray-400 ml-auto">{msg.timestamp}</span>
                      </div>

                      <div className="mt-1 p-2.5 rounded-2xl rounded-tl-sm bg-[#F4EFEA] text-[#1E1B4B] border border-gray-200">
                        {msg.text}
                        {msg.codeSnippet && (
                          <div className="mt-2 bg-[#1E1B4B] rounded-xl p-2 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-black">
                            {msg.codeSnippet}
                          </div>
                        )}
                        {msg.sticker && (
                          <div className="mt-1.5 inline-block bg-yellow-200 border border-[#1E1B4B] text-[#1E1B4B] font-bold px-2 py-0.5 rounded-full text-[11px] shadow-badge">
                            {msg.sticker}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Field */}
              <div className="pt-3 border-t-2 border-dashed border-[#1E1B4B]/20 mt-2">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input
                    className="w-full pl-3 pr-20 py-2.5 bg-[#FAF8F5] rounded-xl border-2 border-[#1E1B4B] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-xs font-medium placeholder:text-gray-400 text-[#1E1B4B]"
                    placeholder="Drop a snippet, ask questions, or vibe check..."
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <div className="absolute right-1.5 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setChatInput((prev) => prev + ' ```\n// code snippet\n```')}
                      className="p-1 text-gray-500 hover:text-[#1E1B4B] rounded cursor-pointer"
                      title="Insert code snippet template"
                    >
                      <span className="material-symbols-outlined text-base">code</span>
                    </button>
                    <button
                      type="submit"
                      className="p-1.5 bg-[#4F46E5] hover:bg-indigo-700 text-white rounded-lg active:scale-95 transition-all shadow-badge cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                  </div>
                </form>
              </div>
            </article>

            {/* Card 4: Deliverable Submission & Escrow Release Drawer */}
            <article className="bg-white rounded-3xl border-2 border-[#1E1B4B] p-5 md:p-6 shadow-pop">
              <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-[#1E1B4B]/20 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#F97316] text-white flex items-center justify-center font-bold text-base shadow-badge">
                    🚀
                  </span>
                  <h2 className="font-display font-extrabold text-base sm:text-lg text-[#1E1B4B]">
                    Deliverable Submission
                  </h2>
                </div>
                <span className="text-xs bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-0.5 rounded-full font-bold border border-[#4F46E5]/30">
                  Step 4: Verification
                </span>
              </div>

              {/* Submission Inputs Form */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                    GitHub Pull Request URL
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">
                      link
                    </span>
                    <input
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] rounded-xl border-2 border-[#1E1B4B] text-xs font-mono text-[#1E1B4B] focus:outline-none"
                      type="text"
                      value={submission.prUrl}
                      onChange={(e) => setSubmission({ ...submission, prUrl: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1B4B] mb-1">
                    Vercel Deployment Preview URL
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-base">
                      rocket_launch
                    </span>
                    <input
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] rounded-xl border-2 border-[#1E1B4B] text-xs font-mono text-[#1E1B4B] focus:outline-none"
                      type="text"
                      value={submission.previewUrl}
                      onChange={(e) => setSubmission({ ...submission, previewUrl: e.target.value })}
                    />
                  </div>
                </div>

                {/* CI/CD Test Status Pill */}
                <div className="p-3 rounded-2xl bg-[#ECFDF5] border-2 border-[#1E1B4B] shadow-badge flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
                    <span className="text-xs font-bold text-[#1E1B4B]">GitHub CI/CD Test Runner:</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-800">
                    Passing (14/14 tests green)
                  </span>
                </div>

                {/* Loom Walkthrough Link Added */}
                <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xl border border-[#1E1B4B] text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="material-symbols-outlined text-base text-[#F97316]">videocam</span>
                    <span className="font-medium truncate max-w-[200px]">{submission.loomUrl}</span>
                  </div>
                  <span className="text-xs text-[#4F46E5] font-bold">Attached ✓</span>
                </div>

                {/* Primary Action Buttons Group */}
                <div className="pt-2 space-y-2.5">
                  <button
                    onClick={() => {
                      soundEngine.playChime('success');
                      alert('PR and Vercel preview submitted for DoD review!');
                    }}
                    className="w-full py-2.5 px-4 bg-[#4F46E5] hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-display font-bold flex items-center justify-center gap-2 border-2 border-[#1E1B4B] shadow-badge active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">done_all</span>
                    <span>Submit for DoD Review</span>
                  </button>

                  <button
                    onClick={handleReleaseEscrow}
                    className="w-full py-2.5 px-4 bg-[#F97316] hover:bg-orange-600 text-white rounded-xl text-xs sm:text-sm font-display font-bold flex items-center justify-center gap-2 border-2 border-[#1E1B4B] shadow-pop active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">payments</span>
                    <span>1-Click Approve & Release $180 USDC</span>
                  </button>

                  <button
                    onClick={onNavigateToEvaluator}
                    className="w-full py-2 px-4 bg-yellow-300 hover:bg-yellow-400 border-2 border-[#1E1B4B] rounded-xl text-xs font-bold text-[#1E1B4B] shadow-badge flex items-center justify-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">group</span>
                    <span>Ask Peer Evaluator to Review Hub</span>
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      {/* Loom Brief Modal */}
      {showLoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border-2 border-[#1E1B4B] p-6 max-w-2xl w-full shadow-pop-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E1B4B] mb-4">
              <h3 className="font-display font-bold text-lg text-[#1E1B4B]">
                Poster&apos;s 60-Second Loom Brief: PDF Vector Index Spec
              </h3>
              <button
                onClick={() => setShowLoomModal(false)}
                className="p-1 text-gray-500 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative flex items-center justify-center border-2 border-[#1E1B4B]">
              <img
                src="/src/assets/images/sprint_vector_preview_1792185156866.jpg"
                alt="Video preview"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white p-4 text-center">
                <span className="text-4xl mb-2">🎬</span>
                <p className="font-bold text-sm max-w-md">
                  &quot;Hey Dave! Quick rundown: we need the Supabase auth callback to set PKCE tokens, then run pgvector cosine distance queries on the 1500-token chunks. Keep latency under 300ms!&quot;
                </p>
                <span className="mt-3 text-xs bg-white/20 px-3 py-1 rounded-full border border-white/40">
                  Duration: 0:58 · 1080p 60fps
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowLoomModal(false)}
                className="px-5 py-2 bg-yellow-300 border-2 border-[#1E1B4B] rounded-xl text-xs font-bold shadow-badge cursor-pointer"
              >
                Got it, let&apos;s ship!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
