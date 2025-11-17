import { StudiedCategory } from "@/utils/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = typeof date === "string" ? new Date(date) : date;
  const diff = now.getTime() - past.getTime(); // diferença em ms

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "agora";
  if (minutes < 60) return `há ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  if (hours < 24) return `há ${hours} hora${hours > 1 ? "s" : ""}`;
  if (days < 7) return `há ${days} dia${days > 1 ? "s" : ""}`;
  if (weeks < 5) return `há ${weeks} semana${weeks > 1 ? "s" : ""}`;
  if (months < 12) return `há ${months} mês${months > 1 ? "es" : ""}`;
  return `há ${years} ano${years > 1 ? "s" : ""}`;
}

export function getCloudinaryPublicId(imageUrl: string) {
  if (!imageUrl) return null;
  try {
    // Exemplo de URL:
    // https://res.cloudinary.com/<cloud_name>/image/upload/v1699094567/folder_name/abc123.jpg
    const parts = imageUrl.split("/");
    const filename = parts.pop()!; // "abc123.jpg"
    const folder = parts.pop(); // "folder_name"
    const publicId = `${folder}/${filename.split(".")[0]}`; // "folder_name/abc123"
    return publicId;
  } catch {
    return null;
  }
}

export function getGradeFromState({
  easeFactor,
  interval,
  repetition,
}: {
  easeFactor: number;
  interval: number;
  repetition: number;
}): number {
  if (repetition === 0 || interval <= 1) return 1;

  if (easeFactor <= 1.5) return 2;

  if (easeFactor <= 2.2) return 3;

  if (easeFactor <= 2.6) return 4;

  return 5;
}

export function normalizeTags(data: StudiedCategory[]): StudiedCategory[] {
  return data.map((item) => {
    if (typeof item === "string") {
      return { tag: item, count: 1 };
    }

    return {
      tag: item.tag,
      count: item.count ?? 1,
    };
  });
}
