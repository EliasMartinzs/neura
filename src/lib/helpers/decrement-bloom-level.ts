import { Prisma, PrismaClient } from "@prisma/client";
import prisma from "../db";

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
  client?: PrismaClient | Prisma.TransactionClient;
  userId: string;
  bloomLevel?: string;
};

export async function decrementBloomLevel({
  userId,
  bloomLevel,
  client = prisma,
}: Props) {
  if (!bloomLevel) return;

  const LEVEL = bloomLevel.toUpperCase();

  const stats = await client.userStats.findUnique({
    where: { userId },
    select: { mostStudiedBloomLevel: true },
  });

  // 1️⃣ Base com todos os bloooms garantidos
  const base = Object.fromEntries(DEFAULT_BLOOMS.map((b) => [b.level, 0]));

  // 2️⃣ Aplicar os valores existentes
  for (const item of (stats?.mostStudiedBloomLevel ?? []) as BloomStat[]) {
    const key = String(item.level).toUpperCase();
    if (key in base) base[key] = Number(item.count) || 0;
  }

  // 3️⃣ Decrementar com segurança (mínimo 0)
  base[LEVEL] = Math.max(0, base[LEVEL] - 1);

  // 4️⃣ Voltar para array ordenado e padronizado
  const finalArray: BloomStat[] = DEFAULT_BLOOMS.map((b) => ({
    level: b.level,
    count: base[b.level],
  }));

  // 5️⃣ Upsert simples
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
