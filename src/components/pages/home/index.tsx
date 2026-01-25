"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Award,
  BarChart3,
  LineChart,
  Calendar,
  ChevronDown,
  ChevronRight,
  Info,
  Plus,
  Search,
  Trophy,
  LogOut,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { about } from "./about";
import Graph from "./graph";
interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  token?: string;
  createdAt?: string;
}

interface UserDetails {
  userId: string;
  name: string;
  email: string;
  username: string;
  password: string;
  codeforces: string;
  contests?: number;
  solve?: number;
  rating?: number;
  successRate?: number;
  avatar?: string;
}

interface UserContestData {
  solve: number;
  contests: number;
  rating: number;
  successRate: number;
}

export interface contestantData {
  cflastMonthSolveCount: number;
  averageSolve: number;
  cfTotalSolved: number;
  cfSucessRate: number;
  cftotalParticipation: number;
  cfavatar?: string;
}
interface UpcomingContest {
  id: number;
  name: string;
  type: string;
  durationSeconds: number;
  durationFormatted: string;
  startTimeSeconds: number;
  startTimeFormatted: string;
  relativeTimeToStart: number;
  timeToStartFormatted: string;
  phase: string;
  websiteUrl?: string;
}

export default function ContestTracker() {
  const [contestants, setContestants] = useState<UserDetails[]>([]);
  const [userContest, setUserContest] = useState<UserContestData[]>([]);
  const [open, setOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [upcomingContests, setUpcomingContests] = useState<UpcomingContest[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = (theme: "light" | "dark") => {
    setIsDarkMode(theme === "dark");
  };

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { _id, token } = useAppSelector((state) => state.auth);
  // console.log("🧞‍♂️  _id --->", _id);
  // console.log("🧞‍♂️  token --->", token);

  const filteredContestants = contestants.filter(
    (contestant) =>
      contestant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contestant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    let filtered = contestants;

    // Filter by name only
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setContestants(filtered || null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    console.log("Log out");
    setTimeout(() => {
      setUserDetails(null);
      setIsUserMenuOpen(false);
      dispatch(logout());
      navigate("/");
    }, 0);
  };

  const handleProfile = () => {
    setTimeout(() => {
      setIsUserMenuOpen(false);
      navigate("/profile/", {
        state: { isDarkMode },
      }); // Navigate to profile page
    }, 0);
  };

  const getPatientInitials = (patientName: string) => {
    if (!patientName) return "AB";

    const cleanName = patientName.trim();

    if (!cleanName) return "AB";

    // Split the cleaned name and get first 2 words
    const words = cleanName.split(" ").filter((word) => word.length > 0);

    if (words.length >= 2) {
      // Get first letter of first 2 words
      return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1) {
      // If only one word, get first 2 letters
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return "AB";
    }
  };

  const fetchUserDetailsWithConcurrency = async (
    users: User[],
    concurrency = 12
  ) => {
    const results = [];

    for (let i = 0; i < users.length; i += concurrency) {
      const batch = users.slice(i, i + concurrency);
      const batchPromises = batch.map(async (user) => {
        try {
          const res = await fetch(`/api/userApi/${user._id}`);
          if (!res.ok) return null;
          const data = await res.json();
          return data?.userDetails || null;
        } catch (error) {
          console.error(`Failed to fetch user ${user._id}:`, error);
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
    }

    return results;
  };

  const fetchCodeforcesDataWithConcurrency = async (
    userDetails: UserDetails[],
    concurrency = 8
  ) => {
    const usersWithCodeforces = userDetails.filter((user) => user?.codeforces);
    if (usersWithCodeforces.length === 0) return [];

    const results = [];

    for (let i = 0; i < usersWithCodeforces.length; i += concurrency) {
      const batch = usersWithCodeforces.slice(i, i + concurrency);
      const batchPromises = batch.map(async (user) => {
        try {
          const response = await fetch(
            `/api/userApi/codeforces?handle=${encodeURIComponent(
              user.codeforces
            )}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!response.ok) return null;

          const data = await response.json();
          console.log("🧞‍♂️  data --->", data);
          if (!data.success) return null;

          if (_id === user.userId) {
            setUserContest([
              {
                solve: data?.data?.totalSolved || 0,
                contests: data?.data?.totalContest || 0,
                rating: data?.rating?.[data.rating.length - 1]?.newRating || 0,
                successRate: data?.data?.successRate || 0,
              },
            ]);
          }

          return {
            userId: user.userId,
            cfTotalSolved: data?.data?.totalSolved || 0,
            cfTotalContest: data?.data?.totalContest || 0,
            cfRating: data?.rating?.[data.rating.length - 1]?.newRating || 0,
            cfSuccessRate: data?.data?.successRate || 0,
          };
        } catch (error) {
          console.error(
            `Failed to fetch Codeforces data for ${user.codeforces}:`,
            error
          );
          return null;
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults.filter(Boolean));
    }

    return results;
  };

  // Handle Add Contestant button click
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Step 1: Fetch all users
        const [allUsersResponse, upcommingContestsResponse] = await Promise.all(
          [fetch("/api/userApi/allUser"), fetch(`/api/userApi/upComingContest`)]
        );
        if (!allUsersResponse.ok) {
          throw new Error("Failed to fetch all users");
        }
        const [allUsers, upcommingContests] = await Promise.all([
          allUsersResponse.json(),
          upcommingContestsResponse.json(),
        ]);

        //set upcommming contests
        setUpcomingContests(upcommingContests?.contests);

        // Fetch user details with concurrency control
        const userDetails = await fetchUserDetailsWithConcurrency(allUsers, 12);
        const validUserDetails = userDetails.filter(Boolean);

        setContestants(validUserDetails);

        // Fetch the user data who have the profile
        if (_id) {
          let speceficUserResponse = await fetch(`/api/userApi/${_id}`);
          const speceficUserDetails = await speceficUserResponse.json();
          console.log("🧞‍♂️  speceficUserDetails --->", speceficUserDetails);
          setUserDetails(speceficUserDetails?.userDetails);
        }

        // Fetch Codeforces data with concurrency control
        const codeforcesDataPromise =
          fetchCodeforcesDataWithConcurrency(validUserDetails);

        //wait for operations
        const codeforcesData = await Promise.all([codeforcesDataPromise]);
        console.log("🧞‍♂️  codeforcesData --->", codeforcesData);

        // Update contestants with Codeforces data in a single batch
        if (codeforcesData.length > 0 && Array.isArray(codeforcesData[0])) {
          setContestants((prevContestants) =>
            prevContestants.map((contestant) => {
              const cfData = codeforcesData[0].find(
                (data) => data && data?.userId === contestant.userId
              );
              if (!cfData) return contestant;

              return {
                ...contestant,
                solve: (contestant.solve || 0) + (cfData?.cfTotalSolved ?? 0),
                contests:
                  (contestant.contests || 0) + (cfData?.cfTotalContest ?? 0),
                rating: (contestant.rating || 0) + (cfData?.cfRating ?? 0),
                successRate:
                  (contestant.successRate || 0) + (cfData?.cfSuccessRate ?? 0),
              };
            })
          );
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchAllData();
  }, [_id]);

  //refresh the page
  const handleRefresh = () => {
    window.location.reload();
  };
 useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (open && !target.closest(".dropdown-container")) {
      setOpen(false);
    }
  };

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      setOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleEscapeKey);
  
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("keydown", handleEscapeKey);
  };
}, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isUserMenuOpen && !target.closest(".dropdown-container")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header
        className={`p-4 ${
          isDarkMode
            ? "bg-gradient-to-r from-cyan-800 to blue-300"
            : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
        }shadow-md`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div
            onClick={() => handleRefresh()}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Trophy className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Contest Tracker</h1>
          </div>
          <div className="flex items-center gap-4 md:gap-16">
            <div className="dropdown-container relative">
              <Button
                variant="outline"
                className={` ${
                  isDarkMode ? "border-black focus-visible:ring-black" : ""
                }border-white bg-white/20 hover:text-gray-800 focus:outline-none`}
                onClick={() => setOpen(!open)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Upcoming Contests
                <ChevronDown className="ml-2 h-4 w-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs"
                >
                  {upcomingContests?.length}
                </Badge>
              </Button>

              {open && (
                <div
                  className={`absolute right-0 mt-2 w-80 shadow-lg rounded-md  border-none z-50 ${
                    isDarkMode ? "bg-black" : "bg-white"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between p-3 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-cyan-800 to-blue-80"
                        : "bg-gradient-to-r from-cyan-50 to-blue-50"
                    }`}
                  >
                    <span
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } font-medium`}
                    >
                      Upcoming Contests
                    </span>
                    <Badge
                      variant="outline"
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } font-normal`}
                    >
                      {upcomingContests?.length} contests
                    </Badge>
                  </div>
                  <div className="border-t" />
                  <div className="max-h-[300px] custom-scrollbar px-1">
                    {upcomingContests?.map((contest) => (
                      <div
                        key={contest?.id}
                        className={`rounded-md p-2 ${
                          isDarkMode ? "hover:bg-cyan-950" : "hover:bg-gray-200"
                        } cursor-pointer`}
                      >
                        <div className="w-full">
                          <div className="flex justify-between items-start gap-2">
                            <h3
                              className={`${
                                isDarkMode ? "text-white" : "text-gray-900"
                              } font-medium line-clamp-2`}
                            >
                              {contest?.name}
                            </h3>
                            <Badge className="shrink-0">
                              {contest?.timeToStartFormatted}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {contest?.startTimeFormatted}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={dropdownRef}>
              <Avatar
                className={`h-9 w-9 border-2 border-white cursor-pointer transition-all duration-200 hover:scale-110 hover:border-cyan-300 hover:shadow-md hover:shadow-cyan-300/30 ${
                  isDarkMode ? "border-black" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                }}
              >
                <AvatarFallback className="text-black">
                  {getPatientInitials(userDetails?.name)}
                </AvatarFallback>
              </Avatar>

              {isUserMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 ${
                    isDarkMode
                      ? " bg-gray-700 rounded-md shadow-md shadow-white  "
                      : "bg-white rounded-md shadow-md shadow-black border border-gray-200"
                  }  z-50 dropdown-container`}
                >
                  {token ? (
                    <div className="py-1">
                      {/* Profile Option */}
                      <button
                        className={`flex items-center w-full px-4 py-2 text-sm${
                          isDarkMode
                            ? " bg-gray-700 text-gray-200 hover:bg-gray-500"
                            : "bg--white text-gray-900 hover:bg-gray-100"
                        } focus:outline-none`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleProfile();
                        }}
                        role="menuitem"
                      >
                        <User className="h-4 w-4 mr-3 text-gray-400" />
                        Profile
                      </button>

                      {/* Logout Option */}
                      <button
                        className={`flex items-center w-full px-4 py-2 text-sm 
                          ${
                            isDarkMode
                              ? " bg-gray-700 text-gray-200 hover:bg-gray-500"
                              : " bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                          }
                          transition-colors duration-150 focus:bg-red-50 focus:outline-none`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLogout();
                        }}
                        role="menuitem"
                      >
                        <LogOut className="h-4 w-4 mr-3 text-red-400" />
                        Logout
                      </button>

                      {/*Light mode option */}
                      <button
                        className={`w-full px-4 py-2 flex items-center gap-2 ${
                          isDarkMode
                            ? " bg-gray-700 text-gray-200 hover:bg-gray-500"
                            : "bg-white text-gray-900 hover:bg-gray-100"
                        } ${!isDarkMode ? "bg-gray-100" : ""}`}
                        onClick={() => toggleTheme("light")}
                      >
                        <Sun className="h-4 w-4" />
                        Light Mode
                      </button>

                      {/*dark mode option */}
                      <button
                        className={`w-full px-4 py-2 flex items-center gap-2 ${
                          isDarkMode
                            ? " bg-gray-700 text-gray-200 hover:bg-gray-500"
                            : "text-gray-900 hover:bg-gray-100"
                        } ${isDarkMode ? "bg-gray-700" : ""}`}
                        onClick={() => toggleTheme("dark")}
                      >
                        <Moon className="h-4 w-4" />
                        Dark Mode
                      </button>
                    </div>
                  ) : (
                    <div className="py-2 px-4 text-sm text-gray-500">
                      Please log in
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main
        className={`mx-auto py-8 px-4 ${
          isDarkMode ? "dark bg-gray-900 container" : "container"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-8">
          <div className="mb-36 md:w-3/4 max-h-[500px] ">
            <Card className="shadow-lg border-none">
              <CardHeader
                className={`bg-gradient-to-r rounded-t-lg ${
                  isDarkMode
                    ? "dark from-cyan-800 to-blue-80"
                    : "from-cyan-50 to-blue-50"
                } text-white`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div onClick={() => handleRefresh()}>
                    <CardTitle
                      className={`text-2xl text-cyan-900
                    ${isDarkMode ? "text-white" : "text-cyan-900"}`}
                    >
                      Contestants Dashboard
                    </CardTitle>
                    <CardDescription>
                      Track and manage contest participants
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Input
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className={`pl-2 border ${
                          isDarkMode ? "border-white" : "border-black"
                        }  `}
                      />
                    </div>
                    <Button
                      onClick={handleSearch}
                      className={`px-6
                    ${
                      isDarkMode
                        ? "bg-blue-80 border border-white text-white hover:bg-cyan-950"
                        : ""
                    }`}
                    >
                      <Search className="h-4 w-4 mr-2" />
                    </Button>

                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleProfile();
                      }}
                      className={`px-6
                    ${
                      isDarkMode
                        ? "bg-blue-80 border border-white text-white hover:bg-cyan-950"
                        : ""
                    }`}
                      role="menuitem"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Account
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="list" className="w-full">
                  <div className=" flex flex-row border-b px-6">
                    <TabsList className="w-full justify-start h-12 bg-transparent">
                      <TabsTrigger
                        value="list"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none"
                      >
                        List View
                      </TabsTrigger>
                      <TabsTrigger
                        value="grid"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none"
                      >
                        Grid View
                      </TabsTrigger>
                      <TabsTrigger
                        value="stats"
                        className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none"
                      >
                        Statistics
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center whitespace-nowrap font-medium text-sm">
                      <User className="h-4 w-4 text-cyan-700" />
                      Contestants:{" "}
                      <span className="ml-1 font-bold">
                        {contestants.length}
                      </span>
                    </div>
                  </div>

                  {contestants && contestants.length > 0 ? (
                    <div>
                      <TabsContent value="list" className="m-0">
                        <ScrollArea className="max-h-[500px]">
                          <div className="divide-y">
                            {contestants?.map((contestant: UserDetails) => (
                              <div
                                key={contestant.userId}
                                className={`flex items-center justify-between p-4
                                `}
                              >
                                <div className="flex items-center gap-4">
                                  <Avatar>
                                    <AvatarFallback>
                                      {getPatientInitials(contestant.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium">
                                      {contestant.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      @
                                      {contestant.username ||
                                        contestant.name.toLocaleLowerCase()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6">
                                  <div className="text-center">
                                    <p className="text-sm text-muted-foreground">
                                      Contests
                                    </p>
                                    <p className="font-medium">
                                      {contestant.contests}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm text-muted-foreground">
                                      Total Solve
                                    </p>
                                    <p className="font-medium">
                                      {contestant.solve}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm text-muted-foreground">
                                      Rating
                                    </p>
                                    <p className="font-medium">
                                      {contestant.rating}
                                    </p>
                                  </div>
                                  <div className="">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          size="icon"
                                          className={`${
                                            isDarkMode
                                              ? "bg-cyan-950 border-white text-white hover:bg-cyan-800"
                                              : "bg-white border-black text-black hover:bg-gray-100"
                                          }`}
                                        >
                                          <Info className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      {about({ contestant, isDarkMode })}
                                    </Dialog>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="grid" className="m-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                          {filteredContestants.length > 0 ? (
                            filteredContestants.map((contestant) => (
                              <Card
                                key={contestant.userId}
                                className="overflow-hidden hover:shadow-md transition-shadow"
                              >
                                <CardHeader
                                  className={`bg-gradient-to-r ${
                                    isDarkMode
                                      ? "dark from-cyan-800 to-blue-80 text-white"
                                      : "from-cyan-50 to-blue-50 text-black"
                                  }`}
                                >
                                  <div className="flex justify-between">
                                    <Avatar className="h-12 w-12 border">
                                      <AvatarFallback>
                                        {getPatientInitials(contestant?.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <Badge
                                      variant={
                                        (contestant.rating ?? 0) > 1800
                                          ? "default"
                                          : (contestant.rating ?? 0) > 1600
                                          ? "secondary"
                                          : "outline"
                                      }
                                    >
                                      {contestant.rating} pts
                                    </Badge>
                                  </div>
                                  <CardTitle className="mt-2">
                                    {contestant.name}
                                  </CardTitle>
                                  <CardDescription>
                                    @
                                    {contestant.username ||
                                      contestant.name.toLocaleLowerCase()}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4">
                                  <div className="grid grid-cols-2 gap-2 ">
                                    <div
                                      className={`text-center p-2 ${
                                        isDarkMode ? "dark" : "bg-slate-50"
                                      }  rounded`}
                                    >
                                      <p className="text-sm text-muted-foreground">
                                        Contests
                                      </p>
                                      <p className="font-medium text-lg">
                                        {contestant.contests}
                                      </p>
                                    </div>
                                    <div
                                      className={`text-center p-2 ${
                                        isDarkMode ? "dark" : "bg-slate-50"
                                      }  rounded`}
                                    >
                                      <p className="text-sm text-muted-foreground">
                                        Wins
                                      </p>
                                      <p className="font-medium text-lg">
                                        {contestant.solve}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                                <CardFooter
                                  className={`flex justify-between p-4 ${
                                    isDarkMode ? "dark" : "bg-slate-50"
                                  }  rounded`}
                                >
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        <Info className="mr-2 h-4 w-4" />
                                        Details
                                      </Button>
                                    </DialogTrigger>
                                    {about({ contestant, isDarkMode })}
                                  </Dialog>
                                </CardFooter>
                              </Card>
                            ))
                          ) : (
                            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                              <h3 className="font-medium text-lg">
                                No contestants found
                              </h3>
                              <p className="text-muted-foreground">
                                Try adjusting your search or add a new
                                contestant.
                              </p>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="stats" className="m-0 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                Top Performers
                              </CardTitle>
                              <CardDescription>
                                Based on success rate
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {[...contestants]
                                .sort(
                                  (a, b) =>
                                    ((b.solve ?? 0) / (b.contests ?? 0) || 0) -
                                    ((a.solve ?? 0) / (a.contests ?? 0) || 0)
                                )
                                .slice(0, 3)
                                .map((contestant, index) => (
                                  <div
                                    key={contestant.userId}
                                    className="flex items-center gap-2 mb-2"
                                  >
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        index === 0
                                          ? "bg-yellow-100 text-yellow-700"
                                          : index === 1
                                          ? "bg-slate-100 text-slate-700"
                                          : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">
                                        {contestant.name}
                                      </p>
                                      <div className="flex  gap-2 text-sm">
                                        <span className="text-muted-foreground">
                                          Success rate:
                                        </span>
                                        <span>{contestant.successRate}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                Highest Rated
                              </CardTitle>
                              <CardDescription>
                                Top contestants by rating
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {[...contestants]
                                .sort(
                                  (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
                                )
                                .slice(0, 3)
                                .map((contestant, index) => (
                                  <div
                                    key={contestant.userId}
                                    className="flex items-center gap-2 mb-2"
                                  >
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        index === 0
                                          ? "bg-yellow-100 text-yellow-700"
                                          : index === 1
                                          ? "bg-slate-100 text-slate-700"
                                          : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">
                                        {contestant.name}
                                      </p>
                                      <div className="flex gap-2 text-sm">
                                        <span className="text-muted-foreground">
                                          Rating:
                                        </span>
                                        <Badge
                                          variant={
                                            (contestant.rating ?? 0) > 1800
                                              ? "default"
                                              : (contestant.rating ?? 0) > 1600
                                              ? "secondary"
                                              : "outline"
                                          }
                                        >
                                          {contestant.rating}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">
                                Most Active
                              </CardTitle>
                              <CardDescription>
                                By number of contests
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {[...contestants]

                                .slice(0, 3)
                                .map((contestant, index) => (
                                  <div
                                    key={contestant.userId}
                                    className="flex items-center gap-2 mb-2"
                                  >
                                    <div
                                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                        index === 0
                                          ? "bg-yellow-100 text-yellow-700"
                                          : index === 1
                                          ? "bg-slate-100 text-slate-700"
                                          : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      {index + 1}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium">
                                        {contestant.name}
                                      </p>
                                      <div className="flex gap-2 text-sm">
                                        <span className="text-muted-foreground">
                                          Contests:
                                        </span>
                                        <span>{contestant.contests || 0}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </div>
                  ) : (
                    <Card className="p-12 rounded-t-none">
                      <div className="space-y-2 flex flex-col items-center">
                        <User className="h-12 w-12 text-muted-foreground mx-auto" />
                        <h3 className="text-lg  font-medium mx-auto">
                          No user found
                        </h3>
                        <p className="text-muted-foreground mx-auto">
                          Try searching with a different name
                        </p>
                      </div>
                    </Card>
                  )}
                </Tabs>
              </CardContent>
            </Card>
            <div>
              <Card className="shadow-lg my-10 border-none ">
                <CardHeader
                  className={`${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-800 to-blue-80 text-white"
                      : " bg-gradient-to-r from-cyan-50 to-blue-50 text-black"
                  } rounded-t-lg`}
                >
                  <div className=" text-2xl font-semibold ">Contest Graph</div>
                </CardHeader>
                {userContest[0] ? (
                  <CardContent>
                    {" "}
                    <Graph
                      handle={userDetails?.codeforces || ""}
                      isDarkMode={isDarkMode}
                    />
                  </CardContent>
                ) : (
                  <div className="p-12 rounded-t-none">
                    <div className="space-y-2 flex flex-col items-center">
                      <User className="h-12 w-12 text-muted-foreground mx-auto" />
                      <h3 className="text-lg  font-medium mx-auto">
                        Create Account
                      </h3>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>

          <div className="md:w-1/4">
            <div className="space-y-6">
              <Card className="shadow-lg border-none">
                <CardHeader
                  className={`${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-800 to-blue-80 text-white"
                      : "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-900"
                  } rounded-t-lg`}
                >
                  <CardTitle className="text-lg ">My Details</CardTitle>
                </CardHeader>
                {userContest[0] ? (
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Award className="h-5 w-5 text-blue-700" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total Contest's Problem Solve
                          </p>
                          <p className="font-medium text-lg">
                            {userContest[0]?.contests}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-full">
                          <Trophy className="h-5 w-5 text-emerald-700" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total Solve
                          </p>
                          <p className="font-medium text-lg">
                            {userContest[0]?.solve}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <BarChart3 className="h-5 w-5 text-purple-700" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Current Rating
                          </p>
                          <p className="font-medium text-lg">
                            {userContest[0]?.rating}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <LineChart className="h-5 w-5 text-purple-700" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Success Rate
                          </p>
                          <p className="font-medium text-lg">
                            {userContest[0]?.successRate || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                ) : (
                  <div className="p-12 rounded-t-none">
                    <div className="space-y-2 flex flex-col items-center">
                      <User className="h-12 w-12 text-muted-foreground mx-auto" />
                      <h3 className="text-lg  font-medium mx-auto">
                        Create Account
                      </h3>
                    </div>
                  </div>
                )}
              </Card>

              <Card className="shadow-lg border-none">
                <CardHeader
                  className={`${
                    isDarkMode
                      ? "bg-gradient-to-r from-cyan-800 to-blue-80 text-white"
                      : "bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-900"
                  } rounded-t-lg`}
                >
                  <CardTitle className="text-lg ">Upcoming Contests</CardTitle>
                </CardHeader>
                {upcomingContests?.map((contest: UpcomingContest) => (
                  <CardContent key={contest.id} className="p-4">
                    <div className="space-y-3">
                      <div
                        className={`border rounded-lg p-3 ${
                          isDarkMode ? "hover:bg-cyan-950" : "hover:bg-gray-200"
                        } cursor-pointer`}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{contest.name}</h3>
                          <Badge
                            className={`${
                              isDarkMode ? "bg-cyan-700 text-white" : ""
                            }`}
                          >
                            {contest.timeToStartFormatted}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {contest.startTimeFormatted} •{" "}
                          {contest.durationFormatted}
                        </p>
                        <Link to={contest.websiteUrl ?? "#"}>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm">participants</p>
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                ))}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
