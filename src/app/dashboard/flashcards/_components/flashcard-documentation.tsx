import React, { memo } from "react";
import {
  Layers,
  PenTool,
  Sparkles,
  Target,
  Calendar,
  TrendingUp,
  Zap,
  Clock,
  BookOpen,
  Brain,
  Award,
  CheckCircle,
  BarChart3,
  Palette,
  StickyNote,
} from "lucide-react";
import { useFlashcardDocumentation } from "@/features/flashcard/hooks/use-flascard-documentation";
import { AnimatePresence, motion } from "framer-motion";

const FlashcardsDocumentationComponent = () => {
  const { open } = useFlashcardDocumentation();

  return (
    <>
      {open && (
        <div className="border-b border-white/10 bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 backdrop-blur-xl rounded-4xl">
          <div className="max-w-7xl mx-auto max-sm:p-4 max-sm:py-8 lg:p-8">
            {/* Hero Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-cyan-600 via-blue-600 to-indigo-600 mb-6 shadow-2xl shadow-blue-500/40 animate-pulse">
                <Layers className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">Flashcards</h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Aprenda de forma rápida, inteligente e no seu ritmo
              </p>
            </div>

            {/* Intro Card */}
            <div className="bg-linear-to-br from-cyan-900/30 via-blue-900/20 to-indigo-900/30 border-2 border-cyan-500/30 rounded-3xl p-8 mb-12 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <Brain className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    O método mais eficiente para memorizar
                  </h2>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Os flashcards são a forma mais eficiente de memorizar
                    conteúdos. Aqui, você estuda com um sistema inteligente que
                    entende seu ritmo, identifica seus pontos fracos e te ajuda
                    a aprender cada vez mais rápido.
                  </p>
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                    <p className="text-sm text-cyan-200">
                      <Zap className="w-4 h-4 inline mr-2" />
                      <strong>A seguir:</strong> veja como tudo funciona, do
                      básico ao avançado.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 01 */}
            <div className="mb-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30">
                    <span className="text-2xl font-bold text-white">01</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                    <PenTool className="w-8 h-8 text-violet-400" />
                    Crie seus próprios flashcards
                  </h2>
                  <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed text-lg">
                      Você pode criar flashcards manualmente a qualquer momento.
                    </p>

                    <div className="bg-slate-900/50 border border-violet-500/20 rounded-xl p-6">
                      <h4 className="font-semibold text-violet-300 mb-4">
                        Cada flashcard tem:
                      </h4>
                      <div className="space-y-3">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                              <BookOpen className="w-4 h-4 text-violet-400" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-white mb-1">
                                Frente
                              </h5>
                              <p className="text-sm text-slate-400">
                                O que você quer lembrar (ex.: pergunta,
                                conceito, termo)
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                              <CheckCircle className="w-4 h-4 text-violet-400" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-white mb-1">
                                Verso
                              </h5>
                              <p className="text-sm text-slate-400">
                                A resposta correta
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border border-violet-500/20 rounded-xl p-6">
                      <h4 className="font-semibold text-violet-300 mb-4">
                        Você também pode adicionar:
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { icon: Palette, label: "Cor", color: "violet" },
                          {
                            icon: StickyNote,
                            label: "Notas pessoais",
                            color: "violet",
                          },
                          { icon: BookOpen, label: "Tópicos", color: "violet" },
                          {
                            icon: BarChart3,
                            label: "Nível de dificuldade",
                            color: "violet",
                          },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={item.label}
                              className="bg-slate-800/50 rounded-lg p-3 flex items-center gap-2"
                            >
                              <Icon className="w-4 h-4 text-violet-400 shrink-0" />
                              <span className="text-sm text-slate-300">
                                {item.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                      <p className="text-sm text-violet-200">
                        <Target className="w-4 h-4 inline mr-2" />
                        Tudo para deixar seu estudo organizado do seu jeito.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 02 */}
            <div className="mb-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-xl shadow-pink-500/30">
                    <span className="text-2xl font-bold text-white">02</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-pink-400" />
                    Gere flashcards com IA{" "}
                    <span className="text-lg text-pink-400 font-normal">
                      (opcional)
                    </span>
                  </h2>
                  <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed text-lg">
                      Se quiser aprender ainda mais rápido, você pode pedir para
                      a IA gerar flashcards automaticamente a partir de um{" "}
                      <span className="text-pink-400 font-semibold">
                        tema ou texto
                      </span>
                      .
                    </p>

                    <div className="bg-linear-to-r from-pink-500/10 to-rose-500/10 border-2 border-pink-500/30 rounded-2xl p-6">
                      <h4 className="font-semibold text-pink-300 mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Ela vai:
                      </h4>
                      <div className="space-y-3">
                        {[
                          { icon: "✨", text: "Criar flashcards completos" },
                          { icon: "💡", text: "Sugerir perguntas e respostas" },
                          {
                            icon: "📋",
                            text: "Organizar conteúdo com clareza",
                          },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-4"
                          >
                            <span className="text-2xl">{item.icon}</span>
                            <p className="text-slate-300">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 03 */}
            <div className="mb-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/30">
                    <span className="text-2xl font-bold text-white">03</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                    <Target className="w-8 h-8 text-amber-400" />
                    Estude com repetição espaçada
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-linear-to-r from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-2xl p-6">
                      <p className="text-amber-100 text-lg font-medium mb-4">
                        Nosso sistema usa uma técnica poderosa chamada{" "}
                        <span className="text-amber-400 font-bold">
                          repetição espaçada
                        </span>
                        .
                      </p>

                      <div className="space-y-3">
                        {[
                          {
                            step: "1",
                            text: "Você responde um flashcard",
                            color: "amber",
                          },
                          {
                            step: "2",
                            text: "Diz o quanto foi fácil ou difícil lembrar",
                            color: "amber",
                          },
                          {
                            step: "3",
                            text: "O sistema calcula automaticamente quando você deve ver esse card de novo",
                            color: "amber",
                          },
                          {
                            step: "4",
                            text: "Os cards mais difíceis voltam mais cedo",
                            color: "rose",
                          },
                          {
                            step: "5",
                            text: "Os que você domina vão sendo espaçados cada vez mais",
                            color: "emerald",
                          },
                        ].map((item) => (
                          <div
                            key={item.step}
                            className="flex items-start gap-3 bg-slate-900/50 rounded-lg p-4 border-l-4 border-amber-500"
                          >
                            <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                              <span className="text-amber-400 font-bold text-sm">
                                {item.step}
                              </span>
                            </div>
                            <p className="text-slate-300 flex-1">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                      <p className="text-sm text-amber-200">
                        <Brain className="w-4 h-4 inline mr-2" />
                        Isso evita esquecer e turbina sua{" "}
                        <strong>memória de longo prazo</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 04 */}
            <div className="mb-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
                    <span className="text-2xl font-bold text-white">04</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-emerald-400" />
                    Sessões de estudo
                  </h2>
                  <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed text-lg">
                      Quando você decide estudar um deck, iniciamos uma{" "}
                      <span className="text-emerald-400 font-semibold">
                        sessão de estudo
                      </span>
                      .
                    </p>

                    <div className="bg-slate-900/50 border border-emerald-500/20 rounded-xl p-6">
                      <h4 className="font-semibold text-emerald-300 mb-4">
                        Durante a sessão, você vê:
                      </h4>
                      <div className="grid gap-3">
                        {[
                          { icon: Layers, label: "Quantos cards faltam" },
                          {
                            icon: CheckCircle,
                            label: "Seu número de acertos e erros",
                          },
                          { icon: TrendingUp, label: "Sua evolução" },
                          {
                            icon: Clock,
                            label:
                              "Quanto tempo você levou para responder (quando disponível)",
                          },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={item.label}
                              className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-4"
                            >
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 text-emerald-400" />
                              </div>
                              <p className="text-slate-300 flex-1">
                                {item.label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <p className="text-sm text-emerald-200">
                        <Award className="w-4 h-4 inline mr-2" />
                        No final, você recebe um{" "}
                        <strong>resumo do seu desempenho</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 05 */}
            <div className="mb-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
                    <span className="text-2xl font-bold text-white">05</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-blue-400" />
                    Histórico de evolução
                  </h2>
                  <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed text-lg">
                      Cada vez que você responde um flashcard:
                    </p>

                    <div className="bg-slate-900/50 border border-blue-500/20 rounded-xl p-6">
                      <div className="grid gap-3">
                        {[
                          { icon: "📊", text: "Registramos sua nota" },
                          { icon: "📈", text: "Atualizamos seu desempenho" },
                          { icon: "🎯", text: "Ajustamos a dificuldade" },
                          { icon: "⏰", text: "Calculamos a próxima revisão" },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-4"
                          >
                            <span className="text-2xl">{item.icon}</span>
                            <p className="text-slate-300">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-linear-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
                      <h4 className="font-semibold text-blue-300 mb-4">
                        Com o tempo, o sistema entende:
                      </h4>
                      <div className="space-y-2">
                        {[
                          "Quais temas você domina",
                          "Quais precisa reforçar",
                          "Como está sua curva de aprendizado",
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                            <p className="text-slate-300 text-sm">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <p className="text-sm text-blue-200">
                        <Brain className="w-4 h-4 inline mr-2" />
                        Tudo para deixar o estudo mais{" "}
                        <strong>inteligente</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 06 */}
            <div className="mb-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center shadow-xl shadow-fuchsia-500/30">
                    <span className="text-2xl font-bold text-white">06</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                    <Zap className="w-8 h-8 text-fuchsia-400" />
                    Flexível e do seu jeito
                  </h2>
                  <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed text-lg mb-4">
                      Com flashcards você pode:
                    </p>

                    <div className="grid gap-3">
                      {[
                        { icon: "🌍", text: "Estudar em qualquer lugar" },
                        { icon: "⚡", text: "Revisar rapidamente" },
                        { icon: "🎯", text: "Focar só nos cards que precisa" },
                        {
                          icon: "📚",
                          text: "Organizar seus decks do jeito que preferir",
                        },
                        {
                          icon: "🎨",
                          text: "Marcar cores, dificuldades e anotações",
                        },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900/50 border border-fuchsia-500/20 rounded-xl p-4 hover:border-fuchsia-500/40 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.icon}</span>
                            <p className="text-slate-300">{item.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-linear-to-r from-fuchsia-500/10 to-purple-500/10 border-2 border-fuchsia-500/30 rounded-2xl p-6 mt-6">
                      <p className="text-fuchsia-100 text-lg font-medium text-center">
                        É o método mais simples para aprender — e o mais
                        eficiente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const FlashcardsDocumentation = memo(FlashcardsDocumentationComponent);
FlashcardsDocumentation.displayName = "FlashcardsDocumentation";
