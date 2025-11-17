export const circleColors = [
  { background: "#f44336", foreground: "#fff" },
  { background: "#e91e63", foreground: "#fff" },
  { background: "#9c27b0", foreground: "#fff" },
  { background: "#673ab7", foreground: "#fff" },
  { background: "#3f51b5", foreground: "#fff" },
  { background: "#2196f3", foreground: "#fff" },
  { background: "#03a9f4", foreground: "#000" },
  { background: "#00bcd4", foreground: "#000" },
  { background: "#009688", foreground: "#fff" },
  { background: "#4caf50", foreground: "#000" },
  { background: "#8bc34a", foreground: "#000" },
  { background: "#cddc39", foreground: "#000" },
  { background: "#ffeb3b", foreground: "#000" },
  { background: "#ffc107", foreground: "#000" },
  { background: "#ff9800", foreground: "#000" },
  { background: "#ff5722", foreground: "#fff" },
  { background: "#795548", foreground: "#fff" },
  { background: "#607d8b", foreground: "#fff" },
] as const;

export function getForeground(bg: string) {
  const color = circleColors.find((c) => c.background === bg);
  return color ? color.foreground : "#000";
}
