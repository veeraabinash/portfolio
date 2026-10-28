import * as THREE from "three";

// Desk, chair and laptop built around the seated character in boy.bin.
// Units are metres; the character faces +z (towards the camera).

export const COLORS = {
  accent: "#3f8a5a",
  accentSoft: "#cfe6cf",
  deskTop: "#c4925f", // oak
  deskBody: "#ece3cf", // cream panels
  trim: "#5f8a6c", // mild forest outline
  gold: "#d9b45a",
  chair: "#d8c7a4",
  metal: "#c6bea9",
  laptop: "#26352c", // dark forest aluminium
  trackpad: "#34463b",
  key: "#efe6d2", // cream keycaps
  logo: "#f4eddd",
  white: "#faf5ea",
};

// Procedural oak grain for the desk top.
function makeWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = COLORS.deskTop;
  ctx.fillRect(0, 0, 1024, 256);
  for (let i = 0; i < 70; i++) {
    const y = Math.random() * 256;
    const amp = 2 + Math.random() * 6;
    const freq = 0.004 + Math.random() * 0.01;
    const phase = Math.random() * 10;
    ctx.strokeStyle = Math.random() > 0.5 ? "rgba(96, 58, 28, 0.16)" : "rgba(235, 200, 150, 0.14)";
    ctx.lineWidth = 0.6 + Math.random() * 2.2;
    ctx.beginPath();
    for (let x = 0; x <= 1024; x += 8) {
      const yy = y + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 3.1 + phase) * amp * 0.3;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  // a couple of knots
  for (let k = 0; k < 2; k++) {
    const cx = 150 + Math.random() * 720, cy = 40 + Math.random() * 170;
    for (let r = 14; r > 2; r -= 3) {
      ctx.strokeStyle = "rgba(90, 52, 24, 0.18)";
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 2.4, r, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

// Fallback layout, used only if the character file carries none.
export const LAYOUT = {
  deskY: 0.665,
  deskZ: 0.54,
  deskDepth: 0.6, // back edge at z 0.24 stays clear of the belly
  laptopZ: 0.44,
};

const std = (color, o = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.04, ...o });

function add(parent, geometry, material, { p, r, s, cast = true } = {}) {
  const m = new THREE.Mesh(geometry, material);
  if (p) m.position.set(...p);
  if (r) m.rotation.set(...r);
  if (s) m.scale.set(...s);
  m.castShadow = cast;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

function makeScreenTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#0c140f";
  ctx.fillRect(0, 0, 512, 512);
  const palette = ["#cfe6cf", "#6fbf86", "#3f8a5a", "#f4eddd", "#d9b45a"];
  let y = 16;
  while (y < 500) {
    let x = 20 + Math.floor(Math.random() * 4) * 22;
    const tokens = 1 + Math.floor(Math.random() * 5);
    for (let t = 0; t < tokens; t++) {
      const w = 20 + Math.random() * 80;
      ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
      ctx.globalAlpha = 0.55 + Math.random() * 0.45;
      ctx.fillRect(x, y, w, 7);
      x += w + 10;
    }
    y += 18 + (Math.random() > 0.85 ? 14 : 0);
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 0.6);
  return tex;
}

function makeShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  g.addColorStop(0, "rgba(40, 30, 55, 0.35)");
  g.addColorStop(1, "rgba(40, 30, 55, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

function buildLaptop(mats) {
  const group = new THREE.Group();
  const base = { w: 0.34, d: 0.24, h: 0.016 };
  add(group, new THREE.BoxGeometry(base.w, base.h, base.d), mats.laptop, { p: [0, base.h / 2, 0] });

  // keys on the far half of the base, under the fingertips
  const cols = 12;
  const rows = 4;
  const keyGeo = new THREE.BoxGeometry(0.021, 0.004, 0.021);
  const keys = new THREE.InstancedMesh(keyGeo, new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.5 }), cols * rows);
  const keyBase = [];
  const keyColor = new THREE.Color(COLORS.key);
  const m = new THREE.Matrix4();
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const pos = new THREE.Vector3(-0.143 + c * 0.026, base.h + 0.002, 0.075 - r * 0.026);
      m.makeTranslation(pos.x, pos.y, pos.z);
      keys.setMatrixAt(i, m);
      keys.setColorAt(i, keyColor);
      keyBase.push({ pos, col: c, until: 0 });
      i++;
    }
  }
  group.add(keys);
  add(group, new THREE.BoxGeometry(0.1, 0.002, 0.06), mats.trackpad, { p: [0, base.h + 0.001, -0.075], cast: false });

  // lid hinged at the far edge, leaning back towards the camera
  const lid = new THREE.Group();
  lid.position.set(0, base.h, base.d / 2);
  lid.rotation.x = 0.28;
  add(lid, new THREE.BoxGeometry(base.w, 0.23, 0.01), mats.laptop, { p: [0, 0.115, 0] });
  const screenTex = makeScreenTexture();
  const screenMat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    map: screenTex,
    emissive: COLORS.accentSoft,
    emissiveMap: screenTex,
    emissiveIntensity: 0.8,
    roughness: 0.3,
  });
  add(lid, new THREE.PlaneGeometry(base.w - 0.02, 0.2), screenMat, { p: [0, 0.118, -0.0055], r: [0, Math.PI, 0], cast: false });
  add(lid, new THREE.CircleGeometry(0.022, 32), mats.logo, { p: [0, 0.12, 0.0055], cast: false });
  group.add(lid);

  return { group, keys, keyBase, keyColor, screenMat, screenTex };
}

// `fit` comes from the character file: desk height under the hands, laptop under
// the fingertips, desk back edge just clear of the belly, and the seat height.
export function buildSet(fit) {
  const mats = {
    deskTop: std("#ffffff", { map: makeWoodTexture(), roughness: 0.55 }),
    deskBody: std(COLORS.deskBody, { roughness: 0.7 }),
    trim: std(COLORS.trim, { roughness: 0.5 }),
    gold: new THREE.MeshStandardMaterial({ color: COLORS.gold, metalness: 0.7, roughness: 0.3, emissive: COLORS.gold, emissiveIntensity: 0.15 }),
    chair: std(COLORS.chair),
    metal: std(COLORS.metal, { metalness: 0.35, roughness: 0.4 }),
    laptop: std(COLORS.laptop, { metalness: 0.45, roughness: 0.35 }),
    trackpad: std(COLORS.trackpad, { roughness: 0.3 }),
    logo: new THREE.MeshStandardMaterial({ color: COLORS.logo, emissive: COLORS.logo, emissiveIntensity: 0.55 }),
    white: std(COLORS.white, { roughness: 0.25 }),
    accent: new THREE.MeshStandardMaterial({ color: COLORS.accent, emissive: COLORS.accent, emissiveIntensity: 0.6 }),
  };
  const group = new THREE.Group();
  const { deskY, laptopZ } = fit || LAYOUT;
  const back = fit ? fit.deskBackZ : LAYOUT.deskZ - LAYOUT.deskDepth / 2;
  const front = laptopZ + 0.32;
  const deskDepth = front - back;
  const deskZ = (front + back) / 2;
  const seatY = fit ? fit.seatY : 0.335;

  // desk: top, front modesty panel and side panels hide the lap
  const desk = new THREE.Group();
  add(desk, new THREE.BoxGeometry(1.3, 0.03, deskDepth), mats.deskTop, { p: [0, deskY - 0.015, deskZ] });
  add(desk, new THREE.BoxGeometry(1.26, deskY - 0.12, 0.02), mats.deskBody, { p: [0, (deskY - 0.03) / 2 + 0.06, front - 0.03] });
  for (const s of [-1, 1]) add(desk, new THREE.BoxGeometry(0.03, deskY - 0.03, deskDepth - 0.02), mats.deskBody, { p: [s * 0.635, (deskY - 0.03) / 2, deskZ] });
  // thin forest outline along the visible panel edges
  const t = 0.007;
  const panelH = deskY - 0.03;
  const frontZ = front - 0.019;
  const line = (w, h, d, p) => add(desk, new THREE.BoxGeometry(w, h, d), mats.trim, { p, cast: false });
  line(1.3, t, t, [0, deskY - 0.03, front + 0.001]); // under the top, front edge
  line(1.26, t, t, [0, 0.06 + t / 2, frontZ]); // bottom of the front panel
  for (const s of [-1, 1]) {
    line(t, panelH - 0.06, t, [s * 0.627, (panelH + 0.06) / 2, frontZ]); // front panel sides
    line(t, panelH, t, [s * 0.65, panelH / 2, front - 0.01]); // side panel front edges
    line(t, t, deskDepth - 0.02, [s * 0.65, deskY - 0.03, deskZ]); // side panel top edges
  }
  group.add(desk);

  const laptop = buildLaptop(mats);
  laptop.group.position.set(0, deskY, laptopZ);
  group.add(laptop.group);

  // mug
  const mug = new THREE.Group();
  mug.position.set(-0.4, deskY, laptopZ + 0.08);
  add(mug, new THREE.CylinderGeometry(0.04, 0.036, 0.1, 24), mats.white, { p: [0, 0.05, 0] });
  add(mug, new THREE.CylinderGeometry(0.041, 0.041, 0.018, 24), mats.accent, { p: [0, 0.06, 0], cast: false });
  add(mug, new THREE.TorusGeometry(0.022, 0.007, 8, 20), mats.white, { p: [0.045, 0.05, 0], r: [0, 0, Math.PI / 2] });
  group.add(mug);

  // chair under the seated figure
  const chair = new THREE.Group();
  const seatTop = seatY - 0.005;
  add(chair, new THREE.BoxGeometry(0.48, 0.05, 0.46), mats.chair, { p: [0, seatTop - 0.025, -0.02] });
  add(chair, new THREE.BoxGeometry(0.46, 0.55, 0.05), mats.chair, { p: [0, seatTop + 0.3, -0.26], r: [-0.1, 0, 0] });
  add(chair, new THREE.BoxGeometry(0.03, 0.44, 0.052), mats.accent, { p: [0, seatTop + 0.32, -0.26], r: [-0.1, 0, 0], cast: false });
  add(chair, new THREE.CylinderGeometry(0.028, 0.028, seatTop - 0.09, 12), mats.metal, { p: [0, (seatTop - 0.05) / 2 + 0.02, -0.02] });
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2;
    add(chair, new THREE.BoxGeometry(0.035, 0.025, 0.28), mats.metal, { p: [Math.sin(a) * 0.14, 0.03, -0.02 + Math.cos(a) * 0.14], r: [0, a, 0] });
  }
  group.add(chair);

  // soft contact shadow
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.9, 1.5),
    new THREE.MeshBasicMaterial({ map: makeShadowTexture(), transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.002, 0.25);
  group.add(shadow);

  return { group, laptop };
}
