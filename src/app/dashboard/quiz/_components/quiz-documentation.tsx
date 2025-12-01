import { useQuizDocumentation } from "@/features/quiz/hooks/use-quiz-documentation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MessageSquare,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { memo, useMemo, useState } from "react";

const QuizDocumentationComponent = () => {
  const { open } = useQuizDocumentation();
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const sections = useMemo(
    () => [
      {
        id: "theme",
        number: "01",
        icon: Target,
        title: "Escolha do Tema",
        color: "from-violet-500 to-purple-600",
        bgColor: "violet",
        content: (
          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              Antes de iniciar, você define o caminho do seu aprendizado:
            </p>
            <div className="space-y-3">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-violet-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Tópico Principal
                    </h4>
                    <p className="text-sm text-slate-400">
                      Ex.: JavaScript, Anatomia, Marketing Digital
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-violet-500/20">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                    <ChevronRight className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      Subtópico{" "}
                      <span className="text-slate-500 text-sm">(opcional)</span>
                    </h4>
                    <p className="text-sm text-slate-400">
                      Ex.: Promises, Sistema Nervoso, Funil de Vendas
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-linear-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-xl p-4">
              <p className="text-sm text-violet-200">
                <Sparkles className="w-4 h-4 inline mr-2" />
                Isso ajuda a IA a criar perguntas realmente focadas no que você
                quer aprender.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "config",
        number: "02",
        icon: Zap,
        title: "Configurações da Sessão",
        color: "from-amber-500 to-orange-600",
        bgColor: "amber",
        content: (
          <div className="space-y-5">
            <p className="text-slate-300 leading-relaxed">
              Personalize a forma como quer aprender:
            </p>

            {/* Dificuldade */}
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                Dificuldade do Quiz
              </h4>
              <div className="grid gap-2">
                {[
                  {
                    level: "EASY",
                    label: "Fácil",
                    desc: "Perguntas diretas e simples",
                    color: "emerald",
                  },
                  {
                    level: "MEDIUM",
                    label: "Médio",
                    desc: "Exige mais interpretação",
                    color: "amber",
                  },
                  {
                    level: "HARD",
                    label: "Difícil",
                    desc: "Raciocínio profundo e avançado",
                    color: "rose",
                  },
                ].map((item) => (
                  <div
                    key={item.level}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-${item.color}-400 font-bold text-sm`}
                      >
                        {item.label}
                      </span>
                      <span className="text-slate-500">—</span>
                      <span className="text-sm text-slate-400">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estilo */}
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                Estilo das Perguntas
              </h4>
              <div className="grid gap-2">
                {[
                  { style: "DIRECT", label: "Direto", icon: "🎯" },
                  { style: "REAL_SCENARIO", label: "Cenário Real", icon: "🌍" },
                  { style: "TRICKY", label: "Pegadinhas", icon: "🎭" },
                  { style: "EXAM_LEVEL", label: "Nível Prova", icon: "📝" },
                ].map((item) => (
                  <div
                    key={item.style}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 flex items-center gap-3"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-medium text-slate-300">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipo de Explicação */}
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                Tipo de Explicação
              </h4>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 space-y-2">
                {[
                  { type: "SHORT", label: "Curta", desc: "Direto ao ponto" },
                  {
                    type: "DETAILED",
                    label: "Detalhada",
                    desc: "Passo a passo completo",
                  },
                  {
                    type: "ANALOGY",
                    label: "Analogia",
                    desc: "Comparações fáceis",
                  },
                  {
                    type: "PRACTICAL",
                    label: "Prática",
                    desc: "Exemplos aplicados",
                  },
                ].map((item) => (
                  <div
                    key={item.type}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm font-medium text-white">
                      {item.label}
                    </span>
                    <span className="text-xs text-slate-400">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "evolution",
        number: "03",
        icon: Rocket,
        title: "Modo EVOLUTION",
        color: "from-blue-500 to-cyan-600",
        bgColor: "blue",
        content: (
          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              Todas as sessões funcionam no modo{" "}
              <span className="text-cyan-400 font-bold">EVOLUTION</span>, criado
              para guiar você por uma sequência natural de aprendizado:
            </p>

            <div className="bg-linear-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-5">
              <h4 className="font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Etapas do Quiz
              </h4>
              <div className="space-y-3">
                {[
                  {
                    step: "1",
                    icon: Brain,
                    title: "CONCEPT",
                    label: "Conceito",
                    desc: "Entenda a base teórica",
                    color: "violet",
                  },
                  {
                    step: "2",
                    icon: Target,
                    title: "EXAMPLE",
                    label: "Exemplo",
                    desc: "Veja o conceito na prática",
                    color: "blue",
                  },
                  {
                    step: "3",
                    icon: TrendingUp,
                    title: "COMPARISON",
                    label: "Comparação",
                    desc: "Diferencie ideias similares",
                    color: "amber",
                  },
                  {
                    step: "4",
                    icon: Award,
                    title: "APPLICATION",
                    label: "Aplicação",
                    desc: "Use tudo para resolver problemas reais",
                    color: "emerald",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.step}
                      className="flex items-start gap-3 bg-slate-900/50 rounded-lg p-3 border border-slate-700/30"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-${item.color}-500/20 flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-4 h-4 text-${item.color}-400`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-xs font-bold text-${item.color}-400`}
                          >
                            {item.step}
                          </span>
                          <span className="text-sm font-semibold text-white">
                            {item.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
              <p className="text-sm text-blue-200">
                <Check className="w-4 h-4 inline mr-2" />
                Esse ciclo ajuda a fixar o conteúdo de maneira progressiva e
                inteligente.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "structure",
        number: "04",
        icon: MessageSquare,
        title: "Estrutura das Perguntas",
        color: "from-emerald-500 to-teal-600",
        bgColor: "emerald",
        content: (
          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              Cada pergunta é cuidadosamente estruturada para maximizar seu
              aprendizado:
            </p>

            <div className="space-y-3">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-emerald-500/20">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">
                      Enunciado Inteligente
                    </h4>
                    <p className="text-sm text-slate-400">
                      Criado pela IA especialmente para você
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">
                      4 Opções de Resposta
                    </h4>
                    <p className="text-sm text-slate-400">
                      Sendo apenas 1 correta
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">
                      Explicação Personalizada
                    </h4>
                    <p className="text-sm text-slate-400">
                      Baseada no tipo que você escolheu
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl p-4">
                <h4 className="font-semibold text-emerald-300 mb-3">
                  O que registramos:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Sua alternativa",
                    "Acerto ou erro",
                    "Horário da resposta",
                    "Explicação correspondente",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-slate-300"
                    >
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "tracking",
        number: "05",
        icon: BarChart3,
        title: "Acompanhamento",
        color: "from-pink-500 to-rose-600",
        bgColor: "pink",
        content: (
          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              Toda sessão possui um status para você acompanhar seu progresso:
            </p>

            <div className="space-y-3">
              {[
                {
                  status: "ACTIVE",
                  label: "Ativo",
                  desc: "Você está no meio da sessão",
                  color: "blue",
                  icon: "▶️",
                },
                {
                  status: "COMPLETED",
                  label: "Completo",
                  desc: "Todas as etapas finalizadas",
                  color: "emerald",
                  icon: "✅",
                },
                {
                  status: "ABANDONED",
                  label: "Abandonado",
                  desc: "Você saiu antes de concluir",
                  color: "slate",
                  icon: "⏸️",
                },
              ].map((item) => (
                <div
                  key={item.status}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white mb-1">
                        {item.label}
                      </h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-linear-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl p-4">
              <p className="text-sm text-pink-200">
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Seu progresso alimenta ciclos futuros de evolução, ajudando a IA
                a melhorar as próximas perguntas.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "difference",
        number: "06",
        icon: Sparkles,
        title: "Por Que é Diferente?",
        color: "from-fuchsia-500 to-purple-600",
        bgColor: "fuchsia",
        content: (
          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed mb-6">
              Este quiz foi projetado para ser uma experiência de aprendizado
              única e adaptativa:
            </p>

            <div className="space-y-3">
              {[
                {
                  icon: "🎯",
                  title: "Perguntas Personalizadas",
                  desc: "Cada pergunta é gerada especialmente para você, não é um banco fixo",
                },
                {
                  icon: "📈",
                  title: "Evolução Adaptativa",
                  desc: "A dificuldade se ajusta conforme seu desempenho em tempo real",
                },
                {
                  icon: "🧠",
                  title: "Aprendizado Completo",
                  desc: "Conceito + Prática + Comparação + Aplicação = Domínio real",
                },
                {
                  icon: "🎨",
                  title: "Seu Estilo",
                  desc: "Explicações no formato que você prefere aprender",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-linear-to-r from-fuchsia-500/10 to-purple-500/10 border border-fuchsia-500/20 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-fuchsia-300 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-linear-to-br from-fuchsia-600/20 to-purple-600/20 border-2 border-fuchsia-500/30 rounded-2xl p-6 mt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-fuchsia-500/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-fuchsia-300" />
                </div>
                <div>
                  <h4 className="font-bold text-fuchsia-200 text-lg mb-2">
                    Resultado?
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Um sistema que não apenas testa seu conhecimento, mas
                    constrói uma jornada de aprendizado progressiva, inteligente
                    e totalmente adaptada ao seu ritmo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            y: -99,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
          }}
          className="border-b border-white/10 bg-linear-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-xl rounded-4xl p-4 sm:p-8"
        >
          <div className="space-y-4">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isExpanded = openSections.includes(index);

              return (
                <div
                  key={section.id}
                  className="bg-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-slate-700/50 transition-all"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-linear-to-br ${section.color} flex items-center justify-center shadow-lg shrink-0`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-3 mb-1">
                          <span
                            className={`text-sm font-bold bg-linear-to-r ${section.color} bg-clip-text text-transparent`}
                          >
                            {section.number}
                          </span>
                          <h3 className="text-xl font-bold text-white">
                            {section.title}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-400">
                          {isExpanded
                            ? "Clique para recolher"
                            : "Clique para expandir"}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-slate-800/50 pt-6 animate-in slide-in-from-top duration-300">
                      {section.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const QuizDocumentation = memo(QuizDocumentationComponent);
QuizDocumentation.displayName = "QuizDocumentation";
