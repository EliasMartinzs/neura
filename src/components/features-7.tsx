import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReactNode } from "react";

import { Layers, CreditCard, BrainCircuit } from "lucide-react";

export const features = [
  {
    icon: Layers,
    label: "Decks de Estudo",
    description:
      "Crie e organize seus decks para armazenar flashcards por matéria, tema ou objetivo de estudo, mantendo tudo estruturado em um só lugar.",
  },
  {
    icon: CreditCard,
    label: "Flashcards Inteligentes",
    description:
      "Crie flashcards manualmente ou utilize a inteligência artificial para gerar conteúdos automaticamente a partir de um prompt personalizado.",
  },
  {
    icon: BrainCircuit,
    label: "Explique e Aprenda",
    description:
      "Pergunte sobre qualquer tema e receba uma pergunta gerada pela IA. Responda com suas próprias palavras e receba feedback detalhado sobre acertos e possíveis erros.",
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-32">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Construído para atender às suas necessidades.
          </h2>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 [--color-background:var(--color-muted)] [--color-card:var(--color-muted)] *:text-center md:mt-16 dark:[--color-muted:var(--color-zinc-900)]">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                className="group shadow-none bg-transparent"
                key={item.label}
              >
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <Icon className="size-6" aria-hidden />
                  </CardDecorator>

                  <h3 className="mt-6 font-medium">{item.label}</h3>
                </CardHeader>

                <CardContent>
                  <p className="mt-3 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
