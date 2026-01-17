class CodeforcesAPI {
  codeforces_url;
  constructor() {
    this.codeforces_url = "https://codeforces.com/api";
  }
  /**
   * Get information about one or multiple users
   * @param handles Comma-separated list of Codeforces user handles (max 10000)
   * @param checkHistoricHandles If true, search includes past handles (default: true)
   */
  async getUserInfo(handles, checkHistoricHandles = true) {
    if (!handles) throw new Error("Handles parameter is required");
    const url = new URL(this.codeforces_url + `user.info`);
    url.searchParams.append("handles", handles);
    if (!checkHistoricHandles) url.searchParams.append("checkHistoricHandles", "false");
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch user info");
    }
    return data.result;
  }
  /**
   * Get list of all contests
   * @param gym Include gym contests (default: false)
   * @param groupCode Filter contests by group code
   */
  async getContestList(gym = false, groupCode) {
    const url = new URL(`${this.codeforces_url}/contest.list`);
    if (gym) url.searchParams.append("gym", "true");
    if (groupCode) url.searchParams.append("groupCode", groupCode);
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch contest list");
    }
    return data.result;
  }
  /**
   * Get contest standings
   * @param contestId Contest identifier
   * @param from 1-based index of the standings row to start with (default: 1)
   * @param count Number of standings rows to return
   * @param showUnofficial Include unofficial participants (default: false)
   * @param room Return standings for specified room
   * @param handles List of handles to show standings for (max 10000)
   */
  async getContestStandings(contestId, from = 1, count, showUnofficial = false, room, handles) {
    if (!contestId) throw new Error("Contest ID is required");
    const url = new URL(`${this.codeforces_url}/contest.standings`);
    url.searchParams.append("contestId", contestId.toString());
    url.searchParams.append("from", from.toString());
    if (count) url.searchParams.append("count", count.toString());
    if (showUnofficial) url.searchParams.append("showUnofficial", "true");
    if (room) url.searchParams.append("room", room.toString());
    if (handles) url.searchParams.append("handles", handles);
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch contest standings");
    }
    return data.result;
  }
  /**
   * Get user's submissions
   * @param handle Codeforces user handle
   * @param from 1-based index of the first submission to return
   * @param count Number of submissions to return
   */
  /**
   * Get user's submissions
   * @param handle Codeforces user handle
   * @param from 1-based index of the first submission to return
   * @param count Number of submissions to return
   */
  async userStatus(handle, from = 1, count = 10) {
    if (!handle) throw new Error("Handle parameter is required");
    const url = new URL(`${this.codeforces_url}/user.status`);
    url.searchParams.append("handle", handle);
    url.searchParams.append("from", from.toString());
    url.searchParams.append("count", count.toString());
    const response = await fetch(url.href.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch user submissions");
    }
    return data.result;
  }
  /**
   * Get user's rating history
   * @param handle Codeforces user handle
   */
  async getUserRating(handle) {
    if (!handle) throw new Error("Handle parameter is required");
    const url = new URL(`${this.codeforces_url}/user.rating`);
    url.searchParams.append("handle", handle);
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch user rating history");
    }
    return data.result;
  }
  /**
   * Get problems with optional tag filtering
   * @param tags Semicolon-separated list of tags
   * @param problemsetName Short name of the problemset (e.g., 'acmsguru')
   */
  async getProblems(tags, problemsetName) {
    const url = new URL(`${this.codeforces_url}/problemset.problems`);
    if (tags) url.searchParams.append("tags", tags);
    if (problemsetName) url.searchParams.append("problemsetName", problemsetName);
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch problems");
    }
    return data.result;
  }
  /**
   * Get blog entry comments
   * @param blogEntryId ID of the blog entry
   */
  async getBlogEntryComments(blogEntryId) {
    if (!blogEntryId) throw new Error("Blog entry ID is required");
    const url = new URL(`${this.codeforces_url}/blogEntry.comments`);
    url.searchParams.append("blogEntryId", blogEntryId.toString());
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch blog entry comments");
    }
    return data.result;
  }
  /**
   * Get full blog entry content
   * @param blogEntryId ID of the blog entry
   */
  async getBlogEntryView(blogEntryId) {
    if (!blogEntryId) throw new Error("Blog entry ID is required");
    const url = new URL(`${this.codeforces_url}/blogEntry.view`);
    url.searchParams.append("blogEntryId", blogEntryId.toString());
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch blog entry");
    }
    return data.result;
  }
  /**
   * Get contest hacks
   * @param contestId Contest ID
   * @param asManager If true, returns info available to managers (requires authorization)
   */
  async getContestHacks(contestId, asManager = false) {
    if (!contestId) throw new Error("Contest ID is required");
    const url = new URL(`${this.codeforces_url}/contest.hacks`);
    url.searchParams.append("contestId", contestId.toString());
    if (asManager) url.searchParams.append("asManager", "true");
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch contest hacks");
    }
    return data.result;
  }
  /**
   * Get contest rating changes
   * @param contestId Contest ID
   */
  async getContestRatingChanges(contestId) {
    if (!contestId) throw new Error("Contest ID is required");
    const url = new URL(`${this.codeforces_url}/contest.ratingChanges`);
    url.searchParams.append("contestId", contestId.toString());
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch contest rating changes");
    }
    return data.result;
  }
  /**
   * Get recent problemset status
   * @param count Number of submissions to return (max 1000)
   * @param problemsetName Optional custom problemset name
   */
  async getProblemsetRecentStatus(count, problemsetName) {
    if (!count) throw new Error("Count parameter is required");
    if (count > 1e3) throw new Error("Count cannot exceed 1000");
    const url = new URL(`${this.codeforces_url}/problemset.recentStatus`);
    url.searchParams.append("count", count.toString());
    if (problemsetName) url.searchParams.append("problemsetName", problemsetName);
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch recent problemset status");
    }
    return data.result;
  }
  /**
   * Get user's blog entries
   * @param handle Codeforces user handle
   */
  async getUserBlogEntries(handle) {
    if (!handle) throw new Error("Handle parameter is required");
    const url = new URL(`${this.codeforces_url}/user.blogEntries`);
    url.searchParams.append("handle", handle);
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch user blog entries");
    }
    return data.result;
  }
  /**
   * Get user's friends (requires authentication)
   * @param onlyOnline If true, returns only friends currently online
   */
  async getUserFriends(onlyOnline = false) {
    const url = new URL(`${this.codeforces_url}/user.friends`);
    if (onlyOnline) url.searchParams.append("onlyOnline", "true");
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch user friends");
    }
    return data.result;
  }
  /**
   * Get rated users list
   * @param activeOnly If true, returns only users active in rated contests in the last month
   * @param includeRetired If true, returns all rated users
   * @param contestId Optional contest ID to filter by
   */
  async getRatedUsers(activeOnly = false, includeRetired = false, contestId) {
    const url = new URL(`${this.codeforces_url}/user.ratedList`);
    if (activeOnly) url.searchParams.append("activeOnly", "true");
    if (includeRetired) url.searchParams.append("includeRetired", "true");
    if (contestId) url.searchParams.append("contestId", contestId.toString());
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch rated users");
    }
    return data.result;
  }
  /**
   * Get recent actions
   * @param maxCount Number of recent actions to return (max 100)
   */
  async getRecentActions(maxCount = 30) {
    if (maxCount > 100) throw new Error("maxCount cannot exceed 100");
    const url = new URL(`${this.codeforces_url}/recentActions`);
    url.searchParams.append("maxCount", maxCount.toString());
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status === "FAILED") {
      throw new Error(data.comment || "Failed to fetch recent actions");
    }
    return data.result;
  }
}
const codeforcesAPI = new CodeforcesAPI();

export { codeforcesAPI as c };
