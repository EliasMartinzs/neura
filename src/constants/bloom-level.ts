export const BloomLevel = {
  REMEMBER: "Lembrar",
  UNDERSTAND: "Compreender",
  APPLY: "Aplicar",
  ANALYZE: "Analisar",
  EVALUATE: "Avaliar",
  CREATE: "Criar",
} as const;

export const bloomLevels = [
  {
    value: "REMEMBER",
    label: "Lembrar",
    icon: "🧠",
    description: "Recordar informações",
  },
  {
    value: "UNDERSTAND",
    label: "Entender",
    icon: "💡",
    description: "Explicar ideias",
  },
  {
    value: "APPLY",
    label: "Aplicar",
    icon: "🔧",
    description: "Usar conhecimento",
  },
  {
    value: "ANALYZE",
    label: "Analisar",
    icon: "🔍",
    description: "Examinar detalhes",
  },
  {
    value: "EVALUATE",
    label: "Avaliar",
    icon: "⚖️",
    description: "Julgar informações",
  },
  {
    value: "CREATE",
    label: "Criar",
    icon: "✨",
    description: "Produzir algo novo",
  },
];

export type BloomLevelType = keyof typeof BloomLevel;
