"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BloomLevelGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-foreground py-10">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold">Guia Completo do Nível Bloom</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Entenda como cada nível da <strong>Taxonomia de Bloom</strong> pode
          transformar a forma como você cria perguntas, atividades e desafios.
          Descubra como sair do básico e levar o aprendizado — e o raciocínio —
          a um novo patamar.
        </p>
      </div>

      <Card className="border">
        <CardHeader>
          <CardTitle>O que é o Bloom Level?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            O Bloom Level é uma forma de medir o{" "}
            <strong>nível cognitivo</strong> de uma tarefa ou pergunta. Criado
            por Benjamin Bloom, ele organiza o pensamento humano em seis níveis
            — do mais simples ao mais complexo.
          </p>
          <p>
            Isso é essencial para quem quer{" "}
            <strong>criar perguntas, atividades ou flashcards</strong> que
            realmente estimulem o aprendizado. Em vez de só lembrar respostas, o
            aluno passa a pensar, aplicar, analisar e criar conhecimento.
          </p>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle>Como usar na prática</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            A ideia é simples: cada pergunta, exercício ou explicação pode ser
            classificada em um nível Bloom. Perguntas mais simples testam{" "}
            <strong>memória e compreensão</strong>, enquanto as mais
            desafiadoras exigem
            <strong>análise, julgamento ou criação</strong>.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>
              Comece com <strong>níveis baixos</strong> (Lembrar, Entender) para
              revisar o conteúdo e garantir que o básico esteja claro.
            </li>
            <li>
              Depois, avance para <strong>níveis intermediários</strong>{" "}
              (Aplicar, Analisar) que forçam o aluno a conectar e usar ideias.
            </li>
            <li>
              Por fim, use <strong>níveis altos</strong> (Avaliar, Criar) para
              desenvolver pensamento crítico e originalidade.
            </li>
          </ul>

          <p>
            O segredo é misturar níveis diferentes: perguntas fáceis constroem
            base, e perguntas desafiadoras consolidam o aprendizado.
          </p>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle>Tabela dos Níveis de Bloom</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="border text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Nível de Bloom</TableHead>
                <TableHead>Verbos-chave (palavras-chave)</TableHead>
                <TableHead>Exemplo de objetivo de aprendizagem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Criar</TableCell>
                <TableCell>
                  projetar, formular, construir, inventar, criar, compor, gerar,
                  derivar, modificar, desenvolver.
                </TableCell>
                <TableCell>
                  Elaborar um problema original sobre o princípio da conservação
                  de energia.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Avaliar</TableCell>
                <TableCell>
                  escolher, apoiar, relacionar, determinar, defender, julgar,
                  classificar, comparar, justificar, argumentar.
                </TableCell>
                <TableCell>
                  Determinar se o uso da conservação de energia ou do momento
                  linear é mais apropriado em um problema de dinâmica.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Analisar</TableCell>
                <TableCell>
                  classificar, decompor, categorizar, ilustrar, criticar,
                  simplificar, associar.
                </TableCell>
                <TableCell>
                  Diferenciar entre energia potencial e energia cinética em um
                  sistema físico.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Aplicar</TableCell>
                <TableCell>
                  calcular, prever, aplicar, resolver, usar, demonstrar,
                  determinar, modelar, executar.
                </TableCell>
                <TableCell>
                  Calcular a energia cinética de um projétil em movimento.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Entender</TableCell>
                <TableCell>
                  descrever, explicar, reformular, resumir, interpretar,
                  discutir.
                </TableCell>
                <TableCell>
                  Explicar as três leis do movimento de Newton com suas próprias
                  palavras.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Lembrar</TableCell>
                <TableCell>
                  listar, recitar, definir, nomear, citar, identificar,
                  reconhecer.
                </TableCell>
                <TableCell>
                  Recitar as três leis do movimento de Newton corretamente.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <p className="text-xs italic text-foreground/70 mt-3">
            Exemplos adaptados de Nelson Baker, Georgia Tech:
            nelson.baker@pe.gatech.edu
          </p>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader>
          <CardTitle>Transforme o aprendizado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            Usar o Bloom Level não é só teoria — é estratégia. Ele te ajuda a
            entender **o que está sendo pedido** e a **como evoluir**.
          </p>
          <p>
            Se você é aluno, use o Bloom para saber **o tipo de raciocínio** que
            a pergunta quer. Se é professor, use para criar atividades que
            realmente desafiem o pensamento.
          </p>
          <p>
            Quanto mais alto o nível, mais a pessoa **transforma conhecimento em
            habilidade**. E é aí que o aprendizado deixa de ser memorização e
            vira **domínio real**.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
