import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function createAc({ token }: { token: string }) {
  const addContestant = async (formdata: {
    name: string;
    email: string;
    username: string;
    codeforces: string;
  }) => {
    // console.log("formdata", formdata);
    const response = await fetch("/api/contestants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify(formdata),
    });
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Contestant</DialogTitle>
        <DialogDescription>
          Enter the details of the new contestant.
        </DialogDescription>
      </DialogHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          const formData = {
            name: form.get("name") as string,
            email: form.get("email") as string,
            username: form.get("username") as string,
            codeforces: form.get("codeforces") as string,
          };
          addContestant(formData);
          e.currentTarget.reset();
          // Close dialog
          const closeButton = document.querySelector(
            '[data-state="open"] button[aria-label="Close"]'
          );
          if (closeButton instanceof HTMLElement) closeButton.click();
        }}
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" name="email" className="col-span-3" required />
          </div>
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
            <Input
              id="username"
              name="username"
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="codeforces" className="text-right">
              Codeforces Link
            </Label>
            <Input
              id="codeforces"
              name="codeforces"
              className="col-span-3"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Add Contestant</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
