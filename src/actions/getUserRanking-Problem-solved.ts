"use server";
import { prisma } from "@/lib";
import axios from "axios";
const user = [{
    id: "clh4v0j",
    name: "Ankit Sisodya",
    codeforces: "Ankit_singh_sisodya",
    leetcode: "ankit_sisodya",
    solvedProblems: 0,
    codeforcesProblemSolved: 0,
    leetcodeProblemSolved: 0,
  }];

export const getUserRanking = async () => {
    return user;
  try {
    console.log("query hone wala h");
    
    const users = await prisma.user.findMany();
    console.log("users is great", users);

    if (!users || users.length === 0) {
      console.log("No users found in database");
      return [];
    }
    console.log("ayushi zindabad");
    console.log("users" , users);
    const userRanking =  users?.map(async (user) => {
      try {
        console.log("ayush is g");
        let codeforcesResponse = await axios.get(
          `https://codeforces.com/api/user.status?handle=${user.codeforces}`
        );
        console.log("ankit is g");
        let leetcodeResponse = await axios.get(
          `https://alfa-leetcode-api.onrender.com/${user.leetcode}/solved`
        );
        console.log("leetcoderesponse", leetcodeResponse.data);
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
        console.log('solvedProblemsi', solvedProblems);
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
    console.log("userRanking", userRanking);
    const results = await Promise.all(userRanking);
    const sortedRanking = results.sort(
      (a: any, b: any) => b.solvedProblems - a.solvedProblems
    );
    console.log("results", results);
    return sortedRanking;
  } catch (error) {
    console.log("Error fetching users from database:", error);
  }
};
