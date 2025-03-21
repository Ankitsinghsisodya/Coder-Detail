"use server";
import { prisma } from "@/lib";
import axios from "axios";
type resultsType = {
  id: string;
  name: string;
  codeforces: string | null;
  leetcode: string | null;
  solvedProblems: number;
  codeforcesProblemSolved: number;
  leetcodeProblemSolved: number;
  leetcodeRating: number;
  codeforcesRating: number;
};
export const getUserRanking = async () => {
  try {
    const users = await prisma.user.findMany();

    if (!users || users.length === 0) {
      console.log("No users found in database");
      return [];
    }
    let results: resultsType[] = [];
    for (const user of users) {
      try {
        let codeforcesResponse = await axios.get(
          `https://codeforces.com/api/user.status?handle=${user.codeforces}`
        );

        let leetcodeResponse = await axios.get(
          `https://alfa-leetcode-api-x0kj.onrender.com/${user.leetcode}/solved`
        );
        const submissions = codeforcesResponse.data.result;
        const solvedProblemSet = new Set();
        submissions.forEach((submission: any) => {
          if (submission.verdict === "OK") {
            solvedProblemSet.add(
              `${submission.problem.contestId}-${submission.problem.index}`
            );
          }
        });
        const solvedProblems = solvedProblemSet.size;
        let lcRating = 0;
        let leetcodeRating = await axios.get(
          `https://alfa-leetcode-api-x0kj.onrender.com/userContestRankingInfo/${user.leetcode}`
        );
        lcRating = leetcodeRating.data.data.userContestRanking.rating;
        let cfRating = 0;
        const ratingResponse = await axios.get(
          `https://codeforces.com/api/user.rating?handle=${user.codeforces}`
        );

        if (ratingResponse.data && ratingResponse.data.status === "OK") {
          const ratingHistory = ratingResponse.data.result;
          if (ratingHistory && ratingHistory.length > 0) {
            // Get the last contest's rating
            cfRating = ratingHistory[ratingHistory.length - 1].newRating;
          }
        }
        lcRating = Math.round(lcRating);
        cfRating = Math.round(cfRating);
        console.log(`${user.name}`, "lcRating:", lcRating);
        console.log("cfRating:", cfRating);
        results.push({
          id: user.id,
          name: user.name,
          codeforces: user.codeforces,
          leetcode: user.leetcode,
          solvedProblems: solvedProblems + leetcodeResponse.data.solvedProblem,
          codeforcesProblemSolved: solvedProblems,
          leetcodeProblemSolved: leetcodeResponse.data.solvedProblem,
          leetcodeRating: lcRating,
          codeforcesRating: cfRating,
        });
      } catch (error) {
        console.log(`Error fetching data for user ${user.name}`);
      }
    }

    const sortedRanking = results.sort(
      (a: any, b: any) => b.solvedProblems - a.solvedProblems
    );

    return sortedRanking;
  } catch (error) {
    console.log("Error fetching users from database:", error);
  }
};
