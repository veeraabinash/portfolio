import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export function initSmoothScroll() {
  if (lenis) return lenis;
  lenis = new Lenis({ duration: 1.6, smoothWheel: true, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
  return lenis;
}

export function getSmoothScroll() {
  return lenis;
}

export function scrollToSection(selector) {
  if (lenis) lenis.scrollTo(selector, { duration: 1.6 });
  else document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
}
