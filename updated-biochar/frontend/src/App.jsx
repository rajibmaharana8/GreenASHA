import React, { useState, useEffect, useRef } from 'react';
import './App.css';

/* ─────────────────────────── NAVBAR ─────────────────────────── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="/" className="nav-logo">
          <img src="/images/GreenASHA-Logo.png" alt="GreenASHA" className="brand-img" />
          <span className="tagline">Pioneering Sustainable Horizons</span>
        </a>
        <div className="nav-links">
          <div className="nav-menu">
            <a href="#process">Process</a>
            <a href="#permanence">Permanence</a>
            <a href="#credits">Carbon Credits</a>
          </div>
          <button className="btn btn-green">Get a Demo</button>
        </div>
      </div>
    </nav>
  );
};

/* ─────────────────────────── STORY PHASES DATA ─────────────────────────── */
const PHASES = [
  {
    id: '01', label: 'INDUCTION', color: '#8ddc6e',
    short: 'Biomass Feeding',
    desc: 'Dried agricultural residue is gravity-fed through an oxygen-sealed induction hopper, metered precisely into the reactor feed pipe.',
  },
  {
    id: '02', label: 'PYROLYSIS', color: '#ffc340',
    short: 'Thermal Decomposition',
    desc: 'The rotary drum operates at 650–750°C in zero-oxygen, cracking biomass into biochar, bio-oil vapour, and syngas.',
  },
  {
    id: '03', label: 'FRACTIONATION', color: '#4fc26a',
    short: 'Gas Separation',
    desc: 'Hot gases rise through the condenser column; bio-oils condense while clean syngas recirculates as furnace fuel.',
  },
  {
    id: '04', label: 'CAPTURE', color: '#8ddc6e',
    short: 'Biochar Output',
    desc: 'Stabilised biochar exits the screw conveyor, lands in the wheeled collection bin, and is ready for soil certification.',
  },
];

/* ─────────────────────────── MAIN STORY SECTION ─────────────────────────── */
const PyrolysisStory = () => {
  const sectionRef = useRef(null);
  const svgRef     = useRef(null);

  // React state — ONLY for the 4 phase cards (not for svg animation)
  const [revealedCards, setRevealedCards] = useState([false, false, false, false]);
  const [activeCard,    setActiveCard]    = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [showFlow,      setShowFlow]      = useState(false);

  useEffect(() => {
    let raf;
    let peakProg = 0;   // tracks highest ever reached
    let lastEff  = -1;

    const clamp = v => Math.min(1, Math.max(0, v));
    const phProg = (p, s, e) => clamp((p - s) / (e - s));

    const tick = () => {
      raf = requestAnimationFrame(tick);

      if (!sectionRef.current || !svgRef.current) return;
      const rect  = sectionRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;

      const raw = clamp(-rect.top / total);
      peakProg = Math.max(peakProg, raw);

      // LOCK: once fully drawn, stays at 1 forever
      const eff = peakProg >= 0.97 ? 1 : raw;
      if (eff === lastEff) return;
      lastEff = eff;

      /* ── Animation: direct CSS custom-property update (no React render) ──
         CSS on each .ph1/.ph2/.ph3/.ph4 class uses:
           stroke-dashoffset: calc(8000px - (8000px * var(--p1, 0)));
         This runs purely in CSS paint, zero React overhead. */
      const svg = svgRef.current;
      svg.style.setProperty('--p1', phProg(eff, 0,    0.25));
      svg.style.setProperty('--p2', phProg(eff, 0.25, 0.50));
      svg.style.setProperty('--p3', phProg(eff, 0.50, 0.75));
      svg.style.setProperty('--p4', phProg(eff, 0.75, 1.00));

      // React state for cards (batched, fine to lag slightly)
      const idx = Math.min(Math.floor(eff * 3.99), 3);
      setActiveCard(idx);
      setRevealedCards([eff > 0.01, eff >= 0.25, eff >= 0.50, eff >= 0.75]);
      setShowParticles(eff > 0.01);
      setShowFlow(peakProg >= 0.97);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Pointer anchor positions per phase (SVG coords) */
  const ptrs = [
    { x: 165, y: 345 },
    { x: 632, y: 306 },
    { x: 935, y: 306 },
    { x: 1397, y: 568 },
  ];

  return (
    <section id="pyrolysis-story" ref={sectionRef} className="story-host">
      <div className="sticky-box">

        {/* Title */}
        <div className="story-header">
          <span className="story-eyebrow">How It Works</span>
          <h2 className="story-title">The Pyrolysis Process</h2>
        </div>

        {/* ── SVG BLUEPRINT CANVAS ── */}
        <div className="sketch-area">
          <svg
            ref={svgRef}
            className="blueprint-svg"
            viewBox="0 0 1530 660"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern id="bp-grid" width="45" height="45" patternUnits="userSpaceOnUse">
                <path d="M 45 0 L 0 0 0 45" fill="none" stroke="rgba(141,220,110,0.04)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#bp-grid)" />

            {/* ═══ PHASE 1: FEED HOPPER ═══ */}
            <g>
              {/* upper bowl wide rim */}
              <path d="M 48 148 L 100 103 L 240 103 L 292 148" className="sl-h ph1" />
              <path d="M 48 148 L 72 215 M 292 148 L 268 215" className="sl-h ph1" />
              <path d="M 72 215 H 268" className="sl-h ph1" />
              {/* interior shading */}
              <path d="M 56 162 L 284 162 M 62 182 L 278 182 M 68 202 L 272 202" className="sl-t ph1" />
              {/* neck */}
              <path d="M 118 215 L 132 270 M 222 215 L 208 270 M 132 270 H 208" className="sl-m ph1" />
              {/* stand */}
              <path d="M 80 270 H 260" className="sl-h ph1" />
              <path d="M 88 270 V 492 M 252 270 V 492" className="sl-h ph1" />
              <path d="M 80 375 H 260 M 80 448 H 260" className="sl-m ph1" />
              <path d="M 70 492 H 270" className="sl-h ph1" />
              {/* feet */}
              <path d="M 70 492 L 52 514 H 95 M 270 492 L 288 514 H 245" className="sl-m ph1" />
              {/* braces */}
              <path d="M 88 375 L 158 492 M 252 375 L 182 492" className="sl-t ph1" />
              <path d="M 118 418 H 222 V 448 H 118 Z" className="sl-t ph1" />
              {/* outlet funnel */}
              <path d="M 138 270 L 126 318 H 214 L 202 270" className="sl-m ph1" />
              <path d="M 150 318 V 355 M 190 318 V 355 M 144 355 H 196" className="sl-m ph1" />
              {/* feed pipe to reactor */}
              <path d="M 170 336 H 398" className="sl-h ph1" />
              <path d="M 170 356 H 398" className="sl-m ph1" />
              <path d="M 395 323 V 370" className="sl-m ph1" />
            </g>

            {/* ═══ PHASE 2: ROTARY REACTOR ═══ */}
            <g>
              {/* drum body */}
              <path d="M 398 175 Q 398 136 435 136 L 862 136 Q 898 136 898 175 L 898 458 Q 898 494 862 494 L 435 494 Q 398 494 398 458 Z" className="sl-h ph2" />
              {/* end caps */}
              <ellipse cx="406" cy="315" rx="26" ry="152" className="sl-m ph2" fill="none" />
              <ellipse cx="890" cy="315" rx="18" ry="142" className="sl-t ph2" fill="none" />
              {/* coil rings top */}
              <path d="M 435 178 Q 528 166 621 178 Q 714 190 807 178 Q 848 172 872 178" className="sl-t ph2" />
              <path d="M 433 212 Q 526 200 619 212 Q 712 224 805 212 Q 846 206 872 212" className="sl-t ph2" />
              <path d="M 432 246 Q 525 234 618 246 Q 711 258 804 246 Q 845 240 872 246" className="sl-t ph2" />
              {/* coil rings bottom */}
              <path d="M 432 420 Q 525 408 618 420 Q 711 432 804 420 Q 845 414 872 420" className="sl-t ph2" />
              <path d="M 432 452 Q 525 440 618 452 Q 711 464 804 452 Q 845 446 872 452" className="sl-t ph2" />
              <path d="M 432 480 Q 525 468 618 480 Q 711 492 804 480 Q 845 474 872 480" className="sl-t ph2" />
              {/* inspection window */}
              <path d="M 488 156 Q 488 140 504 140 L 776 140 Q 792 140 792 156 L 792 298 Q 792 314 776 314 L 504 314 Q 488 314 488 298 Z" className="sl-m ph2" />
              <path d="M 496 296 Q 518 274 544 292 Q 570 310 598 286 Q 626 262 654 280 Q 682 298 710 272 Q 738 246 766 266 L 784 298" className="sl-t ph2" />
              {/* porthole */}
              <circle cx="632" cy="406" r="62" className="sl-m ph2" fill="none" />
              <circle cx="632" cy="406" r="50" className="sl-t ph2" fill="none" />
              <path d="M 632 343 V 338 M 695 406 H 700 M 632 468 V 474 M 569 406 H 563" className="sl-t ph2" />
              {/* exhaust pipe */}
              <path d="M 576 136 V 2 M 596 136 V 2 M 562 2 H 610" className="sl-h ph2" />
              <path d="M 565 52 H 607 M 565 98 H 607" className="sl-t ph2" />
              {/* bolt ring on drum */}
              <path d="M 455 136 V 130 M 498 136 V 130 M 540 136 V 130 M 625 136 V 130 M 688 136 V 130 M 730 136 V 130 M 772 136 V 130 M 815 136 V 130 M 856 136 V 130" className="sl-t ph2" />
              {/* gauges */}
              <circle cx="448" cy="124" r="27" className="sl-m ph2" fill="none" />
              <path d="M 448 124 L 459 112 M 448 151 V 136" className="sl-t ph2" />
              <circle cx="748" cy="110" r="29" className="sl-m ph2" fill="none" />
              <path d="M 748 110 L 761 98 M 748 139 V 136" className="sl-t ph2" />
              {/* nameplate */}
              <path d="M 538 422 H 745 V 468 H 538 Z" className="sl-m ph2" />
              <path d="M 550 434 H 733 M 550 453 H 733" className="sl-t ph2" />
              {/* legs */}
              <path d="M 465 494 V 572 M 548 494 V 572 M 712 494 V 572 M 795 494 V 572" className="sl-h ph2" />
              <path d="M 465 542 H 548 M 712 542 H 795" className="sl-t ph2" />
              <path d="M 443 572 H 484 M 528 572 H 568 M 690 572 H 732 M 774 572 H 815" className="sl-m ph2" />
            </g>

            {/* ═══ PHASE 3: POST-PROCESSOR ═══ */}
            <g>
              {/* top hopper */}
              <path d="M 882 26 L 858 184 H 1012 L 988 26 Z" className="sl-h ph3" />
              <path d="M 869 26 H 1001" className="sl-m ph3" />
              <path d="M 873 58 L 878 184 M 997 58 L 992 184" className="sl-t ph3" />
              <path d="M 876 105 H 994 M 880 145 H 990" className="sl-t ph3" />
              {/* gas pipe from reactor */}
              <path d="M 893 136 Q 892 85 890 26" className="sl-m ph3" />
              {/* condenser column */}
              <path d="M 858 184 V 458 M 1012 184 V 458 M 858 458 H 1012" className="sl-h ph3" />
              <path d="M 858 268 H 1012 M 858 352 H 1012 M 858 436 H 1012" className="sl-m ph3" />
              <circle cx="844" cy="250" r="19" className="sl-t ph3" fill="none" />
              <path d="M 844 250 L 851 242 M 844 269 V 258" className="sl-t ph3" />
              {/* bypass pipe */}
              <path d="M 1012 232 H 1048 V 292 H 1012" className="sl-t ph3" />
              <circle cx="1048" cy="212" r="18" className="sl-t ph3" fill="none" />
              {/* screw conveyor shell */}
              <path d="M 1009 206 H 1252 V 193" className="sl-h ph3" />
              <path d="M 1009 400 H 1252 V 413" className="sl-h ph3" />
              <path d="M 1252 193 Q 1280 193 1280 303 Q 1280 413 1252 413" className="sl-h ph3" />
              <path d="M 1009 193 Q 992 193 992 303 Q 992 413 1009 413" className="sl-m ph3" />
              {/* screw flights */}
              <path d="M 1015 210 Q 1032 248 1049 210 Q 1066 172 1083 210 Q 1100 248 1117 210 Q 1134 172 1151 210 Q 1168 248 1185 210 Q 1202 172 1219 210 Q 1236 248 1250 210" className="sl-t ph3" />
              <path d="M 1015 394 Q 1032 356 1049 394 Q 1066 432 1083 394 Q 1100 356 1117 394 Q 1134 432 1151 394 Q 1168 356 1185 394 Q 1202 432 1219 394 Q 1236 356 1250 394" className="sl-t ph3" />
              <path d="M 1012 303 H 1275" className="sl-t ph3" />
              {/* motor */}
              <path d="M 1032 462 H 1174 V 558 H 1032 Z" className="sl-h ph3" />
              <circle cx="1103" cy="508" r="38" className="sl-m ph3" fill="none" />
              <circle cx="1103" cy="508" r="24" className="sl-t ph3" fill="none" />
              <path d="M 1103 470 V 546 M 1065 508 H 1141 M 1076 478 L 1130 538 M 1130 478 L 1076 538" className="sl-t ph3" />
              <path d="M 1022 558 H 1184 V 569 H 1022 Z" className="sl-m ph3" />
              {/* collection bin */}
              <path d="M 862 458 H 1005 V 554 H 862 Z" className="sl-m ph3" />
              <path d="M 874 472 H 995 M 874 505 H 995 M 874 534 H 995" className="sl-t ph3" />
              {/* legs */}
              <path d="M 878 562 V 598 M 988 562 V 598 M 1045 566 V 598 M 1165 566 V 598" className="sl-m ph3" />
              <path d="M 860 598 H 1004 M 1025 598 H 1185" className="sl-m ph3" />
            </g>

            {/* ═══ PHASE 4: CONTROL + CAPTURE ═══ */}
            <g>
              {/* control panel */}
              <path d="M 1196 266 H 1316 V 562 H 1196 Z" className="sl-h ph4" />
              <path d="M 1210 282 H 1302 V 368 H 1210 Z" className="sl-m ph4" />
              <path d="M 1216 294 H 1296 M 1216 310 H 1286 M 1216 326 H 1296 M 1216 342 H 1276" className="sl-t ph4" />
              <circle cx="1220" cy="392" r="8" className="sl-t ph4" fill="none" />
              <circle cx="1246" cy="392" r="8" className="sl-t ph4" fill="none" />
              <circle cx="1272" cy="392" r="8" className="sl-t ph4" fill="none" />
              <path d="M 1210 414 H 1302 M 1210 432 H 1290 M 1210 450 H 1296 M 1210 468 H 1276 M 1210 490 H 1260 M 1210 510 H 1296 M 1210 530 H 1270" className="sl-t ph4" />
              <path d="M 1216 562 V 598 M 1296 562 V 598 M 1198 598 H 1318" className="sl-m ph4" />
              {/* output hopper */}
              <path d="M 1322 158 L 1298 346 H 1462 L 1436 158 Z" className="sl-h ph4" />
              <path d="M 1308 158 H 1448" className="sl-m ph4" />
              <path d="M 1316 200 L 1322 346 M 1446 200 L 1440 346" className="sl-t ph4" />
              <path d="M 1320 240 H 1442 M 1326 295 H 1436" className="sl-t ph4" />
              {/* pipe from panel to chute */}
              <path d="M 1312 346 V 396 H 1196 V 444" className="sl-m ph4" />
              {/* discharge chute */}
              <path d="M 1194 464 L 1416 572 L 1428 554 L 1206 444 Z" className="sl-h ph4" />
              <path d="M 1242 460 L 1250 500 M 1304 484 L 1316 524 M 1362 508 L 1376 550" className="sl-t ph4" />
              <path d="M 1194 444 L 1416 554 M 1206 464 L 1428 572" className="sl-m ph4" />
              {/* collection bin */}
              <path d="M 1380 554 H 1524 V 642 H 1380 Z" className="sl-h ph4" />
              <path d="M 1387 554 Q 1407 532 1429 552 Q 1451 572 1477 548 Q 1498 526 1512 548" className="sl-t ph4" />
              <path d="M 1388 576 H 1516 M 1388 598 H 1516" className="sl-t ph4" />
              {/* wheels */}
              <circle cx="1408" cy="645" r="19" className="sl-m ph4" fill="none" />
              <circle cx="1496" cy="645" r="19" className="sl-m ph4" fill="none" />
              <circle cx="1408" cy="645" r="8"  className="sl-t ph4" fill="none" />
              <circle cx="1496" cy="645" r="8"  className="sl-t ph4" fill="none" />
              <path d="M 1408 645 H 1496" className="sl-t ph4" />
            </g>

            {/* ═══ FEEDSTOCK PARTICLES (CSS loop) ═══ */}
            {showParticles && [
              [78,  26, 4,   '0s'],
              [96,  18, 3.5, '0.35s'],
              [112, 32, 4,   '0.7s'],
              [84,  42, 3,   '1.05s'],
              [102, 12, 4.5, '1.4s'],
              [70,  48, 3,   '1.75s'],
              [118, 8,  3.5, '0.55s'],
              [90,  55, 3,   '0.9s'],
            ].map(([cx, cy, r, delay], i) => (
              <ellipse
                key={i}
                cx={cx} cy={cy} rx={r} ry={r * 0.75}
                fill="var(--bright)" opacity="0.72"
                style={{ animation: `fall-pellet 2s ease-in ${delay} infinite` }}
              />
            ))}

            {/* ═══ PROCESS FLOW INDICATORS (runs after all done) ═══ */}
            {showFlow && (
              <g className="flow-layer">
                {/* feedstock → reactor */}
                <circle r="5" fill="var(--bright)" opacity="0.9">
                  <animateMotion dur="2.2s" repeatCount="indefinite" path="M 170 346 H 398" />
                </circle>
                <circle r="5" fill="var(--bright)" opacity="0.55">
                  <animateMotion dur="2.2s" repeatCount="indefinite" begin="1.1s" path="M 170 346 H 398" />
                </circle>
                {/* exhaust → up */}
                <circle r="4" fill="#ffc340" opacity="0.85">
                  <animateMotion dur="1.8s" repeatCount="indefinite" path="M 586 136 V 2" />
                </circle>
                {/* gas → condenser hopper */}
                <circle r="4" fill="#ffc340" opacity="0.7">
                  <animateMotion dur="2s" repeatCount="indefinite" begin="0.5s" path="M 893 136 Q 892 80 890 26" />
                </circle>
                {/* biochar → chute → bin */}
                <circle r="5" fill="var(--bright)" opacity="0.8">
                  <animateMotion dur="2.8s" repeatCount="indefinite" begin="1.2s" path="M 1194 464 L 1416 572" />
                </circle>
              </g>
            )}

            {/* Active phase pointer */}
            {!showFlow && ptrs.map((pos, i) => (
              <g key={i} style={{ opacity: activeCard === i ? 1 : 0, transition: 'opacity 0.5s' }}>
                <circle cx={pos.x} cy={pos.y} r="5"  className="ptr-dot" />
                <circle cx={pos.x} cy={pos.y} r="13" className="ptr-ring" />
                <line x1={pos.x} y1={pos.y + 18} x2={pos.x} y2="652" className="ptr-line" />
              </g>
            ))}
          </svg>
        </div>

        {/* ── PHASE CARDS (4 separate) ── */}
        <div className="phase-cards-row">
          {PHASES.map((ph, i) => (
            <div
              key={i}
              className={`phase-card ${revealedCards[i] ? 'revealed' : ''} ${activeCard === i && !showFlow ? 'current' : ''} ${showFlow ? 'done' : ''}`}
              style={{ '--card-color': ph.color }}
            >
              <div className="pc-top">
                <span className="pc-num">{ph.id}</span>
                <span className="pc-lbl">{ph.label}</span>
              </div>
              <div className="pc-short">{ph.short}</div>
              <p className="pc-desc">{ph.desc}</p>
              <div className="pc-bar">
                <div className="pc-fill" style={{ width: revealedCards[i] ? '100%' : '0%' }} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

/* ─────────────── REST OF APP ─────────────── */
const App = () => {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          if (e.target.dataset.target) e.target.style.width = e.target.dataset.target;
        }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .bar-fill, .temp-bar').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="site-wrapper">
      <Navbar />
      <main>
        <section className="hero">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="hero-title">BIOCHAR</h1>
            <p className="hero-subtitle">Engineering permanence from agricultural residues.</p>
            <div className="hero-stat-row">
              <div className="hero-stat"><span className="num">1000+</span><span className="desc">Years Carbon Lock</span></div>
              <div className="hero-stat"><span className="num">650°C</span><span className="desc">Pyrolysis Temp</span></div>
              <div className="hero-stat"><span className="num">3:1</span><span className="desc">CO₂e Ratio</span></div>
            </div>
          </div>
        </section>

        <PyrolysisStory />

        <section className="flow-section" id="process">
          <span className="section-label reveal">The Alchemy</span>
          <h2 className="section-title reveal">From Waste to Sink.</h2>
          <div className="process-flow">
            {[
              { phase:'PHASE I',   title:'Biomass Sourcing', desc:'Agricultural waste intercepted and dried.',                    icon:'🌾' },
              { phase:'PHASE II',  title:'Pyrolysis',        desc:'Airtight heating creates a stable carbon framework.',          icon:'🔥', extra:true },
              { phase:'PHASE III', title:'Biochar Material', desc:'Pure, sponge-like carbon structured lattice.',                 icon:'🪨' },
              { phase:'PHASE IV',  title:'Soil Application', desc:'Revitalizing soil while storing carbon permanently.',          icon:'🌱' },
            ].map((step, i) => (
              <div key={i} className="process-step reveal">
                <div className="step-spine">
                  <div className="step-icon-wrap">{step.icon}</div>
                  <div className="step-connector" />
                </div>
                <div className="step-body">
                  <div className="step-number">{step.phase}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                  {step.extra && (
                    <div className="temp-gauge">
                      <div className="temp-bar-wrap"><div className="temp-bar" data-target="80%" /></div>
                      <div className="temp-label">650°C – 800°C</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="permanence-section" id="permanence">
          <div className="permanence-inner">
            <span className="section-label reveal">The Timescale</span>
            <h2 className="permanence-title reveal">Measuring Permanence.</h2>
            <div className="compare-grid reveal">
              <div className="compare-card">
                <div className="method">Forestry (Trees)</div>
                <div className="years">~50</div>
                <div className="bar-fill" data-target="15%" style={{ '--bar-color': '#4a6b52' }} />
              </div>
              <div className="compare-card highlight">
                <div className="method">Biochar</div>
                <div className="years">1,000+</div>
                <div className="bar-fill" data-target="100%" style={{ '--bar-color': 'var(--bright)' }} />
              </div>
            </div>
          </div>
        </section>

        <section className="credit-section" id="credits">
          <span className="section-label reveal">The Asset</span>
          <h2 className="section-title reveal">Value Engineering.</h2>
          <div className="credit-card reveal">
            <div className="credit-grid">
              <div className="credit-field"><label>Carbon Removal</label><span className="value">~3.0 tCO₂e</span></div>
              <div className="credit-field"><label>Durability</label><span className="value">1000+ Years</span></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <img src="/images/GreenASHA-Logo.png" alt="GreenASHA" className="footer-logo-img" />
        <div className="footer-sub">Turning Agricultural Liabilities into Planetary Assets</div>
      </footer>
    </div>
  );
};

export default App;
