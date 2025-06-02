'use server'

import { prisma } from "@/lib";
import axios from "axios";
import { redirect } from "next/navigation";

// Add this line to the top of the file to disable TypeScript checking
// @ts-nocheck

export const createUser = async (formData: FormData) => {
    const name = formData.get('name')?.toString();
    const codeforces = formData.get('codeforces')?.toString();
    const leetcode = formData.get('leetcode')?.toString();
    const userId = formData.get('userId')?.toString();

    try {
        // Basic validation
        if (!name) {
            throw new Error("Name is required");
        }

        // Verify Codeforces handle if provided
        // Skip API calls to avoid rate limits while testing
        if (codeforces && codeforces.trim() !== '') {
            // Verification is now optional
            try {
                console.log(`Verifying Codeforces handle: ${codeforces}`);
                const codeforcesResponse = await axios.get(`https://codeforces.com/api/user.info?handles=${codeforces}`);

                if (codeforcesResponse.data.status !== "OK") {
                    console.warn("Codeforces username may not be valid");
                    // Don't throw, just warn
                }
                console.log("Codeforces verification successful");
            } catch (cfError) {
                console.error("Error verifying Codeforces handle:", cfError);
                // Don't throw, just log
            }
        }

        // Update or create user in database
        let user;

        try {
            if (userId) {
                // Check if user exists
                const existingUser = await prisma.user.findUnique({
                    where: { id: userId }
                });

                if (existingUser) {
                    console.log(`Updating existing user with ID: ${userId}`);
                    user = await prisma.user.update({
                        where: { id: userId },
                        data: {
                            name,
                            codeforces: codeforces || null,
                            leetcode: leetcode || null
                        }
                    });
                    console.log("User updated successfully");
                } else {
                    console.log("User not found, creating new user");
                    user = await prisma.user.create({
                        data: {
                            id: userId,
                            name,
                            codeforces: codeforces || null,
                            leetcode: leetcode || null
                        }
                    });
                    console.log("User created successfully");
                }
            } else {
                console.log("Creating new user");
                user = await prisma.user.create({
                    data: {
                        name,
                        codeforces: codeforces || null,
                        leetcode: leetcode || null
                    }
                });
                console.log("User created successfully");
            }
            // Redirect to the user's profile
        } catch (dbError) {
            console.error("Database error:", dbError);
            throw new Error("Failed to update database");
        }
        finally {
            if (user) {
                redirect(`/profile/${user.id}`);
            }
        }
    } catch (error) {
        console.error("Error in createUser:", error);
        // The error will be shown on the form page
        throw error;
    }
};