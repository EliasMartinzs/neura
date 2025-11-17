import {
  createFlashcardGenerationForm,
  createFlashcardGenerationSchema,
} from "@/schemas/create-flashcard-generattion.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function useCreateFlashcardGenerationForm({
  deckId,
}: {
  deckId?: string;
}) {
  const [step, setStep] = useState(deckId ? 2 : 1);

  const form = useForm<createFlashcardGenerationForm>({
    resolver: zodResolver(createFlashcardGenerationSchema),
    mode: "onTouched",
    defaultValues: {
      deckId: deckId || "",
      prompt: "",
      topic: "",
      subtopic: "",
      difficulty: "MEDIUM",
      bloomLevel: "UNDERSTAND",
      generationMode: "SIMPLE",
      amount: 5,
    },
  });

  const {
    trigger,
    formState: { errors },
    setFocus,
  } = form;

  /** Campos por etapa */
  const stepFields: Record<number, (keyof createFlashcardGenerationForm)[]> = {
    1: ["deckId"],
    2: ["prompt", "topic", "subtopic", "amount"],
    3: ["difficulty", "bloomLevel", "generationMode"],
  };

  /** Valida apenas os campos do passo atual */
  const validateStep = async () => {
    const fields = stepFields[step];
    const valid = await trigger(fields);
    if (!valid) {
      const firstError = Object.keys(errors)[0];
      if (firstError)
        setFocus(firstError as keyof createFlashcardGenerationForm);
    }
    return valid;
  };

  /** Avança etapa se válido */
  const nextStep = async () => {
    const valid = await validateStep();
    if (!valid) return false;
    setStep((prev) => Math.min(prev + 1, 3));
    return true;
  };

  /** Volta etapa */
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return {
    form,
    step,
    nextStep,
    prevStep,
    stepFields,
    isLastStep: step === 3,
  };
}
