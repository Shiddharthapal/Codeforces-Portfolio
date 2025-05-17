// import { useEffect, useState } from "react";
// import { useAppSelector } from "@/redux/hooks";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Loader2, X } from "lucide-react";

// interface UserDetails {
//   userId: string;
//   name: string;
//   department: string;
//   semester: string;
//   vjudge: string;
//   codeforces: string;
//   leetcode: string;
//   atcoder: string;
//   codechef: string;
//   createdAt: string;
// }
// interface contestantDetails {
//   name: string;
//   email: string;
//   password: string;
//   createdAt?: Date;
// }

// export default function UserProfile() {
//   const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
//   const [contestant, setContestant] = useState<contestantDetails | null>(null);
//   const [open, setOpen] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const navigate = useNavigate();
//   const { _id, token } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const fetchUserDetails = async () => {
//       try {
//         const response = await fetch(`/api/users/${_id}`, {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         let data = await response.json();
//         setUserDetails(data.userDetails);
//         setContestant(data.user);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "Failed to fetch user details"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserDetails();
//   }, [_id, token, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
//       </div>
//     );
//   }

//   if (!userDetails) {
//     return (
//       <div>
//         <X
//           className="absolute top-4 right-4 md:top-6 md:right-6"
//           onClick={() => {
//             navigate("/");
//           }}
//         />

//         <div className="min-h-screen flex items-center justify-center">
//           <div className="bg-yellow-50 text-yellow-600 p-4 rounded-md">
//             No user details found, please create an account!
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
//         <div className="flex items-start justify-between mb-6">
//           <h1 className="text-2xl font-bold mb-6 pb-2 border-b">
//             Profile Details
//           </h1>
//           <X onClick={() => navigate("/")} />
//         </div>
//         <div className="space-y-6">
//           {/* Basic Information */}
//           <div>
//             <h2 className="text-lg font-semibold mb-3">Basic Information</h2>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold  text-gray-900">
//                   Name
//                 </label>
//                 <div className="text-gray-500">{userDetails.name}</div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold  text-gray-900">
//                   Email
//                 </label>
//                 <div className="text-gray-500">{contestant?.email}</div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold  text-gray-900">
//                   Department
//                 </label>
//                 <div className="text-gray-500">{userDetails.department}</div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold  text-gray-900">
//                   Semester
//                 </label>
//                 <div className="text-gray-500">{userDetails.semester}</div>
//               </div>
//             </div>
//           </div>

//           {/* Online Judge Handles */}
//           <div>
//             <h2 className="text-lg font-semibold mb-3">Online Judge Handles</h2>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-semibold  text-gray-900">
//                   VJudge
//                 </label>
//                 <div className="text-gray-500">
//                   {userDetails.vjudge || "Not set"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold  text-gray-900">
//                   Codeforces
//                 </label>
//                 <div className="text-gray-500">
//                   {userDetails.codeforces || "Not set"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold  text-gray-900">
//                   leetcode
//                 </label>
//                 <div className="text-gray-500">
//                   {userDetails.leetcode || "Not set"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold  text-gray-900">
//                   AtCoder
//                 </label>
//                 <div className="text-gray-500">
//                   {userDetails.atcoder || "Not set"}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-semibold  text-gray-900">
//                   CodeChef
//                 </label>
//                 <div className="text-gray-500">
//                   {userDetails.codechef || "Not set"}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Account Information */}
//           <div>
//             <h2 className="text-lg font-semibold mb-3">Account Information</h2>
//             <div>
//               <label className="block text-sm font-semibold  text-gray-900">
//                 Account Created
//               </label>
//               <div className="text-gray-500">
//                 {new Date(userDetails.createdAt).toLocaleDateString()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
