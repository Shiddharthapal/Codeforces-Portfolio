/**
 * Codeforces API Client
 * Documentation based on the official Codeforces API
 */

// API Base URL
const CODEFORCES_API_URL = 'https://codeforces.com/api';

// Types for API responses
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

export interface Problem {
  contestId?: number;
  index: string;
  name: string;
  points?: number;
  rating?: number;
  tags: string[];
}

export interface Hack {
  hacker: any; // Party type
  defender: any; // Party type
  verdict: string;
  problem: Problem;
  test: string;
  judgeProtocol: any;
}

/**
 * API Functions
 */

/**
 * Get information about one or multiple users
 * @param handles Codeforces user handles (comma-separated)
 */
export async function getUserInfo(handles: string): Promise<User[]> {
  const response = await fetch(`${CODEFORCES_API_URL}/user.info?handles=${handles}`);
  const data = await response.json();
  return data.result;
}

/**
 * Get list of all contests
 * @param gym Include gym contests (default: false)
 */
export async function getContestList(gym: boolean = false): Promise<Contest[]> {
  const response = await fetch(`${CODEFORCES_API_URL}/contest.list?gym=${gym}`);
  const data = await response.json();
  return data.result;
}

/**
 * Get contest standings
 * @param contestId Contest identifier
 * @param from 1-based index of the standings row to start with (default: 1)
 * @param count Number of standings rows to return (default: all)
 * @param showUnofficial Include unofficial participants (default: false)
 */
export async function getContestStandings(
  contestId: number,
  from: number = 1,
  count?: number,
  showUnofficial: boolean = false
) {
  let url = `${CODEFORCES_API_URL}/contest.standings?contestId=${contestId}&from=${from}`;
  if (count) url += `&count=${count}`;
  if (showUnofficial) url += '&showUnofficial=true';
  
  const response = await fetch(url);
  const data = await response.json();
  return data.result;
}

/**
 * Get user's submissions
 * @param handle Codeforces user handle
 * @param from 1-based index of the first submission to return
 * @param count Number of submissions to return
 */
export async function getUserSubmissions(
  handle: string,
  from: number = 1,
  count: number = 10
): Promise<Submission[]> {
  const response = await fetch(
    `${CODEFORCES_API_URL}/user.status?handle=${handle}&from=${from}&count=${count}`
  );
  const data = await response.json();
  return data.result;
}

/**
 * Get user's rating history
 * @param handle Codeforces user handle
 */
export async function getUserRating(handle: string) {
  const response = await fetch(`${CODEFORCES_API_URL}/user.rating?handle=${handle}`);
  const data = await response.json();
  return data.result;
}

/**
 * Get problems with optional tag filtering
 * @param tags Comma-separated list of tags
 */
export async function getProblems(tags?: string) {
  let url = `${CODEFORCES_API_URL}/problemset.problems`;
  if (tags) url += `?tags=${tags}`;
  
  const response = await fetch(url);
  const data = await response.json();
  return data.result;
}

/**
 * Get recent actions
 * @param maxCount Number of recent actions to return
 */
export async function getRecentActions(maxCount: number = 30) {
  const response = await fetch(`${CODEFORCES_API_URL}/recentActions?maxCount=${maxCount}`);
  const data = await response.json();
  return data.result;
}