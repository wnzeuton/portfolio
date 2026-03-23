import { useEffect, useRef, useState } from 'react';
import './App.css';

function SatelliteCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId, lastTime = null;
    let camRotX = 0.4, camRotY = 0;

    // ── Geometry helpers ─────────────────────────────────
    function addBox(edges, x0, y0, z0, x1, y1, z1) {
      const c = [
        [x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],
        [x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],
      ];
      edges.push([c[0],c[1]],[c[1],c[2]],[c[2],c[3]],[c[3],c[0]]);
      edges.push([c[4],c[5]],[c[5],c[6]],[c[6],c[7]],[c[7],c[4]]);
      edges.push([c[0],c[4]],[c[1],c[5]],[c[2],c[6]],[c[3],c[7]]);
    }

    // ── Main satellite ───────────────────────────────────
    const satEdges = [];
    addBox(satEdges, -0.14,-0.14,-0.35, 0.14,0.14,0.35);
    satEdges.push([[-0.14,-0.14, 0.08],[0.14,-0.14, 0.08]]);
    satEdges.push([[-0.14, 0.14, 0.08],[0.14, 0.14, 0.08]]);
    satEdges.push([[-0.14,-0.14,-0.08],[0.14,-0.14,-0.08]]);
    satEdges.push([[-0.14, 0.14,-0.08],[0.14, 0.14,-0.08]]);
    // Left panel
    addBox(satEdges, -0.14,-0.03,-0.28, -0.95,0.03,0.28);
    for (let i = 1; i <= 2; i++) {
      const px = -0.14 - 0.81*i/3;
      satEdges.push([[px,-0.03,-0.28],[px,-0.03,0.28]]);
      satEdges.push([[px, 0.03,-0.28],[px, 0.03,0.28]]);
    }
    satEdges.push([[-0.14,-0.03,0],[-0.95,-0.03,0]]);
    satEdges.push([[-0.14, 0.03,0],[-0.95, 0.03,0]]);
    // Right panel
    addBox(satEdges, 0.14,-0.03,-0.28, 0.95,0.03,0.28);
    for (let i = 1; i <= 2; i++) {
      const px = 0.14 + 0.81*i/3;
      satEdges.push([[px,-0.03,-0.28],[px,-0.03,0.28]]);
      satEdges.push([[px, 0.03,-0.28],[px, 0.03,0.28]]);
    }
    satEdges.push([[0.14,-0.03,0],[0.95,-0.03,0]]);
    satEdges.push([[0.14, 0.03,0],[0.95, 0.03,0]]);
    // Dish strut + dish ring
    satEdges.push([[0,0,0.35],[0,-0.22,0.55]]);
    const DN = 24, DR = 0.2;
    for (let i = 0; i < DN; i++) {
      const a1 = i/DN*Math.PI*2, a2 = (i+1)/DN*Math.PI*2;
      const d = a => [Math.cos(a)*DR, -0.22+Math.sin(a)*DR*0.45, 0.55+Math.cos(a)*DR*0.15];
      satEdges.push([d(a1), d(a2)]);
    }
    satEdges.push([[0,-0.22-DR*0.45,0.55-DR*0.15],[0,-0.22+DR*0.45,0.55+DR*0.15]]);
    satEdges.push([[-DR,-0.22,0.55],[DR,-0.22,0.55]]);
    // Antenna nub
    satEdges.push([[0,0,-0.35],[0,0,-0.5]]);
    satEdges.push([[-0.04,0,-0.5],[0.04,0,-0.5]]);

    // ── Space paraphernalia factories ────────────────────
    function hash(n) { return ((Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1 + 1) % 1; }

    function makeAsteroid(seed) {
      const pts = [
        [1+hash(seed)*0.4, 0, 0], [-1-hash(seed+1)*0.3, 0, 0],
        [0, 1+hash(seed+2)*0.35, 0], [0, -1-hash(seed+3)*0.28, 0],
        [0, 0, 1+hash(seed+4)*0.32], [0, 0, -1-hash(seed+5)*0.38],
        [(hash(seed+6)-0.5)*1.4, (hash(seed+7)-0.5)*1.4, (hash(seed+8)-0.5)*1.4],
        [(hash(seed+9)-0.5)*1.2, (hash(seed+10)-0.5)*1.2, (hash(seed+11)-0.5)*1.2],
      ];
      const edges = [];
      for (let i = 0; i < pts.length; i++)
        for (let j = i+1; j < pts.length; j++) {
          const d = Math.hypot(pts[i][0]-pts[j][0], pts[i][1]-pts[j][1], pts[i][2]-pts[j][2]);
          if (d < 1.5) edges.push([pts[i], pts[j]]);
        }
      return edges;
    }

    function makeProbe() {
      const edges = [];
      addBox(edges, -0.35,-0.35,-0.35, 0.35,0.35,0.35);
      addBox(edges, -0.35,-0.55,-0.05, -1.1,0.55,0.05);
      addBox(edges,  0.35,-0.55,-0.05,  1.1,0.55,0.05);
      edges.push([[0,0,0.35],[0,0,0.75]]);
      edges.push([[0,0,0.75],[-0.15,0,0.75]]);
      edges.push([[0,0,0.75],[ 0.15,0,0.75]]);
      return edges;
    }

    function makeRocket() {
      const edges = [];
      const N = 10, r = 0.35, h = 0.9;
      for (let i = 0; i < N; i++) {
        const a1 = i/N*Math.PI*2, a2 = (i+1)/N*Math.PI*2;
        edges.push([[Math.cos(a1)*r,Math.sin(a1)*r,-h/2],[Math.cos(a2)*r,Math.sin(a2)*r,-h/2]]);
        edges.push([[Math.cos(a1)*r,Math.sin(a1)*r, h/2],[Math.cos(a2)*r,Math.sin(a2)*r, h/2]]);
        if (i % 2 === 0) edges.push([[Math.cos(a1)*r,Math.sin(a1)*r,-h/2],[Math.cos(a1)*r,Math.sin(a1)*r,h/2]]);
        edges.push([[Math.cos(a1)*r,Math.sin(a1)*r,h/2],[0,0,h/2+0.5]]);
      }
      // Fins
      const fins = [[1,0],[-1,0],[0,1],[0,-1]];
      for (const [fx,fy] of fins) {
        edges.push([[fx*r,fy*r,-h/2],[fx*r*1.6,fy*r*1.6,-h/2-0.3]]);
        edges.push([[fx*r*1.6,fy*r*1.6,-h/2-0.3],[fx*r,fy*r,-h/2+0.2]]);
      }
      return edges;
    }

    function makeDebris(seed) {
      const pts = Array.from({ length: 5 }, (_,i) => [
        (hash(seed+i*3  )-0.5)*1.8,
        (hash(seed+i*3+1)-0.5)*1.8,
        (hash(seed+i*3+2)-0.5)*1.8,
      ]);
      const edges = [];
      for (let i = 0; i < pts.length; i++)
        for (let j = i+1; j < pts.length; j++) {
          const d = Math.hypot(pts[i][0]-pts[j][0], pts[i][1]-pts[j][1], pts[i][2]-pts[j][2]);
          if (d < 1.6) edges.push([pts[i], pts[j]]);
        }
      return edges;
    }

    // ── Space items (orbit the satellite) ─────────────────
    const items = [
      { edges: makeAsteroid(1),  sc:0.13, oR:2.1, oA:0.5,  oS: 0.00007, incl: 0.4,  lrX:0,   lrY:0,   rsX:0.0014, rsY:0.002  },
      { edges: makeAsteroid(7),  sc:0.09, oR:2.5, oA:2.8,  oS:-0.00005, incl:-0.6,  lrX:1.0, lrY:0.5, rsX:0.002,  rsY:0.0015 },
      { edges: makeAsteroid(19), sc:0.07, oR:1.8, oA:1.8,  oS: 0.0001,  incl: 1.2,  lrX:0.3, lrY:1.0, rsX:0.0022, rsY:0.0018 },
      { edges: makeProbe(),      sc:0.11, oR:2.0, oA:4.2,  oS:-0.00008, incl:-0.3,  lrX:0,   lrY:0,   rsX:0.0009, rsY:0.0013 },
      { edges: makeRocket(),     sc:0.09, oR:2.3, oA:3.1,  oS: 0.00006, incl: 0.7,  lrX:0.5, lrY:0.2, rsX:0.0006, rsY:0.001  },
      { edges: makeDebris(5),    sc:0.10, oR:2.2, oA:1.0,  oS: 0.00009, incl: 0.8,  lrX:0,   lrY:0,   rsX:0.003,  rsY:0.002  },
      { edges: makeDebris(13),   sc:0.07, oR:1.7, oA:3.5,  oS:-0.00012, incl:-1.0,  lrX:1.5, lrY:0.8, rsX:0.0032, rsY:0.0024 },
    ];

    // ── Stars (screen space background) ──────────────────
    const stars = Array.from({ length: 70 }, () => ({
      sx: Math.random(), sy: Math.random(),
      size: 0.3 + Math.random() * 0.8,
      opacity: 0.06 + Math.random() * 0.18,
    }));

    // ── Aura dots ─────────────────────────────────────────
    const dots = Array.from({ length: 42 }, () => ({
      angle:        Math.random() * Math.PI * 2,
      radiusFactor: 1.1 + Math.random() * 0.9,
      speed:        (Math.random() < 0.5 ? 1 : -1) * (0.00015 + Math.random() * 0.00035),
      size:         0.7 + Math.random() * 1.8,
      opacity:      0.12 + Math.random() * 0.3,
      yOffset:      (Math.random() - 0.5) * 0.35,
    }));

    function init() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function draw(ts) {
      if (!lastTime) lastTime = ts;
      const dt = Math.min(50, ts - lastTime);
      lastTime = ts;

      camRotX += 0.0008 * dt / 16;
      camRotY += 0.0018 * dt / 16;

      const cx = canvas.width * 0.72, cy = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) * 0.28;
      const cosX = Math.cos(camRotX), sinX = Math.sin(camRotX);
      const cosY = Math.cos(camRotY), sinY = Math.sin(camRotY);

      function worldToScreen(wx, wy, wz) {
        const wy1 = wy*cosX - wz*sinX, wz1 = wy*sinX + wz*cosX;
        const wx2 = wx*cosY + wz1*sinY, wz2 = -wx*sinY + wz1*cosY;
        const sc = scale * 4.5 / (4.5 + wz2*0.6);
        return [cx + wx2*sc, cy + wy1*sc, wz2];
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.sx * canvas.width, s.sy * canvas.height, s.size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(17,17,17,${s.opacity})`;
        ctx.fill();
      }

      // Aura dots
      for (const dot of dots) {
        dot.angle += dot.speed * dt;
        const dx = Math.cos(dot.angle) * scale * dot.radiusFactor;
        const dy = Math.sin(dot.angle) * scale * dot.radiusFactor * (0.55 + dot.yOffset);
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, dot.size, 0, Math.PI*2);
        ctx.fillStyle = `rgba(17,17,17,${dot.opacity.toFixed(2)})`;
        ctx.fill();
      }

      // Collect all projected edges
      const allEdges = [];

      // Satellite
      for (const [a, b] of satEdges) {
        const pa = worldToScreen(...a), pb = worldToScreen(...b);
        allEdges.push({ pa, pb, z: (pa[2]+pb[2])/2, alpha: 0.8 });
      }

      // Space items
      for (const item of items) {
        item.oA += item.oS * dt;
        item.lrX += item.rsX * dt / 16;
        item.lrY += item.rsY * dt / 16;
        item.pos = [
          item.oR * Math.cos(item.oA),
          item.oR * Math.sin(item.oA) * Math.sin(item.incl),
          item.oR * Math.sin(item.oA) * Math.cos(item.incl),
        ];

        const clX = Math.cos(item.lrX), slX = Math.sin(item.lrX);
        const clY = Math.cos(item.lrY), slY = Math.sin(item.lrY);

        for (const [a, b] of item.edges) {
          const xfm = ([lx, ly, lz]) => {
            lx *= item.sc; ly *= item.sc; lz *= item.sc;
            const ly1 = ly*clX - lz*slX, lz1 = ly*slX + lz*clX;
            const lx2 = lx*clY + lz1*slY, lz2 = -lx*slY + lz1*clY;
            return worldToScreen(lx2+item.pos[0], ly1+item.pos[1], lz2+item.pos[2]);
          };
          const pa = xfm(a), pb = xfm(b);
          allEdges.push({ pa, pb, z: (pa[2]+pb[2])/2, alpha: 0.55 });
        }
      }

      // Sort back-to-front, draw
      allEdges.sort((a, b) => a.z - b.z);
      ctx.lineWidth = 0.7;
      ctx.lineCap = 'round';
      for (const { pa, pb, z, alpha } of allEdges) {
        const d = Math.max(0, Math.min(1, (z + 1.5) / 3));
        ctx.strokeStyle = `rgba(17,17,17,${(alpha * (0.1 + d * 0.9)).toFixed(2)})`;
        ctx.beginPath();
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    animId = requestAnimationFrame(draw);
    window.addEventListener('resize', init);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', init); };
  }, []);

  return <canvas ref={canvasRef} className="grain-canvas" />;
}

const TABS = ['Home', 'Experience', 'Projects', 'Resume'];

function App() {
  const [dark, setDark] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    document.body.classList.toggle('dark-bg', dark);
  }, [dark]);

  useEffect(() => {
    let locked = false;
    const onWheel = (e) => {
      if (locked) return;
      locked = true;
      if (e.deltaY > 0) setActive(t => Math.min(TABS.length - 1, t + 1));
      else              setActive(t => Math.max(0, t - 1));
      setTimeout(() => { locked = false; }, 750);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <div className={`App${dark ? ' dark' : ''}`}>
      <main className="frame">
        <SatelliteCanvas />
        <span className="corner tl" /><span className="corner tr" />
        <span className="corner bl" /><span className="corner br" />

        <header className="frame-header">
          <nav className="main-nav">
            {TABS.map((tab, i) => (
              <button key={tab} className={`tab${active === i ? ' active' : ''}`} onClick={() => setActive(i)}>
                {tab}
              </button>
            ))}
          </nav>
          <span className="meta-year">Last Updated March 23, 2026</span>
        </header>

        <div className="frame-body">
          {/* Home */}
          <div className={`section${active === 0 ? ' active' : ''}`}>
            <div className="name-row">
              <h1 className="name">Will Nzeuton</h1>
              <p className="role">Developer</p>
            </div>
            <div className="about-section">
              <h2 className="about-heading">About</h2>
              <p className="about-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="about-text">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <div className="social-icons">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className={`section${active === 1 ? ' active' : ''}`}>
            <h2 className="about-heading">Experience</h2>
            <div className="exp-entry">
              <div className="exp-header">
                <span className="exp-title">Software Engineer</span>
                <span className="exp-date">2023 — Present</span>
              </div>
              <div className="exp-company">Company Name</div>
              <p className="about-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
            <div className="exp-entry">
              <div className="exp-header">
                <span className="exp-title">Junior Developer</span>
                <span className="exp-date">2021 — 2023</span>
              </div>
              <div className="exp-company">Another Company</div>
              <p className="about-text">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
          </div>

          {/* Projects */}
          <div className={`section${active === 2 ? ' active' : ''}`}>
            <h2 className="about-heading">Projects</h2>
            <div className="exp-entry">
              <div className="exp-header">
                <span className="exp-title">Project One</span>
                <span className="exp-date">2024</span>
              </div>
              <p className="about-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation.</p>
            </div>
            <div className="exp-entry">
              <div className="exp-header">
                <span className="exp-title">Project Two</span>
                <span className="exp-date">2023</span>
              </div>
              <p className="about-text">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          </div>

          {/* Resume */}
          <div className={`section${active === 3 ? ' active' : ''}`}>
            <h2 className="about-heading">Resume</h2>
            <p className="about-text">Download or view my full resume below.</p>
            <a href="#resume" className="resume-link">Download PDF</a>
          </div>
        </div>

        <footer className="frame-footer">
          <span>Available for work</span>
          <span className="footer-dot" />
          <span>Open to opportunities</span>
          <button className="theme-toggle" onClick={() => setDark(d => !d)} aria-label="Toggle theme">
            {dark ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </footer>
      </main>
    </div>
  );
}

export default App;
