'use server'

import { prisma } from "@/lib";

export const getUserDetails = async (userId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (user)
            return {
                ok: true,
                user: user,
            }
    } catch (error) {
        console.log("Error fetching user data:", error);
    }
    return {
        ok: false,
    }
}