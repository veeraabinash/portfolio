import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildSet, COLORS } from "./build";
import { loadHuman, loadCharacterMaterial } from "./human";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP = "(min-width: 1025px)";
const HEAD_RANGE = Math.PI / 6;
const MODEL_DIR = "/models/boy";
const MODEL_URL = `${MODEL_DIR}/boy.bin`;

const _matrix = new THREE.Matrix4();
const _pressColor = new THREE.Color(COLORS.accent);

export async function createCharacterScene(container) {
  const size = () => ({ w: container.clientWidth, h: container.clientHeight });
  let { w, h } = size();

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: window.devicePixelRatio < 2,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;

  const camera = new THREE.PerspectiveCamera(18, w / h, 0.1, 100);
  camera.position.set(0, 1.12, 5);
  const camTarget = new THREE.Vector3(0, 0.92, 0);

  // ----- lights -----
  scene.add(new THREE.HemisphereLight("#fffaf0", "#e2d6bb", 0.9));
  const key = new THREE.DirectionalLight("#fff6e6", 2.3);
  key.position.set(2, 3, 4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -1.2;
  key.shadow.camera.right = 1.2;
  key.shadow.camera.top = 1.6;
  key.shadow.camera.bottom = -0.2;
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  const rim = new THREE.DirectionalLight(COLORS.accent, 1.4);
  rim.position.set(-3, 2.2, -3);
  scene.add(rim);
  const rim2 = new THREE.DirectionalLight("#ffe3b0", 0.9);
  rim2.position.set(3, 1.5, -2.5);
  scene.add(rim2);

  // ----- model: scrollGroup (scroll-driven) > introGroup (entrance) > root -----
  const { mesh: human, bones, hands: handInfo, layout } = await loadHuman(MODEL_URL, loadCharacterMaterial(MODEL_DIR));
  const { group: set, laptop } = buildSet(layout);

  const root = new THREE.Group();
  root.add(human, set);
  const introGroup = new THREE.Group();
  introGroup.add(root);
  const scrollGroup = new THREE.Group();
  scrollGroup.add(introGroup);
  scene.add(scrollGroup);

  // The model's own hands type: each tap dips the hand bone and presses a key.
  const hands = handInfo.map(({ side }) => {
    const n = side > 0 ? "L" : "R";
    return { side, hand: bones["hand" + n], forearm: bones["foreArm" + n], nextTap: Math.random(), tapStart: -1 };
  });

  const screenLight = new THREE.PointLight(COLORS.accentSoft, 0, 1.6, 2);
  screenLight.position.set(0, layout.deskY + 0.2, layout.laptopZ + 0.05);
  root.add(screenLight);

  // ----- state -----
  const pointer = { x: 0, y: 0 };
  const lerpSpeed = { x: 0.1, y: 0.1 };
  const head = { yaw: 0, pitch: 0 };
  const state = {
    introPitch: 0.35,
    nod: 0,
    typing: 0,
    screen: 0.55,
    flicker: 1,
    running: true,
  };
  const isDesktop = () => window.matchMedia(DESKTOP).matches;

  // ----- input -----
  const onMouseMove = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    lerpSpeed.x = lerpSpeed.y = 0.1;
  };
  let touchReset;
  const onTouchMove = (e) => {
    const t = e.touches[0];
    pointer.x = (t.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(t.clientY / window.innerHeight) * 2 + 1;
  };
  const onTouchStart = () => {
    clearTimeout(touchReset);
    lerpSpeed.x = lerpSpeed.y = 0.25;
  };
  const onTouchEnd = () => {
    touchReset = setTimeout(() => {
      pointer.x = 0;
      pointer.y = 0;
      lerpSpeed.x = lerpSpeed.y = 0.03;
    }, 1500);
  };
  document.addEventListener("mousemove", onMouseMove);
  const landing = document.querySelector(".landing-section");
  landing?.addEventListener("touchstart", onTouchStart, { passive: true });
  landing?.addEventListener("touchmove", onTouchMove, { passive: true });
  landing?.addEventListener("touchend", onTouchEnd);

  // A small curious head tilt when the visitor hovers the name.
  const nameEl = document.querySelector(".landing-intro h1");
  const tiltOn = () => gsap.to(state, { nod: 1, duration: 0.5, ease: "power2.out" });
  const tiltOff = () => gsap.to(state, { nod: 0, duration: 0.6, ease: "power2.out" });
  nameEl?.addEventListener("mouseenter", tiltOn);
  nameEl?.addEventListener("mouseleave", tiltOff);

  const flicker = gsap.timeline({ repeat: -1, repeatRefresh: true }).to(state, {
    flicker: () => 0.7 + Math.random() * 0.5,
    duration: () => 0.05 + Math.random() * 0.5,
    delay: () => Math.random() * 0.15,
  });

  // ----- per-frame updates -----
  const lerp = THREE.MathUtils.lerp;
  const { keys, keyBase, keyColor, screenMat, screenTex } = laptop;

  const pressKey = (side, now) => {
    const pool = keyBase.filter((k) => (side < 0 ? k.col <= 5 : k.col >= 6));
    pool[Math.floor(Math.random() * pool.length)].until = now + 0.11;
  };

  const updateKeys = (now) => {
    keyBase.forEach((k, i) => {
      const down = k.until > now;
      _matrix.makeTranslation(k.pos.x, k.pos.y - (down ? 0.002 : 0), k.pos.z);
      keys.setMatrixAt(i, _matrix);
      keys.setColorAt(i, down ? _pressColor : keyColor);
    });
    keys.instanceMatrix.needsUpdate = true;
    keys.instanceColor.needsUpdate = true;
  };

  const updateHands = (t) => {
    for (const h of hands) {
      if (state.typing > 0.95 && t > h.nextTap) {
        h.tapStart = t;
        h.nextTap = t + 0.09 + Math.random() * 0.22;
        pressKey(h.side, t);
      }
      const tap = Math.max(0, 1 - (t - h.tapStart) / 0.1);
      // small wrist dip per keystroke + a slow drift across the keyboard
      h.hand.rotation.x = state.typing * tap * 0.12;
      h.hand.rotation.y = state.typing * Math.sin(t * 1.3 + h.side) * 0.05;
      h.forearm.rotation.y = state.typing * Math.sin(t * 0.9 + h.side) * 0.035;
      h.forearm.rotation.x = state.typing * Math.sin(t * 7 + h.side * 2) * 0.008;
    }
  };

  const updateHead = (t) => {
    let yaw;
    let pitch;
    if (window.scrollY < 200 || !isDesktop()) {
      yaw = pointer.x * HEAD_RANGE;
      const py = THREE.MathUtils.clamp(pointer.y, -0.3, 0.4);
      pitch = -py * 0.5 - 0.06;
    } else {
      // scrolled away: look down at the laptop
      yaw = -0.08;
      pitch = 0.3;
      lerpSpeed.x = lerpSpeed.y = 0.03;
    }
    head.yaw = lerp(head.yaw, yaw, lerpSpeed.x);
    head.pitch = lerp(head.pitch, pitch, lerpSpeed.y);

    const p = head.pitch + state.introPitch;
    bones.neck.rotation.set(p * 0.35, head.yaw * 0.35, state.nod * 0.05);
    bones.head.rotation.set(p * 0.65 - state.nod * 0.06, head.yaw * 0.65, state.nod * 0.16 - head.yaw * 0.05);
    bones.chest.rotation.set(Math.sin(t * 1.6) * 0.008, head.yaw * 0.12, 0);
  };

  const updateScreen = (t) => {
    const power = state.screen * state.flicker;
    screenMat.emissiveIntensity = power * 1.5;
    screenLight.intensity = power * 1.6;
    screenTex.offset.y = (t * 0.03) % 1;
  };

  const clock = new THREE.Clock();
  let frame;
  const render = () => {
    frame = requestAnimationFrame(render);
    if (!state.running) return;
    const t = clock.getElapsedTime();
    updateHead(t);
    updateHands(t);
    updateKeys(t);
    updateScreen(t);
    camera.lookAt(camTarget);
    renderer.render(scene, camera);
  };
  render();

  const onResize = () => {
    ({ w, h } = size());
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  window.addEventListener("resize", onResize);

  // ----- entrance -----
  introGroup.position.y = -0.3;
  introGroup.rotation.y = -0.5;
  container.style.opacity = "0";

  const startIntro = () => {
    gsap.to(container, { opacity: 1, duration: 0.8, delay: 0.2 });
    gsap.to(introGroup.position, { y: 0, duration: 1.8, ease: "power3.out", delay: 0.2 });
    gsap.to(introGroup.rotation, { y: 0, duration: 2.2, ease: "power3.out", delay: 0.2 });
    gsap.to(state, { introPitch: 0, duration: 1.6, ease: "power2.out", delay: 0.9 });
    gsap.to(state, { typing: 1, duration: 0.8, delay: 1.6 });
    setupScroll();
  };

  // ----- scroll choreography (desktop) -----
  let mm;
  const setupScroll = () => {
    mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      gsap
        .timeline({
          scrollTrigger: { trigger: ".landing-section", start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        })
        .fromTo(scrollGroup.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .fromTo(camera.position, { z: 5 }, { z: 4.4, duration: 1 }, 0)
        .fromTo(container, { xPercent: 0 }, { xPercent: -25, duration: 1 }, 0)
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
        .to(".landing-container", { y: "40%", duration: 0.8 }, 0);

      gsap
        .timeline({
          scrollTrigger: { trigger: ".about-section", start: "center 55%", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        })
        .to(state, { screen: 1, duration: 0.8 }, 0)
        .fromTo(camera.position, { z: 4.4, y: 1.12 }, { z: 3.7, y: 1.22, duration: 3 }, 0)
        .to(camTarget, { y: 0.84, duration: 3 }, 0)
        .fromTo(scrollGroup.rotation, { y: 0.7 }, { y: 0.92, duration: 3 }, 0)
        .fromTo(".about-section", { y: 0 }, { y: "-15%", duration: 3 }, 0);

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".whatIDO",
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
            onLeave: () => (state.running = false),
            onEnterBack: () => (state.running = true),
          },
        })
        .fromTo(container, { yPercent: 0 }, { yPercent: -100, ease: "none", duration: 1 }, 0)
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 1 }, 0)
        .fromTo(scrollGroup.rotation, { x: 0 }, { x: -0.04, duration: 1 }, 0);
    });
  };

  const dispose = () => {
    cancelAnimationFrame(frame);
    clearTimeout(touchReset);
    flicker.kill();
    mm?.revert();
    document.removeEventListener("mousemove", onMouseMove);
    landing?.removeEventListener("touchstart", onTouchStart);
    landing?.removeEventListener("touchmove", onTouchMove);
    landing?.removeEventListener("touchend", onTouchEnd);
    nameEl?.removeEventListener("mouseenter", tiltOn);
    nameEl?.removeEventListener("mouseleave", tiltOff);
    window.removeEventListener("resize", onResize);
    scene.traverse((o) => {
      o.geometry?.dispose();
      [].concat(o.material || []).forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    });
    pmrem.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };

  return { startIntro, dispose };
}
