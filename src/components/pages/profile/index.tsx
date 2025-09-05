"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, User, Mail, Code, GraduationCap, School2 } from "lucide-react";

interface Profile {
  email: string;
  name: string;
  universityName: string;
  department: string;
  username: string;
  codeforces: string;
  picture?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if profile exists in localStorage
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    setIsLoading(false);
  }, []);

  const handleCreateProfile = (newProfile: Profile) => {
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
    setProfile(newProfile);
    setIsEditing(false);
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
      <div className="container mx-auto px-4 py-8 max-w-md">
        <ProfileForm
          onSubmit={handleCreateProfile}
          initialData={profile}
          onCancel={profile ? () => setIsEditing(false) : undefined}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profile.picture || "/placeholder.svg"}
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
          <CardTitle className="text-2xl">{profile.name}</CardTitle>
          <Badge variant="secondary" className="w-fit mx-auto">
            @{profile.username}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{profile.email}</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{profile.username}</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <School2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{profile.universityName}</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{profile.department}</span>
          </div>

          {profile.codeforces && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Code className="h-4 w-4 text-muted-foreground" />
              <a
                href={profile.codeforces}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
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
}: {
  onSubmit: (profile: Profile) => void;
  initialData?: Profile | null;
  onCancel?: () => void;
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
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
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
                <AvatarImage
                  src={picturePreview || "/placeholder.svg"}
                  alt="Profile preview"
                />
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

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="universityName">University Name</Label>
            <Input
              id="universityName"
              value={formData.universityName}
              onChange={(e) =>
                handleInputChange("universityName", e.target.value)
              }
              placeholder="Enter your university name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">University Name</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              placeholder="Enter your department name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codeforces">Codeforces Link</Label>
            <Input
              id="codeforces"
              value={formData.codeforces}
              onChange={(e) => handleInputChange("codeforces", e.target.value)}
              placeholder="https://codeforces.com/profile/username"
            />
          </div>

          <div className="flex gap-2 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="flex-1">
              {initialData ? "Update Profile" : "Create Profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
