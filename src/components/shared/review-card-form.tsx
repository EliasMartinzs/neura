import { GRADES } from "@/constants/grades";
import { useCreateReview } from "@/features/study/api/use-create-review";
import { cn } from "@/lib/utils";
import {
  ReviewFlashcardForm,
  reviewFlashcardSchema,
} from "@/schemas/review-flashcard";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brain, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

export const ReviewCardForm = ({
  sessionId,
  flashcardId,
  bg,
  setIsFlipped,
  nextCard,
}: {
  sessionId: string;
  flashcardId: string;
  bg: string;
  setIsFlipped: (prev: boolean) => void;
  nextCard?: () => void;
}) => {
  const form = useForm<ReviewFlashcardForm>({
    resolver: zodResolver(reviewFlashcardSchema),
    defaultValues: {
      sessionId: sessionId,
      flashcardId: flashcardId,
      grade: undefined,
      timeToAnswer: 0,
    },
  });

  const { mutate, isPending } = useCreateReview();

  const isLoading = form.formState.isSubmitting || isPending;
  const isGradeSelected = form.watch("grade");

  async function handleSendReview(data: ReviewFlashcardForm) {
    mutate(data, {
      onSuccess: () => {
        setIsFlipped(false);
        nextCard?.();
        form.reset();
      },
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <p className="text-center font-medium text-lg">Avalie seu conhecimento</p>

      <Form {...form}>
        <form className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-3">
                      {GRADES.map(({ color, icon, label, value }) => {
                        const Icon = icon;

                        return (
                          <button
                            key={value}
                            className={cn(
                              "rounded-xl p-6 font-medium border hover:scale-105 transition-all duration-200 cursor-pointer",
                              color
                            )}
                            value={field.value}
                            onClick={() => {
                              field.onChange(value);
                              form.handleSubmit(handleSendReview)();
                            }}
                            type="button"
                          >
                            <div className="flex items-center flex-col gap-3">
                              <Icon
                                className={cn(
                                  isGradeSelected === value && "text-white"
                                )}
                              />{" "}
                              <span
                                className={cn(
                                  isGradeSelected === value && "text-white"
                                )}
                              >
                                {label}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>

      <div className="mt-6 p-5 rounded-2xl backdrop-blur-sm">
        <p className="text-center flex items-center justify-center gap-2">
          <Brain className="w-4 h-4" />
          Sistema de repetição espaçada (SM-2) ativo
        </p>
      </div>
    </div>
  );
};
