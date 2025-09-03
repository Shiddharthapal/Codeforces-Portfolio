import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
interface UserDetails {
  userId: string;
  name: string;
  email: string;
  username: string;
  password: string;
  codeforces: string;
  contests?: number;
  successRate?: number;
  solve?: number;
  rating?: number;
  avatar?: string;
}
export function about({ contestant }: { contestant: UserDetails }) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{contestant.name}</DialogTitle>
        <DialogDescription>
          Contestant details and performance
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Username:</span>
          <span>
            @{contestant.username || contestant.name.toLocaleLowerCase()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Contests Participated:</span>
          <span>{contestant.contests}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Solved:</span>
          <span>{contestant.solve}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Sucess Rate:</span>
          <span>{contestant.successRate}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Current Rating:</span>
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
    </DialogContent>
  );
}
