"use client";

import { useEffect, useRef, useState } from "react";
import { useSite } from "./SiteContext";

const marquee = "Web Developer · React JS · Next JS · Redux · ";

export default function Loader() {
  const { modelReady, setEntered } = useSite();
  const [percent, setPercent] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(false);
  const wrapRef = useRef(null);

  // Count up to 90% on our own, the last 10% waits for the 3D model.
  useEffect(() => {
    const id = setInterval(() => {
      setPercent((p) => {
        const cap = modelReady ? 100 : 90;
        if (p >= cap) return p;
        return Math.min(cap, p + Math.round(Math.random() * 6) + 1);
      });
    }, 90);
    return () => clearInterval(id);
  }, [modelReady]);

  const ready = percent >= 100;

  const enter = () => {
    if (!ready || clicked) return;
    setClicked(true);
    setTimeout(() => setEntered(true), 900);
    setTimeout(() => setHidden(true), 1700);
  };

  const trackMouse = (e) => {
    const rect = wrapRef.current.getBoundingClientRect();
    wrapRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    wrapRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  if (hidden) return null;

  return (
    <div className={`loading-screen ${clicked ? "loading-out" : ""}`}>
      <div className="loading-header">
        <span className="loading-logo">VM</span>
        <span className={`loading-status ${ready ? "is-ready" : ""}`}>{ready ? "Ready" : "Preparing scene"}</span>
      </div>

      <div className="loading-marquee" aria-hidden="true">
        <div className="loading-marquee-track">
          <span>{marquee.repeat(3)}</span>
          <span>{marquee.repeat(3)}</span>
        </div>
      </div>

      <div
        ref={wrapRef}
        className={`loading-wrap ${ready ? "loading-complete" : ""} ${clicked ? "loading-clicked" : ""}`}
        onMouseMove={trackMouse}
      >
        <div className="loading-hover" />
        <button type="button" className="loading-button" onClick={enter} disabled={!ready} aria-label={ready ? "Enter site" : `Loading ${percent}%`}>
          <span className="loading-label">
            {ready ? (
              <>
                Welcome
                <span className="loading-icon" aria-hidden="true">→</span>
              </>
            ) : (
              <>
                Loading <span className="loading-percent">{percent}%</span>
                <span className="loading-box" />
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
