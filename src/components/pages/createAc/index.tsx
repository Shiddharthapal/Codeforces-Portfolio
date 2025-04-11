import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react"; // for close icon

// Close button component
const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </button>
);

export default function CreateAc() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newContestant, setNewContestant] = useState({
    name: "",
    department: "",
    semester: "",
    vjudgeLink: "",
    cfLink: "",
    clistLink: "",
    atcoderLink: "",
    ccLink: "",
  });

  const user = useAppSelector((state) => state.auth.user);
  const token = user?.token;

  const handleAddContestant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (
      !newContestant.name ||
      !newContestant.department ||
      !newContestant.semester
    ) {
      alert("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    console.log("token=>", token);
    const contestantData = {
      userId: token,
      name: newContestant.name,
      department: newContestant.department,
      semester: newContestant.semester,
      vjudge: newContestant.vjudgeLink,
      codeforces: newContestant.cfLink,
      clist: newContestant.clistLink,
      atcoder: newContestant.atcoderLink,
      codechef: newContestant.ccLink,
    };

    console.log("contestantData=>", contestantData);
    try {
      const response = await fetch("/api/contestants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(contestantData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      alert("Contestant added successfully!");
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding contestant:", error);
      alert("Failed to add contestant. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewContestant({
      name: "",
      department: "",
      semester: "",
      vjudgeLink: "",
      cfLink: "",
      clistLink: "",
      atcoderLink: "",
      ccLink: "",
    });
  };

  const renderField = (
    id: keyof typeof newContestant,
    label: string,
    required = false,
    type = "text"
  ) => (
    <div className="grid grid-cols-4 items-center gap-4 mb-4">
      <Label htmlFor={id} className="text-right">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={newContestant[id]}
        onChange={(e) =>
          setNewContestant({
            ...newContestant,
            [id]: e.target.value,
          })
        }
        className="col-span-3 h-8"
        required={required}
        disabled={isLoading}
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} className="mb-4">
        Add New Contestant
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <CloseButton onClick={() => setOpen(false)} />
        <DialogHeader>
          <DialogTitle>Add New Contestant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddContestant} className="space-y-4">
          {renderField("name", "Name", true)}
          {renderField("department", "Department", true)}
          {renderField("semester", "Semester", true)}
          {renderField("vjudgeLink", "Vjudge Link")}
          {renderField("cfLink", "Codeforces Link")}
          {renderField("clistLink", "Clist Link")}
          {renderField("atcoderLink", "AtCoder Link")}
          {renderField("ccLink", "CodeChef Link")}

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="mr-2"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Contestant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
