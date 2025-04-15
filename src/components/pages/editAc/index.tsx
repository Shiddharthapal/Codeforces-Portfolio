"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAppSelector } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";

interface UserDetails {
  userId: string;
  name: string;
  department: string;
  semester?: string;
  vjudge?: string;
  codeforces?: string;
  clist?: string;
  atcoder?: string;
  codechef?: string;
  createdAt: string;
}

export default function editAc() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [formData, setFormData] = useState<Partial<UserDetails>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const user = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userdetails = await fetch(`/api/users/${user._id}`);
      if (!userdetails.ok) {
        console.error("Failed to fetch user details");
        return;
      }
      const data = await userdetails.json();
      setUserDetails(data.userDetails);
    };
    fetchData();
  }, [user._id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.name && !userDetails?.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.department && !userDetails?.department) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      // Merge the original data with the updated fields
      const updatedData = {
        ...userDetails,
        ...formData,
        createdAt: userDetails?.createdAt || new Date().toISOString(),
      };

      const response = await fetch("/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${user.token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Profile updated",
          description: "Your programmer profile has been successfully updated.",
          variant: "success",
        });
        navigate("/profile"); // Redirect to home after success
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error updating your profile.",
        variant: "failed",
      });
    }
  };

  const handleCancel = () => {
    setFormData({});
    setErrors({});

    toast({
      title: "Changes discarded",
      description: "Your changes have been discarded.",
      variant: "failed",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Programmer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder={userDetails?.name || "Enter name"}
              className="placeholder:text-gray-500 placeholder:opacity-70"
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="flex">
              Department
            </Label>
            <Input
              id="department"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              placeholder={userDetails?.department || "Enter department"}
              className="placeholder:text-gray-500 placeholder:opacity-70"
              aria-invalid={!!errors.department}
            />
            {errors.department && (
              <p className="text-sm text-red-500">{errors.department}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Input
              id="semester"
              name="semester"
              value={formData.semester || ""}
              onChange={handleChange}
              placeholder={userDetails?.semester || "Enter semester"}
              className="placeholder:text-gray-500 placeholder:opacity-70"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vjudge">VJudge Link</Label>
              <Input
                id="vjudge"
                name="vjudge"
                value={formData.vjudge || ""}
                onChange={handleChange}
                placeholder={userDetails?.vjudge || "Enter VJudge link"}
                className="placeholder:text-gray-500 placeholder:opacity-70"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codeforces">Codeforces Link</Label>
              <Input
                id="codeforces"
                name="codeforces"
                value={formData.codeforces || ""}
                onChange={handleChange}
                placeholder={userDetails?.codeforces || "Enter Codeforces link"}
                className="placeholder:text-gray-500 placeholder:opacity-70"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clist">Clist Link</Label>
              <Input
                id="clist"
                name="clist"
                value={formData.clist || ""}
                onChange={handleChange}
                placeholder={userDetails?.clist || "Enter Clist link"}
                className="placeholder:text-gray-500 placeholder:opacity-70"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="atcoder">AtCoder Link</Label>
              <Input
                id="atcoder"
                name="atcoder"
                value={formData.atcoder || ""}
                onChange={handleChange}
                placeholder={userDetails?.atcoder || "Enter AtCoder link"}
                className="placeholder:text-gray-500 placeholder:opacity-70"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="codechef">CodeChef Link</Label>
            <Input
              id="codechef"
              name="codechef"
              value={formData.codechef || ""}
              onChange={handleChange}
              placeholder={userDetails?.codechef || "Enter CodeChef link"}
              className="placeholder:text-gray-500 placeholder:opacity-70"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              handleCancel();
              navigate("/");
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
