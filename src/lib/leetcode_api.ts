// leetcode-api.ts

// Response types
interface LeetCodeUserStats {
  username: string;
  totalSolveCount: number;
  totalParticipation: number;
  successRate: string;
  ranking: number;
  reputation: number;
  detailedStats: {
    byDifficulty: {
      easy: DifficultyStats;
      medium: DifficultyStats;
      hard: DifficultyStats;
    };
    byLanguage: LanguageStats;
    byTags: TagStats;
  };
  recentSubmissions: SubmissionStats[];
}

interface DifficultyStats {
  solved: number;
  total: number;
  percentage: string;
}

interface SubmissionStats {
  id: string;
  title: string;
  titleSlug: string;
  status: string;
  statusDisplay: string;
  lang: string;
  langName: string;
  runtime: string;
  timestamp: number;
  url: string;
  isPending: boolean;
  memory: string;
  hasNotes: boolean;
  notes?: string;
  flagType: number;
}

interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
}

interface GraphQLResponse {
  data?: any;
  errors?: GraphQLError[];
}

interface LanguageProblemCount {
  languageName: string;
  problemsSolved: number;
}

interface TagProblemCount {
  tag: {
    name: string;
    id: string;
    slug: string;
  };
  problemsSolved: number;
}

interface LanguageStats {
  [key: string]: number;
}

interface TagStats {
  [key: string]: {
    id: string;
    slug: string;
    problemsSolved: number;
  };
}

export class LeetCodeAPI {
  private username: string;
  private baseUrl: string = 'https://leetcode.com/graphql';

  constructor(username: string) {
    this.username = username;
  }

  /**
   * Fetches comprehensive statistics for a LeetCode user
   * @returns Complete user statistics
   */
  async getUserStats(username?: string): Promise<LeetCodeUserStats> {
    // If username is provided, update the instance username
    if (username) {
      this.username = username;
    }
    try {
      // Get basic profile info and solve counts
      const profileData = await this.fetchUserProfile();
      // Get detailed submission stats
      const submissionData = await this.fetchUserSubmissions();
      // Get language preferences
      const languageData = await this.fetchLanguageStats();
      // Get problem tags stats
      const tagData = await this.fetchTagStats();

      // Calculate success rate
      const { acSubmissionNum, totalSubmissionNum } = profileData.matchedUser.submitStats;
      const successRate = totalSubmissionNum.submissions > 0 
        ? ((acSubmissionNum.submissions / totalSubmissionNum.submissions) * 100).toFixed(2) + '%'
        : '0%';

      // Process detailed statistics
      const difficultyStats = {
        easy: {
          solved: acSubmissionNum.difficulty.easy || 0,
          total: profileData.allQuestionsCount?.[0]?.count || 0,
          percentage: this.calculatePercentage(
            acSubmissionNum.difficulty.easy || 0,
            profileData.allQuestionsCount?.[0]?.count || 0
          )
        },
        medium: {
          solved: acSubmissionNum.difficulty.medium || 0,
          total: profileData.allQuestionsCount?.[1]?.count || 0,
          percentage: this.calculatePercentage(
            acSubmissionNum.difficulty.medium || 0,
            profileData.allQuestionsCount?.[1]?.count || 0
          )
        },
        hard: {
          solved: acSubmissionNum.difficulty.hard || 0,
          total: profileData.allQuestionsCount?.[2]?.count || 0,
          percentage: this.calculatePercentage(
            acSubmissionNum.difficulty.hard || 0,
            profileData.allQuestionsCount?.[2]?.count || 0
          )
        }
      };

      // Return compiled stats with proper typing
      return {
        username: this.username,
        totalSolveCount: acSubmissionNum.submissions || 0,
        totalParticipation: profileData.matchedUser.userCalendar?.totalActiveDays || 0,
        successRate: successRate,
        ranking: profileData.matchedUser.profile.ranking || 0,
        reputation: profileData.matchedUser.profile.reputation || 0,
        detailedStats: {
          byDifficulty: difficultyStats,
          byLanguage: await this.processLanguageStats(languageData),
          byTags: await this.processTagStats(tagData)
        },
        recentSubmissions: submissionData.recentSubmissionList?.slice(0, 10) || []
      };
    } catch (error) {
      console.error(`Error fetching data for user ${this.username}:`, error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch LeetCode stats: ${error.message}`);
      }
      throw new Error('Failed to fetch LeetCode stats: Unknown error');
    }
  }

  /**
   * Fetches the user profile and basic statistics
   */
  async fetchUserProfile() {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            realName
            websites
            countryName
            skillTags
            company
            school
            starRating
            aboutMe
            userAvatar
            reputation
            ranking
          }
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
          userCalendar {
            activeYears
            streak
            totalActiveDays
            dccBadges {
              timestamp
              badge {
                name
                icon
              }
            }
          }
        }
        allQuestionsCount {
          difficulty
          count
        }
      }
    `;

    const variables = { username: this.username };
    const response = await this.makeGraphQLRequest(query, variables);
    
    if (!response.data.matchedUser) {
      throw new Error(`User ${this.username} not found`);
    }
    
    return response.data;
  }

  /**
   * Fetches the user's recent submissions
   */
  async fetchUserSubmissions() {
    const query = `
      query getUserSubmissions($username: String!, $limit: Int!) {
        recentSubmissionList(username: $username, limit: $limit) {
          id
          title
          titleSlug
          status
          statusDisplay
          lang
          langName
          runtime
          timestamp
          url
          isPending
          memory
          hasNotes
          notes
          flagType
        }
      }
    `;

    const variables = { 
      username: this.username,
      limit: 20 
    };
    
    const response = await this.makeGraphQLRequest(query, variables);
    return response.data;
  }

  /**
   * Fetches statistics about languages used by the user
   */
  async fetchLanguageStats() {
    const query = `
      query getUserLanguages($username: String!) {
        matchedUser(username: $username) {
          languageProblemCount {
            languageName
            problemsSolved
          }
        }
      }
    `;

    const variables = { username: this.username };
    const response = await this.makeGraphQLRequest(query, variables);
    
    if (!response.data.matchedUser) {
      throw new Error(`User ${this.username} not found`);
    }
    
    return response.data;
  }

  /**
   * Fetches statistics about problem tags the user has solved
   */
  async fetchTagStats() {
    const query = `
      query getUserTags($username: String!) {
        matchedUser(username: $username) {
          tagProblemCounts {
            tag {
              name
              id
              slug
            }
            problemsSolved
          }
        }
      }
    `;

    const variables = { username: this.username };
    const response = await this.makeGraphQLRequest(query, variables);
    
    if (!response.data.matchedUser) {
      throw new Error(`User ${this.username} not found`);
    }
    
    return response.data;
  }

  /**
   * Makes a GraphQL request to the LeetCode API
   */
  async makeGraphQLRequest(query: string, variables: Record<string, any>): Promise<GraphQLResponse> {
      try {
          const response = await fetch(this.baseUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Referer': 'https://leetcode.com',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              },
              body: JSON.stringify({
                  query,
                  variables
              })
          });

          if (!response.ok) {
              if (response.status === 404) {
                  throw new Error(`User ${this.username} not found`);
              }
              if (response.status === 429) {
                  throw new Error('Rate limit exceeded. Please try again later.');
              }
              throw new Error(`LeetCode API error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json() as GraphQLResponse;
          
          // Check for GraphQL errors
          if (data.errors) {
              const errorMessage = data.errors.map((e: GraphQLError) => e.message).join(', ');
              throw new Error(`GraphQL error: ${errorMessage}`);
          }

          return data;
      } catch (error) {
          if (error instanceof Error) {
              if (error.message.includes('fetch')) {
                  throw new Error('Failed to connect to LeetCode API. Please check your internet connection.');
              }
              throw error;
          }
          throw new Error('An unknown error occurred');
      }
  }

  /**
   * Processes language statistics from the API response
   */
  async processLanguageStats(data: any): Promise<LanguageStats> {
      const languageStats: LanguageStats = {};
      
      if (data?.matchedUser?.languageProblemCount) {
          (data.matchedUser.languageProblemCount as LanguageProblemCount[]).forEach(item => {
              languageStats[item.languageName] = item.problemsSolved;
          });
      }
      
      return languageStats;
  }

  /**
   * Processes tag statistics from the API response
   */
  async processTagStats(data: any): Promise<TagStats> {
      const tagStats: TagStats = {};
      
      if (data?.matchedUser?.tagProblemCounts) {
          (data.matchedUser.tagProblemCounts as TagProblemCount[]).forEach(item => {
              tagStats[item.tag.name] = {
                  id: item.tag.id,
                  slug: item.tag.slug,
                  problemsSolved: item.problemsSolved
              };
          });
      }
      
      return tagStats;
  }

  /**
   * Calculates percentage of problems solved
   */
  private calculatePercentage(solved: number, total: number): string {
    if (total === 0) return '0%';
    return ((solved / total) * 100).toFixed(2) + '%';
  }
}