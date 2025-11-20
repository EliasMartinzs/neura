import {
  House,
  Layers,
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
  items?: {
    id: number;
    href: string;
    label: string;
    icon: LucideIcon;
  }[];
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
    href: "/dashboard/profile",
    icon: User,
    label: "Perfil",
  },
] as const;
