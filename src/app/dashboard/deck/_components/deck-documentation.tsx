import { useDeckDocumentation } from "@/features/deck/hooks/use-deck-documentation";
import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  Layers,
  Lightbulb,
  RefreshCw,
  Sparkles,
  Star,
  Tags,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

import { memo } from "react";

const DeckDocumentationComponent = () => {
  const { open } = useDeckDocumentation();

  return (
    <>
      {open && (
        <div className="border-b border-white/10 bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 backdrop-blur-xl rounded-4xl">
          <div className="max-w-7xl mx-auto max-sm:p-4 max-sm:py-8 lg:p-8">
            {/* Header principal */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold">Sistema de Decks</h2>
              </div>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Entenda como funciona toda a estrutura de estudos: decks,
                flashcards, IA, sessões de revisão e muito mais.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Seção 1: O que são Decks */}
              <div className="space-y-6 bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Layers className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">O que são Decks?</h3>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Decks são suas pastas de estudos. Cada deck organiza
                  flashcards sobre um tema específico e acompanha toda sua
                  evolução.
                </p>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Tags className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-blue-400">Nome e Tags</p>
                      <p className="text-sm text-slate-400">
                        Identifique e organize seus decks com palavras-chave
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <BarChart3 className="w-5 h-5 text-purple-400 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-purple-400">
                        Estatísticas
                      </p>
                      <p className="text-sm text-slate-400">
                        Acompanhe quantas revisões você já fez e sua evolução
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Target className="w-5 h-5 text-pink-400 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-pink-400">Dificuldade</p>
                      <p className="text-sm text-slate-400">
                        Classificação geral: Fácil, Médio ou Difícil
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 2: Flashcards */}
              <div className="space-y-6 bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold">Flashcards</h3>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Cada flashcard é o conteúdo que você realmente estuda. Frente
                  com pergunta, verso com resposta.
                </p>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <BookOpen className="w-5 h-5 text-blue-400 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-blue-400">
                        Frente e Verso
                      </p>
                      <p className="text-sm text-slate-400">
                        Pergunta na frente, resposta no verso
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Brain className="w-5 h-5 text-purple-400 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-purple-400">
                        Nível de Bloom
                      </p>
                      <p className="text-sm text-slate-400">
                        Define a profundidade: lembrar, entender, aplicar
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Heart className="w-5 h-5 text-pink-400 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-pink-400">
                        Notas Pessoais
                      </p>
                      <p className="text-sm text-slate-400">
                        Adicione comentários e observações próprias
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 3: Sistema de Repetição Espaçada */}
              <div className="space-y-6 bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold">
                    Repetição Espaçada (SRS)
                  </h3>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  O app usa um sistema inteligente que mostra os cards na hora
                  certa para você memorizar de verdade.
                </p>

                <div className="bg-linear-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                  <h4 className="font-bold text-green-400 mb-3">
                    Como funciona:
                  </h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      ⭐ <span className="font-semibold">Facilidade:</span>{" "}
                      Ajusta conforme seus acertos
                    </p>
                    <p>
                      🗓️ <span className="font-semibold">Intervalo:</span> Dias
                      até próxima revisão
                    </p>
                    <p>
                      🔁 <span className="font-semibold">Repetição:</span>{" "}
                      Quantas vezes você revisou
                    </p>
                    <p>
                      📆 <span className="font-semibold">Próxima Revisão:</span>{" "}
                      Calculada automaticamente
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm bg-white/5 rounded-lg p-3">
                  <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0" />
                  <p className="text-muted-foreground">
                    Quanto mais você acerta, mais tempo até rever o card!
                  </p>
                </div>
              </div>

              {/* Seção 4: IA Generator */}
              <div className="space-y-6 bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-bold">Geração por IA</h3>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Crie flashcards automaticamente! A IA entende seu estilo e
                  gera conteúdo personalizado para você.
                </p>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-linear-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-pink-400">Você pede</p>
                      <p className="text-sm text-slate-400">
                        Descreve o que quer estudar
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-linear-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-purple-400">IA gera</p>
                      <p className="text-sm text-slate-400">
                        Cria cards relevantes e inteligentes
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-blue-400">
                        Você escolhe
                      </p>
                      <p className="text-sm text-slate-400">
                        Aceita ou edita como quiser
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-pink-400">
                      ✨ A IA aprende:
                    </span>{" "}
                    Quanto mais você usa, melhor ela fica em criar conteúdo do
                    seu jeito!
                  </p>
                </div>
              </div>

              {/* Seção 5: Sessões de Estudo */}
              <div className="space-y-6 bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold">Sessões de Estudo</h3>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  Toda vez que você estuda, o app registra tudo: tempo, acertos,
                  erros e progresso.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-semibold text-blue-400">
                        DURAÇÃO
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tempo total estudado
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-semibold text-green-400">
                        ACERTOS
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Respostas corretas
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-semibold text-orange-400">
                        ERROS
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Para melhorar
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs font-semibold text-yellow-400">
                        COMPLETO
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sessão finalizada
                    </p>
                  </div>
                </div>
              </div>

              {/* Seção 6: Histórico e Estatísticas */}
              <div className="space-y-6 bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">Histórico & Evolução</h3>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  O app registra cada resposta e acompanha sua evolução ao longo
                  do tempo.
                </p>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Star className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-yellow-400">
                        Nota de Desempenho
                      </p>
                      <p className="text-sm text-slate-400">
                        Cada resposta é avaliada de 0 a 5
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Calendar className="w-5 h-5 text-purple-400 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-purple-400">
                        Data e Hora
                      </p>
                      <p className="text-sm text-slate-400">
                        Registra exatamente quando você estudou
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <TrendingUp className="w-5 h-5 text-green-400 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-green-400">
                        Média de Performance
                      </p>
                      <p className="text-sm text-slate-400">
                        Acompanha sua evolução em cada card
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-white/10">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-white">
                      📊 Insights:
                    </span>{" "}
                    O app usa seu histórico para criar recomendações
                    personalizadas e melhorar seu aprendizado!
                  </p>
                </div>
              </div>
            </div>

            {/* Seção final: Benefícios */}
            <div className="mt-8 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold">Por que isso funciona?</h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <h4 className="font-bold text-blue-400 mb-2">
                    Reforço Ativo
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Repetição espaçada científica
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-purple-400" />
                  </div>
                  <h4 className="font-bold text-purple-400 mb-2">
                    Personalizado
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Adapta-se ao seu ritmo
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-6 h-6 text-pink-400" />
                  </div>
                  <h4 className="font-bold text-pink-400 mb-2">
                    IA Inteligente
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Aprende com você
                  </p>
                </div>

                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-green-400" />
                  </div>
                  <h4 className="font-bold text-green-400 mb-2">
                    Resultados Reais
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Evolução mensurável
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const DeckDocumentation = memo(DeckDocumentationComponent);
DeckDocumentation.displayName = "DeckDocumentation";
