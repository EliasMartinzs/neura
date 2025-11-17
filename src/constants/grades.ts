import { Frown, Smile, Meh, SmilePlus, XCircle, Laugh } from "lucide-react";

export const GRADES = [
  {
    label: "Não Sei",
    value: 0,
    icon: XCircle,
    color: "text-red-500 hover:text-red-600 border-red-600",
    bg: "bg-red-500",
  },
  {
    label: "Não Lembro Nada",
    value: 1,
    icon: Frown,
    color: "text-orange-500 hover:text-orange-600 border-orange-600",
    bg: "bg-orange-500",
  },
  {
    label: "Lembro Pouco",
    value: 2,
    icon: Meh,
    color: "text-amber-500 hover:text-amber-600 border-amber-600",
    bg: "bg-amber-500",
  },
  {
    label: "Lembro Bem",
    value: 3,
    icon: Smile,
    color: "text-yellow-500 hover:text-yellow-600 border-yellow-600",
    bg: "bg-yellow-500",
  },
  {
    label: "Sei Bem",
    value: 4,
    icon: SmilePlus,
    color: "text-lime-500 hover:text-lime-600 border-lime-600",
    bg: "bg-lime-500",
  },
  {
    label: "Domino Isso",
    value: 5,
    icon: Laugh,
    color: "text-green-500 hover:text-green-600 border-green-600",
    bg: "bg-green-500",
  },
] as const;
