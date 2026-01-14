"use client";

import type React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  User,
  Mail,
  Code,
  GraduationCap,
  School2,
  ArrowLeft,
  CheckCircle,
  X,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { navigate } from "astro:transitions/client";

interface Profile {
  email?: string;
  name: string;
  universityName: string;
  department: string;
  username: string;
  codeforces: string;
  picture?: string;
}
const demoProfile: Profile = {
  email: "Not Provided",
  name: "Not Provided",
  universityName: "Not Provided",
  department: "Not Provided",
  username: "Not Provided",
  codeforces: "Not Provided",
  picture: "Not Provided",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(demoProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const location = useLocation();
  const isDarkMode = location.state?.isDarkMode;

  const { _id, token } = useAppSelector((state) => state.auth);
  // console.log("🧞‍♂️  token profile --->", token);
  // console.log("🧞‍♂️  _id profile --->", _id);

  //for notification
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        let speceficUserResponse = await fetch(`/api/userApi/${_id}`);
        if (!speceficUserResponse.ok) {
          throw new Error("Failed to fetch all users");
        }
        let userdata = await speceficUserResponse.json();
        setProfile({ ...userdata?.userDetails, email: userdata.user.email });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchdata();
  }, [_id]);

  //handler function of create profile
  const handleCreateProfile = async (newProfile: Profile) => {
  console.log("newProfile ==> ", newProfile);
    let response = await fetch("/api/userApi/profileCreate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newProfile, _id }),
    });
    if (!response.ok) {
      console.log("Profile not created");
      setNotification({
        show: true,
        message: "Profile not updated successfully!",
        type: "error",
      });
    }
    let responseData = await response.json();
    setProfile(responseData.profiledetails);
    setNotification({
      show: true,
      message: "Profile updated successfully!",
      type: "success",
    });
    setIsEditing(false);
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, show: false }));
  };

  const handleBack = () => {
    navigate("/"); // specify the route to go back to
  };

  let initial = "";
  const getInitials = (patientName: string) => {
    if (!patientName) return "AB";
    const cleanName = patientName.trim();
    if (!cleanName) return "AB";

    // Split the cleaned name and get first 2 words
    const words = cleanName.split(" ").filter((word) => word.length > 0);

    if (words.length >= 2) {
      // Get first letter of first 2 words
      initial = (words[0][0] + words[1][0]).toUpperCase();
      return initial;
    } else if (words.length === 1) {
      // If only one word, get first 2 letters
      initial = words[0].substring(0, 2).toUpperCase();
      return initial;
    } else {
      initial = "AB";
      return initial;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile || isEditing) {
    return (
      <div className={`container mx-auto px-4 py-8 max-w-md `}>
        {notification.show && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 ">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg flex items-center gap-3 min-w-[300px]">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <span className="text-green-800 font-medium flex-1">
                {notification.message}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeNotification}
                className="h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <ProfileForm
          onSubmit={handleCreateProfile}
          initialData={profile}
          onCancel={profile ? () => setIsEditing(false) : undefined}
          isDarkMode={isDarkMode}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <Card className={`${isDarkMode ? "bg-cyan-950" : ""}`}>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profile.picture || getInitials(profile.name)}
                alt={profile.name}
              />
              <AvatarFallback className="text-2xl">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className={`text-2xl ${isDarkMode ? "text-white" : ""}`}>
            {profile?.name}
          </CardTitle>
          <Badge variant="secondary" className="w-fit mx-auto">
            @{profile?.username || profile?.name.toLocaleLowerCase()}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Mail
              className={`h-4 w-4 text-muted-foreground ${
                isDarkMode ? "text-gray-800" : ""
              }`}
            />
            <span className="text-sm">{profile?.email}</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <User
              className={`h-4 w-4 text-muted-foreground ${
                isDarkMode ? "text-gray-800" : ""
              }`}
            />
            <span className="text-sm">
              {profile?.username || profile?.name.toLocaleLowerCase()}
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <School2
              className={`h-4 w-4 text-muted-foreground ${
                isDarkMode ? "text-gray-800" : ""
              }`}
            />
            <span className="text-sm">{profile.universityName || " "}</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <GraduationCap
              className={`h-4 w-4 text-muted-foreground ${
                isDarkMode ? "text-gray-800" : ""
              }`}
            />
            <span className="text-sm">{profile?.department}</span>
          </div>

          {profile.codeforces && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Code
                className={`h-4 w-4 text-muted-foreground ${
                  isDarkMode ? "text-gray-800" : ""
                }`}
              />
              <a
                href={profile?.codeforces}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary text-blue-600 hover:underline"
              >
                Codeforces Profile
              </a>
            </div>
          )}

          <Button
            onClick={() => setIsEditing(true)}
            className="w-full mt-6"
            variant="outline"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileForm({
  onSubmit,
  initialData,
  onCancel,
  isDarkMode,
}: {
  onSubmit: (profile: Profile) => void;
  initialData?: Profile | null;
  onCancel?: () => void;
  isDarkMode: boolean;
}) {
  const [formData, setFormData] = useState<Profile>({
    email: initialData?.email || "",
    name: initialData?.name || "",
    username: initialData?.username || "",
    universityName: initialData?.universityName || "",
    department: initialData?.department || "",
    codeforces: initialData?.codeforces || "",
    picture: initialData?.picture || "",
  });
  const [picturePreview, setPicturePreview] = useState<string>(
    initialData?.picture || ""
  );

  const handleInputChange = (field: keyof Profile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPicturePreview(result);
        setFormData((prev) => ({ ...prev, picture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.name && formData.username) {
      onSubmit(formData);
    }
  };

  return (
    <Card className={`${isDarkMode ? "bg-cyan-950 " : ""}`}>
      <CardHeader>
        <CardTitle className={`text-center ${isDarkMode ? "text-white" : ""}`}>
          {initialData ? "Edit Profile" : "Create Your Profile"}
        </CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          {initialData
            ? "Update your profile information"
            : "Enter your details to get started"}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={picturePreview} alt="Profile preview" />
                <AvatarFallback>
                  {formData.name
                    ? formData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="picture"
                className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Edit className="h-3 w-3" />
              </Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="hidden"
              />
            </div>
          </div>

          <div className={`space-y-2 ${isDarkMode ? "text-white" : ""}`}>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              required
              className={`space-y-2 ${isDarkMode ? "text-gray-400" : ""}`}
            />
          </div>

          <div className={`space-y-2 ${isDarkMode ? "text-white" : ""}`}>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => {
                const valueWithoutSpaces = e.target.value
                  .replace(/\s/g, "")
                  .toLowerCase();
                handleInputChange("username", valueWithoutSpaces);
              }}
              placeholder="Choose a username"
              required
              className={`space-y-2 ${isDarkMode ? "text-gray-400" : ""}`}
            />
          </div>
          <div className={`space-y-2 ${isDarkMode ? "text-white" : ""}`}>
            <Label htmlFor="universityName">University Name</Label>
            <Input
              id="universityName"
              value={formData.universityName}
              onChange={(e) =>
                handleInputChange("universityName", e.target.value)
              }
              placeholder="Enter your university name"
              required
              className={`space-y-2 ${isDarkMode ? "text-gray-400" : ""}`}
            />
          </div>

          <div className={`space-y-2 ${isDarkMode ? "text-white" : ""}`}>
            <Label htmlFor="department">Department Name</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              placeholder="Enter your department name"
              required
              className={`space-y-2 ${isDarkMode ? "text-gray-400" : ""}`}
            />
          </div>

          <div className={`space-y-2 ${isDarkMode ? "text-white" : ""}`}>
            <Label htmlFor="codeforces">Codeforces Link</Label>
            <Input
              id="codeforces"
              value={formData.codeforces}
              onChange={(e) => handleInputChange("codeforces", e.target.value)}
              placeholder="https://codeforces.com/profile/username"
              className={`space-y-2 ${isDarkMode ? "text-gray-400" : ""}`}
            />
          </div>

          <div className="flex gap-2 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className={`flex-1 bg-transparent ${
                  isDarkMode ? "text-white" : ""
                }`}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1">
              {initialData ? "Update Profile" : "Updated"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
