'use client'
import LeaderBoard from "@/components/LeaderBoard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";


export default function Home() {
  const [state, setState] = useState('totalProblemsSolved');
  return (
    <div className="container bg-white mx-auto p-4">
      <div className="w-full bg-gray-400 grid grid-cols-6 p-4 rounded-lg space-x-2">
        <Button>Name</Button>
        <Button onClick={() => setState("codeforcesProblemsSolved")}>Codeforces Problem</Button>
        <Button onClick={() => setState("leetcodeProblemsSolved")}>Leetcode Problem</Button>
        <Button  onClick={() => setState("leetcodeRating")}>Leetcode Rating</Button>
        <Button onClick={() => setState("codeforcesRating")}>codeforces Rating</Button>
        <Button onClick={() => setState("totalProblemsSolved")}>Total</Button>

      </div>
      <LeaderBoard state={state}/>
    </div>
  );
}
