"use client";

import type React from "react";

import { useState } from "react";
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

interface UserDetails {
  id: string;
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

export default function editAc({ userDetails }: { userDetails: UserDetails }) {
  const [formData, setFormData] = useState<Partial<UserDetails>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!formData.name && !userDetails.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.department && !userDetails.department) {
      newErrors.department = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Merge the original data with the updated fields
    const updatedData = { ...userDetails, ...formData };

    // Here you would typically send the data to your API
    console.log("Submitting updated data:", updatedData);

    // Show success message
    toast({
      title: "Profile updated",
      description: "Your programmer profile has been successfully updated.",
    });
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
              placeholder={userDetails.name}
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
              placeholder={userDetails.department}
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
              placeholder={userDetails.semester || ""}
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
                placeholder={userDetails.vjudge || ""}
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
                placeholder={userDetails.codeforces || ""}
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
                placeholder={userDetails.clist || ""}
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
                placeholder={userDetails.atcoder || ""}
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
              placeholder={userDetails.codechef || ""}
              className="placeholder:text-gray-500 placeholder:opacity-70"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
