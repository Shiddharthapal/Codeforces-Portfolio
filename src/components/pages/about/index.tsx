import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Contestant {
  id: string;
  name: string;
  vjudgeHandle: string;
  cfHandle: string;
  clistHandle: string;
  score: number;
  totalSolve: number;
  totalParticipation: number;
  solveCount: number;
  averageSolve: number;
  cfRound913: string;
  atcoderBeginner: string;
  cf3: string;
}

export default function ContestantDetails() {
  const [contestant, setContestant] = useState<Contestant | null>(null);

  // Get contestant ID from URL
  const id = window.location.pathname.split("/about/")[1];

  // In a real app, fetch contestant data from API
  // For now, using mock data
  const mockContestants: Contestant[] = [
    {
      id: "221-35-1065",
      name: "Md. Iffatul Islam Anon",
      vjudgeHandle: "http://vjudge.net/user/iffatul_",
      cfHandle: "http://codeforces.com/profile/iffatul",
      clistHandle: "http://clist.by/coder/iffatul_ar",
      score: 0,
      totalSolve: 90,
      totalParticipation: 0,
      solveCount: 1451,
      averageSolve: 0,
      cfRound913: "A",
      atcoderBeginner: "A",
      cf3: "3",
    },
    // ... other contestants
  ];

  useEffect(() => {
    const found = mockContestants.find((c) => c.id === id);
    if (found) {
      setContestant(found);
    }
  }, [id]);

  const goBack = () => {
    window.location.href = "/";
  };

  if (!contestant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="text-white mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <h1 className="text-2xl font-bold mt-2">{contestant.name}</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Contestant Details</h2>

          {/* Profile Links */}
          <div className="grid gap-4 mb-8">
            <h3 className="text-lg font-medium">Profile Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href={contestant.vjudgeHandle}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                VJudge Profile
              </a>
              <a
                href={contestant.cfHandle}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Codeforces Profile
              </a>
              <a
                href={contestant.clistHandle}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Clist Profile
              </a>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid gap-6">
            <h3 className="text-lg font-medium">Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Total Solve</div>
                <div className="text-2xl font-semibold">
                  {contestant.totalSolve}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Score</div>
                <div className="text-2xl font-semibold">{contestant.score}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Total Participation</div>
                <div className="text-2xl font-semibold">
                  {contestant.totalParticipation}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Solve Count</div>
                <div className="text-2xl font-semibold">
                  {contestant.solveCount}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Average Solve</div>
                <div className="text-2xl font-semibold">
                  {contestant.averageSolve}
                </div>
              </div>
            </div>
          </div>

          {/* Contest Performance */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Contest Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">CF Round 913</div>
                <div className="text-xl font-semibold">
                  {contestant.cfRound913}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Atcoder Beginner</div>
                <div className="text-xl font-semibold">
                  {contestant.atcoderBeginner}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">CF 3</div>
                <div className="text-xl font-semibold">{contestant.cf3}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
