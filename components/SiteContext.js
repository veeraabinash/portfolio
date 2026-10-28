"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initSmoothScroll } from "@/lib/smoothScroll";
import { initialFX } from "@/lib/initialFX";
import { setupTextReveals } from "@/lib/textReveal";

const SiteContext = createContext(null);

export function useSite() {
  return useContext(SiteContext);
}

export default function SiteProvider({ children }) {
  const [modelReady, setModelReady] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    initSmoothScroll();
  }, []);

  useEffect(() => {
    if (!entered) return;
    document.documentElement.classList.remove("is-loading");
    document.body.classList.add("site-entered");
    initSmoothScroll().start();
    const stopFX = initialFX();
    const stopReveals = setupTextReveals();
    ScrollTrigger.refresh();
    return () => {
      stopFX();
      stopReveals();
    };
  }, [entered]);

  return (
    <SiteContext.Provider value={{ modelReady, setModelReady, entered, setEntered }}>
      {children}
    </SiteContext.Provider>
  );
}
