export type BountyColor = 'yellow' | 'pink' | 'mint' | 'cyan' | 'peach' | 'lavender';
export type EnergyLevel = 'creacion' | 'mantenimiento' | 'descompresion';
export type ChronotypeProfile = 'Alba' | 'Cenit' | 'Ocaso';

export interface DoDItem {
  id: string;
  text: string;
  done: boolean;
  requiredByPoster?: boolean;
}

export interface Bounty {
  id: string;
  title: string;
  poster: {
    name: string;
    handle: string;
    role: string;
    avatar: string;
    isVerified?: boolean;
  };
  reward: number;
  rewardCurrency: string;
  escrowStatus: 'locked' | 'released' | 'refunding';
  durationLabel: string;
  expiryHours: number;
  timeLeft: string;
  tags: string[];
  colorScheme: BountyColor;
  energyType: EnergyLevel;
  dor: {
    summary: string;
    repoUrl?: string;
    hasSecrets?: boolean;
    loomUrl?: string;
  };
  dod: DoDItem[];
  chatCount: number;
  activeSprinters?: number;
}

export interface ChatMessage {
  id: string;
  sender: {
    name: string;
    handle: string;
    role: 'poster' | 'sprinter' | 'evaluator' | 'bot';
    avatar?: string;
  };
  timestamp: string;
  text: string;
  codeSnippet?: string;
  sticker?: string;
}

export interface SprintRoomState {
  sprintId: string;
  bountyTitle: string;
  reward: number;
  currency: string;
  secondsRemaining: number;
  isEscrowLocked: boolean;
  isAudioMuted: boolean;
  activeCollaborators: {
    poster: { name: string; handle: string; avatar: string };
    sprinter: { name: string; handle: string; avatar: string };
  };
  dor: {
    repoUrl: string;
    cloneUrl: string;
    loomUrl: string;
    secrets: { key: string; value: string }[];
  };
  dodItems: DoDItem[];
  messages: ChatMessage[];
  submission: {
    prUrl: string;
    previewUrl: string;
    loomUrl: string;
    ciPassed: boolean;
    submittedAt?: string;
    isApproved: boolean;
    approvedAt?: string;
  };
}

export interface PeerReviewItem {
  id: string;
  sprintNumber: string;
  title: string;
  sprinter: {
    name: string;
    handle: string;
    tag: string;
    avatar: string;
  };
  poster: {
    name: string;
    handle: string;
    afkHours: number;
  };
  reward: number;
  validatorSplit: number;
  autoReleaseTimeLeft: string;
  tags: string[];
  prUrl: string;
  prDiff: string;
  previewUrl: string;
  loomUrl: string;
  ciPassed: boolean;
  criteria: {
    id: string;
    title: string;
    description: string;
    verified: boolean;
    verifierNote: string;
  }[];
  sprinterNote: string;
  kudos: {
    cleanCode: number;
    speedyShip: number;
    pixelWizard: number;
    rockSolid: number;
  };
  status: 'pending' | 'verified' | 'revision_requested' | 'arbitration_needed';
}

export interface LimbicBlock {
  id: string;
  blockNumber: number;
  startTime: string;
  endTime: string;
  energyLevel: EnergyLevel;
  focusPhase: {
    minutes: number;
    title: string;
    taskDescription: string;
  };
  transitionPhase: {
    minutes: number;
    activityTitle: string;
    activityDescription: string;
  };
  isFixedMeeting?: boolean;
}
