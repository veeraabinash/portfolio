import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const toggleActions = "play pause resume reverse";

// Section headings (.title) roll in by character, paragraphs (.para) by word.
export function setupTextReveals() {
  const splits = [];

  gsap.utils.toArray(".para").forEach((el) => {
    splits.push(
      SplitText.create(el, {
        type: "lines,words",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0, y: 80, filter: "blur(5px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1,
              ease: "power3.out",
              stagger: 0.02,
              scrollTrigger: { trigger: el.parentElement, start: "top 70%", toggleActions },
            }
          ),
      })
    );
  });

  gsap.utils.toArray(".title").forEach((el) => {
    splits.push(
      SplitText.create(el, {
        type: "chars,lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.chars,
            { opacity: 0, y: 80, rotate: 10, filter: "blur(5px)" },
            {
              opacity: 1,
              y: 0,
              rotate: 0,
              filter: "blur(0px)",
              duration: 0.8,
              ease: "power2.inOut",
              stagger: 0.03,
              scrollTrigger: { trigger: el.parentElement, start: "top 75%", toggleActions },
            }
          ),
      })
    );
  });

  return () => splits.forEach((s) => s.revert());
}
