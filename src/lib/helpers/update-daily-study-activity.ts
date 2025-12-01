import prisma from "../db";
import { PrismaClient, Prisma } from "@prisma/client";

interface UpdateDailyStudy {
  userId: string;
  client?: PrismaClient | Prisma.TransactionClient;
  date?: Date;
}

/**
 * Atualiza a DailyStudyActivity incrementando o count do dia.
 * Aceita prisma ou uma transaction (tx).
 */
export async function updateDailyStudyActivity({
  userId,
  client = prisma,
  date = new Date(),
}: UpdateDailyStudy) {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  return client.dailyStudyActivity.upsert({
    where: {
      userId_date: {
        userId,
        date: normalizedDate,
      },
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      userId,
      date: normalizedDate,
      count: 1,
    },
  });
}
