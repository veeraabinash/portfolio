"use client";

import { useState } from "react";
import { services } from "@/data/content";
import { Icon } from "./icons";

function DashedSides() {
  return (
    <svg className="what-dash" width="100%" height="100%" aria-hidden="true">
      <line x1="0" y1="0" x2="0" y2="100%" />
      <line x1="100%" y1="0" x2="100%" y2="100%" />
    </svg>
  );
}

export default function WhatIDo() {
  const [active, setActive] = useState(null);

  // Hover on desktop, tap to toggle on touch screens.
  const toggle = (i) => setActive((cur) => (cur === i ? null : i));

  return (
    <section className="whatIDO">
      <div className="what-spacer" aria-hidden="true" />
      <div className="what-main">
        <h2 className="what-title">
          W<span className="hat-h2">HAT</span>
          <br />I <span className="do-h2">DO</span>
        </h2>

        <div className="what-box">
          <DashedSides />
          {services.map((s, i) => (
            <div
              key={s.title}
              className={`what-content ${active === i ? "what-content-active" : ""} ${active !== null && active !== i ? "what-sibling" : ""}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => toggle(i)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggle(i)}
              role="button"
              tabIndex={0}
              aria-expanded={active === i}
            >
              <span className="what-corner" aria-hidden="true" />
              <div className="what-content-in">
                <h3>{s.title}</h3>
                <h4>{s.subtitle}</h4>
                <p>{s.text}</p>
                <h5>Skillset &amp; tools</h5>
                <div className="what-tags">
                  {s.tags.map((t) => (
                    <span key={t} className="what-tag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="what-arrow">
                  <Icon name="arrow" size={26} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
