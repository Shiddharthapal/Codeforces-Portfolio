import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default async function ContestantDetails({id}: {id:string}) {
  
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch contestant details");
        }
        const data = await response.json();

        const handle = data.userDetails?.codeforces;
        if (!handle) {
          console.error("Codeforces handle is missing");
          return;
        }

        const Userresponse = await fetch(
          `/api/users/codeforces?handle=${encodeURIComponent(handle)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = await Userresponse.json();
        if (!responseData.success) {
          console.error("Failed to fetch user data from Codeforces");
          return;
        }
        return({data,responseData});
      } catch (error) {
        console.error(error);
      }
    };
  