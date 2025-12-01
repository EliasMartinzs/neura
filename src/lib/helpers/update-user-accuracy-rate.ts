import prisma from "../db";

export async function updateUserAccuracyRate(
  userId: string,
  isCorrect: boolean
) {
  // Atualiza totais
  const stats = await prisma.userStats.update({
    where: { userId },
    data: {
      totalReviews: { increment: 1 },
      totalCorrectAnswers: isCorrect ? { increment: 1 } : undefined,
      totalWrongAnswers: !isCorrect ? { increment: 1 } : undefined,
      lastStudyAt: new Date(),
    },
    select: {
      totalCorrectAnswers: true,
      totalWrongAnswers: true,
    },
  });

  const total = stats.totalCorrectAnswers + stats.totalWrongAnswers;
  const accuracyRate =
    total === 0 ? 0 : (stats.totalCorrectAnswers / total) * 100;

  await prisma.userStats.update({
    where: { userId },
    data: {
      accuracyRateCards: accuracyRate,
      lastStudyAt: new Date(),
    },
  });
}
