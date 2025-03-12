"use server";
import { prisma } from "@/lib";
import axios from "axios";

export const getUserRanking = async () => {
  try {
    const users = await prisma.user.findMany();

    if (!users || users.length === 0) {
      console.log("No users found in database");
      return [];
    }

    const userRanking = users?.map(async (user) => {
      try {
        let codeforcesResponse = await axios.get(
          `https://codeforces.com/api/user.status?handle=${user.codeforces}`
        );

        let leetcodeResponse = await axios.get(
          `https://alfa-leetcode-api.onrender.com/${user.leetcode}/solved`
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

        return {
          id: user.id,
          name: user.name,
          codeforces: user.codeforces,
          leetcode: user.leetcode,
          solvedProblems: solvedProblems + leetcodeResponse.data.solvedProblem,
          codeforcesProblemSolved: solvedProblems,
          leetcodeProblemSolved: leetcodeResponse.data.solvedProblem,
        };
      } catch (error) {
        console.log(`Error fetching data for user ${user.name}`);
      }
    });

    const results = await Promise.all(userRanking);
    const sortedRanking = results.sort(
      (a: any, b: any) => b.solvedProblems - a.solvedProblems
    );

    return sortedRanking;
  } catch (error) {
    console.log("Error fetching users from database:", error);
  }
};
