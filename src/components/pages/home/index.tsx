"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertCircle,
  Award,
  BarChart3,
  Calendar,
  ChevronRight,
  Info,
  Plus,
  Search,
  Trash2,
  Trophy,
  User,
} from "lucide-react"

type Contestant = {
  id: string
  name: string
  username: string
  contests: number
  wins: number
  rating: number
  avatar?: string
}

export default function ContestTracker() {
  const [contestants, setContestants] = useState<Contestant[]>([
    {
      id: "1",
      name: "Shiddhartha Pal",
      username: "shiddhartha_pal",
      contests: 24,
      wins: 8,
      rating: 1842,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      name: "Shiddhartha29",
      username: "shiddhartha29",
      contests: 18,
      wins: 5,
      rating: 1756,
    },
    {
      id: "3",
      name: "Alex Johnson",
      username: "alexcode",
      contests: 32,
      wins: 12,
      rating: 1920,
    },
    {
      id: "4",
      name: "Maya Patel",
      username: "maya_codes",
      contests: 15,
      wins: 3,
      rating: 1680,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  const filteredContestants = contestants.filter(
    (contestant) =>
      contestant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contestant.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const deleteContestant = (id: string) => {
    setContestants(contestants.filter((contestant) => contestant.id !== id))
  }

  const addContestant = (contestant: Omit<Contestant, "id">) => {
    setContestants([...contestants, { ...contestant, id: Math.random().toString(36).substring(7) }])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Contest Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="text-white border-white hover:bg-white/20">
              <Calendar className="mr-2 h-4 w-4" />
              Upcoming Contests
            </Button>
            <Avatar className="h-9 w-9 border-2 border-white">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
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
                    <CardTitle className="text-2xl text-cyan-900">Contestants Dashboard</CardTitle>
                    <CardDescription>Track and manage contest participants</CardDescription>
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Contestant
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Contestant</DialogTitle>
                          <DialogDescription>
                            Enter the details of the new contestant to add them to your tracker.
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            addContestant({
                              name: formData.get("name") as string,
                              username: formData.get("username") as string,
                              contests: Number.parseInt(formData.get("contests") as string) || 0,
                              wins: Number.parseInt(formData.get("wins") as string) || 0,
                              rating: Number.parseInt(formData.get("rating") as string) || 1500,
                            })
                            e.currentTarget.reset()
                            // Close dialog
                            const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]')
                            if (closeButton instanceof HTMLElement) closeButton.click()
                          }}
                        >
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="name" className="text-right">
                                Name
                              </Label>
                              <Input id="name" name="name" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="username" className="text-right">
                                Username
                              </Label>
                              <Input id="username" name="username" className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="contests" className="text-right">
                                Contests
                              </Label>
                              <Input id="contests" name="contests" type="number" min="0" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="wins" className="text-right">
                                Wins
                              </Label>
                              <Input id="wins" name="wins" type="number" min="0" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="rating" className="text-right">
                                Rating
                              </Label>
                              <Input id="rating" name="rating" type="number" min="0" className="col-span-3" />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Add Contestant</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
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
                        {filteredContestants.length > 0 ? (
                          filteredContestants.map((contestant) => (
                            <div
                              key={contestant.id}
                              className="flex items-center justify-between p-4 hover:bg-slate-50"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarImage src={contestant.avatar || "/placeholder.svg"} alt={contestant.name} />
                                  <AvatarFallback>{contestant.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">{contestant.name}</h3>
                                  <p className="text-sm text-muted-foreground">@{contestant.username}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-6">
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">Contests</p>
                                  <p className="font-medium">{contestant.contests}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">Wins</p>
                                  <p className="font-medium">{contestant.wins}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">Rating</p>
                                  <p className="font-medium">{contestant.rating}</p>
                                </div>
                                <div className="">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="icon">
                                        <Info className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>{contestant.name}</DialogTitle>
                                        <DialogDescription>Contestant details and performance</DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Username:</span>
                                          <span>@{contestant.username}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Contests Participated:</span>
                                          <span>{contestant.contests}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Wins:</span>
                                          <span>{contestant.wins}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Win Rate:</span>
                                          <span>
                                            {contestant.contests > 0
                                              ? `${((contestant.wins / contestant.contests) * 100).toFixed(1)}%`
                                              : "0%"}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="font-medium">Current Rating:</span>
                                          <Badge
                                            variant={
                                              contestant.rating > 1800
                                                ? "default"
                                                : contestant.rating > 1600
                                                  ? "secondary"
                                                  : "outline"
                                            }
                                          >
                                            {contestant.rating}
                                          </Badge>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
          
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 text-center">
                            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                            <h3 className="font-medium text-lg">No contestants found</h3>
                            <p className="text-muted-foreground">Try adjusting your search or add a new contestant.</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="grid" className="m-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
                      {filteredContestants.length > 0 ? (
                        filteredContestants.map((contestant) => (
                          <Card key={contestant.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4">
                              <div className="flex justify-between">
                                <Avatar className="h-12 w-12 border">
                                  <AvatarImage src={contestant.avatar || "/placeholder.svg"} alt={contestant.name} />
                                  <AvatarFallback>{contestant.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Badge
                                  variant={
                                    contestant.rating > 1800
                                      ? "default"
                                      : contestant.rating > 1600
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {contestant.rating} pts
                                </Badge>
                              </div>
                              <CardTitle className="mt-2">{contestant.name}</CardTitle>
                              <CardDescription>@{contestant.username}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-center p-2 bg-slate-50 rounded">
                                  <p className="text-sm text-muted-foreground">Contests</p>
                                  <p className="font-medium text-lg">{contestant.contests}</p>
                                </div>
                                <div className="text-center p-2 bg-slate-50 rounded">
                                  <p className="text-sm text-muted-foreground">Wins</p>
                                  <p className="font-medium text-lg">{contestant.wins}</p>
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
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>{contestant.name}</DialogTitle>
                                    <DialogDescription>Contestant details and performance</DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">Username:</span>
                                      <span>@{contestant.username}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">Contests Participated:</span>
                                      <span>{contestant.contests}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">Wins:</span>
                                      <span>{contestant.wins}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">Win Rate:</span>
                                      <span>
                                        {contestant.contests > 0
                                          ? `${((contestant.wins / contestant.contests) * 100).toFixed(1)}%`
                                          : "0%"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium">Current Rating:</span>
                                      <Badge
                                        variant={
                                          contestant.rating > 1800
                                            ? "default"
                                            : contestant.rating > 1600
                                              ? "secondary"
                                              : "outline"
                                        }
                                      >
                                        {contestant.rating}
                                      </Badge>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button variant="destructive" size="sm" onClick={() => deleteContestant(contestant.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                          <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                          <h3 className="font-medium text-lg">No contestants found</h3>
                          <p className="text-muted-foreground">Try adjusting your search or add a new contestant.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="m-0 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Top Performers</CardTitle>
                          <CardDescription>Based on win rate</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {[...contestants]
                            .sort((a, b) => (b.wins / b.contests || 0) - (a.wins / a.contests || 0))
                            .slice(0, 3)
                            .map((contestant, index) => (
                              <div key={contestant.id} className="flex items-center gap-2 mb-2">
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
                                  <p className="font-medium">{contestant.name}</p>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Win rate:</span>
                                    <span>
                                      {contestant.contests > 0
                                        ? `${((contestant.wins / contestant.contests) * 100).toFixed(1)}%`
                                        : "0%"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Highest Rated</CardTitle>
                          <CardDescription>Top contestants by rating</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {[...contestants]
                            .sort((a, b) => b.rating - a.rating)
                            .slice(0, 3)
                            .map((contestant, index) => (
                              <div key={contestant.id} className="flex items-center gap-2 mb-2">
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
                                  <p className="font-medium">{contestant.name}</p>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Rating:</span>
                                    <Badge
                                      variant={
                                        contestant.rating > 1800
                                          ? "default"
                                          : contestant.rating > 1600
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
                          <CardDescription>By number of contests</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {[...contestants]
                            .sort((a, b) => b.contests - a.contests)
                            .slice(0, 3)
                            .map((contestant, index) => (
                              <div key={contestant.id} className="flex items-center gap-2 mb-2">
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
                                  <p className="font-medium">{contestant.name}</p>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Contests:</span>
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
                  <CardTitle className="text-lg text-cyan-900">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-cyan-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Contestants</p>
                        <p className="font-medium text-lg">{contestants.length}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Award className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Contests</p>
                        <p className="font-medium text-lg">
                          {contestants.reduce((sum, contestant) => sum + contestant.contests, 0)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-100 p-2 rounded-full">
                        <Trophy className="h-5 w-5 text-emerald-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Wins</p>
                        <p className="font-medium text-lg">
                          {contestants.reduce((sum, contestant) => sum + contestant.wins, 0)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <BarChart3 className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg. Rating</p>
                        <p className="font-medium text-lg">
                          {contestants.length > 0
                            ? Math.round(
                                contestants.reduce((sum, contestant) => sum + contestant.rating, 0) /
                                  contestants.length,
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
                  <CardTitle className="text-lg text-cyan-900">Upcoming Contests</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">Spring Coding Challenge</h3>
                        <Badge>2 days</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">May 15, 2025 • 10:00 AM</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm">12 participants</p>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">Algorithm Marathon</h3>
                        <Badge variant="outline">1 week</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">May 20, 2025 • 2:00 PM</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm">8 participants</p>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">Summer Code Jam</h3>
                        <Badge variant="outline">2 weeks</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">May 27, 2025 • 9:00 AM</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm">15 participants</p>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 rounded-b-lg">
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Contest
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
