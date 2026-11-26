/* Wedding invitation runtime — plain JavaScript, no framework.
   Drives: page scaling, tap-to-enter cover + music, load-in and in-view
   animations, parallax, birds, bells, flag, story text, photo ticker,
   map, RSVP and countdown. */
(function () {
  "use strict";
  var D = window.__INVITE__ || {};
  var W = D.widget || {};
  var root = document.documentElement;
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var byName = function (name, ctx) { return $$('[data-framer-name="' + name + '"]', ctx); };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  // a widget's real root(s): the markup wraps per-screen-size copies in .ssr-variant
  function roots(container) {
    var out = [];
    (function walk(n) {
      Array.prototype.forEach.call(n.children, function (k) { if (k.classList.contains("ssr-variant")) walk(k); else out.push(k); });
    })(container);
    return out;
  }
  function eachRoot(name, fn) { byName(name).forEach(function (c) { roots(c).forEach(fn); }); }
  var MOBILE_MQ = "(max-width: 767.98px)";
  var BREAKS = [768, 834, 960, 1280, 1515, 1920];

  /* ------------------------------------------------------------------ */
  /* 1. Page scaling: one 430px-wide design, scaled to the viewport      */
  /* ------------------------------------------------------------------ */
  var designWidth = 430;
  (function scaler() {
    var outer = document.querySelector("[data-invitation-layout]");
    var inner = outer && outer.querySelector("[data-invitation-content]");
    if (!outer || !inner) return;
    function apply() {
      var w = outer.clientWidth;
      if (!w) return;
      var mobile = window.matchMedia(MOBILE_MQ).matches;
      var base = 430;
      if (!mobile) { base = BREAKS[0]; BREAKS.forEach(function (b) { if (b <= w) base = b; }); }
      var zoom = w / base;
      designWidth = base;
      inner.style.width = inner.style.minWidth = inner.style.maxWidth = base + "px";
      inner.style.position = "relative";
      inner.style.flexShrink = "0";
      var scaled = mobile && Math.abs(zoom - 1) > 0.003;
      if (scaled) {
        inner.style.zoom = "";
        inner.style.transform = "scale(" + zoom + ")";
        inner.style.transformOrigin = "50% 0";
        outer.style.height = Math.ceil(inner.offsetHeight * zoom) + "px";
      } else {
        inner.style.transform = "";
        inner.style.transformOrigin = "";
        inner.style.zoom = mobile ? "" : String(zoom);
        outer.style.height = "";
      }
    }
    apply();
    if (window.ResizeObserver) {
      new ResizeObserver(apply).observe(outer);
      new ResizeObserver(apply).observe(inner);
    }
    window.addEventListener("resize", apply);
  })();

  /* ------------------------------------------------------------------ */
  /* 2. Easing: springs and cubic-bezier tweens                          */
  /* ------------------------------------------------------------------ */
  function findSpring(durationSec, bounce) {
    var safeMin = 0.001;
    var zeta = clamp(1 - bounce, 0.05, 1);
    var d = clamp(durationSec, 0.01, 10);
    var envelope, derivative;
    var ang = function (w, z) { return w * Math.sqrt(1 - z * z); };
    if (zeta < 1) {
      envelope = function (w) {
        var e = w * zeta, delta = e * d;
        return safeMin - (e / ang(w, zeta)) * Math.exp(-delta);
      };
      derivative = function (w) {
        var e = w * zeta, delta = e * d;
        var dd = 0, ee = Math.pow(zeta, 2) * Math.pow(w, 2) * d, f = Math.exp(-delta);
        var g = ang(Math.pow(w, 2), zeta);
        var factor = -envelope(w) + safeMin > 0 ? -1 : 1;
        return (factor * ((dd - ee) * f)) / g;
      };
    } else {
      envelope = function (w) { return -safeMin + Math.exp(-w * d) * (w * d + 1); };
      derivative = function (w) { return Math.exp(-w * d) * (-w * d * d); };
    }
    var w0 = 5 / d;
    for (var i = 1; i < 12; i++) w0 = w0 - envelope(w0) / derivative(w0);
    if (isNaN(w0)) return { stiffness: 100, damping: 10, mass: 1 };
    var k = w0 * w0;
    return { stiffness: k, damping: zeta * 2 * Math.sqrt(k), mass: 1 };
  }
  // unit step response of a damped spring: 0 -> 1
  function springFn(k, c, m) {
    var w0 = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m));
    if (z < 1) {
      var wd = w0 * Math.sqrt(1 - z * z);
      return function (t) { return 1 - Math.exp(-z * w0 * t) * (((z * w0) / wd) * Math.sin(wd * t) + Math.cos(wd * t)); };
    }
    if (z === 1) return function (t) { return 1 - Math.exp(-w0 * t) * (1 + w0 * t); };
    var wo = w0 * Math.sqrt(z * z - 1);
    return function (t) {
      var e = Math.exp(-z * w0 * t), x = Math.min(wo * t, 300);
      return 1 - (e * (z * w0 * Math.sinh(x) + wo * Math.cosh(x))) / wo;
    };
  }
  function bezier(x1, y1, x2, y2) {
    var cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    var cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    return function (x) {
      var t = x;
      for (var i = 0; i < 8; i++) {
        var f = ((ax * t + bx) * t + cx) * t - x;
        if (Math.abs(f) < 1e-5) break;
        var df = (3 * ax * t + 2 * bx) * t + cx;
        if (Math.abs(df) < 1e-6) break;
        t -= f / df;
      }
      return ((ay * t + by) * t + cy) * t;
    };
  }
  // returns {at(tSec) -> progress, end: seconds until settled}
  function timing(tr) {
    tr = tr || {};
    var delay = tr.delay || 0, fn, end;
    if (tr.type === "tween") {
      var e = tr.ease ? bezier(tr.ease[0], tr.ease[1], tr.ease[2], tr.ease[3]) : function (x) { return x; };
      var dur = tr.duration || 0.3;
      fn = function (t) { return t >= dur ? 1 : e(t / dur); };
      end = dur;
    } else {
      var s = tr.stiffness ? { stiffness: tr.stiffness, damping: tr.damping || 10, mass: tr.mass || 1 }
                           : findSpring(tr.duration || 0.8, tr.bounce == null ? 0.25 : tr.bounce);
      fn = springFn(s.stiffness, s.damping, s.mass);
      end = 0;
      // settle time: when the envelope is below 0.05%
      var w0 = Math.sqrt(s.stiffness / s.mass), z = s.damping / (2 * Math.sqrt(s.stiffness * s.mass));
      var rate = z <= 1 ? z * w0 : w0 * (z - Math.sqrt(z * z - 1));
      end = Math.log(2000) / Math.max(rate, 0.01);
    }
    return { at: function (t) { t -= delay; return t <= 0 ? 0 : t >= end ? 1 : fn(t); }, end: delay + end };
  }

  /* ------------------------------------------------------------------ */
  /* 3. Layered transforms: several effects can move the same element    */
  /* ------------------------------------------------------------------ */
  var FX = new Map();
  function parseTransform(str) {
    var out = [], re = /(\w+)\(([^)]*)\)/g, m;
    while ((m = re.exec(str || ""))) out.push([m[1], m[2].trim()]);
    return out;
  }
  // initial: the motion values the server-rendered inline style represents
  function fxFor(el, initScale) {
    var f = FX.get(el);
    if (f) return f;
    var parts = parseTransform(el.style.transform), pre = "", ssrScale = 1, ssr = { x: 0, y: 0, rotate: 0 };
    parts.forEach(function (p) {
      var name = p[0], val = p[1];
      if ((name === "translateX" || name === "translateY") && val.indexOf("%") > -1) pre += name + "(" + val + ") ";
      else if (name === "translateX") ssr.x = parseFloat(val);
      else if (name === "translateY") ssr.y = parseFloat(val);
      else if (name === "rotate") ssr.rotate = parseFloat(val);
      else if (name === "scale") ssrScale = parseFloat(val);
    });
    var op = el.style.opacity === "" ? 1 : parseFloat(el.style.opacity);
    f = { el: el, pre: pre, mul: ssrScale / (initScale || 1), ssr: ssr, ssrOpacity: op, layers: {}, dirty: false };
    FX.set(el, f);
    return f;
  }
  function setLayer(f, name, v) { f.layers[name] = v; f.dirty = true; }
  function flush() {
    FX.forEach(function (f) {
      if (!f.dirty) return;
      f.dirty = false;
      var x = 0, y = 0, r = 0, s = 1, o = 1, L;
      for (var k in f.layers) {
        L = f.layers[k];
        x += L.x || 0; y += L.y || 0; r += L.rotate || 0;
        s *= L.scale == null ? 1 : L.scale;
        o *= L.opacity == null ? 1 : L.opacity;
      }
      s *= f.mul;
      var t = f.pre;
      if (x) t += "translateX(" + x.toFixed(3) + "px) ";
      if (y) t += "translateY(" + y.toFixed(3) + "px) ";
      if (Math.abs(s - 1) > 1e-4) t += "scale(" + s.toFixed(4) + ") ";
      if (r) t += "rotate(" + r.toFixed(3) + "deg) ";
      f.el.style.transform = t.trim() || "none";
      f.el.style.opacity = String(+o.toFixed(4));
    });
  }
  var KEYS = ["x", "y", "scale", "rotate", "opacity"];
  var IDENT = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };
  var anims = [];
  function animateLayer(f, name, from, to, tr) {
    var tm = timing(tr);
    anims = anims.filter(function (a) { return !(a.f === f && a.name === name); });
    anims.push({ f: f, name: name, from: from, to: to, tm: tm, start: performance.now() });
    setLayer(f, name, from);
  }
  function stepAnims(now) {
    if (!anims.length) return;
    anims = anims.filter(function (a) {
      var t = (now - a.start) / 1000, p = a.tm.at(t), v = {};
      KEYS.forEach(function (k) {
        var a0 = a.from[k] == null ? IDENT[k] : a.from[k], a1 = a.to[k] == null ? IDENT[k] : a.to[k];
        v[k] = a0 + (a1 - a0) * p;
      });
      setLayer(a.f, a.name, v);
      return t < a.tm.end;
    });
  }

  /* ------------------------------------------------------------------ */
  /* 4. Effect tables (values taken from the original design)            */
  /* ------------------------------------------------------------------ */
  var SP = function (bounce, delay, duration) { return { type: "spring", bounce: bounce, delay: delay, duration: duration }; };
  var TW = function (delay, duration) { return { type: "tween", delay: delay, duration: duration, ease: [0.16, 1, 0.3, 1] }; };
  var PARALLAX = {
    "Groom": 20, "Joining Text": 30, "Bride": 40,
    "Ganesha Naamh": 120, "God Photo": 120, "Vakratunda Shlok": 120, "Heavenly Heading": 120, "Heavenly Names": 120,
    "Invitation Text Para": 120, "Groom Name ": 120, "Groom Parents Name": 120, "Joining Word": 120, "Bride Name": 120, "Bride Parents": 120,
    "Sun": 170, "Mountain": 150, "Cloud": 170, "Temple": 120, "Flag": 110, "Flag Rod": 110, "Peacock Pillar Background": 90
  };
  var SCROLL_TARGET = { "Groom": 36, "Joining Text": -36, "Bride": -36 }; // rotate at end; opacity .3, scale .5
  var INVIEW = {
    "Ganesha Naamh": [0.15, SP(0.12, 0.05, 0.65)], "God Photo": [0.15, SP(0.12, 0.05, 0.65)], "Vakratunda Shlok": [0.15, SP(0.12, 0.05, 0.65)],
    "Heavenly Heading": [0.15, SP(0.12, 0.15, 0.65)], "Heavenly Names": [0.15, SP(0.12, 0.15, 0.65)],
    "Invitation Text Para": [0.15, SP(0.12, 0.2, 0.65)],
    "Groom Name ": [0.15, SP(0.12, 0.25, 0.65)], "Groom Parents Name": [0.15, SP(0.12, 0.25, 0.65)],
    "Joining Word": [0.15, SP(0.12, 0.3, 0.65)], "Bride Name": [0.15, SP(0.12, 0.35, 0.65)], "Bride Parents": [0.15, SP(0.12, 0.45, 0.65)],
    "Timeline Heading": [0.2, SP(0.1, 0, 1.2)], "Timeline Subtext": [0.2, SP(0.1, 0.18, 1.2)],
    "Event 1": [0.2, null], "Event 2": [0.2, null], "Event 3": [0.2, null], "Event 4": [0.2, null], "Event 5": [0.2, null], "Event 6": [0.2, null],
    "Meet Couple Heading": [0, SP(0.14, 0, 1), 1.35],
    "Meet Story Text": [0.2, TW(0, 1.2)],
    "Images wrap": [0, { type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }],
    "Map Heading": [0, TW(0, 1.4), 0.94], "Map Details": [0, TW(0.15, 1.4), 0.94], "RSVP Form": [0, TW(0.3, 1.4), 0.94],
    "Heading": [0, TW(0, 1.4), 0.94], "Sub Text": [0, TW(0.15, 1.4), 0.94],
    "Countdown Divider": [0, TW(0.3, 1.4), 0.94], "Countdown Timer": [0, TW(0.45, 1.4), 0.94]
  };
  function eventTransition(name, fromLeft) {
    var n = parseInt(name.slice(6), 10);
    if (window.matchMedia(MOBILE_MQ).matches) return SP(0.1, n % 2 ? 0 : 0.1, 1.2);
    return SP(0.1, [0, 0.3, 0.6][(n - 1) % 3], 1.2);
  }

  /* ------------------------------------------------------------------ */
  /* 5. Scroll-linked effects                                            */
  /* ------------------------------------------------------------------ */
  var parallaxItems = [], targetItems = [];
  function docTop(el) { var n = 0; while (el && el instanceof HTMLElement) { n += el.offsetTop; el = el.offsetParent; } return n; }
  function setupScrollEffects() {
    Object.keys(PARALLAX).forEach(function (name) {
      byName(name).forEach(function (el) {
        parallaxItems.push({ f: fxFor(el), k: PARALLAX[name] / 100 - 1 });
      });
    });
    var hero = byName("Ignore Opening Hero Banner")[0];
    Object.keys(SCROLL_TARGET).forEach(function (name) {
      byName(name).forEach(function (el) { targetItems.push({ f: fxFor(el), rot: SCROLL_TARGET[name], ref: hero }); });
    });
  }
  var lastY = -1, lastW = -1;
  function stepScroll() {
    var y = window.scrollY, w = window.innerWidth;
    if (y === lastY && w === lastW) return;
    lastY = y; lastW = w;
    parallaxItems.forEach(function (p) { setLayer(p.f, "parallax", { y: -y * p.k }); });
    targetItems.forEach(function (t) {
      if (!t.ref) return;
      var a = Math.max(docTop(t.ref) - 1, 0), b = Math.max(a + t.ref.clientHeight, a + 1);
      var p = clamp((y - a) / (b - a), 0, 1);
      setLayer(t.f, "target", { opacity: 1 - 0.7 * p, rotate: t.rot * p, scale: 1 - 0.5 * p });
    });
  }

  /* ------------------------------------------------------------------ */
  /* 6. Load-in animations (play once the cover has faded)               */
  /* ------------------------------------------------------------------ */
  function activeHash() {
    var bp = D.breakpoints || [];
    for (var i = 0; i < bp.length; i++) if (window.matchMedia(bp[i].mediaQuery).matches) return bp[i].hash;
    return null;
  }
  function prepareAppear() {
    var hash = activeHash(), table = D.appear || {};
    return $$("[data-framer-appear-id]").map(function (el) {
      var cfg = table[el.getAttribute("data-framer-appear-id")];
      if (!cfg) return null;
      cfg = cfg[hash] || cfg["default"];
      if (!cfg || !cfg.initial || !cfg.animate) return null;
      var f = fxFor(el, cfg.initial.scale == null ? 1 : cfg.initial.scale);
      setLayer(f, "appear", cfg.initial);
      return { f: f, cfg: cfg };
    }).filter(Boolean);
  }
  function playAppear(list) {
    list.forEach(function (a) { animateLayer(a.f, "appear", a.cfg.initial, a.cfg.animate, a.cfg.animate.transition); });
  }

  /* ------------------------------------------------------------------ */
  /* 7. In-view reveals                                                  */
  /* ------------------------------------------------------------------ */
  var THRESHOLDS = []; for (var ti = 0; ti <= 20; ti++) THRESHOLDS.push(ti / 20);
  function prepareInView() {
    var items = [];
    Object.keys(INVIEW).forEach(function (name) {
      var cfg = INVIEW[name];
      byName(name).forEach(function (el) {
        if (el.style.opacity !== "0") return; // not a hidden-until-seen layer
        var f = fxFor(el, cfg[2] || 1);
        var from = { x: f.ssr.x, y: f.ssr.y, rotate: f.ssr.rotate, scale: cfg[2] || 1, opacity: 0 };
        setLayer(f, "inview", from);
        items.push({ el: el, f: f, from: from, threshold: cfg[0], tr: cfg[1], name: name });
      });
    });
    return items;
  }
  function watchInView(items) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var it = e.target.__inview;
        if (!it || it.done) return;
        var rect = e.boundingClientRect, seen;
        if (rect.height === 0) seen = e.isIntersecting;
        else seen = e.isIntersecting && e.intersectionRect.height / Math.min(rect.height, window.innerHeight) >= it.threshold;
        if (!seen) return;
        it.done = true;
        io.unobserve(e.target);
        var tr = it.tr || eventTransition(it.name, it.from.x < 0);
        animateLayer(it.f, "inview", it.from, IDENT, tr);
      });
    }, { threshold: THRESHOLDS });
    items.forEach(function (it) { it.el.__inview = it; io.observe(it.el); });
  }

  /* ------------------------------------------------------------------ */
  /* 8. Widgets                                                          */
  /* ------------------------------------------------------------------ */
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.onload = res; s.onerror = rej;
      document.body.appendChild(s);
    });
  }
  function whenNear(el, margin, cb) {
    if (!window.IntersectionObserver) return cb();
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); cb(); }
    }, { rootMargin: margin });
    io.observe(el);
  }

  /* --- flocking birds (three.js) --- */
  function initBirds() {
    var hosts = [];
    eachRoot("Birds", function (h) { hosts.push(h); });
    if (!hosts.length) return;
    loadScript("https://unpkg.com/three@0.136.0/build/three.min.js").then(function () {
      hosts.forEach(function (host) { try { birds(host, window.THREE); } catch (e) { console.warn("birds", e); } });
    }).catch(function () {});
  }
  function birds(host, T) {
    var P = { count: 20, size: 1, cohesion: 1.2, maxSpeed: 3, color: "rgb(36, 0, 0)" };
    var w = host.clientWidth || 400, h = host.clientHeight || 400;
    var scene = new T.Scene();
    var cam = new T.PerspectiveCamera(60, w / h, 1, 3000);
    cam.position.z = 350;
    var renderer = new T.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new T.Color("rgb(0,0,0)"), 0);
    host.innerHTML = "";
    host.appendChild(renderer.domElement);
    var rnd = function (s) { return (Math.random() - 0.5) * s; };
    var flock = [], meshes = [], i;
    for (i = 0; i < P.count; i++) flock.push({ pos: new T.Vector3(rnd(350), rnd(350), rnd(350)), vel: new T.Vector3(rnd(2), rnd(2), rnd(2)), acc: new T.Vector3(), phase: Math.random() * Math.PI * 2 });
    var geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.BufferAttribute(new Float32Array([0, 0, -1.5, -3, 0, 0, 0, 0, 1.5, 0, 0, -1.5, 0, 0, 1.5, 0, 0.6, 0, 0, 0, -1.5, 3, 0, 0, 0, 0, 1.5]), 3));
    geo.computeVertexNormals();
    var rest = geo.attributes.position.array.slice();
    var group = new T.Group();
    scene.add(group);
    for (i = 0; i < P.count; i++) {
      var mesh = new T.Mesh(geo.clone(), new T.MeshBasicMaterial({ color: new T.Color(P.color), side: 2, wireframe: false }));
      group.add(mesh); meshes.push(mesh);
    }
    var mouse = new T.Vector3(0, 0, 0);
    window.addEventListener("mousemove", function (e) {
      var r = host.getBoundingClientRect();
      mouse.set(((e.clientX - r.left) / r.width * 2 - 1) * 200, (-((e.clientY - r.top) / r.height) * 2 + 1) * 200, 0);
    });
    var coh = new T.Vector3(), sep = new T.Vector3(), ali = new T.Vector3(), tmp = new T.Vector3(), toMouse = new T.Vector3(), v = new T.Vector3();
    var clock = new T.Clock(), raf = 0, running = false;
    function tick() {
      if (!running) return;
      var dt = Math.min(clock.getDelta(), 0.1), time = clock.getElapsedTime();
      for (var a = 0; a < P.count; a++) {
        var b = flock[a];
        b.acc.set(0, 0, 0); coh.set(0, 0, 0); sep.set(0, 0, 0); ali.set(0, 0, 0);
        var n = 0;
        for (var c = 0; c < P.count; c++) {
          if (a === c) continue;
          var o = flock[c], d2 = b.pos.distanceToSquared(o.pos);
          if (d2 < 6400) {
            coh.add(o.pos); ali.add(o.vel); n++;
            if (d2 < 625 && d2 > 0) { tmp.subVectors(b.pos, o.pos).normalize().divideScalar(Math.sqrt(d2)); sep.add(tmp); }
          }
        }
        if (n > 0) {
          coh.divideScalar(n).sub(b.pos).normalize().multiplyScalar(P.cohesion); b.acc.add(coh);
          ali.divideScalar(n).normalize().multiplyScalar(0.5); b.acc.add(ali);
          sep.normalize().multiplyScalar(1.5); b.acc.add(sep);
        }
        toMouse.subVectors(mouse, b.pos);
        if (toMouse.lengthSq() > 0) { toMouse.normalize().multiplyScalar(P.cohesion * 0.8); b.acc.add(toMouse); }
        if (Math.abs(b.pos.x) > 220) b.acc.x -= Math.sign(b.pos.x) * 2;
        if (Math.abs(b.pos.y) > 220) b.acc.y -= Math.sign(b.pos.y) * 2;
        if (Math.abs(b.pos.z) > 220) b.acc.z -= Math.sign(b.pos.z) * 2;
        v.copy(b.acc).multiplyScalar(dt * 5); b.vel.add(v);
        if (b.vel.lengthSq() > P.maxSpeed * P.maxSpeed) b.vel.normalize().multiplyScalar(P.maxSpeed);
        v.copy(b.vel).multiplyScalar(dt * 40); b.pos.add(v);
        var m = meshes[a];
        m.position.copy(b.pos);
        v.addVectors(b.pos, b.vel); m.lookAt(v);
        m.scale.setScalar(P.size);
        var flap = Math.sin(time * b.vel.length() * 4 + b.phase) * 1.5;
        var attr = m.geometry.attributes.position, arr = attr.array;
        for (var q = 0; q < arr.length; q++) arr[q] = rest[q];
        arr[4] = flap; arr[22] = flap;
        attr.needsUpdate = true;
      }
      renderer.render(scene, cam);
      raf = requestAnimationFrame(tick);
    }
    new IntersectionObserver(function (es) {
      var was = running;
      running = es[0].isIntersecting;
      if (running && !was) { clock.start(); tick(); } else if (!running && was) cancelAnimationFrame(raf);
    }, { threshold: 0.1 }).observe(host);
    if (window.ResizeObserver) new ResizeObserver(function () {
      var cw = host.clientWidth, ch = host.clientHeight;
      if (cw && ch) { cam.aspect = cw / ch; cam.updateProjectionMatrix(); renderer.setSize(cw, ch); }
    }).observe(host);
  }

  /* --- hanging bells: spring pendulum, hover/tap to ring --- */
  var bells = [];
  function initBells() {
    $$('[role="img"][aria-label="Hanging bell with flowers"]').forEach(function (el) {
      var arm = el.firstElementChild;
      if (!arm) return;
      var holder = el.closest('[data-framer-name^="Bell "]');
      var heavy = holder && holder.getAttribute("data-framer-name") === "Bell 4";
      var b = { el: el, arm: arm, angle: 0, vel: 0, push: 0, near: false, visible: true, mass: heavy ? 2 : 1.5, volume: heavy ? 0.75 : 0.6, lastSound: 0, timer: 0 };
      new IntersectionObserver(function (es) { b.visible = es[0].isIntersecting; }, { rootMargin: "200px" }).observe(el);
      el.addEventListener("pointerdown", function (e) {
        var r = el.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2);
        b.push = (dx === 0 ? 1 : dx / Math.abs(dx)) * 18;
        ring(b);
        clearTimeout(b.timer);
        b.timer = setTimeout(function () { b.push = 0; }, 180);
      });
      bells.push(b);
    });
    if (!bells.length) return;
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      var radius = 57 * designWidth / 430;
      bells.forEach(function (b) {
        if (!b.visible || !b.el.offsetParent) return;
        var r = b.el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.55);
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius) {
          b.push = (dx === 0 ? 0 : dx / Math.abs(dx)) * (1 - dist / radius) * 18;
          if (!b.near) ring(b);
          b.near = true;
        } else { b.push = 0; b.near = false; }
      });
    });
  }
  var bellSound = null;
  function ring(b) {
    var now = performance.now();
    if (now - b.lastSound < 500) return;
    b.lastSound = now;
    try {
      if (!bellSound) { bellSound = new Audio("assets/h45eKdEQgEZsNQLY8z9lrI3tuY.mp3"); bellSound.preload = "auto"; }
      var a = bellSound.cloneNode(true);
      a.volume = b.volume;
      a.play().catch(function () {});
    } catch (e) {}
  }
  function stepBells(now, dt) {
    if (!bells.length) return;
    var T = 5000, idle = Math.sin(((now % T) / T) * Math.PI * 2) * 2.5;
    bells.forEach(function (b) {
      if (!b.visible) return;
      var target = idle + b.push, steps = 4, h = dt / steps;
      for (var i = 0; i < steps; i++) {
        var acc = (-40 * (b.angle - target) - 6 * b.vel) / b.mass;
        b.vel += acc * h; b.angle += b.vel * h;
      }
      b.arm.style.transform = "rotate(" + b.angle.toFixed(3) + "deg)";
    });
  }

  /* --- waving flag (WebGL2 cloth shader) --- */
  function initFlags() {
    var shaders = D.flag;
    if (!shaders) return;
    byName("Flag").forEach(function (c) {
      $$("canvas", c).forEach(function (canvas) { try { flag(canvas, shaders); } catch (e) { console.warn("flag", e); } });
    });
  }
  function flag(canvas, shaders) {
    var P = { wind: 2, speed: 3, weave: 1, sheen: 1, brightness: 1.21, shading: 0.51, aspect: 1.5 };
    var gl = canvas.getContext("webgl2", { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!gl) return;
    function compile(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(s));
      return s;
    }
    var prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, shaders.vertex));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, shaders.fragment));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(prog));
    var cols = 96, rows = 64, uv = [], idx = [], i, j;
    for (i = 0; i <= rows; i++) for (j = 0; j <= cols; j++) uv.push(j / cols, i / rows);
    for (i = 0; i < rows; i++) for (j = 0; j < cols; j++) {
      var a = i * (cols + 1) + j, b = a + 1, c = a + cols + 1, d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    [0, 1].forEach(function (loc) {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    });
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(idx), gl.STATIC_DRAW);
    gl.bindVertexArray(null);

    var tex = gl.createTexture(), texAspect = 1, uvScale = [1, 1], ready = false;
    function fit() { uvScale = texAspect > P.aspect ? [P.aspect / texAspect, 1] : [1, texAspect / P.aspect]; }
    var img = new Image();
    img.onload = function () {
      texAspect = img.naturalWidth / img.naturalHeight; fit();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.bindTexture(gl.TEXTURE_2D, null);
      ready = true;
    };
    img.src = "assets/ea6WAeUsN6PJaauIQhAYB0hyDQ.webp";

    var U = {};
    ["uTime", "uCanvasAspect", "uPlaneAspect", "uAmbientAmp", "uSpeed", "uGustCenter", "uGustVelocity", "uGustStrength", "uUvScale", "uUvOffset", "uWeave", "uSheen", "uBrightness", "uShading", "uTex"]
      .forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    var hover = 0, gust = 0, center = [0.5, 0.5], aim = [0.5, 0.5], vel = [0, 0], velS = [0, 0], amp = 0.06, last = null;
    function track(cx, cy) {
      var r = canvas.getBoundingClientRect(), ca = r.width / Math.max(1, r.height), fw = r.width, fh = r.height;
      if (ca > P.aspect) fw = r.height * P.aspect; else fh = r.width / P.aspect;
      var u = clamp((cx - r.left - (r.width - fw) * 0.5) / Math.max(1, fw), 0, 1);
      var v = clamp(1 - (cy - r.top - (r.height - fh) * 0.5) / Math.max(1, fh), 0, 1);
      aim = [u, v];
      var now = performance.now();
      if (last) {
        var dt = Math.max(0.001, (now - last.t) * 0.001);
        vel = [vel[0] * 0.7 + ((u - last.u) / dt) * 0.3, vel[1] * 0.7 + ((v - last.v) / dt) * 0.3];
      }
      last = { u: u, v: v, t: now };
    }
    canvas.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") hover = 1; });
    canvas.addEventListener("pointerleave", function (e) { if (e.pointerType !== "touch") { hover = 0; last = null; } });
    canvas.addEventListener("pointerdown", function (e) { if (e.pointerType === "touch" || e.pointerType === "pen") { hover = 1; track(e.clientX, e.clientY); } });
    canvas.addEventListener("pointermove", function (e) { track(e.clientX, e.clientY); });
    var up = function (e) { if (e.pointerType === "touch" || e.pointerType === "pen") { hover = 0; last = null; } };
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    function size() {
      var r = canvas.getBoundingClientRect(), dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      var w = Math.max(1, Math.floor(r.width * dpr)), h = Math.max(1, Math.floor(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    var visible = true, raf = 0, t0 = performance.now();
    function draw() {
      raf = 0;
      size();
      gust += (hover - gust) * 0.045;
      center[0] += (aim[0] - center[0]) * 0.1; center[1] += (aim[1] - center[1]) * 0.1;
      velS[0] += (vel[0] - velS[0]) * 0.12; velS[1] += (vel[1] - velS[1]) * 0.12;
      vel[0] *= 0.94; vel[1] *= 0.94;
      amp += (0.06 * P.wind - amp) * 0.08;
      gl.enable(gl.DEPTH_TEST);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      if (ready) {
        gl.useProgram(prog);
        gl.bindVertexArray(vao);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(U.uTex, 0);
        gl.uniform1f(U.uTime, (performance.now() - t0) * 0.001);
        gl.uniform1f(U.uCanvasAspect, canvas.width / Math.max(1, canvas.height));
        gl.uniform1f(U.uPlaneAspect, P.aspect);
        gl.uniform1f(U.uAmbientAmp, amp);
        gl.uniform1f(U.uSpeed, P.speed);
        gl.uniform2f(U.uGustCenter, center[0], center[1]);
        gl.uniform2f(U.uGustVelocity, velS[0], velS[1]);
        gl.uniform1f(U.uGustStrength, gust * P.wind);
        gl.uniform2f(U.uUvScale, uvScale[0], uvScale[1]);
        gl.uniform2f(U.uUvOffset, 0, 0);
        gl.uniform1f(U.uWeave, P.weave);
        gl.uniform1f(U.uSheen, P.sheen);
        gl.uniform1f(U.uBrightness, P.brightness);
        gl.uniform1f(U.uShading, P.shading);
        gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_INT, 0);
        gl.bindVertexArray(null);
      }
      if (visible) raf = requestAnimationFrame(draw);
    }
    new IntersectionObserver(function (es) {
      var was = visible;
      visible = es[0].isIntersecting;
      if (visible && !was && !raf) raf = requestAnimationFrame(draw);
    }, { rootMargin: "200px" }).observe(canvas);
    draw();
  }

  /* --- story text that fills with colour as you scroll --- */
  var stories = [];
  function initStory() {
    eachRoot("Meet Story Text", function (box) {
      stories.push({ box: box, spans: $$("span", box), p: 0, shown: -2 });
    });
  }
  function stepStory(dt) {
    stories.forEach(function (s) {
      if (!s.box.offsetParent) return;
      // the original measures the block while it still sits 24px low (pre-reveal)
      var vh = window.innerHeight, r = s.box.getBoundingClientRect(), k = r.width / (s.box.offsetWidth || 1);
      var holder = s.box.closest('[data-framer-name="Meet Story Text"]'), f = holder && FX.get(holder);
      var shift = f && f.layers.inview ? (f.layers.inview.y || 0) : 0;
      var top = r.top + (24 - shift) * k;
      var raw = clamp((vh * 0.9 - top) / (vh * 0.8), 0, 1);
      s.p += (raw - s.p) * (1 - Math.exp(-dt / 0.1));
      if (Math.abs(raw - s.p) < 0.0005) s.p = raw;
      var upTo = Math.floor(s.p * s.spans.length);
      if (upTo === s.shown) return;
      s.shown = upTo;
      s.spans.forEach(function (sp, i) { sp.style.color = i <= upTo ? "rgb(95, 37, 15)" : "rgba(95, 37, 15, 0.22)"; });
    });
  }

  /* --- photo ticker (auto-scrolling, draggable) --- */
  var tickers = [];
  function initTicker() {
    byName("Images").forEach(function (wrap) {
      var ul = wrap.querySelector("ul");
      if (!ul || !ul.children.length) return;
      var originals = Array.prototype.slice.call(ul.children);
      for (var r = 0; r < 3; r++) originals.forEach(function (li) {
        var c = li.cloneNode(true);
        c.setAttribute("aria-hidden", "true");
        ul.appendChild(c);
      });
      $$("img", ul).forEach(function (im) { im.setAttribute("draggable", "false"); im.loading = "eager"; });
      ul.style.opacity = "1";
      ul.style.willChange = "transform";
      var t = { wrap: wrap, ul: ul, count: originals.length, x: 0, visible: false, drag: null, hover: false };
      new IntersectionObserver(function (es) { t.visible = es[0].isIntersecting; }).observe(wrap);
      wrap.style.cursor = "grab";
      wrap.addEventListener("pointerdown", function (e) {
        t.drag = { x: e.clientX, id: e.pointerId, moved: false };
        wrap.style.cursor = "grabbing";
      });
      window.addEventListener("pointermove", function (e) {
        if (!t.drag || e.pointerId !== t.drag.id) return;
        var scale = wrap.getBoundingClientRect().width / (wrap.offsetWidth || 1);
        t.x += (e.clientX - t.drag.x) / (scale || 1);
        t.drag.x = e.clientX;
      });
      var end = function () { t.drag = null; wrap.style.cursor = "grab"; };
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
      tickers.push(t);
    });
  }
  function stepTicker(dt) {
    tickers.forEach(function (t) {
      if (!t.visible) return;
      var first = t.ul.children[0], next = t.ul.children[t.count];
      if (!first || !next) return;
      var span = next.offsetLeft - first.offsetLeft;
      if (!span) return;
      if (!t.drag) t.x -= 70 * dt;
      t.x = ((t.x % span) - span) % span; // keep in (-span, 0]
      t.ul.style.transform = "translateX(" + t.x.toFixed(2) + "px)";
    });
  }

  /* --- countdown --- */
  var countdowns = [];
  function initCountdown() {
    if (!document.getElementById("font-Inter")) {
      var l = document.createElement("link");
      l.id = "font-Inter"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css?family=Inter:300,400,500,600,700,800,900&display=swap";
      document.head.appendChild(l);
    }
    eachRoot("Countdown Timer", function (rootEl) {
      var rows = Array.prototype.slice.call(rootEl.children).map(function (unit) { return unit.firstElementChild; });
      if (rows.length !== 4) return;
      var proto = rows[0].firstElementChild;
      rows.forEach(function (row) { row.__digits = []; });
      countdowns.push({ rows: rows, boxStyle: proto.getAttribute("style"), spanStyle: proto.firstElementChild.getAttribute("style") });
    });
    tickCountdown();
    setInterval(tickCountdown, 1000);
  }
  var TARGET = +new Date("2026-12-21T11:30:00.000+05:30");
  var digitAnims = [];
  var digitSpring = springFn(450, 35, 1);
  function tickCountdown() {
    var ms = TARGET - Date.now();
    var v = ms > 0 ? [Math.floor(ms / 864e5), Math.floor((ms / 36e5) % 24), Math.floor((ms / 1e3 / 60) % 60), Math.floor((ms / 1e3) % 60)] : [0, 0, 0, 0];
    countdowns.forEach(function (cd) {
      cd.rows.forEach(function (row, i) {
        var chars = (v[i] < 10 ? "0" + v[i] : String(v[i])).split("");
        var first = !row.__built;
        if (first || row.children.length !== chars.length) {
          row.innerHTML = "";
          row.__digits = chars.map(function (ch) {
            var box = document.createElement("div");
            box.setAttribute("style", cd.boxStyle);
            var sp = document.createElement("span");
            sp.setAttribute("style", cd.spanStyle);
            sp.textContent = ch;
            box.appendChild(sp); row.appendChild(box);
            return { box: box, span: sp, ch: ch };
          });
          row.__built = true;
          return;
        }
        row.__digits.forEach(function (d, k) {
          if (d.ch === chars[k]) return;
          var old = d.span, neu = old.cloneNode(false);
          neu.textContent = chars[k];
          d.box.appendChild(neu);
          d.span = neu; d.ch = chars[k];
          digitAnims.push({ old: old, neu: neu, start: performance.now() });
        });
      });
    });
  }
  function stepDigits(now) {
    if (!digitAnims.length) return;
    digitAnims = digitAnims.filter(function (a) {
      var t = (now - a.start) / 1000, p = t > 0.6 ? 1 : digitSpring(t);
      a.neu.style.transform = "translateY(" + (-60 * (1 - p)).toFixed(2) + "%)";
      a.neu.style.opacity = String(clamp(p, 0, 1));
      a.neu.style.filter = "blur(" + Math.max(0, 6 * (1 - p)).toFixed(2) + "px)";
      a.old.style.transform = "translateY(" + (60 * p).toFixed(2) + "%)";
      a.old.style.opacity = String(clamp(1 - p, 0, 1));
      a.old.style.filter = "blur(" + Math.max(0, 6 * p).toFixed(2) + "px)";
      if (t > 0.6) {
        a.neu.style.transform = "none"; a.neu.style.filter = "blur(0px)";
        if (a.old.parentNode) a.old.parentNode.removeChild(a.old);
        return false;
      }
      return true;
    });
  }

  /* --- venue map with location switcher (Leaflet + OpenStreetMap) --- */
  function initMaps() {
    var locs = W.locations || [];
    eachRoot("Map Details", function (box) {
      if (box.children.length < 2) return;
      try { venueMap(box, locs); } catch (e) { console.warn("map", e); }
    });
  }
  function venueMap(box, locs) {
    var mapWrap = box.children[0], panel = box.children[1], grid = box.children[2];
    var mapEl = mapWrap.querySelector('[role="region"]');
    var link = mapWrap.querySelector("a"), recenter = mapWrap.querySelector("button");
    var pill = Array.prototype.slice.call(mapWrap.children).filter(function (n) { return n.textContent === "Tap to interact with map"; })[0];
    var label = Array.prototype.slice.call(mapWrap.children).filter(function (n) { return n !== mapEl && n !== link && n !== recenter && n !== pill; })[0];
    var header = panel.children[0], sub = panel.children[1], copyBtn = panel.querySelector("button");
    var buttons = grid ? $$("button", grid) : [];
    var active = 0, map = null, marker = null, touched = false;
    var coords = function (l) {
      var p = String((l && l.coordinates) || "").split(",").map(function (s) { return parseFloat(s); });
      return p.length === 2 && !isNaN(p[0]) && !isNaN(p[1]) ? p : null;
    };
    var pin = function (L) {
      return L.divIcon({ className: "location-showcase-pin", iconSize: [30, 40], iconAnchor: [15, 40], popupAnchor: [0, -40],
        html: '<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg"><path d="M15 0C6.716 0 0 6.716 0 15c0 10.5 15 25 15 25s15-14.5 15-25C30 6.716 23.284 0 15 0z" fill="' + (W.accentColor || "#EA4335") + '"/><circle cx="15" cy="15" r="5.5" fill="#ffffff"/></svg>' });
    };
    function show(i) {
      active = i;
      var l = locs[i];
      if (!l) return;
      header.textContent = l.addressHeader || "";
      sub.textContent = l.addressSubtext || "";
      if (label) label.textContent = l.overlayLabel || "";
      if (link) link.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(l.coordinates || "");
      buttons.forEach(function (b, k) {
        var on = k === i;
        b.style.background = on ? "rgb(179, 116, 67)" : "rgb(255, 255, 255)";
        b.style.color = on ? "rgb(255, 255, 255)" : "rgb(110, 55, 4)";
        b.style.borderColor = on ? "rgb(179, 116, 67)" : "rgb(208, 208, 208)";
      });
      var c = coords(l);
      if (map && c) { map.setView(c, l.zoom || 14); if (marker) marker.setLatLng(c); }
    }
    buttons.forEach(function (b, k) { b.addEventListener("click", function () { show(k); }); });
    if (recenter) recenter.addEventListener("click", function () { var c = coords(locs[active]); if (map && c) map.setView(c, locs[active].zoom || 14); });
    if (copyBtn) {
      var copyIcon = copyBtn.innerHTML;
      copyBtn.addEventListener("click", function () {
        var l = locs[active];
        if (!l || !navigator.clipboard) return;
        navigator.clipboard.writeText([l.addressHeader, l.addressSubtext].filter(Boolean).join(" — ")).then(function () {
          copyBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          setTimeout(function () { copyBtn.innerHTML = copyIcon; }, 1500);
        }, function () {});
      });
    }
    // side-by-side layout when the widget is wide (desktop)
    var column = null, wide = null;
    function layout(isWide) {
      if (isWide === wide) return;
      wide = isWide;
      if (isWide) {
        if (!column) { column = document.createElement("div"); column.style.cssText = "flex:1 1 50%;display:flex;flex-direction:column;gap:16px;justify-content:flex-start"; }
        box.style.flexDirection = "row"; box.style.alignItems = "stretch"; box.style.gap = "24px";
        mapWrap.style.flex = "1 1 50%"; mapWrap.style.width = ""; mapWrap.style.height = ""; mapWrap.style.minHeight = (W.mapHeight || 320) + "px";
        panel.style.flex = "1"; panel.style.flexShrink = "";
        box.appendChild(column); column.appendChild(panel);
        if (grid) { column.appendChild(grid); grid.style.display = "flex"; grid.style.flexDirection = "column"; buttons.forEach(function (b) { b.style.width = "100%"; b.style.boxSizing = "border-box"; }); }
      } else {
        box.style.flexDirection = "column"; box.style.alignItems = ""; box.style.gap = "16px";
        mapWrap.style.flex = ""; mapWrap.style.width = "100%"; mapWrap.style.height = (W.mapHeight || 320) + "px"; mapWrap.style.minHeight = ""; mapWrap.style.flexShrink = "0";
        panel.style.flex = ""; panel.style.flexShrink = "0";
        box.appendChild(panel);
        if (grid) { box.appendChild(grid); grid.style.display = "grid"; grid.style.flexDirection = ""; buttons.forEach(function (b) { b.style.width = ""; }); }
        if (column && column.parentNode) column.parentNode.removeChild(column);
      }
      if (map && !touched) map.invalidateSize();
    }
    if (window.ResizeObserver) new ResizeObserver(function (es) { layout(es[0].contentRect.width >= 768); }).observe(box);

    whenNear(mapEl, "400px", function () {
      var ready = window.L ? Promise.resolve() : new Promise(function (res) {
        var css = document.createElement("link");
        css.id = "leaflet-style"; css.rel = "stylesheet"; css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(css);
        loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js").then(res, function () {});
      });
      ready.then(function () {
        var L = window.L, l = locs[active], c = coords(l) || [20.5937, 78.9629], z = (l && l.zoom) || 14;
        map = L.map(mapEl, { zoomControl: true, attributionControl: false, scrollWheelZoom: false, dragging: false, touchZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false }).setView(c, z);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
        marker = L.marker(c, { icon: pin(L) }).addTo(map);
        map.on("click", function unlock() {
          map.dragging.enable(); map.scrollWheelZoom.enable(); map.touchZoom.enable(); map.doubleClickZoom.enable(); map.boxZoom.enable(); map.keyboard.enable();
          map.off("click", unlock);
          touched = true;
          if (pill && pill.parentNode) pill.parentNode.removeChild(pill);
        });
        if (window.ResizeObserver) new ResizeObserver(function () {
          if (map && !touched) { map.invalidateSize(); var cc = coords(locs[active]); if (cc) map.setView(cc, locs[active].zoom || 14); }
        }).observe(mapEl);
      });
    });
    show(0);
  }

  /* --- RSVP via WhatsApp --- */
  function initRsvp() {
    eachRoot("RSVP Form", function (card) {
      try { rsvp(card); } catch (e) { console.warn("rsvp", e); }
    });
  }
  function rsvp(card) {
    var nameInput = card.querySelector('input[type="text"]'), select = card.querySelector("select"), send = card.querySelector("a");
    var trigger = card.querySelector('button[type="button"]');
    if (!nameInput || !select || !send || !trigger) return;
    var holder = trigger.parentNode, labelSpan = trigger.querySelector("span"), chevron = trigger.querySelector("svg");
    var options = (W.eventOptions || []).filter(Boolean), multi = W.allowMultipleEvents !== false;
    var chosen = [], open = false, menu = null;
    var text = W.textColor || "rgb(17,17,17)", border = W.inputBorderColor || "#E0E0E0", green = W.buttonColor || "#25D366";
    var font = "font-family:" + getComputedStyle(nameInput).fontFamily + ";";
    function buildMenu() {
      menu = document.createElement("div");
      menu.style.cssText = "position:absolute;top:calc(100% + 6px);left:0;right:0;background:" + (W.inputBackgroundColor || "#fff") + ";border:1px solid " + border + ";border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:1000;max-height:220px;overflow-y:auto";
      options.forEach(function (o) {
        var row = document.createElement("div");
        row.style.cssText = "display:flex;align-items:center;gap:8px;padding:10px 12px;font-size:14px;" + font + "line-height:1em;color:" + text + ";cursor:pointer";
        var on = chosen.indexOf(o) > -1;
        if (multi) {
          var box = document.createElement("span");
          box.style.cssText = "width:16px;height:16px;flex-shrink:0;border-radius:4px;border:1.5px solid " + (on ? green : border) + ";background:" + (on ? green : "transparent") + ";display:flex;align-items:center;justify-content:center";
          if (on) box.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          row.appendChild(box);
        }
        row.appendChild(document.createTextNode(o));
        row.addEventListener("click", function () {
          if (multi) { var i = chosen.indexOf(o); if (i > -1) chosen.splice(i, 1); else chosen.push(o); }
          else { chosen = [o]; open = false; }
          render();
        });
        menu.appendChild(row);
      });
      holder.appendChild(menu);
    }
    function render() {
      if (menu && menu.parentNode) menu.parentNode.removeChild(menu);
      menu = null;
      if (open) buildMenu();
      if (chevron) chevron.style.transform = open ? "rotate(180deg)" : "none";
      labelSpan.textContent = chosen.length ? chosen.length + " Selected" : (W.eventPlaceholder || "Select Event");
      trigger.style.color = chosen.length ? text : "rgba(0,0,0,0.4)";
      select.style.color = select.value ? text : "rgba(0,0,0,0.4)";
      var name = nameInput.value.trim(), people = String(select.value || "").trim();
      var ok = name.length > 0 && chosen.length > 0 && people.length > 0;
      var msg = (W.messageTemplate || "").replace(/\{name\}/g, name).replace(/\{events\}/g, chosen.join(", ")).replace(/\{people\}/g, people);
      var num = (W.whatsappNumber || "").replace(/[^\d]/g, "");
      if (ok) send.href = num ? "https://wa.me/" + num + "?text=" + encodeURIComponent(msg) : "#"; else send.removeAttribute("href");
      send.style.cursor = ok ? "pointer" : "not-allowed";
      send.style.opacity = ok ? "1" : "0.5";
      send.__ok = ok;
    }
    trigger.addEventListener("click", function () { open = !open; render(); });
    document.addEventListener("mousedown", function (e) { if (open && !holder.contains(e.target)) { open = false; render(); } });
    nameInput.addEventListener("input", render);
    select.addEventListener("change", render);
    send.addEventListener("click", function (e) { if (!send.__ok) e.preventDefault(); });
    render();
  }

  /* --- music + tap-to-enter cover --- */
  var MUSIC_SRC = "assets/oMOKiqtpEnuUGW2bff5S6TOZxk.mp3";
  var music = (function () {
    var audio = new Audio();
    audio.src = MUSIC_SRC; audio.preload = "auto"; audio.loop = true; audio.volume = 0.6;
    audio.setAttribute("playsinline", "");
    audio.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none";
    document.body.appendChild(audio);
    var m = {
      audio: audio, subs: [], userPaused: false, lastToggleAt: 0,
      play: function () { m.userPaused = false; var p = audio.play(); return p && p.then ? p : Promise.resolve(); },
      pause: function () { m.userPaused = true; audio.pause(); },
      notify: function () {
        m.subs.forEach(function (fn) { fn(); });
        if (navigator.mediaSession) navigator.mediaSession.playbackState = audio.paused ? "paused" : "playing";
      }
    };
    ["play", "pause", "ended"].forEach(function (ev) { audio.addEventListener(ev, m.notify); });
    try {
      if (navigator.mediaSession) {
        navigator.mediaSession.metadata = new window.MediaMetadata({ title: "Wedding Music" });
        navigator.mediaSession.setActionHandler("play", function () { m.play(); });
        navigator.mediaSession.setActionHandler("pause", function () { m.pause(); });
      }
    } catch (e) {}
    return m;
  })();
  function initMusicButton() {
    byName("Music Button").forEach(function (c) { $$("button", c).forEach(wire); });
    function wire(btn) {
      var keyframes = btn.querySelector("style"), note = btn.querySelector("svg");
      var bars = document.createElement("div");
      bars.style.cssText = "display:flex;align-items:center;gap:3px;height:40%";
      [0.5, 1, 0.7, 0.9].forEach(function (h, i) {
        var s = document.createElement("span");
        s.style.cssText = "width:3px;height:" + h * 100 + "%;border-radius:2px;background:rgb(255, 255, 255);transform-origin:center;animation:mb-bar " + (0.7 + i * 0.13) + "s ease-in-out infinite";
        bars.appendChild(s);
      });
      function paint() {
        var playing = !music.audio.paused;
        btn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
        btn.setAttribute("aria-pressed", String(playing));
        if (playing) { if (note.parentNode) btn.replaceChild(bars, note); }
        else if (bars.parentNode) btn.replaceChild(note, bars);
      }
      void keyframes;
      music.subs.push(paint);
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var now = Date.now();
        if (now - music.lastToggleAt < 350) return;
        music.lastToggleAt = now;
        if (music.audio.paused) music.play().catch(function () {}); else music.pause();
      });
      paint();
    }
  }
  function armMusicRetry() {
    var evs = ["touchend", "click", "keydown"];
    function done() { evs.forEach(function (ev) { window.removeEventListener(ev, retry, true); }); }
    function retry() {
      if (music.userPaused || !music.audio.paused) return done();
      music.lastToggleAt = Date.now();
      music.play().then(done, function () {});
    }
    evs.forEach(function (ev) { window.addEventListener(ev, retry, true); });
  }

  /* --- smooth scrolling (Lenis) --- */
  var lenis = null;
  function initSmoothScroll() {
    loadScript("https://unpkg.com/lenis@1.1.20/dist/lenis.min.js").then(function () {
      if (!window.Lenis) return;
      $$("*").forEach(function (n) { if (getComputedStyle(n).overflow === "auto") n.setAttribute("data-lenis-prevent", "true"); });
      lenis = window.__lenis = new window.Lenis({ duration: 6 });
      if (root.classList.contains("fw-locked")) lenis.stop();
      // clicking the native scrollbar should not fight the eased scroll
      window.addEventListener("mousedown", function (e) {
        if (e.button !== 0) return;
        var cw = root.clientWidth;
        if (e.clientX >= cw && cw < window.innerWidth) { try { lenis.scrollTo(window.scrollY, { immediate: true, force: true }); } catch (x) {} }
      }, true);
    }).catch(function () {});
  }

  /* ------------------------------------------------------------------ */
  /* 9. Boot                                                             */
  /* ------------------------------------------------------------------ */
  var appearList = prepareAppear();
  var inviewList = prepareInView();
  setupScrollEffects();
  stepScroll();
  flush();
  initMusicButton();
  initRsvp();
  initMaps();
  initStory();
  initCountdown();
  initSmoothScroll();

  var released = false, prev = performance.now();
  function frame(now) {
    var dt = Math.min((now - prev) / 1000, 0.05);
    prev = now;
    if (lenis) lenis.raf(now);
    stepScroll();
    if (released) {
      stepAnims(now);
      stepBells(now, dt);
      stepStory(dt);
      stepTicker(dt);
    }
    stepDigits(now);
    flush();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function release() {
    if (released) return;
    released = true;
    playAppear(appearList);
    watchInView(inviewList);
    initBirds();
    initBells();
    initFlags();
    initTicker();
  }

  var cover = document.getElementById("fw-cover");
  if (!cover) { release(); return; }
  root.classList.add("fw-locked");
  window.scrollTo(0, 0);
  var opened = false;
  function openInvite() {
    if (opened) return;
    opened = true;
    // audio must start inside the tap itself or mobile browsers block it
    music.lastToggleAt = Date.now();
    if (!music.userPaused) music.play().catch(armMusicRetry);
    cover.classList.add("fw-hide");
    root.classList.remove("fw-locked");
    if (lenis) lenis.start();
    setTimeout(function () { if (cover.parentNode) cover.parentNode.removeChild(cover); }, 900);
    setTimeout(function () { if (lenis) lenis.start(); release(); }, 800);
  }
  cover.addEventListener("touchend", function (e) { e.preventDefault(); openInvite(); }, { passive: false });
  cover.addEventListener("click", openInvite);
  cover.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvite(); } });
})();
