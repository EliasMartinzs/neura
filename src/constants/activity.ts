import {
  CheckCircle2,
  FilePlus2,
  FolderCog,
  FolderPlus,
  FolderX,
  PlayCircle,
  RefreshCcw,
  Sparkles,
  FileQuestion, // questão aberta criada
  MessageCircle, // resposta de questão aberta
  Trash2, // deletar questão aberta ou quiz
  ListPlus, // criar quiz
  Pencil, // responder quiz
} from "lucide-react";

export const ACTIVITY_ICONS = {
  folderPlus: FolderPlus,
  folderCog: FolderCog,
  folderX: FolderX,
  filePlus2: FilePlus2,
  refreshCcw: RefreshCcw,
  playCircle: PlayCircle,
  checkCircle2: CheckCircle2,
  sparkles: Sparkles,

  // novos
  fileQuestion: FileQuestion,
  messageCircle: MessageCircle,
  trash2: Trash2,
  listPlus: ListPlus,
  pencil: Pencil,
} as const;

export const ACTIVITY_TYPES = {
  CREATE_DECK: {
    label: "Criou um novo deck",
    icon: "folderPlus",
  },
  UPDATE_DECK: {
    label: "Atualizou um deck",
    icon: "folderCog",
  },
  DELETE_DECK: {
    label: "Deletou um deck",
    icon: "folderX",
  },

  CREATE_FLASHCARD: {
    label: "Criou um novo flashcard",
    icon: "filePlus2",
  },
  UPDATE_FLASHCARD: {
    label: "Atualizou um flashcard",
    icon: "folderCog",
  },
  DELETE_FLASHCARD: {
    label: "Deletou um flashcard",
    icon: "folderX",
  },

  CREATE_FLASHCARD_BY_AI: {
    label: "Gerou novos flashcards com IA",
    icon: "filePlus2",
  },

  REVIEW_FLASHCARD: {
    label: "Revisou um flashcard",
    icon: "refreshCcw",
  },

  STUDY_SESSION_STARTED: {
    label: "Iniciou uma sessão de estudo",
    icon: "playCircle",
  },
  STUDY_SESSION_COMPLETED: {
    label: "Concluiu uma sessão de estudo",
    icon: "checkCircle2",
  },

  // 🔥 novas atividades de questões abertas
  CREATE_OPEN_QUESTION: {
    label: "Criou uma questão aberta",
    icon: "fileQuestion",
  },
  ANSWER_OPEN_QUESTION: {
    label: "Respondeu uma questão aberta",
    icon: "messageCircle",
  },
  DELETE_OPEN_QUESTION: {
    label: "Deletou uma questão aberta",
    icon: "trash2",
  },

  // 🔥 novas atividades de quiz
  CREATE_QUIZ: {
    label: "Criou um quiz",
    icon: "listPlus",
  },
  ANSWER_QUIZ: {
    label: "Respondeu um quiz",
    icon: "pencil",
  },
  DELETE_QUIZ: {
    label: "Deletou um quiz",
    icon: "trash2",
  },

  OTHER: {
    label: "Outra atividade",
    icon: "sparkles",
  },
};

export type ActivityIconType = keyof typeof ACTIVITY_ICONS;
export type ActivityType = keyof typeof ACTIVITY_TYPES;
