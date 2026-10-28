"use client";

import { useEffect, useRef } from "react";

// Soft circle that trails the pointer and grows over links/buttons.
export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const el = ref.current;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;
    let frame;

    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      const hovering = e.target.closest("a, button");
      el.classList.toggle("cursor--hover", Boolean(hovering));
    };

    const tick = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      el.style.transform = `translate(${cx}px, ${cy}px)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move);
    frame = requestAnimationFrame(tick);
    el.style.opacity = "1";
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="cursor" aria-hidden="true" />;
}
