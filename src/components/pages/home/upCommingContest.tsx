import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
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
export default function UpComingContest(): JSX.Element {
  const [upcomingContests, setUpcomingContests] = useState<UpcomingContest[]>(
    []
  );

  useEffect(() => {
    const fetchUpcomingContests = async () => {
      let verifiedId = await fetch(`/api/users/upComingContest`);
      let verifiedUserId = await verifiedId.json();
      console.log("🧞‍♂️verifiedUserId --->", verifiedUserId.contests);
      setUpcomingContests(verifiedUserId.contests);
    };
    fetchUpcomingContests();
  }, []);

  return (
    <div>
      {upcomingContests?.map((contest: UpcomingContest) => (
        <CardContent key={contest.id} className="p-4">
          <div className="space-y-3">
            <div className="border rounded-lg p-3 hover:bg-slate-50 cursor-pointer">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{contest.name}</h3>
                <Badge>{contest.timeToStartFormatted}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {contest.startTimeFormatted} • {contest.durationFormatted}
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
    </div>
  );
}
