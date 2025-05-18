import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";

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

export const UpcomingContest = ({
  upcomingContests,
}: {
  upcomingContests: UpcomingContest[];
}) => {
  return (
    <DropdownMenuContent className="w-80" align="end">
      <DropdownMenuLabel className="flex items-center justify-between">
        <span>Upcoming Contests</span>
      </DropdownMenuLabel>
      <DropdownMenuGroup>
        {upcomingContests.length > 0 ? (
          upcomingContests.map((contest) => (
            <DropdownMenuItem key={contest.id} className="p-0">
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
          ))
        ) : (
          <DropdownMenuItem disabled>No upcoming contests</DropdownMenuItem>
        )}
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
};
