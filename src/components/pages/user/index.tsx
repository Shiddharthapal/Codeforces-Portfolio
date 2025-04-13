import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface UserDetails {
  userId: string;
  name: string;
  department: string;
  semester: string;
  vjudge: string;
  codeforces: string;
  clist: string;
  atcoder: string;
  codechef: string;
  createdAt: string;
}

export default function UserProfile() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { _id, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/users/${_id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setUserDetails(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user details"
        );
        navigate("/createAc");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [_id, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 text-yellow-600 p-4 rounded-md">
          No user details found, please create an account!
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6 pb-2 border-b">
          Profile Details
        </h1>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500">Name</label>
                <div className="text-gray-900">{userDetails.name}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500">
                  Department
                </label>
                <div className="text-gray-900">{userDetails.department}</div>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Semester</label>
                <div className="text-gray-900">{userDetails.semester}</div>
              </div>
            </div>
          </div>

          {/* Online Judge Handles */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Online Judge Handles</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500">VJudge</label>
                <div className="text-gray-900">
                  {userDetails.vjudge || "Not set"}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500">
                  Codeforces
                </label>
                <div className="text-gray-900">
                  {userDetails.codeforces || "Not set"}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Clist</label>
                <div className="text-gray-900">
                  {userDetails.clist || "Not set"}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500">AtCoder</label>
                <div className="text-gray-900">
                  {userDetails.atcoder || "Not set"}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500">CodeChef</label>
                <div className="text-gray-900">
                  {userDetails.codechef || "Not set"}
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Account Information</h2>
            <div>
              <label className="block text-sm text-gray-500">
                Account Created
              </label>
              <div className="text-gray-900">
                {new Date(userDetails.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
