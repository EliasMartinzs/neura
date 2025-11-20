const now = new Date();

// Brasília é UTC-3
const BR_TIMEZONE_OFFSET = -3; // em horas

export function getBrasiliaDayRange(date: Date) {
  // Converte o horário atual para o mesmo dia, mas em Brasília
  const localYear = date.getUTCFullYear();
  const localMonth = date.getUTCMonth();
  const localDay = date.getUTCDate();

  // Início do dia em UTC considerando o fuso
  const start = new Date(
    Date.UTC(localYear, localMonth, localDay, -BR_TIMEZONE_OFFSET)
  );
  const end = new Date(start.getTime() + (24 * 60 * 60 * 1000 - 1));

  return { start, end };
}

const { start: startOfToday, end: endOfToday } = getBrasiliaDayRange(now);
