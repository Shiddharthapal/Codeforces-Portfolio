export interface User {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank?: string;
  maxRank?: string;
  rating?: number;
  maxRating?: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar?: string;
  titlePhoto?: string;
}

export interface BlogEntry {
  id: number;
  originalLocale?: string;
  locale?: string;
  creationTimeSeconds: number;
  modificationTimeSeconds?: number;
  authorHandle: string;
  title: string;
  content: string;
  allowViewHistory: boolean;
  tags: string[];
  rating: number;
}

export interface Comment {
  id: number;
  creationTimeSeconds: number;
  commentatorHandle: string;
  text: string;
  parentCommentId?: number;
  rating: number;
}

export interface Contest {
  id: number;
  name: string;
  type: 'CF' | 'IOI' | 'ICPC';
  phase: 'BEFORE' | 'CODING' | 'SYSTEM_TEST' | 'FINISHED';
  frozen: boolean;
  durationSeconds: number;
  startTimeSeconds: number;
  websiteUrl?: string;
  description?: string;
  difficulty?: number;
  kind?: string;
  icpcRegion?: string;
  country?: string;
  city?: string;
  season?: string;
}

export interface Submission {
  id: number;
  contestId: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  programmingLanguage: string;
  verdict: 'OK' | 'FAILED' | 'WRONG_ANSWER' | string;
  testset: 'SAMPLES' | 'PRETESTS' | 'TESTS';
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
  points?: number;
}

export interface Party {
  contestId?: number;
  members: User[];
  participantType: 'CONTESTANT' | 'PRACTICE' | 'VIRTUAL' | 'MANAGER' | 'OUT_OF_COMPETITION';
  teamId?: number;
  teamName?: string;
  ghost: boolean;
  room?: number;
  startTimeSeconds?: number;
}

export interface Problem {
  contestId?: number;
  index: string;
  name: string;
  points?: number;
  rating?: number;
  tags: string[];
}

export interface ProblemStatistics {
  contestId?: number;
  index: string;
  solvedCount: number;
}

export interface RatingChange {
  contestId: number;
  contestName: string;
  handle: string;
  rank: number;
  ratingUpdateTimeSeconds: number;
  oldRating: number;
  newRating: number;
}

export interface Hack {
  id: number;
  creationTimeSeconds: number;
  hacker: Party;
  defender: Party;
  verdict: 'HACK_SUCCESSFUL' | 'HACK_UNSUCCESSFUL' | 'INVALID_INPUT' | 'GENERATOR_INCOMPILABLE' | 'GENERATOR_CRASHED' | 'IGNORED' | 'TESTING' | 'OTHER';
  problem: Problem;
  test: string;
  judgeProtocol?: {
    manual?: boolean;
    protocol?: string;
    verdict?: string;
  };
}

export interface ContestStandingsResponse {
  contest: Contest;
  problems: Problem[];
  rows: {
    party: Party;
    rank: number;
    points: number;
    penalty: number;
    successfulHackCount: number;
    unsuccessfulHackCount: number;
    problemResults: {
      points: number;
      rejectedAttemptCount: number;
      type: 'PRELIMINARY' | 'FINAL';
      bestSubmissionTimeSeconds?: number;
    }[];
  }[];
}