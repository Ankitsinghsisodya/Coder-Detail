import LeaderBoard from "@/components/LeaderBoard";
import { Button } from "@/components/ui/button";
import Image from "next/image";


export default function Home() {
  return (
    <div className="container bg-white mx-auto p-4">
      <div className="w-full bg-gray-400 grid grid-cols-4 p-4 rounded-lg space-x-2">
        <Button>Name</Button>
        <Button>Codeforces</Button>
        <Button>Leetcode</Button>
        <Button>Total</Button>

      </div>
      <LeaderBoard/>
    </div>
  );
}
