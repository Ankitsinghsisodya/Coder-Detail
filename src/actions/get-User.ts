'use server'
import { prisma } from "@/lib";

export const getUser = async () => {
  return await prisma.user.findMany();
};
