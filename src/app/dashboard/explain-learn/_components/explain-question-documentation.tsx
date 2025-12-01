import { useExplainDocumentation } from "@/features/explain-learn/hooks/use-explain-documentation";
import { AnimatePresence } from "framer-motion";
import {
  Brain,
  MessageSquare,
  PenTool,
  BarChart3,
  CheckCircle,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Award,
  BookOpen,
  Lightbulb,
} from "lucide-react";

import { motion } from "framer-motion";
import { memo } from "react";

const ExplainLearnDocumentationComponent = () => {
  const { open } = useExplainDocumentation();

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="p-4 sm:p-8 border-b border-white/10 bg-linear-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-xl rounded-4xl">
          {/* Intro Card */}
          <div className="bg-linear-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 border-2 border-indigo-500/30 rounded-3xl p-8 mb-12 backdrop-blur-sm">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                <Lightbulb className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  O que é o Explique & Aprenda?
                </h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  Uma experiência focada em{" "}
                  <span className="text-indigo-400 font-semibold">
                    raciocínio aberto
                  </span>
                  . Aqui, você não responde múltipla escolha — você explica com
                  suas próprias palavras, e a IA analisa sua resposta como um
                  professor particular.
                </p>
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                  <p className="text-sm text-indigo-200">
                    <Target className="w-4 h-4 inline mr-2" />
                    <strong>Ideal para:</strong> desenvolver clareza,
                    profundidade e capacidade real de explicar conceitos.
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
                  <Brain className="w-8 h-8 text-violet-400" />
                  Como funciona?
                </h2>
                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed text-lg">
                    Você escolhe um tópico (ex.:{" "}
                    <span className="text-violet-400 font-medium">
                      Git, Economia, Anatomia, Redes
                    </span>
                    , etc.) e a IA gera:
                  </p>

                  <div className="grid gap-3">
                    <div className="bg-slate-900/50 border border-violet-500/20 rounded-xl p-5 hover:border-violet-500/40 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0 mt-1">
                          <MessageSquare className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">
                            Uma pergunta aberta
                          </h4>
                          <p className="text-sm text-slate-400">
                            Adaptada ao tema escolhido
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border border-violet-500/20 rounded-xl p-5 hover:border-violet-500/40 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0 mt-1">
                          <CheckCircle className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">
                            Uma resposta ideal
                          </h4>
                          <p className="text-sm text-slate-400">
                            Usada apenas internamente para avaliação
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border border-violet-500/20 rounded-xl p-5 hover:border-violet-500/40 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0 mt-1">
                          <TrendingUp className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">
                            Um nível de dificuldade
                          </h4>
                          <p className="text-sm text-slate-400">
                            Easy, Medium ou Hard
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-4 mt-4">
                    <p className="text-sm text-violet-200">
                      <Sparkles className="w-4 h-4 inline mr-2" />
                      Isso inicia uma <strong>Seção</strong>, onde você será
                      orientado passo a passo.
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
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
                  <span className="text-2xl font-bold text-white">02</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-blue-400" />
                  Receba uma pergunta aberta da IA
                </h2>
                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed text-lg">
                    Diferente do Quiz Evolutivo, aqui a pergunta{" "}
                    <span className="text-blue-400 font-semibold">
                      não tem alternativas
                    </span>
                    .
                  </p>

                  <div className="bg-slate-900/50 border border-blue-500/20 rounded-xl p-6">
                    <h4 className="font-semibold text-blue-300 mb-4">
                      Exemplos de perguntas:
                    </h4>
                    <div className="space-y-3">
                      {[
                        "Explique como funciona o event loop do JavaScript.",
                        "Por que o feedback negativo é essencial para homeostase?",
                        "Qual a diferença entre correlação e causalidade?",
                      ].map((q, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-4"
                        >
                          <span className="text-blue-400 font-bold shrink-0">
                            •
                          </span>
                          <p className="text-slate-300 italic">"{q}"</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-sm text-blue-200">
                      <BookOpen className="w-4 h-4 inline mr-2" />A pergunta
                      aparece na sua sessão e fica registrada.
                    </p>
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
                  <PenTool className="w-8 h-8 text-amber-400" />
                  Você responde com suas próprias palavras
                </h2>
                <div className="space-y-4">
                  <div className="bg-linear-to-r from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-2xl p-6">
                    <p className="text-amber-100 text-lg font-medium mb-2">
                      ✨ Aqui é onde a mágica acontece.
                    </p>
                    <p className="text-slate-300 leading-relaxed">
                      Você escreve sua resposta{" "}
                      <span className="text-amber-400 font-semibold">
                        livremente
                      </span>{" "}
                      — curta ou longa, simples ou detalhada. É seu momento de
                      realmente mostrar o que sabe (ou descobrir o que não sabe
                      ainda).
                    </p>
                  </div>

                  <div className="bg-slate-900/50 border border-amber-500/20 rounded-xl p-6">
                    <h4 className="font-semibold text-amber-300 mb-4">
                      Sua resposta é salva, que inclui:
                    </h4>
                    <div className="grid gap-3">
                      {[
                        {
                          label: "Sua resposta",
                          desc: "O que você escreveu",
                          icon: "📝",
                        },
                        {
                          label: "Pontuação",
                          desc: "Nota de 0 a 100",
                          icon: "🎯",
                        },
                        {
                          label: "Feedback",
                          desc: "Análise detalhada da IA",
                          icon: "💬",
                        },
                        {
                          label: "Pontos faltantes",
                          desc: "O que faltou para atingir a resposta ideal",
                          icon: "🔍",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-3 bg-slate-800/50 rounded-lg p-3"
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <div className="flex-1">
                            <code className="text-amber-400 font-semibold">
                              {item.label}
                            </code>
                            <span className="text-slate-500 mx-2">—</span>
                            <span className="text-slate-400 text-sm">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
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
                  <BarChart3 className="w-8 h-8 text-emerald-400" />
                  Avaliação imediata da IA
                </h2>
                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed text-lg mb-6">
                    Assim que você envia sua resposta, a IA realiza uma análise
                    completa:
                  </p>

                  <div className="space-y-3">
                    <div className="bg-slate-900/50 border-l-4 border-emerald-500 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-white mb-2">
                            Lê e interpreta seu texto
                          </h4>
                          <p className="text-slate-400 text-sm">
                            Analisa clareza, organização, erros e acertos.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border-l-4 border-emerald-500 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-white mb-2">
                            Compara com a resposta ideal
                          </h4>
                          <p className="text-slate-400 text-sm">
                            Sem te mostrar diretamente, a IA usa o modelo
                            interno de resposta gerado para saber o que deveria
                            estar presente na explicação.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border-l-4 border-emerald-500 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-white mb-2">
                            Gera um score de 0 a 100
                          </h4>
                          <div className="space-y-2 mt-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                              <span className="text-emerald-400 font-semibold">
                                80–100:
                              </span>
                              <span className="text-slate-400 text-sm">
                                compreensão sólida
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                              <span className="text-amber-400 font-semibold">
                                50–79:
                              </span>
                              <span className="text-slate-400 text-sm">
                                entendimento parcial com pontos faltando
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                              <span className="text-rose-400 font-semibold">
                                0–49:
                              </span>
                              <span className="text-slate-400 text-sm">
                                resposta insuficiente ou incompleta
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border-l-4 border-emerald-500 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-white mb-2">
                            Produz um feedback personalizado
                          </h4>
                          <div className="mt-3 space-y-2">
                            <div className="bg-slate-800/50 rounded-lg p-3">
                              <p className="text-slate-300 text-sm italic">
                                "Sua explicação está correta, mas faltou
                                mencionar o papel da fila de microtasks."
                              </p>
                            </div>
                            <div className="bg-slate-800/50 rounded-lg p-3">
                              <p className="text-slate-300 text-sm italic">
                                "Ótima clareza! Mas você confundiu correlação
                                com causalidade — a resposta ideal explica que A
                                pode não causar B."
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border-l-4 border-emerald-500 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-white mb-2">
                            Aponta o que faltou
                          </h4>
                          <p className="text-slate-400 text-sm mb-2">
                            Em{" "}
                            <code className="bg-emerald-500/20 px-2 py-1 rounded text-emerald-300">
                              Pontos faltantes
                            </code>
                            , a IA descreve itens que deveriam ter sido
                            mencionados.
                          </p>
                          <p className="text-slate-400 text-sm">
                            Isso ajuda a ajustar exatamente o que está faltando
                            na sua aprendizagem.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 05 */}
          <div className="mb-8">
            <div className="flex items-start gap-6 mb-6">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-pink-600 to-rose-600 flex items-center justify-center shadow-xl shadow-pink-500/30">
                  <span className="text-2xl font-bold text-white">05</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                  <Award className="w-8 h-8 text-pink-400" />
                  Finalização da sessão
                </h2>
                <div className="space-y-4">
                  <p className="text-slate-300 leading-relaxed text-lg mb-4">
                    Depois de gerar o feedback:
                  </p>

                  <div className="bg-slate-900/50 border border-pink-500/20 rounded-xl p-6">
                    <div className="space-y-4">
                      {[
                        { icon: "✅", text: "A sessão muda fica completa" },
                        {
                          icon: "💾",
                          text: "Registramos a nota, o feedback e o que faltou",
                        },
                        {
                          icon: "🔄",
                          text: "Você pode iniciar uma nova pergunta sempre que quiser",
                        },
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
                </div>
              </div>
            </div>
          </div>

          {/* Why Section */}
          <div className="bg-linear-to-br from-fuchsia-900/40 via-purple-900/30 to-pink-900/40 border-2 border-fuchsia-500/40 rounded-3xl p-8 shadow-2xl shadow-fuchsia-500/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Por que o Explique & Aprenda é poderoso?
                </h2>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                {
                  icon: "🎓",
                  title: "Aprenda explicando",
                  desc: "Uma das técnicas mais eficazes da ciência da aprendizagem",
                },
                {
                  icon: "👨‍🏫",
                  title: "IA como professor",
                  desc: "Corrige seu raciocínio, não só a resposta",
                },
                {
                  icon: "🔍",
                  title: "Entendimento profundo",
                  desc: "Você entende não só o que errou, mas por quê errou",
                },
                {
                  icon: "💼",
                  title: "Aplicação prática",
                  desc: "Ideal para treinar entrevistas, provas discursivas e clareza mental",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/50 border border-fuchsia-500/20 rounded-xl p-5 hover:border-fuchsia-500/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-fuchsia-300 text-lg mb-1">
                        {item.title}
                      </h4>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ExplainQuestionDocumentation = memo(
  ExplainLearnDocumentationComponent
);
ExplainQuestionDocumentation.displayName = "ExplainQuestionDocumentation";
