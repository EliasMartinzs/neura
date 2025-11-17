// utils/updateUserStats.ts
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Atualiza o modelo UserStats com os campos informados.
 * - Garante que o registro existe
 * - Permite atualizar apenas os campos desejados
 */
export async function updateUserStats(
  userId: string,
  data: Prisma.UserStatsUpdateInput
) {
  try {
    const userStats = await prisma.userStats.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!userStats) {
      await prisma.userStats.create({
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

    await prisma.userStats.update({
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
