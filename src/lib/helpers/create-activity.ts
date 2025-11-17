import { ACTIVITY_TYPES, ActivityType } from "@/constants/activity";
import prisma from "../db";
import { PrismaClient, Prisma } from "@prisma/client";

interface CreateActivityParams {
  userId: string;
  type: ActivityType;
  message?: string;
  client?: PrismaClient | Prisma.TransactionClient; // permite tx ou prisma normal
}

export async function createActivity({
  userId,
  type,
  message,
  client = prisma, // se não passar, usa o client padrão
}: CreateActivityParams) {
  return client.activityLog.create({
    data: {
      userId,
      type,
      message: type === "OTHER" ? message : ACTIVITY_TYPES[type].label,
      icon: ACTIVITY_TYPES[type].icon,
    },
  });
}
