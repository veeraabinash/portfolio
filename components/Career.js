"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { career } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

export default function Career() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: { trigger: ".career-section", start: "top 50%", end: "bottom 30%", scrub: 1.5, invalidateOnRefresh: true },
        })
        .fromTo(".career-timeline", { height: "0%", opacity: 0 }, { height: "100%", opacity: 1, duration: 1, ease: "none" }, 0)
        .fromTo(".career-info-box", { opacity: 0, y: 40 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 }, 0);
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section className="career-section section-container" ref={ref}>
      <h2 className="title">
        My career <span>&amp;</span>
        <br /> experience
      </h2>
      <div className="career-info">
        <div className="career-timeline" aria-hidden="true">
          <div className="career-dot" />
        </div>
        {career.map((c) => (
          <div className="career-info-box" key={c.role}>
            <div className="career-info-in">
              <div className="career-role">
                <h4>{c.role}</h4>
                <h5>{c.place}</h5>
              </div>
              <h3>{c.year}</h3>
            </div>
            <p>{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
