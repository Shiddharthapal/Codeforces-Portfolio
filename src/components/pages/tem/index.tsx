"use client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateAc from "../createAc";
import { motion } from "framer-motion";

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
  leetcodeHandle: string;
  atcoderHandle: string;
  ccHandle: string;
  atcoderBeginner: string;
}

interface Contestant {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export default function ContestTrackerHome() {
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [editingContestant, setEditingContestant] = useState<Contestant | null>(
    null
  );

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

  const handleProfile = () => {
    navigate("/user");
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const alldataResponse = await fetch("/api/users/allUser");
      const response = await fetch(`/api/users/${_id}`);

      if (alldataResponse.ok) {
        const dataOfAllUser = await alldataResponse.json();
        //console.log("alldataResponse=>", data);
        setContestants(dataOfAllUser);
      } else {
        console.error("Failed to fetch user details");
      }

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data.userDetails);
      } else {
        console.error("Failed to fetch user details");
      }
    };
    fetchUserDetails();
  }, [token]);

  console.log("userDetails?.userId=>", userDetails?.userId);
  console.log("Id=>", _id);
  const ifSameUserDetails = _id === userDetails?.userId;
  
  const saveEditedContestant = () => {
    if (editingContestant) {
      const updatedContestants = contestants.map((c) =>
        c._id === editingContestant._id ? editingContestant : c
      );
      setContestants(updatedContestants);
      setIsEditDialogOpen(false);
      setEditingContestant(null);
    }
  };

  const handleDeleteContestant = async (id: string) => {
    const alldataResponse = await fetch("/api/users/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    let data = await alldataResponse.json();
    //console.log("data ==> ", data);
    setContestants(data);
    let verifiedId = await fetch(`/api/users/verfiedUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    let verifiedUserId = await verifiedId.json();
    if (verifiedUserId.verifiedTokenUserId === id) {
      navigate("/login");
      dispatch(logout());
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <CodeIcon/>
          <h1 className="text-xl font-bold">Contest Tracker</h1>
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
              <button
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                onClick={() => {
                  handleProfile();
                  setIsUserMenuOpen(false);
                }}
              >
                Profile
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 p-4 bg-gray-50">
        {/* Title */}
        <div className=" flex flex-row bg-green-200 rounded-md p-3 mb-6 justify-center gap-11">
          <div>
            <motion.div
            className="absolute"
            animate={
              isAnimating
                ? {
                    y: [10, -10, 10],
                    x: [0, 5, 0],
                    rotate: [0, 10, 0],
                  }
                : { y: 0, x: 0, rotate: 0 }
            }
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            onClick={() => setIsAnimating(!isAnimating)}
            >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              C
            </div>
            </motion.div>
          </div>
          <h2 className="text-lg font-semibold">
            Individual Contest Tracker
          </h2>
        </div>

        {/* Action buttons */}
        <div className="mb-4 flex justify-end gap-4">
          {!ifSameUserDetails && (
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
          )}
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
              key={contestant._id}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow"
            >
              <div className="font-medium">{contestant.name}</div>
              <div className="flex gap-3">
                <Link to={`/about/${contestant._id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#1b78a9] text-white hover:bg-white hover:text-black"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    About
                  </Button>
                </Link>
                <Trash2
                  className="text-red-500"
                  onClick={() => {
                    handleDeleteContestant(contestant._id);
                  }}
                />
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
