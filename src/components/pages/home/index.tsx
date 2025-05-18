"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useToast,
  type ToastProps,
  type ToastVariant,
} from "@/hooks/use-toast";
import {
  AlertCircle,
  Award,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronRight,
  Info,
  Plus,
  Search,
  Trash2,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { createAc } from "./create";
import { about } from "./about";
import { UpcomingContest } from "./upCommingContest";

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

interface FormData {
  name: string;
  email: string;
  username: string;
  codeforces: string;
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

interface AuthState {
  _id: string | undefined;
  token: string | undefined;
  isAuthenticated: boolean;
}

export default function ContestTracker() {
  const [contestants, setContestants] = useState<UserDetails[]>([]);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    username: "",
    codeforces: "",
  });
  const [upcomingContests, setUpcomingContests] = useState<UpcomingContest[]>(
    []
  );

  const toast = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { _id, token } = useAppSelector((state) => state.auth);

  const filteredContestants = contestants.filter(
    (contestant) =>
      contestant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contestant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    setUserDetails(null);
    setIsUserMenuOpen(false);
    dispatch(logout());
    navigate("/");
  };

  const deleteContestant = (id: string) => {
    setContestants(
      contestants.filter((contestant) => contestant.userId !== id)
    );
  };

  const validate = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.username ||
      !formData.codeforces
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "failed" as ToastVariant,
      });
      return false;
    }
    return true;
  };

  // Handle Add Contestant button click

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Step 1: Fetch all users
        const allUsersResponse = await fetch("/api/users/allUser");
        if (!allUsersResponse.ok) {
          throw new Error("Failed to fetch all users");
        }
        const allUsers = await allUsersResponse.json();
        setUserDetails(allUsers);

        // Step 2: Fetch user details for all users in parallel
        const userDetailsPromises = allUsers.map((user: User) =>
          fetch(`/api/users/${user._id}`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => data?.userDetails)
            .catch(() => null)
        );

        const userDetailsList = await Promise.all(userDetailsPromises);
        const validUserDetails = userDetailsList.filter(Boolean);
        setContestants(validUserDetails);

        // Step 3: Fetch Codeforces data for all users in parallel
        const codeforcesPromises = validUserDetails.map(
          async (user: UserDetails) => {
            if (!user?.codeforces) return null;

            try {
              const response = await fetch(
                `/api/users/codeforces?handle=${encodeURIComponent(
                  user.codeforces
                )}`,
                {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                }
              );

              const data = await response.json();
              if (!data.success) return null;

              return {
                userId: user.userId,
                cfTotalSolved: data?.data?.totalSolved || 0,
                cfTotalContest: data?.data?.totalContest || 0,
                cfRating: data?.rating[data.rating.length - 1].newRating || 0,
                cfSuccessRate: data?.data?.successRate || 0,
                // cfavatar: data?.data?.avatar || "",
              };
            } catch (error) {
              console.error(
                `Failed to fetch Codeforces data for ${user.codeforces}:`,
                error
              );
              return null;
            }
          }
        );

        const codeforcesData = (await Promise.all(codeforcesPromises)).filter(
          Boolean
        );

        // Update all contestants in a single batch
        setContestants((prevContestants) =>
          prevContestants.map((contestant) => {
            const cfData = codeforcesData.find(
              (data) => data?.userId === contestant.userId
            );
            if (!cfData) return contestant;

            return {
              ...contestant,
              solve: (contestant.solve || 0) + cfData.cfTotalSolved,
              contests: (contestant.contests || 0) + cfData.cfTotalContest,
              rating: (contestant.rating || 0) + cfData.cfRating,
              successRate: (contestant.successRate || 0) + cfData.cfSuccessRate,
              // avatar: cfData.cfavatar,
            };
          })
        );
        let verifiedId = await fetch(`/api/users/upComingContest`);
        let verifiedUserId = await verifiedId.json();
        setUpcomingContests(verifiedUserId.contests);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchAllData();
  }, []);

  const handleAddClick = () => {
    if (!token) {
      navigate("/login", {
        state: { returnUrl: window.location.pathname },
      });
      return false;
    }
    return true;
  };
  // const ifSameUserDetails = _id === userDetails?.id;

  // const saveEditedContestant = () => {
  //   if (editingContestant) {
  //     const updatedContestants = contestants.map((c) =>
  //       c._id === editingContestant._id ? editingContestant : c
  //     );
  //     setContestants(updatedContestants);
  //     setIsEditDialogOpen(false);
  //     setEditingContestant(null);
  //   }
  // };

  // const handleDeleteContestant = async (id: string) => {
  //   const alldataResponse = await fetch("/api/users/delete", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ id }),
  //   });
  //   let data = await alldataResponse.json();
  //   //console.log("data ==> ", data);
  //   setContestants(data);
  //   let verifiedId = await fetch(`/api/users/verfiedUser`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `${token}`,
  //     },
  //   });
  //   let verifiedUserId = await verifiedId.json();
  //   if (verifiedUserId.verifiedTokenUserId === id) {
  //     navigate("/login");
  //     dispatch(logout());
  //   } else {
  //     navigate("/home");
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Contest Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white/20 hover:text-white"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Upcoming Contests
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Upcoming Contests</span>
                  <Badge variant="outline" className="font-normal">
                    {upcomingContests.length} contests
                  </Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
                  {upcomingContests.map((contest) => (
                    <DropdownMenuItem
                      key={contest.id}
                      className="p-0 focus:bg-transparent"
                    >
                      <div className="w-full p-2 hover:bg-accent rounded-md cursor-pointer">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{contest.name}</h3>
                          <Badge>{contest.timeToStartFormatted}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {contest.startTimeFormatted}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="p-0 focus:bg-transparent">
                  <Button variant="ghost" size="sm" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Contest
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Avatar
              className="h-9 w-9 border-2 border-white"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <AvatarImage
                src="/placeholder.svg?height=36&width=36"
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            {isUserMenuOpen && (
              <div className="flex flex-row justify-between items-center  absolute  mt-2 sm:w-28 md:w-48 bg-cyan-100 rounded-md shadow-lg py-1">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-[50%] text-left"
                  onClick={() => {
                    handleLogout();
                    setIsUserMenuOpen(false);
                  }}
                >
                  Log out
                </button>
                <X
                  className="block text-gray-700 size-4 hover:text-red-600 w-[50%]  "
                  onClick={() => {
                    navigate("/");
                    setIsUserMenuOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-3/4">
            <Card className="shadow-lg border-none">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl text-cyan-900">
                      Contestants Dashboard
                    </CardTitle>
                    <CardDescription>
                      Track and manage contest participants
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search contestants..."
                        className="pl-8 w-[200px] md:w-[300px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Dialog
                      open={isAddDialogOpen}
                      onOpenChange={setIsAddDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            handleAddClick();
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Contestant
                        </Button>
                      </DialogTrigger>
                      {token && createAc({ token })}
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="list" className="w-full">
                  <div className="border-b px-6">
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
                  </div>

                  <TabsContent value="list" className="m-0">
                    <ScrollArea className="h-[500px]">
                      <div className="divide-y">
                        {contestants?.map((contestant: UserDetails) => (
                          <div
                            key={contestant.userId}
                            className="flex items-center justify-between p-4 hover:bg-slate-50"
                          >
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage
                                  src={contestant.avatar || "/placeholder.svg"}
                                  alt={contestant.name}
                                />
                                <AvatarFallback>
                                  {contestant.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">
                                  {contestant.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  @{contestant.username}
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
                                  TotalSolve
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
                                    <Button variant="outline" size="icon">
                                      <Info className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  {about({ contestant })}
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
                            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4">
                              <div className="flex justify-between">
                                <Avatar className="h-12 w-12 border">
                                  <AvatarImage
                                    src={
                                      contestant.avatar || "/placeholder.svg"
                                    }
                                    alt={contestant.name}
                                  />
                                  <AvatarFallback>
                                    {contestant.name.charAt(0)}
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
                                @{contestant.username}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-center p-2 bg-slate-50 rounded">
                                  <p className="text-sm text-muted-foreground">
                                    Contests
                                  </p>
                                  <p className="font-medium text-lg">
                                    {contestant.contests}
                                  </p>
                                </div>
                                <div className="text-center p-2 bg-slate-50 rounded">
                                  <p className="text-sm text-muted-foreground">
                                    Wins
                                  </p>
                                  <p className="font-medium text-lg">
                                    {contestant.solve}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between p-4 bg-slate-50">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Info className="mr-2 h-4 w-4" />
                                    Details
                                  </Button>
                                </DialogTrigger>
                                {about({ contestant })}
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
                            Try adjusting your search or add a new contestant.
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
                                  <div className="flex justify-between text-sm">
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
                            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
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
                                  <div className="flex justify-between text-sm">
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
                          <CardTitle className="text-lg">Most Active</CardTitle>
                          <CardDescription>
                            By number of contests
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {[...contestants]
                            .sort((a, b) => b.contests - a.contests)
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
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Contests:
                                    </span>
                                    <span>{contestant.contests}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-1/4">
            <div className="space-y-6">
              <Card className="shadow-lg border-none">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
                  <CardTitle className="text-lg text-cyan-900">
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-cyan-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Contestants
                        </p>
                        <p className="font-medium text-lg">
                          {contestants.length}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Award className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Contests
                        </p>
                        <p className="font-medium text-lg">
                          {contestants.reduce(
                            (sum, contestant) => sum + contestant.contests,
                            0
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-full">
                        <Trophy className="h-5 w-5 text-emerald-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Wins
                        </p>
                        <p className="font-medium text-lg">
                          {contestants.reduce(
                            (sum, contestant) => sum + contestant.solve,
                            0
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <BarChart3 className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Avg. Rating
                        </p>
                        <p className="font-medium text-lg">
                          {contestants.length > 0
                            ? Math.round(
                                contestants.reduce(
                                  (sum, contestant) => sum + contestant.rating,
                                  0
                                ) / contestants.length
                              )
                            : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-none">
                <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-t-lg">
                  <CardTitle className="text-lg text-cyan-900">
                    Upcoming Contests
                  </CardTitle>
                </CardHeader>
                {upcomingContests?.map((contest: UpcomingContest) => (
                  <CardContent key={contest.id} className="p-4">
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{contest.name}</h3>
                          <Badge>{contest.timeToStartFormatted}</Badge>
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
