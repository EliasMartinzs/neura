import { Prisma, PrismaClient } from "@prisma/client";

type BloomStat = { level: string; count: number };

const DEFAULT_BLOOMS: BloomStat[] = [
  { level: "REMEMBER", count: 0 },
  { level: "UNDERSTAND", count: 0 },
  { level: "APPLY", count: 0 },
  { level: "ANALYZE", count: 0 },
  { level: "EVALUATE", count: 0 },
  { level: "CREATE", count: 0 },
];

type Props = {
  client: PrismaClient | Prisma.TransactionClient;
  userId: string;
  bloomLevel?: string;
  count?: number;
};

export async function incrementBloomLevel({
  client,
  userId,
  bloomLevel,
  count = 1,
}: Props) {
  if (!bloomLevel) return;

  const LEVEL = bloomLevel.toUpperCase();

  const stats = await client.userStats.findUnique({
    where: { userId },
    select: { mostStudiedBloomLevel: true },
  });

  const base = Object.fromEntries(DEFAULT_BLOOMS.map((b) => [b.level, 0]));

  for (const item of (stats?.mostStudiedBloomLevel ?? []) as BloomStat[]) {
    const key = String(item.level).toUpperCase();
    if (key in base) base[key] = Number(item.count) || 0;
  }

  base[LEVEL] += count;

  const finalArray: BloomStat[] = DEFAULT_BLOOMS.map((b) => ({
    level: b.level,
    count: base[b.level],
  }));

  await client.userStats.upsert({
    where: { userId },
    create: {
      userId,
      mostStudiedBloomLevel: finalArray,
    },
    update: {
      mostStudiedBloomLevel: finalArray,
    },
  });
}
