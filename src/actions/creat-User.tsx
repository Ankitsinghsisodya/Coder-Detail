'use server'

import axios from "axios";
import { prisma } from "@/lib";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createUser = async (formData: FormData) => {
    const name = formData.get('name')?.toString();
    const codeforces = formData.get('codeforces')?.toString();
    const leetcode = formData.get('leetcode')?.toString();
    const userId = formData.get('userId')?.toString();

    console.log("Processing user data:", { name, codeforces, leetcode, userId });

    try {
        // Basic validation
        if (!name) {
            throw new Error("Name is required");
        }

        // Verify Codeforces handle if provided
        if (codeforces && codeforces.trim() !== '') {
            try {
                console.log(`Verifying Codeforces handle: ${codeforces}`);
                const codeforcesResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${codeforces}`);

                if (codeforcesResponse.data.status !== "OK") {
                    throw new Error("Codeforces username is not valid");
                }
                console.log("Codeforces verification successful");
            } catch (cfError) {
                console.error("Error verifying Codeforces handle:", cfError);
                throw new Error("Codeforces username is not valid or API is unavailable");
            }
        }

        // Verify LeetCode handle if provided
        if (leetcode && leetcode.trim() !== '') {
            try {
                console.log(`Verifying LeetCode handle: ${leetcode}`);
                // Using alfa-leetcode-api which is more reliable than direct LeetCode calls
                const leetcodeResponse = await axios.get(`https://alfa-leetcode-api.onrender.com/${leetcode}`);
                console.log("LeetCode response:", leetcodeResponse.data);
                if (!leetcodeResponse.data) {
                    throw new Error("LeetCode username is not valid");
                }
                console.log("LeetCode verification successful");
            } catch (lcError) {
                console.error("Error verifying LeetCode handle:", lcError);
                throw new Error("LeetCode username is not valid or API is unavailable");
            }
        }

        // Update or create user in database
        let user;

        user = await prisma.user.findUnique
            ({
                where: { id: userId }
            });

        if (user !== null) {
            console.log(`Updating existing user with ID: ${userId}`);
            // Update existing user
            console.log("User found:", user);
            user = await prisma.user.update({
                where: { id: userId },
                data: {
                    name,
                    codeforces: codeforces || null,
                    leetcode: leetcode || null
                }
            });
            console.log("User updated successfully:", user);
        } else {
            console.log("Creating new user");
            console.log("user brought", user);
            // Create new user
            user = await prisma.user.create({
                data: {
                    id: userId,
                    name,
                    codeforces: codeforces || null,
                    leetcode: leetcode || null
                }
            });
            console.log("User created successfully:", user);
        }

        // Refresh data and redirect
        revalidatePath('/');
        redirect(`/profile/${user.id}`);

    } catch (error) {
        console.error("Error in createUser:", error);
        // Return the error for client-side handling
        return {
            error: true,
            message: error instanceof Error ? error.message : "An unknown error occurred"
        };
    }
};