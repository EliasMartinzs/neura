import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../db";

/**
 * Atualiza o modelo UserStats com os campos informados.
 * - Garante que o registro existe
 * - Permite atualizar apenas os campos desejados
 *
 * */

type Props = {
  client?: PrismaClient | Prisma.TransactionClient;
  userId: string;
  data: Prisma.UserStatsUpdateInput;
};

export async function updateUserStats({
  data,
  userId,
  client = prisma,
}: Props) {
  try {
    const userStats = await client.userStats.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!userStats) {
      await client.userStats.create({
        data: {
          userId: userId,
        },
      });
    }

    const safeData: any = {};

    for (const [key, value] of Object.entries(data)) {
      const current = (userStats as any)?.[key] ?? 0;

      // Se não for operação de incremento/decremento, aplica direto
      if (typeof value !== "object" || value === null) {
        safeData[key] = value;
        continue;
      }

      if ("decrement" in value) {
        const dec = Math.min(value.decrement!, current); // Evita negativos
        safeData[key] = current <= 0 ? { set: 0 } : { decrement: dec };
      } else if ("increment" in value) {
        safeData[key] = { increment: value.increment };
      } else if ("set" in value) {
        safeData[key] = { set: value.set };
      } else {
        safeData[key] = value;
      }
    }

    await client.userStats.update({
      where: {
        userId: userId,
      },
      data: {
        ...(data as any),
      },
    });

    return;
  } catch (error: any) {
    throw new Error(error);
  }
}
