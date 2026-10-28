"use client";

import { useEffect, useRef } from "react";
import { useSite } from "./SiteContext";

export default function CharacterModel() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const { setModelReady, entered } = useSite();

  useEffect(() => {
    let cancelled = false;
    import("@/lib/character/scene")
      .then(({ createCharacterScene }) => createCharacterScene(containerRef.current))
      .then((api) => {
        if (cancelled) return api.dispose();
        sceneRef.current = api;
      })
      .catch((err) => console.error("3D character failed to load:", err))
      // never leave the loader stuck, even without the 3D scene
      .finally(() => !cancelled && setModelReady(true));
    return () => {
      cancelled = true;
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [setModelReady]);

  useEffect(() => {
    if (entered) sceneRef.current?.startIntro();
  }, [entered]);

  return <div className="character-model" ref={containerRef} aria-hidden="true" />;
}
