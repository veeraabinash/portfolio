"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { works } from "@/data/content";

gsap.registerPlugin(ScrollTrigger);

function ProjectPreview({ title }) {
  return (
    <div className="work-image">
      <div className="work-image-in">
        <div className="mock-bar">
          <i />
          <i />
          <i />
          <span className="mock-url">{title.toLowerCase().replace(/\s+/g, "-")}.app</span>
        </div>
        <div className="mock-body">
          <span className="mock-title">{title}</span>
          <span className="mock-line" />
          <span className="mock-line short" />
          <div className="mock-grid">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Work() {
  const sectionRef = useRef(null);
  const flexRef = useRef(null);

  // Desktop: pin the section and translate the cards sideways while scrolling.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1025px)", () => {
      const distance = () => flexRef.current.scrollWidth - sectionRef.current.querySelector(".work-container").clientWidth;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(flexRef.current, { x: () => -distance(), ease: "none" });
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="work-section" id="work" ref={sectionRef}>
      <div className="work-container section-container">
        <h2 className="title">
          My <span>Work</span>
        </h2>
        <div className="work-flex" ref={flexRef}>
          {works.map((w, i) => (
            <article className="work-box" key={w.title}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{i + 1}</h3>
                  <div>
                    <h4>{w.title}</h4>
                    <p>{w.category}</p>
                  </div>
                </div>
                <p className="work-desc">{w.text}</p>
                <h4>Tools and features</h4>
                <p>{w.tools}</p>
              </div>
              <ProjectPreview title={w.title} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
