import {
  Cpu,
  House,
  Layers,
  Lightbulb,
  LucideIcon,
  RectangleHorizontal,
  Star,
  User,
} from "lucide-react";

type LinksHeader = {
  id: number;
  href: string;
  icon: LucideIcon;
  label: string;
};

export const linksHeader: LinksHeader[] = [
  {
    id: 1,
    href: "/dashboard",
    icon: House,
    label: "Início",
  },
  {
    id: 2,
    href: "/dashboard/deck",
    icon: Layers,
    label: "Deck",
  },
  {
    id: 3,
    href: "/dashboard/flashcards",
    icon: RectangleHorizontal,
    label: "Flashcards",
  },
  {
    id: 4,
    href: "/dashboard/review",
    icon: Star,
    label: "Reviews",
  },
  {
    id: 5,
    href: "/dashboard/explain-learn",
    icon: Lightbulb,
    label: "Explique e Aprenda",
  },
  {
    id: 6,
    href: "/dashboard/quiz",
    icon: Cpu,
    label: "Quiz",
  },
  {
    id: 99,
    href: "/dashboard/profile",
    icon: User,
    label: "Perfil",
  },
] as const;
