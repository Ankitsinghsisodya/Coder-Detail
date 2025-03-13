"use server";

import { prisma } from "@/lib";
import axios from "axios";

export const updateUserRating = async () => {
    console.log("Updating user ratings...");
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
        
       
        console.log('ankit');

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
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          codeforces: user.codeforces,
          leetcode: user.leetcode,
          totalProblemsSolved: solvedProblems,
          codeforcesProblemsSolved: solvedProblems,
          codeforcesRating: cfRating,
        },
      });
      console.log('ayush');
      let leetcodeRating = await axios.get(
        `https://alfa-leetcode-api-x0kj.onrender.com/userContestRankingInfo/${user.leetcode}`
      );
      let leetcodeResponse = await axios.get(
        `https://alfa-leetcode-api-x0kj.onrender.com/${user.leetcode}/solved`
    );
      lcRating = leetcodeRating.data.data.userContestRanking.rating;
      let totalSolvedProblems = solvedProblems + leetcodeResponse.data.solvedProblem;
      console.log(`${user.name}`, 'lcRating:', lcRating);
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          codeforces: user.codeforces,
          leetcode: user.leetcode,
          totalProblemsSolved: totalSolvedProblems,
          codeforcesProblemsSolved: solvedProblems,
          leetcodeProblemsSolved: leetcodeResponse.data.solvedProblem,
          leetcodeRating: lcRating,
          codeforcesRating: cfRating,
        },
      });
    } catch (error) {
      console.log(`Error fetching data for user ${user.name}`);
    }
  });
};
