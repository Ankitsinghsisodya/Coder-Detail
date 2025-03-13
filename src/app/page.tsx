import LeaderBoard from "@/components/LeaderBoard";
import { Button } from "@/components/ui/button";
import Image from "next/image";


export default function Home() {
  return (
    <div className="container bg-white mx-auto p-4">
      <div className="w-full bg-gray-400 grid grid-cols-6 p-4 rounded-lg space-x-2">
        <Button>Name</Button>
        <Button>Codeforces Problem</Button>
        <Button>Leetcode Problem</Button>
        <Button>Leetcode Rating</Button>
        <Button>codeforces Rating</Button>
        <Button>Total</Button>

      </div>
      <LeaderBoard/>
    </div>
  );
}
