'use server'

import { prisma } from "@/lib";
import axios from "axios";
import { NextResponse } from "next/server";
import { updateUserRating } from "./update-User-Rating";

export const createUser = async (formData: FormData) => {
    const name = formData.get('name')?.toString();
    const codeforces = formData.get('codeforces')?.toString();
    const leetcode = formData.get('leetcode')?.toString();
    const userId = formData.get('userId')?.toString();

    try {
        // Basic validation
        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        // Verify Codeforces handle if provided
        if (codeforces && codeforces.trim() !== '') {
            try {
                const codeforcesResponse = await axios.get(
                    `https://codeforces.com/api/user.info?handles=${codeforces}`
                );

                if (codeforcesResponse.data.status !== "OK") {
                    console.warn("Codeforces username may not be valid");
                }
            } catch (cfError) {
                console.error("Error verifying Codeforces handle:", cfError);
            }
        }

        let user;
        try {
            if (userId) {
                const existingUser = await prisma.user.findUnique({
                    where: { id: userId }
                });

                if (existingUser) {
                    user = await prisma.user.update({
                        where: { id: userId },
                        data: {
                            name,
                            codeforces: codeforces || null,
                            leetcode: leetcode || null
                        }
                    });
                } else {
                    user = await prisma.user.create({
                        data: {
                            id: userId,
                            name,
                            codeforces: codeforces || null,
                            leetcode: leetcode || null
                        }
                    });
                }

                // Update user ratings
                await updateUserRating();

                return NextResponse.json({ 
                    success: true, 
                    user 
                }, { 
                    status: 200 
                });
            } else {
                return NextResponse.json(
                    { error: "User ID is required" },
                    { status: 400 }
                );
            }
        } catch (dbError) {
            console.error("Database error:", dbError);
            return NextResponse.json(
                { error: "Failed to update database" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error in createUser:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
};