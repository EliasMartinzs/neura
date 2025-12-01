"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function useBlockNavigation(enabled: boolean) {
  const router = useRouter();
  const [nextHref, setNextHref] = useState<string | null>(null);

  const blockingRef = useRef(enabled);
  blockingRef.current = enabled;

  //
  // 🔥 BLOQUEAR CLIQUES EM LINKS
  //
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      if (href.startsWith("http")) return;

      event.preventDefault();
      event.stopPropagation();

      setNextHref(href);
    };

    document.addEventListener("click", handleClick, true);

    return () => document.removeEventListener("click", handleClick, true);
  }, [enabled]);

  //
  // 🔥 BLOQUEAR O BOTÃO VOLTAR / AVANÇAR DO NAVEGADOR
  //
  useEffect(() => {
    if (!enabled) return;

    // empurra um estado falso no histórico
    history.pushState(null, "", window.location.href);

    const onPopState = () => {
      // Impede voltar no navegador
      history.pushState(null, "", window.location.href);

      // dispara modal para o usuário
      setNextHref("__BACK__");
    };

    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, [enabled]);

  //
  // Ações do modal
  //
  const confirmLeave = () => {
    if (!nextHref) return;

    const href = nextHref;
    setNextHref(null);

    if (href === "__BACK__") {
      // volta realmente
      window.onbeforeunload = null; // caso tenha sido ativado
      history.back();
      return;
    }

    router.push(href);
  };

  const cancelLeave = () => setNextHref(null);

  return {
    shouldConfirm: !!nextHref,
    confirmLeave,
    cancelLeave,
  };
}
