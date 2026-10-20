/* Desi Sawad — travelling 3D dish (home page)
   handi (clay pot + biryani) · karahi (iron, chicken / white) · glass (mint / watermelon)
   Anchors: any <section data-dish="handi|karahi|glass" data-x data-y data-s data-ms> ; mobile uses the .zone inside it. */
(function () {
'use strict';
var canvas = document.getElementById('dish3d');
if (!canvas) return;
var anchors = Array.prototype.slice.call(document.querySelectorAll('section[data-dish]'));
var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
function isMobile() { return innerWidth < 1024; }
function boot() { if (!window.THREE) { document.body.classList.add('no3d'); return; } try { init(); } catch (e) { console.warn('3D off', e); document.body.classList.add('no3d'); } }
if (document.readyState === 'complete') boot(); else addEventListener('load', boot, { once: true });

function init() {
  var T = THREE;
  var gl = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  gl.setPixelRatio(Math.min(devicePixelRatio || 1, isMobile() ? 1.5 : 1.6));
  gl.outputEncoding = T.sRGBEncoding; gl.toneMapping = T.ACESFilmicToneMapping; gl.toneMappingExposure = 1.0;
  gl.shadowMap.enabled = true; gl.shadowMap.type = T.PCFShadowMap;
  gl.setClearColor(0, 0);
  var scene = new T.Scene();
  var cam = new T.PerspectiveCamera(28, 1, .1, 100); cam.position.set(0, 1.1, 15); cam.lookAt(0, 0, 0);
  var VH = 2 * Math.tan(T.MathUtils.degToRad(14)) * 15;

  /* neutral photo-studio environment: big soft key, strip lights, warm bounce */
  (function () {
    var es = new T.Scene(), g = new T.SphereGeometry(30, 48, 24), cols = [], p = g.attributes.position;
    for (var i = 0; i < p.count; i++) { var y = p.getY(i) / 30, t = (y + 1) / 2; cols.push(.035 + .22 * t * t, .032 + .2 * t * t, .03 + .17 * t * t); }
    g.setAttribute('color', new T.Float32BufferAttribute(cols, 3));
    es.add(new T.Mesh(g, new T.MeshBasicMaterial({ side: T.BackSide, vertexColors: true })));
    function box(w, h, x, y, z, k, c) { var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(k * c[0], k * c[1], k * c[2]), side: T.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); }
    box(14, 7, -9, 10, 7, 6, [1, .97, .92]);     /* key softbox */
    box(2.2, 18, 12, 2, 1, 4, [1, .96, .9]);     /* right strip */
    box(2, 14, -13, 0, -4, 2.5, [1, .9, .8]);    /* left kicker */
    box(16, 3, 0, -9, 10, 1.1, [1, .78, .55]);   /* warm floor bounce */
    box(10, 10, 0, 14, -6, 1.6, [1, 1, 1]);      /* top */
    var pm = new T.PMREMGenerator(gl); scene.environment = pm.fromScene(es, .04).texture; pm.dispose();
  })();
  var key = new T.DirectionalLight(0xfff3e4, 1.55); key.position.set(-4.5, 9, 6);
  key.castShadow = true; key.shadow.mapSize.set(isMobile() ? 512 : 1024, isMobile() ? 512 : 1024); key.shadow.radius = 7; key.shadow.bias = -.0006;
  var sc = key.shadow.camera; sc.left = -3.5; sc.right = 3.5; sc.top = 3.5; sc.bottom = -3.5; sc.near = 1; sc.far = 30;
  scene.add(key); scene.add(key.target);
  var rim = new T.DirectionalLight(0xffc68a, .9); rim.position.set(6, 3, -7); scene.add(rim);
  var fill = new T.DirectionalLight(0xdfe7ff, .25); fill.position.set(5, 1, 8); scene.add(fill);
  var fire = new T.PointLight(0xff6a2a, 0, 7, 2); fire.position.set(0, -1.6, 1.2); scene.add(fire);
  var amb = new T.HemisphereLight(0xfff4e6, 0x2a1a10, .25); scene.add(amb);

  /* ---------- helpers ---------- */
  var MAXA = gl.capabilities.getMaxAnisotropy();
  function cv(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function tex(c, srgb, rep) { var t = new T.CanvasTexture(c); if (srgb !== false) t.encoding = T.sRGBEncoding; t.anisotropy = Math.min(8, MAXA); if (rep) { t.wrapS = t.wrapT = T.RepeatWrapping; } return t; }
  function R(a, b) { return a + Math.random() * (b - a); }
  function lin(h) { return new T.Color(h).convertSRGBToLinear(); }
  function profile(pts, n) { var c = new T.SplineCurve(pts.map(function (p) { return new T.Vector2(p[0], p[1]); })); return c.getSpacedPoints(n || 120); }
  function lathe(v2, seg) { return new T.LatheGeometry(v2, seg || 128); }
  function blotches(g, w, h, n, cols, rmin, rmax, a) { for (var i = 0; i < n; i++) { var x = Math.random() * w, y = Math.random() * h, r = R(rmin, rmax), gr = g.createRadialGradient(x, y, 0, x, y, r); var col = cols[Math.random() * cols.length | 0]; gr.addColorStop(0, col.replace('A', (a * R(.5, 1)).toFixed(3))); gr.addColorStop(1, col.replace('A', '0')); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); } }
  function speck(g, w, h, n, col, s) { for (var i = 0; i < n; i++) { g.fillStyle = col.replace('A', R(.03, .14).toFixed(3)); g.fillRect(Math.random() * w, Math.random() * h, R(.6, s), R(.6, s)); } }
  function blob(s, j, seg) { var g = new T.SphereGeometry(s, 28, 20), p = g.attributes.position, v = new T.Vector3(); var o1 = R(0, 9), o2 = R(0, 9); for (var i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); var n = 1 + j * (Math.sin(v.x * 7 + o1) * Math.cos(v.y * 6 + o2) * .6 + Math.sin(v.z * 9 + o1) * .4); v.multiplyScalar(n); p.setXYZ(i, v.x, v.y, v.z); } g.computeVertexNormals(); return g; }
  function softShadow(sz, k) { var c = cv(256, 256), g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 2, 128, 128, 128); gr.addColorStop(0, 'rgba(0,0,0,' + (k || .7) + ')'); gr.addColorStop(.35, 'rgba(0,0,0,' + ((k || .7) * .45) + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    var m = new T.Mesh(new T.PlaneGeometry(sz, sz), new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.renderOrder = -1; return m; }
  function catcher(sz) { var m = new T.Mesh(new T.PlaneGeometry(sz, sz), new T.ShadowMaterial({ opacity: .32 })); m.rotation.x = -Math.PI / 2; m.receiveShadow = true; m.position.y = .004; return m; }
  var steamTex = (function () { var c = cv(256, 256), g = c.getContext('2d'); for (var i = 0; i < 7; i++) { var x = R(80, 176), y = R(80, 176), r = R(40, 90), gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,.22)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); } return new T.CanvasTexture(c); })();
  function steam(grp, n, y, spread, rise) { var a = []; for (var i = 0; i < n; i++) { var sp = new T.Sprite(new T.SpriteMaterial({ map: steamTex, transparent: true, depthWrite: false, opacity: 0, rotation: R(0, 6.28) })); sp.userData = { ph: Math.random(), x: (Math.random() - .5) * spread, z: (Math.random() - .5) * spread * .6, sp: R(.08, .14), y: y, rise: rise, rot: R(-.3, .3) }; grp.add(sp); a.push(sp); } return a; }
  function animSteam(arr, time, k) { arr.forEach(function (s) { var u = s.userData, p = (u.ph + time * u.sp) % 1; s.position.set(u.x + Math.sin(time * .9 + u.ph * 9) * .22 * p, u.y + p * u.rise, u.z); s.scale.setScalar(.45 + p * 1.5); s.material.rotation += u.rot * .01; s.material.opacity = Math.sin(Math.PI * p) * .5 * k; }); }
  function shadowAll(g) { g.traverse(function (o) { if (o.isMesh && !(o.material && (o.material.transparent || o.material.isShadowMaterial))) { o.castShadow = true; } }); }

  /* ══════════════ HANDI ══════════════ */
  var handi = new T.Group();
  var OUT = profile([[.001, 0], [.46, 0], [.6, .05], [.88, .2], [1.1, .44], [1.21, .7], [1.19, .95], [1.06, 1.2], [.89, 1.42], [.76, 1.58], [.72, 1.68], [.74, 1.76], [.82, 1.82], [.87, 1.86], [.85, 1.9], [.77, 1.89], [.72, 1.84], [.69, 1.74], [.67, 1.6]], 150);
  function vAt(y) { var best = 0, d = 9; for (var i = 0; i < OUT.length; i++) { if (i > OUT.length * .85) break; var dd = Math.abs(OUT[i].y - y); if (dd < d) { d = dd; best = i; } } return best / (OUT.length - 1); }
  var clayMap = (function () {
    var W = 2048, H = 1024, c = cv(W, H), g = c.getContext('2d');
    function Y(y) { return (1 - vAt(y)) * H; }
    var gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#6f321b'); gr.addColorStop(.1, '#9b5232'); gr.addColorStop(.45, '#a95c38'); gr.addColorStop(.8, '#8f472a'); gr.addColorStop(1, '#4a2213'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    blotches(g, W, H, 140, ['rgba(176,104,64,A)', 'rgba(120,58,32,A)', 'rgba(150,82,48,A)', 'rgba(95,46,26,A)'], 60, 220, .35);
    /* wheel-thrown rings */
    for (var y = 0; y < H; y += R(2, 7)) { g.fillStyle = (Math.random() < .5 ? 'rgba(255,220,190,' : 'rgba(40,15,5,') + R(.02, .07).toFixed(3) + ')'; g.fillRect(0, y, W, R(1, 3)); }
    speck(g, W, H, 26000, 'rgba(255,230,200,A)', 2.4); speck(g, W, H, 18000, 'rgba(30,10,4,A)', 2);
    /* hand-painted white bands, worn */
    function band(y0, th) { for (var x = 0; x < W; x += 3) { var yy = y0 + Math.sin(x * .004) * 3 + R(-.6, .6); g.fillStyle = 'rgba(238,226,204,' + (Math.random() < .08 ? R(.05, .2) : R(.55, .82)).toFixed(2) + ')'; g.fillRect(x, yy, 3.6, th + R(-.5, .5)); } }
    var s1 = Y(1.36), s2 = Y(1.3), s3 = Y(.98);
    band(s1, 5); band(s2, 3); band(s3, 4);
    for (var x = 20; x < W; x += 38) { if (Math.random() < .06) continue; var yy = (s2 + s3) / 2 + R(-2, 2); g.fillStyle = 'rgba(238,226,204,' + R(.5, .85).toFixed(2) + ')'; g.beginPath(); g.ellipse(x + R(-2, 2), yy, R(5, 7), R(5, 7), 0, 0, 6.28); g.fill();
      g.beginPath(); g.ellipse(x + 19, yy - 16, 3, 3, 0, 0, 6.28); g.ellipse(x + 19, yy + 16, 3, 3, 0, 0, 6.28); g.fill(); }
    /* zig-zag line on the neck */
    var z0 = Y(1.62), z1 = Y(1.52); g.strokeStyle = 'rgba(232,218,192,.6)'; g.lineWidth = 3; g.beginPath(); for (x = 0; x <= W; x += 26) g.lineTo(x + R(-1, 1), (x / 26) % 2 ? z0 : z1); g.stroke();
    /* soot from the flame, darker lower belly */
    var sb = g.createLinearGradient(0, Y(.55), 0, H); sb.addColorStop(0, 'rgba(20,8,3,0)'); sb.addColorStop(.6, 'rgba(20,8,3,.45)'); sb.addColorStop(1, 'rgba(10,4,2,.85)'); g.fillStyle = sb; g.fillRect(0, Y(.55), W, H - Y(.55));
    blotches(g, W, H, 40, ['rgba(15,6,2,A)'], 40, 160, .25);
    /* inside the lip: darker, oily */
    g.fillStyle = 'rgba(30,12,5,.55)'; g.fillRect(0, 0, W, Y(1.86));
    return tex(c);
  })();
  var clayRough = (function () { var c = cv(1024, 512), g = c.getContext('2d'); g.fillStyle = '#d8d8d8'; g.fillRect(0, 0, 1024, 512); blotches(g, 1024, 512, 60, ['rgba(120,120,120,A)'], 30, 120, .5); speck(g, 1024, 512, 8000, 'rgba(255,255,255,A)', 2); g.fillStyle = 'rgba(80,80,80,.6)'; g.fillRect(0, 0, 1024, 40); return tex(c, false); })();
  var clayBump = (function () { var c = cv(1024, 1024), g = c.getContext('2d'); g.fillStyle = '#808080'; g.fillRect(0, 0, 1024, 1024); for (var y = 0; y < 1024; y += R(2, 9)) { g.fillStyle = 'rgba(' + (Math.random() < .5 ? '255,255,255' : '0,0,0') + ',' + R(.05, .22).toFixed(2) + ')'; g.fillRect(0, y, 1024, R(1, 4)); } speck(g, 1024, 1024, 30000, 'rgba(255,255,255,A)', 2); speck(g, 1024, 1024, 20000, 'rgba(0,0,0,A)', 2); return tex(c, false); })();
  var clay = new T.MeshStandardMaterial({ map: clayMap, roughnessMap: clayRough, roughness: 1, metalness: 0, bumpMap: clayBump, bumpScale: .012, envMapIntensity: .55 });
  var pot = new T.Mesh(lathe(OUT, 160), clay); handi.add(pot);
  /* biryani mound */
  (function () {
    var c = cv(1024, 1024), g = c.getContext('2d'); g.fillStyle = '#e9d3a4'; g.fillRect(0, 0, 1024, 1024);
    var cols = ['#fffaf0', '#fff4dd', '#f7e3b5', '#f5c862', '#ee9a3a', '#e57a26', '#fdfcf6', '#f3d38a'];
    for (var i = 0; i < 16000; i++) { g.save(); g.translate(Math.random() * 1024, Math.random() * 1024); g.rotate(Math.random() * 3.14); g.fillStyle = cols[Math.random() * cols.length | 0]; g.beginPath(); g.ellipse(0, 0, R(9, 13), R(2.4, 3.4), 0, 0, 6.28); g.fill(); g.restore(); }
    var t = tex(c);
    var mound = new T.Mesh(new T.SphereGeometry(.7, 64, 20, 0, Math.PI * 2, 0, Math.PI * .26), new T.MeshStandardMaterial({ map: t, roughness: .78, envMapIntensity: .4 }));
    mound.scale.set(1, .75, 1); mound.position.y = 1.58 - .7 * Math.cos(Math.PI * .26) * .75; handi.add(mound);
    /* individual grains */
    var N = isMobile() ? 520 : 900, gg = new T.SphereGeometry(1, 7, 5), gm = new T.MeshStandardMaterial({ roughness: .55, envMapIntensity: .5 }), im = new T.InstancedMesh(gg, gm, N), d = new T.Object3D(), col = new T.Color();
    var GC = ['#fffaf1', '#fffaf1', '#fff1d6', '#f6cf6a', '#efa23c', '#e47a25'];
    for (i = 0; i < N; i++) { var a = Math.random() * 6.28, r = Math.sqrt(Math.random()) * .64, h = Math.cos(Math.min(1, r / .66) * Math.PI / 2) * .14; d.position.set(Math.cos(a) * r, 1.56 + h + R(0, .012), Math.sin(a) * r); d.rotation.set(R(-.5, .5), R(0, 6.28), R(-.3, .3)); d.scale.set(.011, .011, R(.04, .055)); d.updateMatrix(); im.setMatrixAt(i, d.matrix); col.set(GC[Math.random() * GC.length | 0]).convertSRGBToLinear(); im.setColorAt(i, col); }
    im.castShadow = false; handi.add(im);
    /* chicken pieces */
    var chM = new T.MeshPhysicalMaterial({ color: 0xa4521f, roughness: .45, clearcoat: .5, clearcoatRoughness: .4 });
    var chTex = (function () { var c2 = cv(512, 256), g2 = c2.getContext('2d'); g2.fillStyle = '#b25a22'; g2.fillRect(0, 0, 512, 256); blotches(g2, 512, 256, 80, ['rgba(110,40,10,A)', 'rgba(220,130,60,A)', 'rgba(60,20,5,A)'], 8, 40, .7); return tex(c2); })();
    chM.map = chTex; chM.color.set(0xffffff);
    [[-.18, 1.66, .1, .2], [.24, 1.64, -.18, .17]].forEach(function (p) { var m = new T.Mesh(blob(p[3], .18, 3), chM); m.scale.set(1.3, .65, .9); m.position.set(p[0], p[1], p[2]); m.rotation.y = R(0, 3); handi.add(m); });
    /* mint + fried onion + spice */
    var leafS = new T.Shape(); leafS.moveTo(0, 0); leafS.bezierCurveTo(.05, .03, .06, .09, 0, .13); leafS.bezierCurveTo(-.06, .09, -.05, .03, 0, 0);
    var lg = new T.ShapeGeometry(leafS, 8), lm = new T.MeshStandardMaterial({ color: 0x3f7f2c, roughness: .5, side: T.DoubleSide });
    for (i = 0; i < 9; i++) { var lf = new T.Mesh(lg, lm); a = R(0, 6.28); r = R(.05, .55); lf.position.set(Math.cos(a) * r, 1.62 + (1 - r) * .1, Math.sin(a) * r); lf.rotation.set(-Math.PI / 2 + R(-.4, .4), 0, R(0, 6)); handi.add(lf); }
    var om = new T.MeshStandardMaterial({ color: 0x6b3412, roughness: .6 });
    for (i = 0; i < 14; i++) { var on = new T.Mesh(new T.TorusGeometry(R(.04, .07), .008, 4, 10, R(1.5, 3)), om); a = R(0, 6.28); r = R(.05, .58); on.position.set(Math.cos(a) * r, 1.63 + (1 - r) * .08, Math.sin(a) * r); on.rotation.set(Math.PI / 2 + R(-.4, .4), 0, R(0, 6)); handi.add(on); }
  })();
  /* lid */
  var LID = profile([[.9, 0], [.88, .04], [.78, .12], [.6, .2], [.38, .25], [.18, .27], [.12, .3], [.13, .36], [.18, .42], [.15, .48], [.05, .5], [.001, .505]], 80);
  var lid = new T.Group(); var lidM = new T.Mesh(lathe(LID, 128), clay); lid.add(lidM);
  var lidIn = new T.Mesh(new T.CircleGeometry(.88, 64), new T.MeshStandardMaterial({ color: 0x7a3c22, roughness: 1 })); lidIn.rotation.x = Math.PI / 2; lidIn.position.y = .002; lid.add(lidIn);
  lid.position.y = 1.88; handi.add(lid);
  var hSteam = steam(handi, 14, 1.75, .9, 2.2);
  handi.add(softShadow(3.6, .75)); handi.add(catcher(6));
  shadowAll(handi);
  handi.position.y = -1.2;

  /* ══════════════ KARAHI ══════════════ */
  var karahi = new T.Group();
  var KP = profile([[.001, 0], [.4, .01], [.78, .07], [1.08, .2], [1.3, .38], [1.44, .58], [1.5, .74], [1.54, .8], [1.58, .82], [1.57, .86], [1.52, .86], [1.47, .81]], 110);
  var ironMap = (function () { var W = 1024, H = 512, c = cv(W, H), g = c.getContext('2d'); var gr = g.createLinearGradient(0, H, 0, 0); gr.addColorStop(0, '#080706'); gr.addColorStop(.55, '#0f0d0c'); gr.addColorStop(.86, '#1b1612'); gr.addColorStop(.95, '#2a221b'); gr.addColorStop(1, '#3a3028'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    blotches(g, W, H, 90, ['rgba(70,42,22,A)', 'rgba(30,26,40,A)', 'rgba(90,60,30,A)'], 20, 90, .45);
    for (var i = 0; i < 70; i++) { g.strokeStyle = 'rgba(' + (90 + Math.random() * 60 | 0) + ',58,28,' + R(.05, .18).toFixed(2) + ')'; g.lineWidth = R(2, 9); g.beginPath(); var x = Math.random() * W; g.moveTo(x, H * .3); g.bezierCurveTo(x + 30, H * .2, x - 20, H * .1, x + R(-40, 40), R(0, 40)); g.stroke(); }
    speck(g, W, H, 9000, 'rgba(255,240,220,A)', 1.4); return tex(c); })();
  var ironRough = (function () { var c = cv(512, 256), g = c.getContext('2d'); var gr = g.createLinearGradient(0, 256, 0, 0); gr.addColorStop(0, '#9a9a9a'); gr.addColorStop(.7, '#7a7a7a'); gr.addColorStop(1, '#5a5a5a'); g.fillStyle = gr; g.fillRect(0, 0, 512, 256); blotches(g, 512, 256, 60, ['rgba(200,200,200,A)', 'rgba(40,40,40,A)'], 10, 50, .5); return tex(c, false); })();
  var iron = new T.MeshStandardMaterial({ map: ironMap, roughnessMap: ironRough, roughness: 1, metalness: .45, envMapIntensity: .75, side: T.DoubleSide, bumpMap: clayBump, bumpScale: .003 });
  var bowl = new T.Mesh(lathe(KP, 140), iron); karahi.add(bowl);
  [1, -1].forEach(function (sd) {
    var h = new T.Mesh(new T.TorusGeometry(.2, .05, 16, 40, Math.PI), iron); h.position.set(sd * 1.56, .66, 0); h.rotation.z = -sd * Math.PI / 2; karahi.add(h);
    [.46, .86].forEach(function (y) { var rv = new T.Mesh(new T.SphereGeometry(.055, 14, 10), iron); rv.scale.set(.6, 1, 1); rv.position.set(sd * 1.5, y, 0); karahi.add(rv); });
  });
  function gravy(kind) {
    var c = cv(1024, 1024), g = c.getContext('2d'), ch = kind === 'chicken';
    var gr = g.createRadialGradient(512, 512, 40, 512, 512, 512);
    if (ch) { gr.addColorStop(0, '#b8500f'); gr.addColorStop(.5, '#9c3a08'); gr.addColorStop(.84, '#7a2405'); gr.addColorStop(1, '#3e1003'); }
    else { gr.addColorStop(0, '#efe3c8'); gr.addColorStop(.6, '#e4d3ae'); gr.addColorStop(.88, '#cdb588'); gr.addColorStop(1, '#8f7652'); }
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 1024);
    blotches(g, 1024, 1024, 120, ch ? ['rgba(214,96,18,A)', 'rgba(110,26,4,A)', 'rgba(232,130,30,A)'] : ['rgba(255,250,236,A)', 'rgba(190,160,110,A)'], 10, 60, .5);
    if (ch) { g.strokeStyle = 'rgba(200,60,6,.75)'; g.lineWidth = 46; g.beginPath(); g.arc(512, 512, 470, 0, 6.28); g.stroke(); for (var i = 0; i < 70; i++) { var a = R(0, 6.28), r = R(200, 470); g.fillStyle = 'rgba(232,110,14,' + R(.3, .6).toFixed(2) + ')'; g.beginPath(); g.ellipse(512 + Math.cos(a) * r, 512 + Math.sin(a) * r, R(6, 26), R(4, 14), a, 0, 6.28); g.fill(); }
      g.fillStyle = '#2f6a22'; for (i = 0; i < 220; i++) { g.save(); g.translate(R(120, 900), R(120, 900)); g.rotate(R(0, 6)); g.fillRect(-4, -2.5, 8, 5); g.restore(); } }
    else { g.fillStyle = '#1b1814'; for (var j = 0; j < 1300; j++) { g.beginPath(); g.arc(R(100, 924), R(100, 924), R(1.2, 3), 0, 6.28); g.fill(); } g.fillStyle = '#4c8a2a'; for (j = 0; j < 90; j++) { g.save(); g.translate(R(150, 870), R(150, 870)); g.rotate(R(0, 6)); g.fillRect(-4, -2, 8, 4); g.restore(); } }
    var ao = g.createRadialGradient(512, 512, 360, 512, 512, 512); ao.addColorStop(0, 'rgba(0,0,0,0)'); ao.addColorStop(1, 'rgba(25,8,0,.55)'); g.fillStyle = ao; g.fillRect(0, 0, 1024, 1024);
    return tex(c);
  }
  var ripple = (function () { var c = cv(512, 512), g = c.getContext('2d'); g.fillStyle = '#808080'; g.fillRect(0, 0, 512, 512); blotches(g, 512, 512, 160, ['rgba(255,255,255,A)', 'rgba(0,0,0,A)'], 8, 40, .35); return tex(c, false); })();
  var gMats = {
    chicken: new T.MeshPhysicalMaterial({ map: gravy('chicken'), roughness: .5, clearcoat: .55, clearcoatRoughness: .22, bumpMap: ripple, bumpScale: .01, envMapIntensity: .45, emissive: 0x2a0800, emissiveIntensity: .35, transparent: true, opacity: 1 }),
    white: new T.MeshPhysicalMaterial({ map: gravy('white'), roughness: .5, clearcoat: .45, clearcoatRoughness: .3, bumpMap: ripple, bumpScale: .008, envMapIntensity: .5, transparent: true, opacity: 0 })
  };
  Object.keys(gMats).forEach(function (k, i) { var m = new T.Mesh(new T.CircleGeometry(1.4, 96), gMats[k]); m.rotation.x = -Math.PI / 2; m.position.y = .6 + i * .002; m.renderOrder = 1 + i; m.receiveShadow = true; karahi.add(m); });
  var coatTex = (function () { var c = cv(512, 256), g = c.getContext('2d'); g.fillStyle = '#ffffff'; g.fillRect(0, 0, 512, 256); blotches(g, 512, 256, 90, ['rgba(255,236,210,A)', 'rgba(120,80,60,A)', 'rgba(40,18,8,A)'], 6, 34, .7); speck(g, 512, 256, 3000, 'rgba(30,12,4,A)', 3); return tex(c); })();
  var chunkMat = new T.MeshPhysicalMaterial({ color: 0x7e3209, map: coatTex, roughness: .55, clearcoat: .35, clearcoatRoughness: .35, envMapIntensity: .5, emissive: 0x1e0600, emissiveIntensity: .3 });
  var chunks = [];
  for (var ci = 0; ci < 14; ci++) { var m = new T.Mesh(blob(R(.17, .24), .2, 3), chunkMat); var a = ci / 14 * 6.28 + R(-.2, .2), r = ci < 2 ? R(0, .25) : R(.35, 1.05); m.position.set(Math.cos(a) * r, .64, Math.sin(a) * r); m.scale.set(R(1.1, 1.5), R(.55, .7), R(.9, 1.2)); m.rotation.y = R(0, 6); m.castShadow = true; karahi.add(m); chunks.push(m); }
  var chilliM = new T.MeshPhysicalMaterial({ color: 0x2c6a18, roughness: .45, clearcoat: .5, clearcoatRoughness: .3, envMapIntensity: .5 });
  for (ci = 0; ci < 10; ci++) { var sl = new T.Mesh(new T.TorusGeometry(.06, .02, 10, 24), chilliM); a = R(0, 6.28); r = R(.2, 1.1); sl.position.set(Math.cos(a) * r, .69, Math.sin(a) * r); sl.scale.z = .7; sl.rotation.set(Math.PI / 2 + R(-.5, .5), 0, R(0, 3)); karahi.add(sl); }
  [[.3, -.4, 2.2], [-.55, .3, -.6]].forEach(function (p) { var crv = new T.QuadraticBezierCurve3(new T.Vector3(-.28, 0, 0), new T.Vector3(0, .05, .12), new T.Vector3(.28, 0, 0)); var w = new T.Mesh(new T.TubeGeometry(crv, 20, .045, 10), chilliM); w.position.set(p[0], .7, p[1]); w.rotation.y = p[2]; w.castShadow = true; karahi.add(w); });
  var corG = new T.Group(), corM = new T.MeshStandardMaterial({ color: 0x2f7a2a, roughness: .5, side: T.DoubleSide });
  var cs = new T.Shape(); cs.moveTo(0, 0); cs.bezierCurveTo(.07, .02, .1, .09, .04, .13); cs.bezierCurveTo(.02, .16, -.02, .16, -.04, .13); cs.bezierCurveTo(-.1, .09, -.07, .02, 0, 0); var cgeo = new T.ShapeGeometry(cs, 10);
  for (ci = 0; ci < 20; ci++) { var lf = new T.Mesh(cgeo, corM); a = R(0, 6.28); r = R(0, 1.1); lf.position.set(Math.cos(a) * r, .71, Math.sin(a) * r); lf.rotation.set(-Math.PI / 2 + R(-.4, .4), 0, R(0, 6)); lf.scale.setScalar(R(.9, 1.3)); corG.add(lf); }
  var gingM = new T.MeshStandardMaterial({ color: 0xf0d79a, roughness: .45 });
  for (ci = 0; ci < 22; ci++) { var gj = new T.Mesh(new T.BoxGeometry(.2, .012, .014), gingM); a = R(0, 6.28); r = R(0, .9); gj.position.set(Math.cos(a) * r, .73, Math.sin(a) * r); gj.rotation.set(R(-.2, .2), R(0, 6), R(-.2, .2)); corG.add(gj); }
  karahi.add(corG);
  var whiteG = new T.Group(), creamM = new T.MeshPhysicalMaterial({ color: 0xfffbf2, roughness: .35, clearcoat: .6 });
  for (ci = 0; ci < 3; ci++) { var pts = []; var a0 = R(0, 6.28); for (var k = 0; k < 7; k++) { var rr = R(.2, .9); pts.push(new T.Vector3(Math.cos(a0 + k * .5) * rr, .7, Math.sin(a0 + k * .5) * rr)); } whiteG.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 60, .022, 8), creamM)); }
  var berryM = new T.MeshPhysicalMaterial({ color: 0x9a1424, roughness: .3, clearcoat: .8 });
  for (ci = 0; ci < 6; ci++) { var b = new T.Mesh(new T.SphereGeometry(.055, 14, 10), berryM); a = R(0, 6.28); r = R(.2, .9); b.position.set(Math.cos(a) * r, .7, Math.sin(a) * r); whiteG.add(b); }
  whiteG.scale.setScalar(.0001); whiteG.visible = false; karahi.add(whiteG);
  var kSteam = steam(karahi, 12, .75, 1.8, 1.7);
  karahi.add(softShadow(4.4, .8)); karahi.add(catcher(7));
  shadowAll(karahi);
  karahi.position.y = -.5;

  /* ══════════════ GLASS ══════════════ */
  var glass = new T.Group(), H2 = 2.8, rb2 = .58, rt2 = .84;
  function r2f(y) { return rb2 + (rt2 - rb2) * (y / H2); }
  var LT = H2 - .32;
  var slush = (function () { var c = cv(512, 1024), g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 1024); for (var i = 0; i < 9000; i++) { var v = 205 + Math.random() * 50 | 0; g.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',' + R(.3, .9).toFixed(2) + ')'; g.beginPath(); g.ellipse(Math.random() * 512, Math.random() * 1024, R(1, 5), R(1, 4), 0, 0, 6.28); g.fill(); } var gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, 'rgba(255,255,255,.4)'); gr.addColorStop(.25, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(0,0,0,.25)'); g.fillStyle = gr; g.fillRect(0, 0, 512, 1024); var t = tex(c); t.wrapS = t.wrapT = T.RepeatWrapping; return t; })();
  var liqMat = new T.MeshPhysicalMaterial({ color: 0x8cc63e, map: slush, roughness: .5, clearcoat: .3, transparent: true, opacity: .97, emissive: 0x162e05, emissiveIntensity: .5, envMapIntensity: .45 });
  var lp = []; for (var q = 0; q <= 12; q++) { var yy = .07 + LT * q / 12; lp.push(new T.Vector2(r2f(yy) - .035, yy)); }
  var liq = new T.Mesh(new T.LatheGeometry([new T.Vector2(.001, .07)].concat(lp), 72), liqMat); liq.renderOrder = 1; glass.add(liq);
  var top = new T.Mesh(new T.CircleGeometry(r2f(LT + .07) - .035, 64), liqMat); top.rotation.x = -Math.PI / 2; top.position.y = LT + .07; glass.add(top);
  var crushM = new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: .12, transparent: true, opacity: .6, envMapIntensity: 2, clearcoat: 1 });
  var crushN = 46, crush = new T.InstancedMesh(blob(.07, .25, 1), crushM, crushN), dd = new T.Object3D();
  for (q = 0; q < crushN; q++) { var aa = R(0, 6.28), rr2 = Math.sqrt(Math.random()) * (r2f(LT) - .14); dd.position.set(Math.cos(aa) * rr2, LT + .1 + R(0, .1), Math.sin(aa) * rr2); dd.rotation.set(R(0, 3), R(0, 3), R(0, 3)); dd.scale.setScalar(R(.7, 1.6)); dd.updateMatrix(); crush.setMatrixAt(q, dd.matrix); }
  crush.renderOrder = 2; glass.add(crush);
  var gp = [new T.Vector2(.001, 0), new T.Vector2(rb2 - .02, 0), new T.Vector2(rb2, .03), new T.Vector2(rb2, .14)]; for (q = 1; q <= 14; q++) gp.push(new T.Vector2(r2f(.14 + (H2 - .14) * q / 14), .14 + (H2 - .14) * q / 14));
  var shellM = new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: .03, metalness: 0, transparent: true, opacity: .14, envMapIntensity: 2.4, clearcoat: 1, side: T.DoubleSide, depthWrite: false });
  var shell = new T.Mesh(new T.LatheGeometry(gp, 96), shellM); shell.renderOrder = 3; glass.add(shell);
  var lip = new T.Mesh(new T.TorusGeometry(rt2, .016, 10, 128), new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: .02, transparent: true, opacity: .5, envMapIntensity: 2.5, clearcoat: 1 })); lip.rotation.x = Math.PI / 2; lip.position.y = H2; lip.renderOrder = 3; glass.add(lip);
  var base = new T.Mesh(new T.CylinderGeometry(rb2 - .005, rb2 - .03, .14, 64), new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: .04, transparent: true, opacity: .3, envMapIntensity: 2.4, clearcoat: 1, depthWrite: false })); base.position.y = .07; base.renderOrder = 3; glass.add(base);
  var straw = new T.Mesh(new T.CylinderGeometry(.045, .045, H2 * 1.1, 20, 1, true), new T.MeshStandardMaterial({ color: 0x141414, roughness: .35, side: T.DoubleSide })); straw.position.set(-.26, H2 * .72, .08); straw.rotation.set(-.06, 0, .17); glass.add(straw);
  (function () { var n = isMobile() ? 110 : 200, g = new T.SphereGeometry(.012, 8, 6), m = new T.MeshPhysicalMaterial({ color: 0xffffff, roughness: .02, transparent: true, opacity: .5, envMapIntensity: 2.6, clearcoat: 1, depthWrite: false });
    var im = new T.InstancedMesh(g, m, n), d = new T.Object3D(); for (var i = 0; i < n; i++) { var y = .2 + Math.random() * (H2 * .8), ph = Math.random() * 6.28, r = r2f(y) + .01; d.position.set(Math.sin(ph) * r, y, Math.cos(ph) * r); d.lookAt(Math.sin(ph) * r * 2, y, Math.cos(ph) * r * 2); var s = R(.5, 1.7); d.scale.set(s, s * R(1, 1.6), s * .45); d.updateMatrix(); im.setMatrixAt(i, d.matrix); } im.renderOrder = 5; glass.add(im); })();
  var garn = {};
  (function () {
    var mint = new T.Group(), mm = new T.MeshStandardMaterial({ color: 0x2d8a3e, roughness: .45, side: T.DoubleSide });
    var s = new T.Shape(); s.moveTo(0, 0); s.bezierCurveTo(.1, .05, .12, .18, 0, .3); s.bezierCurveTo(-.12, .18, -.1, .05, 0, 0); var g = new T.ShapeGeometry(s, 14);
    [[0, .2, 0, 0], [1.3, .13, .5, .15], [-1.2, .1, .6, -.1], [2.6, .05, .75, .05], [-2.5, .02, .8, 0]].forEach(function (L) { var lf = new T.Mesh(g, mm); lf.position.y = L[1]; lf.rotation.set(-L[2], L[0], L[3]); mint.add(lf); });
    var lc = cv(512, 512), lg = lc.getContext('2d'), lr = lg.createRadialGradient(256, 256, 8, 256, 256, 256); lr.addColorStop(0, '#eef6c8'); lr.addColorStop(.25, '#cde46f'); lr.addColorStop(.82, '#b0d455'); lr.addColorStop(.9, '#f3f9de'); lr.addColorStop(.94, '#6aa62a'); lr.addColorStop(1, '#3e7a16'); lg.fillStyle = lr; lg.fillRect(0, 0, 512, 512);
    lg.strokeStyle = 'rgba(248,252,228,.75)'; lg.lineWidth = 5; for (var i = 0; i < 10; i++) { var an = i / 10 * 6.28; lg.beginPath(); lg.moveTo(256, 256); lg.lineTo(256 + Math.cos(an) * 212, 256 + Math.sin(an) * 212); lg.stroke(); }
    var lm = new T.MeshPhysicalMaterial({ map: tex(lc), roughness: .3, clearcoat: .6 }), lsk = new T.MeshStandardMaterial({ color: 0x4a8a1c, roughness: .4 });
    var wheel = new T.Mesh(new T.CylinderGeometry(.34, .34, .055, 48), [lsk, lm, lm]); wheel.rotation.x = Math.PI / 2;
    var lime = new T.Group(); lime.add(wheel); lime.position.set(rt2 + .02, H2 + .1, 0); lime.rotation.z = -.25;
    var mg = new T.Group(); mint.position.set(.18, H2 + .12, -.22); mg.add(mint); mg.add(lime); glass.add(mg); garn.mint = mg;
    var wm = new T.Group(), sh = new T.Shape(); sh.moveTo(-.46, 0); sh.quadraticCurveTo(0, -.62, .46, 0); sh.lineTo(-.46, 0);
    var flesh = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: .09, bevelEnabled: true, bevelThickness: .015, bevelSize: .015, bevelSegments: 2, curveSegments: 24 }), new T.MeshPhysicalMaterial({ color: 0xe33a4a, roughness: .35, clearcoat: .5 }));
    var rind = new T.Mesh(new T.TorusGeometry(.48, .045, 10, 40, Math.PI), new T.MeshStandardMaterial({ color: 0x2f7a2a, roughness: .5 })); rind.rotation.z = Math.PI; rind.position.z = .045; rind.scale.set(.98, 1.25, 1);
    wm.add(flesh); wm.add(rind);
    var seedM = new T.MeshStandardMaterial({ color: 0x111111, roughness: .3 }); [[-.16, -.16], [0, -.24], [.16, -.16], [-.07, -.34], [.09, -.33]].forEach(function (p) { var sd = new T.Mesh(new T.SphereGeometry(.022, 8, 6), seedM); sd.scale.set(.7, 1.3, .6); sd.position.set(p[0], p[1], .11); wm.add(sd); });
    wm.position.set(rt2 - .06, H2 + .22, 0); wm.rotation.set(0, -.3, -.35); glass.add(wm); garn.melon = wm;
  })();
  glass.add(softShadow(3, .6)); glass.add(catcher(5));
  straw.castShadow = true; liq.castShadow = true;
  glass.position.y = -H2 / 2;

  /* ---------- state ---------- */
  var FL = { mint: { c: lin(0x8cc63e), e: lin(0x162e05) }, melon: { c: lin(0xe9465a), e: lin(0x3e0610) } };
  var flavCur = FL.mint.c.clone(), flavT = FL.mint.c.clone(), emCur = FL.mint.e.clone(), emT = FL.mint.e.clone(), glassFlav = 'mint';
  Object.keys(garn).forEach(function (k) { garn[k].userData.s = k === 'mint' ? 1 : 0; garn[k].scale.setScalar(k === 'mint' ? 1 : .0001); garn[k].visible = k === 'mint'; });
  var karahiFlav = 'chicken', CH = { chicken: lin(0x7e3209), white: lin(0xd8c39b) }, chunkCur = CH.chicken.clone();
  var kick = 0, spinExtra = 0;
  window.DS3D = { flavor: function (dish, fl) { if (dish === 'karahi') karahiFlav = fl; else { glassFlav = fl; flavT.copy(FL[fl].c); emT.copy(FL[fl].e); } kick += Math.PI * .9; } };

  var dishes = { handi: handi, karahi: karahi, glass: glass };
  var TILT = { handi: .2, karahi: .52, glass: .1 }, SCALE = { handi: 1.18, karahi: .86, glass: 1 };
  var root3 = new T.Group(), tilt = new T.Group(), spin = new T.Group(); root3.add(tilt); tilt.add(spin); scene.add(root3);
  Object.keys(dishes).forEach(function (k) { var w = new T.Group(); w.add(dishes[k]); w.userData = { vis: k === 'handi' ? 1 : 0, vel: 0 }; w.scale.setScalar(w.userData.vis || .0001); spin.add(w); dishes[k] = w; });
  scene.traverse(function (o) { if (!o.material) return; (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { if (m.userData.lin) return; m.userData.lin = 1; if (m.color && !m.map && !m.isShadowMaterial) m.color.convertSRGBToLinear(); if (m.emissive) m.emissive.convertSRGBToLinear(); }); });
  function themeTune() { var light = document.documentElement.getAttribute('data-theme') === 'light'; gl.toneMappingExposure = light ? .95 : 1.02; amb.intensity = light ? .45 : .25; scene.traverse(function (o) { if (o.material && o.material.isShadowMaterial) o.material.opacity = light ? .22 : .38; }); }
  themeTune(); addEventListener('ds:theme', themeTune);

  /* ---------- layout ---------- */
  var cvW = 0, cvH = 0;
  function resize() { var w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight; if (w === cvW && h === cvH) return; cvW = w; cvH = h; gl.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  resize(); addEventListener('resize', resize);
  function num(el, k, d) { var v = el.getAttribute('data-' + k); return v === null ? d : parseFloat(v); }
  function anchorState() {
    var vh = innerHeight, c = vh / 2, list = anchors.map(function (el) { var r = el.getBoundingClientRect(); return { c: r.top + Math.min(r.height, vh) / 2, x: num(el, 'x', 0), y: num(el, 'y', 0), s: num(el, 's', 1), t: el.getAttribute('data-dish') }; });
    if (c <= list[0].c) return list[0];
    for (var i = 0; i < list.length - 1; i++) { var a = list[i], b = list[i + 1]; if (c >= a.c && c <= b.c) { var t = (c - a.c) / Math.max(1, b.c - a.c); t = t * t * (3 - 2 * t); return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, s: a.s + (b.s - a.s) * t, t: t < .5 ? a.t : b.t }; } }
    return list[list.length - 1];
  }
  var stages = anchors.map(function (el) { var z = el.querySelector('.zone'); return z ? { z: z, el: el } : null; }).filter(Boolean);
  function stageState() {
    var vh = innerHeight, best = null, bv = 0, br = null;
    for (var i = 0; i < stages.length; i++) { var z = stages[i].z; if (!z.offsetParent) continue; var r = z.getBoundingClientRect(); if (r.height < 10) continue; var v = (Math.min(r.bottom, vh) - Math.max(r.top, 0)) / r.height; if (v > bv) { bv = v; best = stages[i]; br = r; } }
    if (!best || bv < .1) return null;
    var f = Math.max(0, Math.min(1, (bv - .35) / .5)); f = f * f * (3 - 2 * f);
    var fit = Math.min(br.height / cvH / .42, br.width / cvW / .9);
    return { x: (br.left + br.width / 2 - cvW / 2) / cvW, y: -(br.top + br.height * .5 - cvH / 2) / cvH, s: num(best.el, 'ms', 1) * f * fit, t: best.el.getAttribute('data-dish'), pin: true };
  }
  var cur = { x: 0, y: 0, s: 0 }, first = true, active = 'handi';
  var drag = { on: false, x: 0, y: 0, v: 0, off: 0, lock: null };
  Array.prototype.slice.call(document.querySelectorAll('[data-spin]')).forEach(function (z) {
    z.addEventListener('pointerdown', function (e) { drag.on = true; drag.x = e.clientX; drag.y = e.clientY; drag.lock = e.pointerType === 'mouse' ? 'x' : null; drag.v = 0; z.classList.add('was-dragged'); if (e.pointerType === 'mouse') z.setPointerCapture(e.pointerId); });
    z.addEventListener('pointermove', function (e) { if (!drag.on) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (drag.lock === null) { if (Math.abs(dx) > 6 || Math.abs(dy) > 6) drag.lock = Math.abs(dx) > Math.abs(dy) * .8 ? 'x' : 'y'; } if (drag.lock === 'x') { drag.off += dx * .012; drag.v = dx * .012; drag.x = e.clientX; drag.y = e.clientY; } });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { z.addEventListener(ev, function () { drag.on = false; }); });
    z.addEventListener('dblclick', function () { lidT = clock.elapsedTime; });
  });
  var blank = false, clock = new T.Clock(), auto = 0, lastY = scrollY, lean = 0, running = true, tiltX = TILT.handi, lidT = -10, lidLift = 0;
  document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) { clock.getDelta(); requestAnimationFrame(loop); } });
  canvas.classList.add('is-on');
  function sm(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function loop() {
    if (!running) return;
    var dt = Math.min(clock.getDelta(), .05), k = 1 - Math.exp(-dt * 3.8), time = clock.elapsedTime;
    if (document.documentElement.classList.contains('ld-on')) { requestAnimationFrame(loop); return; }
    var st = isMobile() ? (stageState() || { x: cur.x, y: cur.y, s: 0, t: active, pin: true }) : anchorState();
    if (first) { cur.x = st.x; cur.y = st.y; cur.s = 0; first = false; }
    if (st.pin && st.t !== active && cur.s >= .3) st.s = 0;
    if (st.pin) { cur.x = st.x; cur.y = st.y; cur.s += (st.s - cur.s) * (1 - Math.exp(-dt * 9)); }
    else { cur.x += (st.x - cur.x) * k; cur.y += (st.y - cur.y) * k; cur.s += (st.s - cur.s) * k; }
    if (st.s < .001 && cur.s < .05) cur.s = 0;
    var VW = VH * cam.aspect;
    root3.position.set(cur.x * VW, cur.y * VH, 0);
    root3.scale.setScalar(Math.max(cur.s * SCALE[active], .0001));
    key.target.position.copy(root3.position); key.position.set(root3.position.x - 4.5, 9, 6);
    if (st.t !== active && (!st.pin || cur.s < .3)) { active = st.t; kick += Math.PI * 1.1; if (active === 'handi') lidT = time + .5; }
    var any = 0;
    Object.keys(dishes).forEach(function (n) { var w = dishes[n], u = w.userData; var others = Object.keys(dishes).filter(function (o) { return o !== n; }).reduce(function (a, o) { return Math.max(a, dishes[o].userData.vis); }, 0);
      var tg = (n === active && others < .2) ? 1 : 0; u.vel += (tg - u.vis) * 120 * dt; u.vel *= Math.pow(.0005, dt); u.vis += u.vel * dt; if (tg === 0 && u.vis < .002) { u.vis = 0; u.vel = 0; }
      var s = Math.max(0, u.vis); w.scale.setScalar(Math.max(s, .0001)); w.visible = s > .002; any = Math.max(any, s); });
    var sy = scrollY, dy = sy - lastY; lastY = sy;
    if (!drag.on) { drag.off += drag.v; drag.v *= Math.pow(.04, dt); auto += dt * (RM ? .05 : .22); }
    var kk = kick * (1 - Math.exp(-dt * 3.2)); kick -= kk; spinExtra += kk;
    var target = auto + sy * .0028 + drag.off + spinExtra;
    spin.rotation.y += (target - spin.rotation.y) * (1 - Math.exp(-dt * 6));
    lean += ((Math.max(-.2, Math.min(.2, dy * .005))) - lean) * (1 - Math.exp(-dt * 4));
    tiltX += (TILT[active] - tiltX) * (1 - Math.exp(-dt * 3));
    tilt.rotation.x = tiltX + Math.sin(time * .7) * .02 + lean * .5;
    tilt.rotation.z = Math.sin(time * .5) * .022 - lean * .2;
    tilt.position.y = Math.sin(time * 1.0) * .05;
    if (dishes.handi.visible) {
      var cyc = (time + 2) % 9, auto1 = sm(2.4, 3.3, cyc) * (1 - sm(6.2, 7.2, cyc)), ph = time - lidT, man = ph >= 0 && ph < 4 ? sm(0, .6, ph) * (1 - sm(3, 4, ph)) : 0;
      var L = RM ? .5 : Math.max(auto1, man); lidLift += (L - lidLift) * (1 - Math.exp(-dt * 6));
      lid.position.set(lidLift * .5, 1.88 + lidLift * .72, lidLift * .1); lid.rotation.z = -lidLift * .38;
      animSteam(hSteam, time, .25 + lidLift * .95);
    }
    if (dishes.karahi.visible) {
      var w = karahiFlav === 'white', e = 1 - Math.exp(-dt * 4);
      gMats.chicken.opacity += ((w ? 0 : 1) - gMats.chicken.opacity) * e; gMats.white.opacity += ((w ? 1 : 0) - gMats.white.opacity) * e;
      chunkCur.lerp(CH[karahiFlav], e); chunkMat.color.copy(chunkCur);
      var ws = whiteG.userData.s || 0; ws += ((w ? 1 : 0) - ws) * (1 - Math.exp(-dt * 7)); whiteG.userData.s = ws; whiteG.scale.setScalar(Math.max(ws, .0001)); whiteG.visible = ws > .01;
      var cs2 = corG.userData.s === undefined ? 1 : corG.userData.s; cs2 += ((w ? .0 : 1) - cs2) * (1 - Math.exp(-dt * 7)); corG.userData.s = cs2; corG.scale.setScalar(Math.max(cs2, .0001)); corG.visible = cs2 > .01;
      chunks.forEach(function (m, i) { m.position.y = .64 + Math.sin(time * 2 + i * 1.7) * .008; });
      ripple.offset.set(time * .01, time * .007);
      animSteam(kSteam, time, .6);
      fire.position.set(root3.position.x, root3.position.y - 1.4, 1.2);
      fire.intensity += ((1.4 + Math.sin(time * 9) * .25 + Math.sin(time * 23) * .15) * dishes.karahi.userData.vis - fire.intensity) * .2;
    } else fire.intensity *= .9;
    if (dishes.glass.visible) {
      flavCur.lerp(flavT, 1 - Math.exp(-dt * 4)); emCur.lerp(emT, 1 - Math.exp(-dt * 4)); liqMat.color.copy(flavCur); liqMat.emissive.copy(emCur);
      Object.keys(garn).forEach(function (n) { var g = garn[n], u = g.userData, tg = n === glassFlav ? 1 : 0; u.s += (tg - u.s) * (1 - Math.exp(-dt * 7)); g.scale.setScalar(Math.max(.0001, u.s)); g.visible = u.s > .01; });
      slush.offset.y = (slush.offset.y + dt * .004) % 1;
    }
    if (cur.s > .01 && any > .002) { gl.render(scene, cam); blank = false; } else if (!blank) { gl.clear(); blank = true; }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
})();
