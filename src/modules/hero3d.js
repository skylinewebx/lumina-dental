/* =============================================================================
   HERO 3D TOOTH
   A glossy procedural tooth built from geometry. It lerp-follows the pointer
   (moves toward it + rotates on all axes to "face" it) with heavy easing so it
   feels premium, not snappy — the same weighty feel as the reference cookie.
   Touch: follows the finger. Idle: gentle float + slow rotation.

   GLTF swap: set CONFIG.hero3d.glb to a model path and it loads that instead.
   ========================================================================== */
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CONFIG } from "../config.js";

/* -----------------------------------------------------------------------------
   TOOTH MOTION — tune the whole feel here.
   The tooth always follows the pointer (and finger on touch), but gently:
   limited rotation range, small positional drift, heavy smoothing.
   --------------------------------------------------------------------------- */
const deg = (d) => (d * Math.PI) / 180;
const TOOTH = {
  // Rotation range (how far it can turn to "face" the cursor):
  maxYawDeg: 30,     // left/right  (recommended 25–35)
  maxPitchDeg: 18,   // up/down     (recommended 15–20)
  maxRollDeg: 5,     // subtle banking as it turns

  // Positional drift toward the cursor (world units — keep small):
  moveX: 0.35,       // horizontal shift
  moveY: 0.22,       // vertical shift

  // Smoothing: lower = heavier / slower / more premium (0.04–0.06).
  lerp: 0.05,

  // Idle motion when the pointer is still (very subtle):
  idleAfterMs: 2000, // start idling after this long with no input
  idleSwayDeg: 3,    // gentle rotation sway amount
  idleFloat: 0.05,   // gentle vertical bob (world units)

  baseXDesktop: 2.0, // resting offset to the right so it clears the headline
};

export function initHero3D() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  const MAX_DPR = isMobile ? 1.5 : 2; // lighter render on phones for steady 60fps

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: "high-performance",
  });

  // Progressive enhancement: if the device only has SOFTWARE WebGL (no GPU),
  // running a continuous 3D loop would stutter and hammer the CPU. In that case
  // we bail out and keep the instant tooth poster — which already looks great.
  try {
    const gl = renderer.getContext();
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    const name = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
    if (/swiftshader|software|llvmpipe|basic render|microsoft basic/i.test(name)) {
      renderer.dispose();
      return; // poster stays visible; no heavy software rendering
    }
  } catch { /* if detection fails, proceed normally */ }

  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // Group we actually move/rotate (so model origin doesn't matter).
  const pivot = new THREE.Group();
  scene.add(pivot);

  /* ---- Lighting ---- */
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(4, 6, 6);
  scene.add(key);
  const teal = new THREE.PointLight(0x3fd0c0, 55, 40);
  teal.position.set(-5, -2, 3);
  scene.add(teal);
  const rim = new THREE.PointLight(0x9ff5e6, 28, 40);
  rim.position.set(3, -4, -4);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0x4a6a74, 0.6));

  // Studio environment for glossy reflections.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(buildEnvScene(), 0.04).texture;
  scene.environment = envTex;

  /* ---- Build / load the tooth ---- */
  let tooth;
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xf6fbff,
    roughness: 0.18,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.12,
    sheen: 0.6,
    sheenColor: new THREE.Color(0x9ff5e6),
    envMapIntensity: 1.1,
  });

  if (CONFIG.hero3d.glb) {
    new GLTFLoader().load(
      CONFIG.hero3d.glb,
      (gltf) => {
        tooth = gltf.scene;
        tooth.traverse((o) => { if (o.isMesh) o.material = material; });
        fitAndAdd(tooth);
      },
      undefined,
      () => { tooth = buildProceduralTooth(material); fitAndAdd(tooth); }
    );
  } else {
    tooth = buildProceduralTooth(material);
    fitAndAdd(tooth);
  }

  function fitAndAdd(obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    obj.position.sub(center); // center the geometry on the pivot
    const scale = 3.6 / Math.max(size.x, size.y, size.z);
    obj.scale.setScalar(scale);
    pivot.add(obj);
  }

  /* ---- Sparkle particles (fewer on mobile) ---- */
  const sparkles = buildSparkles(isMobile ? 70 : 140);
  scene.add(sparkles);

  /* ---- Pointer tracking (normalized -1..1) ---- */
  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };

  function setFromEvent(clientX, clientY) {
    target.x = (clientX / window.innerWidth) * 2 - 1;
    target.y = -((clientY / window.innerHeight) * 2 - 1);
    lastInput = performance.now();
  }
  window.addEventListener("pointermove", (e) => setFromEvent(e.clientX, e.clientY), { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (e.touches[0]) setFromEvent(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  /* ---- Resize (debounced) ---- */
  function resize() {
    const r = canvas.getBoundingClientRect();
    const w = r.width || window.innerWidth;
    const h = r.height || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR)); // cap DPR (1.5 mobile / 2 desktop)
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  /* ---- Render loop (paused when hero is off-screen or tab hidden) ---- */
  let lastInput = performance.now();
  const clock = new THREE.Clock();
  let running = false;
  let rafId = null;
  let signalledReady = false;

  function start() {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(render);
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  // Only run while the hero is visible in the viewport.
  const io = new IntersectionObserver(
    (entries) => (entries[0].isIntersecting ? start() : stop()),
    { threshold: 0 }
  );
  io.observe(canvas);

  // Pause when the tab is backgrounded.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (isCanvasInView()) start();
  });
  function isCanvasInView() {
    const r = canvas.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  function render() {
    if (!running) return;
    const t = clock.getElapsedTime();
    const idle = performance.now() - lastInput > TOOTH.idleAfterMs;

    // Ease the pointer toward its target. This single slow lerp is what gives
    // the follow its heavy, premium feel (responsive but never twitchy).
    pointer.x += (target.x - pointer.x) * TOOTH.lerp;
    pointer.y += (target.y - pointer.y) * TOOTH.lerp;

    if (pivot.children.length) {
      const baseX = isMobile ? 0 : TOOTH.baseXDesktop;

      // Rotation: turn to "face" the cursor, within a natural, limited range.
      let yaw = pointer.x * deg(TOOTH.maxYawDeg);
      let pitch = -pointer.y * deg(TOOTH.maxPitchDeg);
      const roll = pointer.x * deg(TOOTH.maxRollDeg);

      // Position: a small drift toward the cursor (not a big travel).
      let posX = baseX + pointer.x * TOOTH.moveX;
      let posY = pointer.y * TOOTH.moveY;

      if (idle && !reduced) {
        // Very subtle idle sway + float when the pointer is still.
        yaw += Math.sin(t * 0.4) * deg(TOOTH.idleSwayDeg);
        pitch += Math.cos(t * 0.33) * deg(TOOTH.idleSwayDeg) * 0.6;
        posY += Math.sin(t * 0.6) * TOOTH.idleFloat;
      }

      pivot.rotation.set(pitch, yaw, roll);
      pivot.position.x = posX;
      pivot.position.y = posY;
    }

    sparkles.rotation.y = t * 0.03;
    sparkles.material.opacity = 0.5 + Math.sin(t * 1.5) * 0.2;

    renderer.render(scene, camera);

    // Signal readiness once the tooth has actually drawn, so the hero can
    // crossfade from the instant poster to the live 3D with no empty frame.
    if (!signalledReady && pivot.children.length) {
      signalledReady = true;
      document.querySelector(".hero")?.classList.add("is-3d-ready");
    }

    rafId = requestAnimationFrame(render);
  }

  // IntersectionObserver kicks off start() when the hero is in view.
  if (isCanvasInView()) start();
}

/* -------------------------------------------------------------------------
   Procedural tooth: a lathed body (two rounded roots + bulging crown) with
   extra crown "cusp" bumps. Readable as a molar, glossy and soft.
   ---------------------------------------------------------------------- */
function buildProceduralTooth(material) {
  const group = new THREE.Group();

  // Lathe profile (x = radius, y = height). Bottom = roots, top = crown.
  const pts = [];
  pts.push(new THREE.Vector2(0.02, -2.0));  // root tip
  pts.push(new THREE.Vector2(0.28, -1.7));
  pts.push(new THREE.Vector2(0.42, -1.2));
  pts.push(new THREE.Vector2(0.5, -0.6));
  pts.push(new THREE.Vector2(0.62, 0.0));   // neck
  pts.push(new THREE.Vector2(0.86, 0.5));   // crown flares out
  pts.push(new THREE.Vector2(0.98, 1.0));
  pts.push(new THREE.Vector2(0.95, 1.35));
  pts.push(new THREE.Vector2(0.7, 1.55));   // crown shoulder
  pts.push(new THREE.Vector2(0.35, 1.62));
  pts.push(new THREE.Vector2(0.0, 1.6));    // crown top center
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 64), material);
  body.geometry.computeVertexNormals();
  group.add(body);

  // Crown cusps: four little spheres on top for a molar's chewing surface.
  const cuspGeo = new THREE.SphereGeometry(0.34, 24, 20);
  const r = 0.42;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const cusp = new THREE.Mesh(cuspGeo, material);
    cusp.position.set(Math.cos(a) * r, 1.5, Math.sin(a) * r);
    cusp.scale.set(1, 0.7, 1);
    group.add(cusp);
  }

  return group;
}

/* Small studio scene used only to bake an environment map for reflections. */
function buildEnvScene() {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x0a1420);
  const g = new THREE.SphereGeometry(10, 16, 16);
  const soft = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0x14303a, side: THREE.BackSide }));
  s.add(soft);
  const makeLight = (color, x, y, z, scale) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(scale, scale),
      new THREE.MeshBasicMaterial({ color })
    );
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    s.add(m);
  };
  makeLight(0xffffff, 0, 8, 2, 8);
  makeLight(0x3fd0c0, -8, 0, 3, 7);
  makeLight(0x9ff5e6, 6, -4, -4, 6);
  return s;
}

/* Sparkle particle field behind the tooth. */
function buildSparkles(count = 140) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const rad = 3 + Math.random() * 4;
    const a = Math.random() * Math.PI * 2;
    const b = Math.random() * Math.PI - Math.PI / 2;
    positions[i * 3] = Math.cos(a) * Math.cos(b) * rad;
    positions[i * 3 + 1] = Math.sin(b) * rad * 0.8;
    positions[i * 3 + 2] = Math.sin(a) * Math.cos(b) * rad - 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x9ff5e6, size: 0.05, transparent: true, opacity: 0.6,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  return new THREE.Points(geo, mat);
}
