import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const charIn = {
  opacity: 1,
  y: 0,
  filter: "blur(0px)",
  duration: 1.2,
  ease: "power3.inOut",
  stagger: 0.025,
  delay: 0.3,
};

// Two stacked words that roll in/out letter by letter forever.
function wordSwap(firstEl, secondEl) {
  const a = SplitText.create(firstEl, { type: "chars" });
  const b = SplitText.create(secondEl, { type: "chars" });
  const roll = { duration: 1.1, ease: "power3.inOut", stagger: 0.06 };
  gsap.set(b.chars, { yPercent: 110 });

  const tl = gsap
    .timeline({ repeat: -1, delay: 3.5 })
    .to(a.chars, { yPercent: -110, ...roll }, 0)
    .to(b.chars, { yPercent: 0, ...roll }, 0)
    .to(b.chars, { yPercent: -110, ...roll }, 4)
    .fromTo(a.chars, { yPercent: 110 }, { yPercent: 0, ...roll, immediateRender: false }, 4)
    .to({}, { duration: 3 });

  return () => {
    tl.kill();
    a.revert();
    b.revert();
  };
}

// Entrance animation once the visitor clicks through the loader.
export function initialFX() {
  const targets = gsap.utils.toArray(".landing-intro h2, .landing-intro h1, .landing-info h3");
  const intro = SplitText.create(targets, { type: "chars,lines", linesClass: "split-line" });
  gsap.fromTo(intro.chars, { opacity: 0, y: 80, filter: "blur(5px)" }, charIn);

  const role = SplitText.create(".landing-info-h2", { type: "chars", linesClass: "split-h2" });
  gsap.fromTo(role.chars, { opacity: 0, y: 80, filter: "blur(5px)" }, { ...charIn, delay: 0.5 });

  gsap.fromTo([".header", ".icons-section", ".nav-fade"], { opacity: 0 }, { opacity: 1, duration: 1.2, ease: "power1.inOut", delay: 0.1 });

  const stopSwap = wordSwap(".landing-swap-a", ".landing-swap-b");

  return () => {
    stopSwap();
    intro.revert();
    role.revert();
  };
}
