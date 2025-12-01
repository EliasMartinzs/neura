import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAnswerExplainQuestion } from "@/features/explain-learn/api/use-create-answer-explaoin-question";
import {
  createAnswerExplainQuestion,
  CreateAnswerExplainQuestion,
} from "@/schemas/create-asnwer-explain-question.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

type Props = {
  attempt: boolean;
  showInput: boolean;
  sessionId: string;
  question: {
    id: string;
    createdAt: string;
    difficulty: string | null;
    sessionId: string;
    content: string;
    idealAnswer: string | null;
  } | null;
};

export const QuestionItemForm = ({
  attempt,
  showInput,
  question,
  sessionId,
}: Props) => {
  const form = useForm<CreateAnswerExplainQuestion>({
    resolver: zodResolver(createAnswerExplainQuestion),
    defaultValues: {
      content: "",
      sessionId: "",
      userAnswer: "",
    },
  });

  const { mutate, isPending } = useCreateAnswerExplainQuestion();

  const isLoading = form.formState.isSubmitting || isPending;

  const handleCreateAnswer = useCallback(
    (data: CreateAnswerExplainQuestion) => {
      mutate(data, {
        onSuccess: () => form.reset(),
      });
    },
    [mutate, form]
  );

  return (
    <>
      {attempt && showInput && !isLoading && (
        <Form {...form}>
          <form
            className="w-full space-y-4 justify-center flex flex-col items-end"
            onSubmit={form.handleSubmit(handleCreateAnswer)}
          >
            <FormField
              control={form.control}
              name="userAnswer"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Sua resposta (Max: 2000 caracteres)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Digite sua reposta aqui..."
                      className="placeholder:text-base"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        if (e.target.value.length === 1) {
                          form.setValue("sessionId", sessionId);
                          form.setValue("content", question?.content as string);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {true && (
              <Button
                variant={"outline"}
                className="bg-linear-to-br from-orange-500 to-amber-500 rounded-lg shrink-0 font-bold"
                type="submit"
              >
                Enviar resposta
              </Button>
            )}
          </form>
        </Form>
      )}

      {isLoading && (
        <div className="p-4 w-full items-center flex justify-center gap-x-3 text-center animate-pulse">
          <Sparkles className="animate-pulse text-primary size-7" /> Estamos
          revisando sua resposta aguarde...
        </div>
      )}
    </>
  );
};
