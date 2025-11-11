import {
  CreateFlashcardForm,
  createFlashcardSchema,
} from "@/schemas/create-flashcard.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { BloomLevel, FlashcardDifficulty } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function useCreateFlashcardForm() {
  const [step, setStep] = useState(1);

  const form = useForm<CreateFlashcardForm>({
    resolver: zodResolver(createFlashcardSchema),
    mode: "onTouched",
    defaultValues: {
      deckId: "",
      front: "",
      back: "",
      topic: "",
      subtopic: "",
      difficulty: FlashcardDifficulty.EASY,
      bloomLevel: BloomLevel.REMEMBER,
      note: "",
      color: "",
    },
  });

  const {
    trigger,
    formState: { errors },
    setFocus,
  } = form;

  /** Campos por etapa */
  const stepFields: Record<number, (keyof CreateFlashcardForm)[]> = {
    1: ["deckId"],
    2: ["front", "back"],
    3: ["topic", "subtopic", "difficulty", "bloomLevel", "note", "color"],
  };

  /** Valida apenas os campos do passo atual */
  const validateStep = async () => {
    const fields = stepFields[step];
    // ✅ trigger aceita diretamente o array tipado
    const valid = await trigger(fields);
    if (!valid) {
      const firstError = Object.keys(errors)[0];
      if (firstError) setFocus(firstError as keyof CreateFlashcardForm);
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
