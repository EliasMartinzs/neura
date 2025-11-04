import {
  CircleUser,
  House,
  Layers,
  RectangleHorizontal,
  Star,
} from "lucide-react";

export const linksHeader = [
  {
    id: 1,
    href: "/dashboard",
    icon: House,
    name: "Início",
  },
  {
    id: 2,
    href: "/dashboard/deck",
    icon: Layers,
    name: "Deck",
  },
  {
    id: 3,
    href: "/dashboard/flashcards",
    icon: RectangleHorizontal,
    name: "Flashcards",
  },
  {
    id: 4,
    href: "/dashboard/reviews",
    icon: Star,
    name: "Reviews",
  },
] as const;
