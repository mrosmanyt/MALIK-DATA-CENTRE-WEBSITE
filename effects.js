/* ==========================================================================
   MALIK DATA CENTRE — Premium 3D / Animation Engine
   Requires: three.min.js (loaded before this file)
   Handles: preloader, 3D particle network background, floating 3D objects +
   glowing globe in hero, 3D tilt cards, scroll reveals, animated counters,
   magnetic buttons, custom cursor glow, scroll progress bar.
   All effects are guarded so the site still works if Three.js fails to load.
   ========================================================================== */
(function () {
    "use strict";

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const hasTHREE = typeof window.THREE !== "undefined";

    /* ======================================================================
       1. PRELOADER
       ====================================================================== */
    function hidePreloader() {
        const pre = document.getElementById("mdc-preloader");
        if (!pre) return;
        pre.classList.add("loaded");
        setTimeout(() => pre.remove(), 900);
    }
    window.addEventListener("load", () => setTimeout(hidePreloader, 600));
    // safety: never trap the user behind the loader
    setTimeout(hidePreloader, 4000);

    /* ======================================================================
       2. SCROLL PROGRESS BAR
       ====================================================================== */
    function initScrollProgress() {
        const bar = document.getElementById("mdc-scroll-progress");
        if (!bar) return;
        const onScroll = () => {
            const h = document.documentElement;
            const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
            bar.style.width = Math.max(0, Math.min(1, scrolled)) * 100 + "%";
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    /* ======================================================================
       3. CUSTOM CURSOR GLOW (desktop)
       ====================================================================== */
    function initCursorGlow() {
        if (isMobile || prefersReduced) return;
        const glow = document.getElementById("mdc-cursor-glow");
        if (!glow) return;
        let tx = window.innerWidth / 2, ty = window.innerHeight / 2;
        let cx = tx, cy = ty;
        document.body.classList.add("cursor-active");
        window.addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
        (function loop() {
            cx += (tx - cx) * 0.12;
            cy += (ty - cy) * 0.12;
            glow.style.left = cx + "px";
            glow.style.top = cy + "px";
            requestAnimationFrame(loop);
        })();
    }

    /* ======================================================================
       4. SCROLL REVEAL
       ====================================================================== */
    function initScrollReveal() {
        const els = document.querySelectorAll("[data-reveal]");
        if (!els.length) return;
        if (prefersReduced || !("IntersectionObserver" in window)) {
            els.forEach((el) => el.classList.add("revealed"));
            return;
        }
        const obs = new IntersectionObserver((entries, o) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute("data-reveal-delay");
                    if (delay) entry.target.style.transitionDelay = delay + "ms";
                    entry.target.classList.add("revealed");
                    o.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
        els.forEach((el) => obs.observe(el));
    }

    /* ======================================================================
       5. ANIMATED COUNTERS
       ====================================================================== */
    function animateCounter(el) {
        const target = parseFloat(el.getAttribute("data-count"));
        const suffix = el.getAttribute("data-suffix") || "";
        const dur = 1600;
        const start = performance.now();
        function step(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = Math.floor(eased * target);
            el.textContent = val.toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString() + suffix;
        }
        requestAnimationFrame(step);
    }

    function initCounters() {
        const counters = document.querySelectorAll("[data-count]");
        if (!counters.length) return;
        if (!("IntersectionObserver" in window) || prefersReduced) {
            counters.forEach((c) => {
                c.textContent = parseFloat(c.getAttribute("data-count")).toLocaleString() + (c.getAttribute("data-suffix") || "");
            });
            return;
        }
        const obs = new IntersectionObserver((entries, o) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    o.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach((c) => obs.observe(c));
    }

    /* ======================================================================
       6. 3D TILT CARDS
       ====================================================================== */
    function initTilt() {
        if (prefersReduced) return;
        const cards = document.querySelectorAll(".tilt-3d");
        const MAX = isMobile ? 0 : 9; // degrees
        if (!MAX) return;
        cards.forEach((card) => {
            let raf = null;
            const glare = card.querySelector(".tilt-glare");
            function onMove(e) {
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                const rx = (0.5 - py) * MAX * 2;
                const ry = (px - 0.5) * MAX * 2;
                if (raf) cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    card.style.transform =
                        `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
                    if (glare) {
                        glare.style.setProperty("--glare-x", (px * 100) + "%");
                        glare.style.setProperty("--glare-y", (py * 100) + "%");
                    }
                });
            }
            function onEnter() { card.classList.add("is-tilting"); }
            function onLeave() {
                card.classList.remove("is-tilting");
                if (raf) cancelAnimationFrame(raf);
                card.style.transform = "";
            }
            card.addEventListener("mouseenter", onEnter);
            card.addEventListener("mousemove", onMove);
            card.addEventListener("mouseleave", onLeave);
        });
    }

    /* ======================================================================
       7. MAGNETIC BUTTONS
       ====================================================================== */
    function initMagnetic() {
        if (isMobile || prefersReduced) return;
        document.querySelectorAll(".magnetic").forEach((btn) => {
            const strength = 18;
            btn.addEventListener("mousemove", (e) => {
                const r = btn.getBoundingClientRect();
                const mx = e.clientX - r.left - r.width / 2;
                const my = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${(mx / r.width) * strength}px, ${(my / r.height) * strength}px)`;
            });
            btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
        });
    }

    /* ======================================================================
       8. THREE.JS — PARTICLE NETWORK BACKGROUND
       ====================================================================== */
    function initBackground3D() {
        if (!window.THREE || prefersReduced) return;
        const canvas = document.getElementById("mdc-bg-canvas");
        if (!canvas) return;
        const THREE = window.THREE;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 320;

        // --- Particle field ---
        const COUNT = isMobile ? 70 : 130;
        const SPREAD = 600;
        const positions = new Float32Array(COUNT * 3);
        const velocities = [];
        for (let i = 0; i < COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * SPREAD;
            positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
            positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
            velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 0.25,
                (Math.random() - 0.5) * 0.25,
                (Math.random() - 0.5) * 0.25
            ));
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        // soft round sprite for points
        const sprite = (function () {
            const c = document.createElement("canvas");
            c.width = c.height = 64;
            const ctx = c.getContext("2d");
            const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            g.addColorStop(0, "rgba(255,255,255,1)");
            g.addColorStop(0.3, "rgba(160,170,255,0.8)");
            g.addColorStop(1, "rgba(99,102,241,0)");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 64, 64);
            const t = new THREE.Texture(c);
            t.needsUpdate = true;
            return t;
        })();

        const pMat = new THREE.PointsMaterial({
            size: 7,
            map: sprite,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            color: 0x8b9bff
        });
        const points = new THREE.Points(pGeo, pMat);
        scene.add(points);

        // --- Connecting lines ---
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x6366f1,
            transparent: true,
            opacity: 0.12,
            blending: THREE.AdditiveBlending
        });
        const lineGeo = new THREE.BufferGeometry();
        const maxLineVerts = COUNT * COUNT;
        const linePositions = new Float32Array(maxLineVerts * 3);
        lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        const lines = new THREE.LineSegments(lineGeo, lineMat);
        scene.add(lines);

        const CONNECT_DIST = isMobile ? 90 : 115;

        // mouse parallax
        let mx = 0, my = 0, tmx = 0, tmy = 0;
        window.addEventListener("mousemove", (e) => {
            tmx = (e.clientX / window.innerWidth - 0.5);
            tmy = (e.clientY / window.innerHeight - 0.5);
        });

        const pos = pGeo.attributes.position.array;
        let frame = 0;
        let paused = false;
        document.addEventListener("visibilitychange", () => {
            paused = document.hidden;
            if (!paused) requestAnimationFrame(animate);
        });

        function animate() {
            if (paused) return;
            frame++;
            // move particles
            for (let i = 0; i < COUNT; i++) {
                const ix = i * 3;
                pos[ix] += velocities[i].x;
                pos[ix + 1] += velocities[i].y;
                pos[ix + 2] += velocities[i].z;
                for (let a = 0; a < 3; a++) {
                    if (pos[ix + a] > SPREAD / 2 || pos[ix + a] < -SPREAD / 2) {
                        velocities[i].setComponent(a, -velocities[i].getComponent(a));
                    }
                }
            }
            pGeo.attributes.position.needsUpdate = true;

            // build connecting lines (throttled: every 2nd frame — saves CPU)
            if (frame % 2 === 0) {
                let v = 0;
                const cd2 = CONNECT_DIST * CONNECT_DIST;
                for (let i = 0; i < COUNT; i++) {
                    for (let j = i + 1; j < COUNT; j++) {
                        const dx = pos[i * 3] - pos[j * 3];
                        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
                        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                        const d2 = dx * dx + dy * dy + dz * dz;
                        if (d2 < cd2) {
                            linePositions[v++] = pos[i * 3];
                            linePositions[v++] = pos[i * 3 + 1];
                            linePositions[v++] = pos[i * 3 + 2];
                            linePositions[v++] = pos[j * 3];
                            linePositions[v++] = pos[j * 3 + 1];
                            linePositions[v++] = pos[j * 3 + 2];
                        }
                    }
                }
                lineGeo.setDrawRange(0, v / 3);
                lineGeo.attributes.position.needsUpdate = true;
            }

            // camera parallax + gentle rotation
            mx += (tmx - mx) * 0.04;
            my += (tmy - my) * 0.04;
            camera.position.x += (mx * 120 - camera.position.x) * 0.05;
            camera.position.y += (-my * 120 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            points.rotation.y += 0.0006;
            lines.rotation.y += 0.0006;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();
        requestAnimationFrame(() => canvas.classList.add("ready"));

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, { passive: true });
    }

    /* ======================================================================
       9. THREE.JS — HERO FLOATING OBJECTS + GLOWING GLOBE
       ====================================================================== */
    function initHero3D() {
        if (!window.THREE || prefersReduced) return;
        const canvas = document.getElementById("mdc-hero-canvas");
        if (!canvas) return;
        const THREE = window.THREE;
        const parent = canvas.parentElement;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

        function size() {
            const w = parent.clientWidth, h = parent.clientHeight;
            renderer.setSize(w, h, false);
            return { w, h };
        }
        let { w, h } = size();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
        camera.position.z = 9;

        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const key = new THREE.PointLight(0x8b9bff, 2.2, 100);
        key.position.set(6, 6, 8);
        scene.add(key);
        const rim = new THREE.PointLight(0x38bdf8, 1.8, 100);
        rim.position.set(-7, -4, 5);
        scene.add(rim);

        const group = new THREE.Group();
        scene.add(group);

        const mats = {
            purple: new THREE.MeshStandardMaterial({ color: 0x7c5cff, metalness: 0.4, roughness: 0.25, emissive: 0x2a1f6b, emissiveIntensity: 0.5 }),
            blue: new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.5, roughness: 0.2, emissive: 0x0b3a52, emissiveIntensity: 0.5 }),
            green: new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.4, roughness: 0.25, emissive: 0x07372a, emissiveIntensity: 0.5 })
        };

        const floaters = [];
        function addShape(geo, mat, x, y, z, s) {
            const m = new THREE.Mesh(geo, mat);
            m.position.set(x, y, z);
            m.scale.setScalar(s);
            m.userData = {
                rx: (Math.random() - 0.5) * 0.01,
                ry: (Math.random() - 0.5) * 0.012,
                baseY: y,
                phase: Math.random() * Math.PI * 2,
                amp: 0.3 + Math.random() * 0.3
            };
            group.add(m);
            floaters.push(m);
        }

        addShape(new THREE.IcosahedronGeometry(1, 0), mats.purple, -3.2, 1.4, 0, 1);
        addShape(new THREE.TorusGeometry(0.7, 0.28, 16, 40), mats.blue, 3.1, -1.2, -1, 1);
        addShape(new THREE.OctahedronGeometry(0.9, 0), mats.green, 2.6, 2.0, -2, 0.9);
        addShape(new THREE.DodecahedronGeometry(0.7, 0), mats.blue, -3.0, -1.8, -1, 0.9);
        addShape(new THREE.TetrahedronGeometry(0.8, 0), mats.purple, 0.4, 2.6, -3, 0.8);

        // --- glowing wireframe globe centerpiece ---
        const globeGroup = new THREE.Group();
        scene.add(globeGroup);
        const globe = new THREE.Mesh(
            new THREE.SphereGeometry(1.7, 28, 28),
            new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.35 })
        );
        const globeCore = new THREE.Mesh(
            new THREE.SphereGeometry(1.5, 24, 24),
            new THREE.MeshStandardMaterial({ color: 0x0a0a14, metalness: 0.6, roughness: 0.3, emissive: 0x1a1f4d, emissiveIntensity: 0.6 })
        );
        globeGroup.add(globeCore, globe);

        // glowing points on the globe
        const dotCount = isMobile ? 30 : 60;
        const dotPos = new Float32Array(dotCount * 3);
        for (let i = 0; i < dotCount; i++) {
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = Math.random() * Math.PI * 2;
            const r = 1.72;
            dotPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            dotPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            dotPos[i * 3 + 2] = r * Math.cos(phi);
        }
        const dotGeo = new THREE.BufferGeometry();
        dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPos, 3));
        const dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({
            color: 0x38bdf8, size: 0.08, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false
        }));
        globeGroup.add(dots);

        let tmx = 0, tmy = 0, mxv = 0, myv = 0;
        window.addEventListener("mousemove", (e) => {
            tmx = (e.clientX / window.innerWidth - 0.5);
            tmy = (e.clientY / window.innerHeight - 0.5);
        });

        const clock = new THREE.Clock();
        function animate() {
            const t = clock.getElapsedTime();
            floaters.forEach((m) => {
                m.rotation.x += m.userData.rx;
                m.rotation.y += m.userData.ry;
                m.position.y = m.userData.baseY + Math.sin(t + m.userData.phase) * m.userData.amp;
            });
            globeGroup.rotation.y += 0.004;
            globeGroup.rotation.x = 0.2;

            mxv += (tmx - mxv) * 0.05;
            myv += (tmy - myv) * 0.05;
            group.rotation.y = mxv * 0.5;
            group.rotation.x = myv * 0.4;
            globeGroup.position.x = mxv * 0.6;
            globeGroup.position.y = -myv * 0.5;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        animate();

        window.addEventListener("resize", () => {
            const s = size();
            camera.aspect = s.w / s.h;
            camera.updateProjectionMatrix();
        }, { passive: true });
    }

    /* ======================================================================
       10. AUTO-TAG elements created by index.js (tool cards) for tilt
       ====================================================================== */
    function enhanceToolCards() {
        // index.js renders tool cards into #tools-grid; observe for them.
        const grid = document.getElementById("tools-grid");
        if (!grid) return;
        function tag() {
            grid.querySelectorAll(".tool-card:not([data-enhanced])").forEach((card) => {
                card.setAttribute("data-enhanced", "1");
                card.classList.add("tilt-3d");
                if (!card.querySelector(".tilt-glare")) {
                    const g = document.createElement("span");
                    g.className = "tilt-glare";
                    card.appendChild(g);
                }
            });
            initTilt();
        }
        tag();
        const mo = new MutationObserver(tag);
        mo.observe(grid, { childList: true });
    }

    /* ======================================================================
       INIT
       ====================================================================== */
    // Load Three.js ONLY on desktop (saves ~600KB + heavy GPU work on phones).
    function load3D() {
        if (isMobile || prefersReduced) return;      // phones rely on CSS effects (fast)
        if (window.THREE) { initBackground3D(); initHero3D(); return; }
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        s.async = true;
        s.onload = () => { initBackground3D(); initHero3D(); };
        document.head.appendChild(s);
    }

    document.addEventListener("DOMContentLoaded", () => {
        initScrollProgress();
        initCursorGlow();
        initScrollReveal();
        initCounters();
        initTilt();
        initMagnetic();
        enhanceToolCards();
        // defer 3D until the page is idle so it never blocks first paint
        if ("requestIdleCallback" in window) requestIdleCallback(load3D, { timeout: 2000 });
        else setTimeout(load3D, 800);
    });
})();
