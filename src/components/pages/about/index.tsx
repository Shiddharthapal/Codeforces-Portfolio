import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
interface contestantDetails {
  userId: string;
  name: string;
  department: string;
  semester: string;
  vjudge: string;
  codeforces: string;
  leetcode: string;
  atcoder: string;
  codechef: string;
  score: number;
  totalSolved: number;
  totalParticipation: number;
  solveCount: number;
  averageSolve: number;
  atcoderBeginner: string;
}
export interface contestant {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
}

export interface contestantData {
  lastMonthSolveCount: number;
  averageSolve: number;
  cfTotalSolved: number;
  cfScore: number;
}
export default function ContestantDetails() {
  const [contestant, setContestant] = useState<contestant | null>(null);
  const [userDetails, setUserDetails] = useState<contestantDetails | null>(
    null
  );
  const [contestantData, setContestantData] = useState<contestantData | null>(
    null
  );
  const navigate = useNavigate();

  // Get contestant ID from URL
  const id = window.location.pathname.split("/about/")[1];

  useEffect(() => {
    const fetchContestantDetails = async () => {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch contestant details");
        }
        const data = await response.json();
        const handle = data.userDetails?.codeforces;
        // console.log("handle ==> ", handle);
        if (!handle) {
          console.error("Codeforces handle is missing");
          return;
        }

        const Userresponse = await fetch(
          `/api/users/codeforces?handle=${encodeURIComponent(handle)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = await Userresponse.json();
        console.log("responseData ==> ", responseData);
        if (!responseData.success) {
          console.error("Codeforces API error:", responseData.error);
        }
        console.log("cf solve=>", responseData.data.totalSolved);

        setUserDetails(data.userDetails);
        setContestant(data.user);
        setContestantData({
          lastMonthSolveCount: 0,
          averageSolve: 0,
          cfTotalSolved: responseData?.data?.totalSolved,
          cfScore: 0,
        });
        setUserDetails({
          ...data.userDetails,
          totalSolved:
            (data.userDetails?.totalSolved || 0) +
            (contestantData?.cfTotalSolved || 0),
          totalParticipation: 0,
          solveCount: 0,
          averageSolve: 0,
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchContestantDetails();
  }, [id]);

  const goBack = () => {
    window.location.href = "/";
  };

  if (!contestant) {
    return (
      <div className="flex items-center justify-between">
        <div>Invalid!. Create an account</div>
        <Button
          className="absolute top-4 right-4"
          onClick={() => {
            navigate("/");
          }}
        >
          Back
        </Button>
      </div>
    );
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold mb-6">Contestant Details</h2>
            <Button
              onClick={() => {
                navigate("/");
              }}
            >
              Back
            </Button>
          </div>
          {/* Profile Links */}
          <div className="grid gap-4 mb-8">
            <h3 className="text-lg font-medium">Profile Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href={userDetails?.vjudge}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                VJudge Profile
              </a>
              <a
                href={userDetails?.codeforces}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Codeforces Profile
              </a>
              <a
                href={userDetails?.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                leetcode Profile
              </a>
              <a
                href={userDetails?.atcoder}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                AtCoder Profile
              </a>
              <a
                href={userDetails?.codechef}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                CodeChef Profile
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
                  {userDetails?.totalSolved}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Score</div>
                <div className="text-2xl font-semibold">997</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Total Participation</div>
                <div className="text-2xl font-semibold">510</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">
                  Last Month Solve Count
                </div>
                <div className="text-2xl font-semibold">90</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Average Solve</div>
                <div className="text-2xl font-semibold">2</div>
              </div>
            </div>
          </div>

          {/* Contest Performance */}
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Contest Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">CF Level</div>
                <div className="text-xl font-semibold">A</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">Atcoder Level</div>
                <div className="text-xl font-semibold">B</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-sm text-gray-500">CodeChef Level</div>
                <div className="text-xl font-semibold">A</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
