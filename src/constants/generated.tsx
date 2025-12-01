import { AlignLeft, FileText, Lightbulb } from "lucide-react";

export const generatedModes = [
  {
    value: "SIMPLE",
    label: "Simples",
    icon: <AlignLeft className="size-5 text-blue-400" />,
    desc: "Resposta objetiva e direta ao ponto.",
  },
  {
    value: "DETAILED",
    label: "Detalhado",
    icon: <FileText className="size-5 text-indigo-500" />,
    desc: "Resposta completa com explicações estendidas.",
  },
  {
    value: "EXPLAINED",
    label: "Explicado",
    icon: <Lightbulb className="size-5 text-amber-500" />,
    desc: "Resposta com foco no entendimento e clareza.",
  },
];
