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
import { navigate } from "astro/virtual-modules/transitions-router.js";

export default function editAc() {
  const [open, setOpen] = useState(true);
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

  const auth = useAppSelector((state) => state.auth);
  const token = auth?.token;

  const handleAddContestant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check authentication
      if (!token) {
        alert("Please login to add contestants");
        return;
      }

      // Validation
      if (!newContestant.name || !newContestant.department) {
        alert("Name and department are required");
        return;
      }
      const contestantData = {
        name: newContestant.name.trim(),
        department: newContestant.department.trim(),
        semester: newContestant.semester.trim() || undefined,
        vjudge: newContestant.vjudgeLink.trim() || undefined,
        codeforces: newContestant.cfLink.trim() || undefined,
        clist: newContestant.clistLink.trim() || undefined,
        atcoder: newContestant.atcoderLink.trim() || undefined,
        codechef: newContestant.ccLink.trim() || undefined,
      };

      const response = await fetch("/api/contestants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(contestantData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error cases
        switch (response.status) {
          case 400:
            throw new Error(data.message || "Invalid input data");
          case 401:
            throw new Error("Authentication failed. Please login again.");
          case 500:
            throw new Error("Server error. Please try again later.");
          default:
            throw new Error(data.message || "Failed to add contestant");
        }
      }

      alert("Contestant added successfully!");
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding contestant:", error);
      alert(
        error instanceof Error ? error.message : "Failed to add contestant"
      );
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Contestant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddContestant} className="space-y-4">
          {renderField("name", "Name", true)}
          {renderField("department", "Department", true)}
          {renderField("semester", "Semester")}
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
              onClick={() => {
                setOpen(false);
                navigate("/");
              }}
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
