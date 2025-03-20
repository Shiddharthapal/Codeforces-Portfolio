"use client";

import type React from "react";

import { useState } from "react";
import { Menu, Github, Plus, Trash2, Edit, Save } from "lucide-react";
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
    vjudgeHandle: "",
    cfHandle: "",
    clistHandle: "",
    totalSolve: 0,
    solveCount: 0,
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAddContestant = () => {
    const contestant: Contestant = {
      id: newContestant.id || `ID-${Math.floor(Math.random() * 10000)}`,
      name: newContestant.name || "New Contestant",
      vjudgeHandle: newContestant.vjudgeHandle || "",
      cfHandle: newContestant.cfHandle || "",
      clistHandle: newContestant.clistHandle || "",
      score: 0,
      totalSolve: newContestant.totalSolve || 0,
      totalParticipation: 0,
      solveCount: newContestant.solveCount || 0,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Contestant
  ) => {
    if (editingContestant) {
      setEditingContestant({
        ...editingContestant,
        [field]: e.target.value,
      });
    }
  };

  const handleNewContestantChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Contestant
  ) => {
    setNewContestant({
      ...newContestant,
      [field]:
        field === "totalSolve" || field === "solveCount"
          ? Number.parseInt(e.target.value) || 0
          : e.target.value,
    });
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
                  <Label htmlFor="id" className="text-right">
                    ID
                  </Label>
                  <Input
                    id="id"
                    value={newContestant.id || ""}
                    onChange={(e) => handleNewContestantChange(e, "id")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newContestant.name || ""}
                    onChange={(e) => handleNewContestantChange(e, "name")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vjudgeHandle" className="text-right">
                    VJudge Handle
                  </Label>
                  <Input
                    id="vjudgeHandle"
                    value={newContestant.vjudgeHandle || ""}
                    onChange={(e) =>
                      handleNewContestantChange(e, "vjudgeHandle")
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cfHandle" className="text-right">
                    CF Handle
                  </Label>
                  <Input
                    id="cfHandle"
                    value={newContestant.cfHandle || ""}
                    onChange={(e) => handleNewContestantChange(e, "cfHandle")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="clistHandle" className="text-right">
                    Clist Handle
                  </Label>
                  <Input
                    id="clistHandle"
                    value={newContestant.clistHandle || ""}
                    onChange={(e) =>
                      handleNewContestantChange(e, "clistHandle")
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="totalSolve" className="text-right">
                    Total Solve
                  </Label>
                  <Input
                    id="totalSolve"
                    type="number"
                    value={newContestant.totalSolve || 0}
                    onChange={(e) => handleNewContestantChange(e, "totalSolve")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="solveCount" className="text-right">
                    Solve Count
                  </Label>
                  <Input
                    id="solveCount"
                    type="number"
                    value={newContestant.solveCount || 0}
                    onChange={(e) => handleNewContestantChange(e, "solveCount")}
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Contestant</DialogTitle>
            </DialogHeader>
            {editingContestant && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-id" className="text-right">
                    ID
                  </Label>
                  <Input
                    id="edit-id"
                    value={editingContestant.id}
                    onChange={(e) => handleInputChange(e, "id")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingContestant.name}
                    onChange={(e) => handleInputChange(e, "name")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-vjudgeHandle" className="text-right">
                    VJudge Handle
                  </Label>
                  <Input
                    id="edit-vjudgeHandle"
                    value={editingContestant.vjudgeHandle}
                    onChange={(e) => handleInputChange(e, "vjudgeHandle")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-cfHandle" className="text-right">
                    CF Handle
                  </Label>
                  <Input
                    id="edit-cfHandle"
                    value={editingContestant.cfHandle}
                    onChange={(e) => handleInputChange(e, "cfHandle")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-totalSolve" className="text-right">
                    Total Solve
                  </Label>
                  <Input
                    id="edit-totalSolve"
                    type="number"
                    value={editingContestant.totalSolve}
                    onChange={(e) => handleInputChange(e, "totalSolve")}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-solveCount" className="text-right">
                    Solve Count
                  </Label>
                  <Input
                    id="edit-solveCount"
                    type="number"
                    value={editingContestant.solveCount}
                    onChange={(e) => handleInputChange(e, "solveCount")}
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-green-200 p-2 border text-left">#</th>
                <th className="bg-green-200 p-2 border text-left">ID</th>
                <th className="bg-green-200 p-2 border text-left">Name</th>
                <th className="bg-green-200 p-2 border text-left">
                  VJudge Handle
                </th>
                <th className="bg-green-200 p-2 border text-left">CF Handle</th>
                <th className="bg-green-200 p-2 border text-left">
                  Clist Handle
                </th>
                <th className="bg-green-200 p-2 border text-left">Score</th>
                <th className="bg-green-200 p-2 border text-left">
                  Total Solve
                </th>
                <th className="bg-green-200 p-2 border text-left">
                  Total Participation
                </th>
                <th className="bg-green-200 p-2 border text-left">
                  Solve Count
                </th>
                <th className="bg-green-200 p-2 border text-left">
                  Average solve
                </th>
                <th className="bg-green-200 p-2 border text-left">
                  CF Round 913
                </th>
                <th className="bg-green-200 p-2 border text-left">
                  Atcoder Beginner
                </th>
                <th className="bg-green-200 p-2 border text-left">CF 3</th>
                <th className="bg-green-200 p-2 border text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contestants.map((contestant, index) => (
                <tr key={contestant.id}>
                  <td className="bg-green-100 p-2 border">{index + 1}</td>
                  <td className="bg-red-100 p-2 border">{contestant.id}</td>
                  <td className="bg-yellow-100 p-2 border">
                    {contestant.name}
                  </td>
                  <td className="bg-red-100 p-2 border">
                    <a
                      href={contestant.vjudgeHandle}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {contestant.vjudgeHandle}
                    </a>
                  </td>
                  <td className="bg-red-100 p-2 border">
                    <a
                      href={contestant.cfHandle}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {contestant.cfHandle}
                    </a>
                  </td>
                  <td className="bg-red-100 p-2 border">
                    <a
                      href={contestant.clistHandle}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {contestant.clistHandle}
                    </a>
                  </td>
                  <td className="bg-red-100 p-2 border">{contestant.score}</td>
                  <td className="bg-red-100 p-2 border">
                    {contestant.totalSolve}
                  </td>
                  <td className="bg-red-100 p-2 border">
                    {contestant.totalParticipation}
                  </td>
                  <td className="bg-red-100 p-2 border">
                    {contestant.solveCount}
                  </td>
                  <td className="bg-red-100 p-2 border">
                    {contestant.averageSolve}
                  </td>
                  <td className="bg-red-100 p-2 border">
                    {contestant.cfRound913}
                  </td>
                  <td className="bg-red-100 p-2 border">
                    {contestant.atcoderBeginner}
                  </td>
                  <td className="bg-red-100 p-2 border">{contestant.cf3}</td>
                  <td className="bg-green-100 p-2 border">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditContestant(contestant)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDeleteContestant(contestant.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
