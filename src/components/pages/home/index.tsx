"use client";

import type React from "react";
import { useState } from "react";
import { Menu, Github, Plus, Trash2, Edit, Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

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

export default function ContestTrackerHome() {
  const [contestants, setContestants] = useState<Contestant[]>([
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
    {
      id: "221-35-993",
      name: "Piyash Basak",
      vjudgeHandle: "https://vjudge.net/user/Piyash",
      cfHandle: "https://codeforces.com/profile/piyash",
      clistHandle: "https://clist.by/coder/piyash_b",
      score: 0,
      totalSolve: 90,
      totalParticipation: 0,
      solveCount: 1379,
      averageSolve: 0,
      cfRound913: "A",
      atcoderBeginner: "A",
      cf3: "3",
    },
    {
      id: "0242310005341058",
      name: "Md. Eusha Hasan",
      vjudgeHandle: "https://vjudge.net/user/esh29",
      cfHandle: "https://codeforces.com/profile/eusha",
      clistHandle: "https://clist.by/coder/esh29/",
      score: 0,
      totalSolve: 80,
      totalParticipation: 0,
      solveCount: 1101,
      averageSolve: 0,
      cfRound913: "A",
      atcoderBeginner: "A",
      cf3: "A",
    },
  ]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContestant, setEditingContestant] = useState<Contestant | null>(
    null
  );
  const [newContestant, setNewContestant] = useState<Partial<Contestant>>({
    id: "",
    name: "",
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAddContestant = () => {
    const contestant: Contestant = {
      id: newContestant.id || `ID-${Math.floor(Math.random() * 10000)}`,
      name: newContestant.name || "New Contestant",
      vjudgeHandle: "",
      cfHandle: "",
      clistHandle: "",
      score: 0,
      totalSolve: 0,
      totalParticipation: 0,
      solveCount: 0,
      averageSolve: 0,
      cfRound913: "N/A",
      atcoderBeginner: "N/A",
      cf3: "N/A",
    };

    setContestants([...contestants, contestant]);
    setNewContestant({});
    setIsAddDialogOpen(false);
  };

  const handleEditContestant = (contestant: Contestant) => {
    setEditingContestant(contestant);
    setIsEditDialogOpen(true);
  };

  const saveEditedContestant = () => {
    if (editingContestant) {
      const updatedContestants = contestants.map((c) =>
        c.id === editingContestant.id ? editingContestant : c
      );
      setContestants(updatedContestants);
      setIsEditDialogOpen(false);
      setEditingContestant(null);
    }
  };

  const handleDeleteContestant = (id: string) => {
    const updatedContestants = contestants.filter((c) => c.id !== id);
    setContestants(updatedContestants);
  };

  const viewContestantDetails = (id: string) => {
    window.location.href = `/about/${id}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="text-white mr-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold">SWE C.Tracker</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-white">
          <Github className="h-6 w-6" />
        </Button>
      </header>

      {/* Main content */}
      <div className="flex-1 p-4 bg-gray-50">
        {/* Title */}
        <div className="bg-green-200 rounded-md p-3 mb-6 text-center">
          <h2 className="text-lg font-semibold">
            <span className="mr-2">⚽</span>
            Individual Contest Tracker, SWE-DIU
          </h2>
        </div>

        {/* Action buttons */}
        <div className="mb-4 flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Contestant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contestant</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newContestant.name || ""}
                    onChange={(e) =>
                      setNewContestant({
                        ...newContestant,
                        name: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleAddContestant}>Add Contestant</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* User List */}
        <div className="grid gap-4">
          {contestants.map((contestant) => (
            <div
              key={contestant.id}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow"
            >
              <div className="font-medium">{contestant.name}</div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewContestantDetails(contestant.id)}
                >
                  <Info className="h-4 w-4 mr-1" />
                  About
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditContestant(contestant)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500"
                  onClick={() => handleDeleteContestant(contestant.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Contestant</DialogTitle>
            </DialogHeader>
            {editingContestant && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingContestant.name}
                    onChange={(e) =>
                      setEditingContestant({
                        ...editingContestant,
                        name: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={saveEditedContestant}>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
