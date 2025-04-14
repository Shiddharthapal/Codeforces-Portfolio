"use client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateAc from "../createAc";

import { userData } from "@/const/fakeData";
import { Menu, Plus, Trash2, Edit, Save, Info, User } from "lucide-react";
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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface UserDetails {
  userId: string;
  name: string;
  email: string;
  password: string;
  vjudgeHandle: string;
  cfHandle: string;
  clistHandle: string;
  atcoderHandle: string;
  ccHandle: string;
  atcoderBeginner: string;
}

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
  const [contestants, setContestants] = useState<Contestant[]>(userData);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [editingContestant, setEditingContestant] = useState<Contestant | null>(
    null
  );
  const [newContestant, setNewContestant] = useState<Partial<Contestant>>({
    id: "",
    name: "",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { _id, token } = useAppSelector((state) => state.auth);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    setUserDetails(null);
    setIsUserMenuOpen(false);
    dispatch(logout());
    navigate("/");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await fetch(`/api/users/${_id}`);
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
      } else {
        console.error("Failed to fetch user details");
      }
    };
    fetchUserDetails();
  }, [token]);
  console.log("userdetails=>", userDetails);
  console.log("user=>", _id);
  const ifSameUserDetails = _id === userDetails?.userId;

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
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="text-white border-2 rounded-full"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <User className="h-6 w-6" />
          </Button>
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  handleLogout();
                  setIsUserMenuOpen(false);
                }}
              >
                Log out
              </button>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => setIsUserMenuOpen(false)}
              >
                Profile
              </Link>
            </div>
          )}
        </div>
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
        <div className="mb-4 flex justify-end gap-4">
          <Link to={`/createAc`}>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Create Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <CreateAc />
              </DialogContent>
            </Dialog>
          </Link>
          {ifSameUserDetails && (
            <Link to={`/editAc`}>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-1">
                    <Edit className="h-4 w-4" /> Edit Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CreateAc />
                </DialogContent>
              </Dialog>
            </Link>
          )}
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
                <Link to={`/about/${contestant.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#1b78a9] text-white hover:bg-white hover:text-black"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    About
                  </Button>
                </Link>
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
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
