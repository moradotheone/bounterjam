import { useState } from 'react';
import { Bounty, SprintRoomState } from './types';
import { INITIAL_BOUNTIES, INITIAL_SPRINT_ROOM, INITIAL_PEER_REVIEWS } from './data/mockData';
import { TopHangoutBar } from './components/TopHangoutBar';
import { TopNavBar, ActiveTab } from './components/TopNavBar';
import { JamBoardView } from './components/JamBoardView';
import { SprintRoomView } from './components/SprintRoomView';
import { PeerReviewView } from './components/PeerReviewView';
import { LimbicSchedulerView } from './components/LimbicSchedulerView';
import { PinStickyModal } from './components/PinStickyModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('board');
  const [bounties, setBounties] = useState<Bounty[]>(INITIAL_BOUNTIES);
  const [sprintRoom, setSprintRoom] = useState<SprintRoomState>(INITIAL_SPRINT_ROOM);
  const [peerReviews] = useState(INITIAL_PEER_REVIEWS);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle adding a newly pinned bounty
  const handleAddBounty = (newBounty: Bounty) => {
    setBounties([newBounty, ...bounties]);
    setActiveTab('board');
  };

  // Toggle DoD item on a sticky note directly on the board
  const handleToggleDodItem = (bountyId: string, dodId: string) => {
    setBounties((prev) =>
      prev.map((b) => {
        if (b.id === bountyId) {
          return {
            ...b,
            dod: b.dod.map((d) => (d.id === dodId ? { ...d, done: !d.done } : d)),
          };
        }
        return b;
      })
    );
  };

  // Select a bounty to enter the Active Sprint Room
  const handleSelectBounty = (bounty: Bounty) => {
    setSprintRoom((prev) => ({
      ...prev,
      bountyTitle: bounty.title,
      reward: bounty.reward,
      dor: {
        ...prev.dor,
        repoUrl: bounty.dor.repoUrl || prev.dor.repoUrl,
      },
    }));
    setActiveTab('sprint');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased canvas-grid-dots text-[#1E1B4B]">
      {/* 1. Top Live Jam Hangout Bar */}
      <TopHangoutBar
        onNavigateToSprint={() => setActiveTab('sprint')}
      />

      {/* 2. Top Navigation Bar with Mode Switcher & Search */}
      <TopNavBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 3. Main Body Active View */}
      <main className="flex-grow">
        {activeTab === 'board' && (
          <JamBoardView
            bounties={bounties}
            onSelectBounty={handleSelectBounty}
            onOpenPinModal={() => setIsPinModalOpen(true)}
            onToggleDodItem={handleToggleDodItem}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'sprint' && (
          <SprintRoomView
            sprint={sprintRoom}
            onNavigateToEvaluator={() => setActiveTab('evaluator')}
            onBackToBoard={() => setActiveTab('board')}
          />
        )}

        {activeTab === 'evaluator' && (
          <PeerReviewView
            queue={peerReviews}
            onBackToBoard={() => setActiveTab('board')}
          />
        )}

        {activeTab === 'limbic' && (
          <LimbicSchedulerView
            onBackToBoard={() => setActiveTab('board')}
            onSnagSprint={() => setActiveTab('board')}
          />
        )}
      </main>

      {/* 4. Pin Sticky Modal Wizard (Available from anywhere) */}
      <PinStickyModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onAddBounty={handleAddBounty}
      />

      {/* 5. Footer */}
      <Footer onNavigateTab={(tab) => setActiveTab(tab)} />
    </div>
  );
}
