import React, { useState, useEffect, useRef } from 'react';
import './App.css';

/* ─── NAVBAR ─── */
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

/* ─── PHASES DATA ─── */
const PHASES = [
  { id: '01', label: 'INDUCTION', color: '#8ddc6e', short: 'Biomass Feeding', desc: 'Dried agricultural residue is gravity-fed through an oxygen-sealed hopper, metered precisely into the reactor feed pipe.' },
  { id: '02', label: 'PYROLYSIS', color: '#ffc340', short: 'Thermal Decomposition', desc: 'The rotary drum operates at 650–750 °C in zero-oxygen, cracking biomass into biochar, bio-oil vapour and syngas.' },
  { id: '03', label: 'FRACTIONATION', color: '#4fc26a', short: 'Gas Separation', desc: 'Hot gases rise through the condenser column; bio-oils condense while clean syngas recirculates as furnace fuel.' },
  { id: '04', label: 'CAPTURE', color: '#8ddc6e', short: 'Biochar Output', desc: 'Stabilised biochar exits the screw conveyor into the wheeled collection bin, ready for soil certification.' },
];

/* ══════════════════════════════════════════
   PYROLYSIS STORY COMPONENT
   ══════════════════════════════════════════ */
const PyrolysisStory = () => {
  const sectionRef = useRef(null);
  const svgRef = useRef(null);
  const hasJumped = useRef(false);

  const [revealedCards, setRevealedCards] = useState([false, false, false, false]);
  const [activeCard, setActiveCard] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [showFlow, setShowFlow] = useState(false);

  useEffect(() => {
    let raf;
    let peakProg = 0;
    let lastEff = -1;

    const clamp = v => Math.min(1, Math.max(0, v));
    const phProg = (p, s, e) => clamp((p - s) / (e - s));

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!sectionRef.current || !svgRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;

      const raw = clamp(-rect.top / total);
      peakProg = Math.max(peakProg, raw);

      /* Once fully drawn: jump to section-end so one UP-scroll exits */
      if (peakProg >= 0.97 && !hasJumped.current) {
        hasJumped.current = true;
        const targetY = sectionRef.current.offsetTop + sectionRef.current.offsetHeight - window.innerHeight;
        if (window.scrollY < targetY - 8) window.scrollTo({ top: targetY, behavior: 'smooth' });
      }

      const eff = peakProg >= 0.97 ? 1 : raw;
      if (eff === lastEff) return;
      lastEff = eff;

      const svg = svgRef.current;

      /* ── Full-phase vars (labels, cards, separators) ── */
      svg.style.setProperty('--p1', phProg(eff, 0, 0.25));
      svg.style.setProperty('--p2', phProg(eff, 0.25, 0.5));
      svg.style.setProperty('--p3', phProg(eff, 0.5, 0.75));
      svg.style.setProperty('--p4', phProg(eff, 0.75, 1.0));

      /* ── 12 Sub-phase vars for sequential sketching ──
         Each phase (0.25 wide) is split into 3 equal sub-ranges (~0.0833 each).
         Sub-phase A = structural skeleton (long lines first)
         Sub-phase B = secondary elements  (connections, gauges)
         Sub-phase C = fine details        (hatch, bolts, labels)       */
      // Phase 1  eff 0.000 → 0.250
      svg.style.setProperty('--p1a', phProg(eff, 0.000, 0.0833));
      svg.style.setProperty('--p1b', phProg(eff, 0.0833, 0.1667));
      svg.style.setProperty('--p1c', phProg(eff, 0.1667, 0.25));
      // Phase 2  eff 0.250 → 0.500
      svg.style.setProperty('--p2a', phProg(eff, 0.25, 0.3333));
      svg.style.setProperty('--p2b', phProg(eff, 0.3333, 0.4167));
      svg.style.setProperty('--p2c', phProg(eff, 0.4167, 0.5));
      // Phase 3  eff 0.500 → 0.750
      svg.style.setProperty('--p3a', phProg(eff, 0.5, 0.5833));
      svg.style.setProperty('--p3b', phProg(eff, 0.5833, 0.6667));
      svg.style.setProperty('--p3c', phProg(eff, 0.6667, 0.75));
      // Phase 4  eff 0.750 → 1.000
      svg.style.setProperty('--p4a', phProg(eff, 0.75, 0.8333));
      svg.style.setProperty('--p4b', phProg(eff, 0.8333, 0.9167));
      svg.style.setProperty('--p4c', phProg(eff, 0.9167, 1.0));

      /* ── React state for phase cards ── */
      const idx = Math.min(Math.floor(eff * 3.99), 3);
      setActiveCard(idx);
      setRevealedCards([eff > 0.01, eff >= 0.25, eff >= 0.5, eff >= 0.75]);
      setShowParticles(eff > 0.01);
      setShowFlow(peakProg >= 0.97);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Pointer anchors — absolute SVG coords (with phase translate offsets baked in) */
  const ptrs = [
    { x: 170, y: 340 },
    { x: 686, y: 308 },
    { x: 1058, y: 308 },
    { x: 1510, y: 570 },
  ];

  const pellets = [
    [78, 26, 4, '0s'], [96, 18, 3.5, '0.35s'], [112, 32, 4, '0.7s'], [84, 42, 3, '1.05s'],
    [102, 12, 4.5, '1.4s'], [70, 48, 3, '1.75s'], [118, 8, 3.5, '0.55s'], [90, 55, 3, '0.9s'],
  ];

  /* ── helper: dim-bracket label per zone ──
     Renders: badge pill + zone-span dimension line with ticks + 2-line title + leader arrow  */
  const ZoneLabel = ({ cx, x1, x2, pVar, color = 'var(--bright)', num, line1, line2 }) => {
    const tColor = color;
    const bgRgba = color === '#ffc340' ? 'rgba(255,195,64,0.10)' :
      color === '#4fc26a' ? 'rgba(79,194,106,0.10)' : 'rgba(141,220,110,0.10)';
    const bkStroke = color === '#ffc340' ? 'rgba(255,195,64,0.38)' :
      color === '#4fc26a' ? 'rgba(79,194,106,0.38)' : 'rgba(141,220,110,0.38)';
    const bwStr = 0.7;
    const badgeW = line2 === 'DECOMPOSITION' ? 138 : 108;

    return (
      <g style={{ opacity: `var(${pVar}, 0)` }}>
        {/* Dimension span line */}
        <line x1={x1} y1="-50" x2={x2} y2="-50"
          stroke={bkStroke} strokeWidth="0.7" strokeDasharray="5 7" />
        {/* Zone tick marks */}
        <line x1={x1} y1="-57" x2={x1} y2="-43" stroke={tColor} strokeWidth={bwStr} opacity="0.6" />
        <line x1={x2} y1="-57" x2={x2} y2="-43" stroke={tColor} strokeWidth={bwStr} opacity="0.6" />
        {/* Badge pill */}
        <rect x={cx - badgeW / 2} y="-124" width={badgeW} height="18" rx="9"
          fill={bgRgba} stroke={bkStroke} strokeWidth={bwStr} />
        <text x={cx} y="-112" className="ph-badge-text" style={{ fill: tColor }}>
          {`● PHASE ${num}`}
        </text>
        {/* 2-line title */}
        <text x={cx} y="-92" className="ph-title-label">{line1}</text>
        {line2 && <text x={cx} y="-71" className="ph-title-label">{line2}</text>}
        {/* Short horizontal accent under title */}
        <line x1={cx - 38} y1="-62" x2={cx + 38} y2="-62" stroke={bkStroke} strokeWidth="0.8" />
        {/* Leader to dimension line */}
        <line x1={cx} y1="-57" x2={cx} y2="-57" stroke="none" />
        <line x1={cx} y1="-62" x2={cx} y2="-55"
          stroke={tColor} strokeWidth="0.9" strokeDasharray="2 0" />
        {/* Arrowhead */}
        <polygon points={`${cx - 5},-43 ${cx + 5},-43 ${cx},-37`} fill={tColor} opacity="0.85" />
      </g>
    );
  };

  return (
    <section id="pyrolysis-story" ref={sectionRef} className="story-host">
      <div className="sticky-box">

        <div className="story-header">
          <span className="story-eyebrow">How It Works</span>
          <h2 className="story-title">The Pyrolysis Process</h2>
        </div>

        <div className="sketch-area">
          {/*
            ViewBox: 0 -128 1720 808
            Phase transforms for spacing (50px gaps between zones):
              Phase 1: translate(0,0)   — feed hopper
              Phase 2: translate(50,0)  — rotary reactor
              Phase 3: translate(100,0) — post-processor
              Phase 4: translate(150,0) — capture station
          */}
          <svg ref={svgRef} className="blueprint-svg"
            viewBox="40 -128 1640 808" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="bp-grid" width="45" height="45" patternUnits="userSpaceOnUse">
                <path d="M 45 0 L 0 0 0 45" fill="none" stroke="rgba(141,220,110,0.04)" strokeWidth="0.5" />
              </pattern>
              {/* ── Glow filters for flow particles ── */}
              <filter id="glow-g" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glow-o" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glow-b" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect x="0" y="-128" width="1720" height="808" fill="url(#bp-grid)" />

            {/* ════════════════════════════════════
                ZONE DIMENSION-BRACKET LABELS
                Zone spans (absolute coords after translate offsets):
                  Zone 1: x 20  → 420   center x=170
                  Zone 2: x 440 → 948   center x=694
                  Zone 3: x 955 → 1318  center x=1138
                  Zone 4: x 1340→ 1700  center x=1510
                ════════════════════════════════════ */}
            <ZoneLabel pVar="--p1" color="var(--bright)" num="01"
              x1={20} x2={420} cx={210} line1="BIOMASS" line2="FEEDING" />
            <ZoneLabel pVar="--p2" color="#ffc340" num="02"
              x1={440} x2={948} cx={694} line1="THERMAL" line2="DECOMPOSITION" />
            <ZoneLabel pVar="--p3" color="#4fc26a" num="03"
              x1={955} x2={1318} cx={1138} line1="GAS" line2="SEPARATION" />
            <ZoneLabel pVar="--p4" color="var(--bright)" num="04"
              x1={1340} x2={1700} cx={1510} line1="BIOCHAR" line2="OUTPUT" />

            {/* ════════════════════════════════════
                VERTICAL ZONE SEPARATOR LINES
                Opacity tied to full-phase --p2/p3/p4 via CSS sep- classes
                ════════════════════════════════════ */}
            <line x1="423" y1="-128" x2="423" y2="700" className="sep-line sep-p2" />
            <line x1="953" y1="-128" x2="953" y2="700" className="sep-line sep-p3" />
            <line x1="1328" y1="-128" x2="1328" y2="700" className="sep-line sep-p4" />

            {/* ════════════════════════════════════
                INTER-PHASE CONNECTORS (absolute SVG coords)
                Drawn outside translate groups so they bridge gaps correctly.
                ════════════════════════════════════ */}
            {/* Extended feed pipe: hopper outlet → reactor inlet (abs x 170→448) */}
            <path d="M 170 336 H 448" className="sl-h ph1b" />
            <path d="M 170 356 H 448" className="sl-m ph1b" />
            <path d="M 445 323 V 370" className="sl-m ph1b" />
            {/* Horizontal gas bridge: reactor exhaust (abs x≈638) → condenser hopper top (abs x≈1028) */}
            <path d="M 638 3 H 1028 V 28" className="sl-m ph3a" />
            <path d="M 622 3 H 654 M 1022 5 H 1044" className="sl-t ph3b" />

            {/* ════════════════════════════════════
                PHASE 1 — FEED HOPPER  (no transform)
                1a = structural skeleton
                1b = secondary connections
                1c = fine detail / hatch lines
                ════════════════════════════════════ */}
            <g>
              {/* ── 1a structural ── */}
              <path d="M 48 148 L 100 103 L 240 103 L 292 148" className="sl-h ph1a" />
              <path d="M 48 148 L 72 215 M 292 148 L 268 215" className="sl-h ph1a" />
              <path d="M 72 215 H 268" className="sl-h ph1a" />
              <path d="M 80 270 H 260" className="sl-h ph1a" />
              <path d="M 88 270 V 492 M 252 270 V 492" className="sl-h ph1a" />
              <path d="M 70 492 H 270" className="sl-h ph1a" />
              {/* ── 1b secondary ── */}
              <path d="M 118 215 L 132 270 M 222 215 L 208 270 M 132 270 H 208" className="sl-m ph1b" />
              <path d="M 80 375 H 260 M 80 448 H 260" className="sl-m ph1b" />
              <path d="M 70 492 L 52 514 H 95 M 270 492 L 288 514 H 245" className="sl-m ph1b" />
              <path d="M 138 270 L 126 318 H 214 L 202 270" className="sl-m ph1b" />
              <path d="M 150 318 V 355 M 190 318 V 355 M 144 355 H 196" className="sl-m ph1b" />
              {/* ── 1c fine ── */}
              <path d="M 56 162 L 284 162 M 62 182 L 278 182 M 68 202 L 272 202" className="sl-t ph1c" />
              <path d="M 88 375 L 158 492 M 252 375 L 182 492" className="sl-t ph1c" />
              <path d="M 118 418 H 222 V 448 H 118 Z" className="sl-t ph1c" />
            </g>

            {/* ════════════════════════════════════
                PHASE 2 — ROTARY REACTOR  (+50 translate)
                ════════════════════════════════════ */}
            <g transform="translate(50,0)">
              {/* ── 2a structural ── */}
              <path d="M 398 175 Q 398 136 435 136 L 862 136 Q 898 136 898 175 L 898 458 Q 898 494 862 494 L 435 494 Q 398 494 398 458 Z" className="sl-h ph2a" />
              <path d="M 465 494 V 572 M 548 494 V 572 M 712 494 V 572 M 795 494 V 572" className="sl-h ph2a" />
              {/* ── 2b secondary ── */}
              <ellipse cx="406" cy="315" rx="26" ry="152" className="sl-m ph2b" fill="none" />
              <ellipse cx="890" cy="315" rx="18" ry="142" className="sl-t ph2b" fill="none" />
              <path d="M 576 136 V 2 M 596 136 V 2 M 562 2 H 610" className="sl-h ph2b" />
              <path d="M 488 156 Q 488 140 504 140 L 776 140 Q 792 140 792 156 L 792 298 Q 792 314 776 314 L 504 314 Q 488 314 488 298 Z" className="sl-m ph2b" />
              <circle cx="632" cy="406" r="62" className="sl-m ph2b" fill="none" />
              <circle cx="632" cy="406" r="50" className="sl-t ph2b" fill="none" />
              <circle cx="448" cy="124" r="27" className="sl-m ph2b" fill="none" />
              <circle cx="748" cy="110" r="29" className="sl-m ph2b" fill="none" />
              <path d="M 465 542 H 548 M 712 542 H 795" className="sl-t ph2b" />
              <path d="M 443 572 H 484 M 528 572 H 568 M 690 572 H 732 M 774 572 H 815" className="sl-m ph2b" />
              {/* ── 2c fine ── */}
              <path d="M 435 178 Q 528 166 621 178 Q 714 190 807 178 Q 848 172 872 178" className="sl-t ph2c" />
              <path d="M 433 212 Q 526 200 619 212 Q 712 224 805 212 Q 846 206 872 212" className="sl-t ph2c" />
              <path d="M 432 246 Q 525 234 618 246 Q 711 258 804 246 Q 845 240 872 246" className="sl-t ph2c" />
              <path d="M 432 420 Q 525 408 618 420 Q 711 432 804 420 Q 845 414 872 420" className="sl-t ph2c" />
              <path d="M 432 452 Q 525 440 618 452 Q 711 464 804 452 Q 845 446 872 452" className="sl-t ph2c" />
              <path d="M 432 480 Q 525 468 618 480 Q 711 492 804 480 Q 845 474 872 480" className="sl-t ph2c" />
              <path d="M 496 296 Q 518 274 544 292 Q 570 310 598 286 Q 626 262 654 280 Q 682 298 710 272 Q 738 246 766 266 L 784 298" className="sl-t ph2c" />
              <path d="M 632 343 V 338 M 695 406 H 700 M 632 468 V 474 M 569 406 H 563" className="sl-t ph2c" />
              <path d="M 565 52 H 607 M 565 98 H 607" className="sl-t ph2c" />
              <path d="M 455 136 V 130 M 498 136 V 130 M 540 136 V 130 M 625 136 V 130 M 688 136 V 130 M 730 136 V 130 M 772 136 V 130 M 815 136 V 130 M 856 136 V 130" className="sl-t ph2c" />
              <path d="M 448 124 L 459 112 M 448 151 V 136" className="sl-t ph2c" />
              <path d="M 748 110 L 761 98 M 748 139 V 136" className="sl-t ph2c" />
              <path d="M 538 422 H 745 V 468 H 538 Z" className="sl-m ph2c" />
              <path d="M 550 434 H 733 M 550 453 H 733" className="sl-t ph2c" />
            </g>

            {/* ════════════════════════════════════
                PHASE 3 — POST-PROCESSOR  (+100 translate)
                ════════════════════════════════════ */}
            <g transform="translate(100,0)">
              {/* ── 3a structural ── */}
              <path d="M 882 26 L 858 184 H 1012 L 988 26 Z" className="sl-h ph3a" />
              <path d="M 858 184 V 458 M 1012 184 V 458 M 858 458 H 1012" className="sl-h ph3a" />
              <path d="M 1009 206 H 1252 V 193" className="sl-h ph3a" />
              <path d="M 1009 400 H 1252 V 413" className="sl-h ph3a" />
              <path d="M 1252 193 Q 1280 193 1280 303 Q 1280 413 1252 413" className="sl-h ph3a" />
              {/* ── 3b secondary ── */}
              <path d="M 869 26 H 1001" className="sl-m ph3b" />
              <path d="M 893 136 Q 892 85 890 26" className="sl-m ph3b" />
              <path d="M 1009 193 Q 992 193 992 303 Q 992 413 1009 413" className="sl-m ph3b" />
              <path d="M 1012 232 H 1048 V 292 H 1012" className="sl-t ph3b" />
              <circle cx="1048" cy="212" r="18" className="sl-t ph3b" fill="none" />
              <path d="M 1032 462 H 1174 V 558 H 1032 Z" className="sl-h ph3b" />
              <circle cx="1103" cy="508" r="38" className="sl-m ph3b" fill="none" />
              <path d="M 1022 558 H 1184 V 569 H 1022 Z" className="sl-m ph3b" />
              <path d="M 862 458 H 1005 V 554 H 862 Z" className="sl-m ph3b" />
              {/* ── 3c fine ── */}
              <path d="M 873 58 L 878 184 M 997 58 L 992 184" className="sl-t ph3c" />
              <path d="M 876 105 H 994 M 880 145 H 990" className="sl-t ph3c" />
              <path d="M 858 268 H 1012 M 858 352 H 1012 M 858 436 H 1012" className="sl-m ph3c" />
              <circle cx="844" cy="250" r="19" className="sl-t ph3c" fill="none" />
              <path d="M 844 250 L 851 242 M 844 269 V 258" className="sl-t ph3c" />
              <path d="M 1015 210 Q 1032 248 1049 210 Q 1066 172 1083 210 Q 1100 248 1117 210 Q 1134 172 1151 210 Q 1168 248 1185 210 Q 1202 172 1219 210 Q 1236 248 1250 210" className="sl-t ph3c" />
              <path d="M 1015 394 Q 1032 356 1049 394 Q 1066 432 1083 394 Q 1100 356 1117 394 Q 1134 432 1151 394 Q 1168 356 1185 394 Q 1202 432 1219 394 Q 1236 356 1250 394" className="sl-t ph3c" />
              <path d="M 1012 303 H 1275" className="sl-t ph3c" />
              <circle cx="1103" cy="508" r="24" className="sl-t ph3c" fill="none" />
              <path d="M 1103 470 V 546 M 1065 508 H 1141 M 1076 478 L 1130 538 M 1130 478 L 1076 538" className="sl-t ph3c" />
              <path d="M 874 472 H 995 M 874 505 H 995 M 874 534 H 995" className="sl-t ph3c" />
              <path d="M 878 562 V 598 M 988 562 V 598 M 1045 566 V 598 M 1165 566 V 598" className="sl-m ph3c" />
              <path d="M 860 598 H 1004 M 1025 598 H 1185" className="sl-m ph3c" />
            </g>

            {/* ════════════════════════════════════
                PHASE 4 — CONTROL + CAPTURE  (+150 translate)
                ════════════════════════════════════ */}
            <g transform="translate(150,0)">
              {/* ── 4a structural ── */}
              <path d="M 1196 266 H 1316 V 562 H 1196 Z" className="sl-h ph4a" />
              <path d="M 1322 158 L 1298 346 H 1462 L 1436 158 Z" className="sl-h ph4a" />
              <path d="M 1380 554 H 1524 V 642 H 1380 Z" className="sl-h ph4a" />
              {/* ── 4b secondary ── */}
              <path d="M 1210 282 H 1302 V 368 H 1210 Z" className="sl-m ph4b" />
              <path d="M 1308 158 H 1448" className="sl-m ph4b" />
              <path d="M 1312 346 V 396 H 1196 V 444" className="sl-m ph4b" />
              <path d="M 1194 464 L 1416 572 L 1428 554 L 1206 444 Z" className="sl-h ph4b" />
              <path d="M 1194 444 L 1416 554 M 1206 464 L 1428 572" className="sl-m ph4b" />
              <path d="M 1216 562 V 598 M 1296 562 V 598 M 1198 598 H 1318" className="sl-m ph4b" />
              {/* ── 4c fine ── */}
              <path d="M 1216 294 H 1296 M 1216 310 H 1286 M 1216 326 H 1296 M 1216 342 H 1276" className="sl-t ph4c" />
              <circle cx="1220" cy="392" r="8" className="sl-t ph4c" fill="none" />
              <circle cx="1246" cy="392" r="8" className="sl-t ph4c" fill="none" />
              <circle cx="1272" cy="392" r="8" className="sl-t ph4c" fill="none" />
              <path d="M 1210 414 H 1302 M 1210 432 H 1290 M 1210 450 H 1296 M 1210 468 H 1276 M 1210 490 H 1255 M 1210 510 H 1296 M 1210 530 H 1270" className="sl-t ph4c" />
              <path d="M 1316 200 L 1322 346 M 1446 200 L 1440 346" className="sl-t ph4c" />
              <path d="M 1320 240 H 1442 M 1326 295 H 1436" className="sl-t ph4c" />
              <path d="M 1242 460 L 1250 500 M 1304 484 L 1316 524 M 1362 508 L 1376 550" className="sl-t ph4c" />
              <path d="M 1387 554 Q 1407 532 1429 552 Q 1451 572 1477 548 Q 1498 526 1512 548" className="sl-t ph4c" />
              <path d="M 1388 576 H 1516 M 1388 598 H 1516" className="sl-t ph4c" />
              <circle cx="1408" cy="645" r="19" className="sl-m ph4c" fill="none" />
              <circle cx="1496" cy="645" r="19" className="sl-m ph4c" fill="none" />
              <circle cx="1408" cy="645" r="8" className="sl-t ph4c" fill="none" />
              <circle cx="1496" cy="645" r="8" className="sl-t ph4c" fill="none" />
              <path d="M 1408 645 H 1496" className="sl-t ph4c" />
            </g>

            {/* ════ FEEDSTOCK PARTICLES ════ */}
            {showParticles && pellets.map(([cx, cy, r, delay], i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.75}
                fill="var(--bright)" opacity="0.72"
                style={{ animation: `fall-pellet 2s ease-in ${delay} infinite` }} />
            ))}

            {/* ════ ELABORATE PROCESS FLOW — 7 material streams ════
                 Absolute coords (translate offsets already applied):
                   Feed pipe   : M 170 346 H 448
                   Reactor wave: S-curve inside x=460-938, cy=346
                   Exhaust pipe: M 636 136 V 3
                   Gas bridge  : M 638 3 H 1028 V 28
                   Condenser   : M 1035 28 V 440
                   Screw+chute : M 1109 303 H 1352 V 450 L 1566 572
                 ════ */}
            {showFlow && (
              <g className="flow-layer">

                {/* ─── ZONE HEAT PULSE: pulsing orange halo in reactor ─── */}
                <circle cx="698" cy="315" r="100" fill="rgba(255,100,0,0.03)"
                  stroke="rgba(255,120,0,0.20)" strokeWidth="1.5">
                  <animate attributeName="r" values="100;124;100" dur="2.6s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.20;0.05;0.20" dur="2.6s" repeatCount="indefinite" />
                </circle>
                <circle cx="698" cy="315" r="60" fill="rgba(255,100,0,0.05)"
                  stroke="rgba(255,150,0,0.12)" strokeWidth="0.8">
                  <animate attributeName="r" values="60;80;60" dur="2s" repeatCount="indefinite" begin="0.5s" />
                </circle>

                {/* ─── PROCESS BADGE LABELS ─── */}
                {/* 1 BIOMASS — Relocated to the specific void requested by the user */}
                <g opacity="0.95">
                  <rect x="250" y="285" width="112" height="20" rx="4"
                    fill="rgba(5,14,8,0.92)" stroke="rgba(141,220,110,0.55)" strokeWidth="0.8" />
                  <circle cx="265" cy="295" r="4" fill="#8ddc6e" filter="url(#glow-g)" />
                  <text x="275" y="295" fontFamily="'Space Mono',monospace" fontSize="9"
                    fill="#8ddc6e" dominantBaseline="middle">RAW BIOMASS</text>
                </g>
                {/* 2 PYROLYSIS — Shifted upward to clear the drum body */}
                <g opacity="0.92">
                  <rect x="614" y="150" width="168" height="22" rx="4"
                    fill="rgba(12,6,2,0.92)" stroke="rgba(255,140,0,0.65)" strokeWidth="0.8" />
                  <circle cx="630" cy="161" r="4.5" fill="#ff8c00" filter="url(#glow-o)">
                    <animate attributeName="opacity" values="1;0.45;1" dur="1.1s" repeatCount="indefinite" />
                  </circle>
                  <text x="640" y="161" fontFamily="'Space Mono',monospace" fontSize="9"
                    fill="#ffb24c" dominantBaseline="middle">PYROLYSIS  650 °C</text>
                </g>
                {/* 3 SYNGAS — Moved right to clear the exhaust stack */}
                <g opacity="0.92">
                  <rect x="710" y="45" width="88" height="20" rx="4"
                    fill="rgba(10,8,2,0.92)" stroke="rgba(255,195,64,0.58)" strokeWidth="0.8" />
                  <circle cx="724" cy="55" r="4" fill="#ffc340" filter="url(#glow-o)">
                    <animate attributeName="cy" values="55;53;55" dur="1.3s" repeatCount="indefinite" />
                  </circle>
                  <text x="733" y="55" fontFamily="'Space Mono',monospace" fontSize="9"
                    fill="#ffc340" dominantBaseline="middle">SYNGAS ↑</text>
                </g>
                {/* 4 BIO-OIL — Shifted to the specific condenser void pinned by the user */}
                <g opacity="0.92">
                  <rect x="1055" y="340" width="90" height="20" rx="4"
                    fill="rgba(2,10,12,0.92)" stroke="rgba(0,210,180,0.55)" strokeWidth="0.8" />
                  <circle cx="1069" cy="350" r="4" fill="#00d4b4" filter="url(#glow-b)">
                    <animate attributeName="cy" values="350;352;350" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <text x="1079" y="350" fontFamily="'Space Mono',monospace" fontSize="9"
                    fill="#00d4b4" dominantBaseline="middle">BIO-OIL ↓</text>
                </g>
                {/* 5 BIOCHAR — Moved to higher-clearance area above screw */}
                <g opacity="0.92">
                  <rect x="1185" y="275" width="100" height="20" rx="4"
                    fill="rgba(5,14,8,0.92)" stroke="rgba(141,220,110,0.45)" strokeWidth="0.8" />
                  <rect x="1198" y="281" width="8" height="8" rx="1.5" fill="#4fc26a" opacity="0.9" />
                  <text x="1211" y="285" fontFamily="'Space Mono',monospace" fontSize="9"
                    fill="#8ddc6e" dominantBaseline="middle">BIOCHAR →</text>
                </g>
                {/* 6 STORED — Perfect alignment with bin area */}
                <g opacity="0.92">
                  <rect x="1465" y="535" width="116" height="20" rx="4"
                    fill="rgba(4,20,8,0.92)" stroke="rgba(141,220,110,0.65)" strokeWidth="0.9" />
                  <text x="1523" y="545" fontFamily="'Space Mono',monospace" fontSize="9"
                    fill="var(--bright)" dominantBaseline="middle" textAnchor="middle">✓ CARBON STORED</text>
                </g>

                {/* ─── STREAM 1: Biomass feed (green ellipses, 4-train) ─── */}
                {[0, 0.6, 1.2, 1.8].map((delay, i) => (
                  <ellipse key={`bf${i}`} rx="5" ry="3.5" fill="#8ddc6e"
                    opacity={0.88 - i * 0.08} filter="url(#glow-g)">
                    <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${delay}s`}
                      path="M 170 346 H 448" />
                  </ellipse>
                ))}

                {/* ─── STREAM 2: Pyrolysis wave through reactor (orange glow orbs) ─── */}
                {/* Sinusoidal S-curve: material tumbles inside the 650°C rotating drum */}
                {[0, 1.3, 2.6].map((delay, i) => (
                  <g key={`py${i}`}>
                    <circle r="6.5" fill="#ff7c00" opacity="0.82" filter="url(#glow-o)">
                      <animateMotion dur="3.8s" repeatCount="indefinite" begin={`${delay}s`}
                        path="M 460 346 C 556 192 660 480 698 346 C 736 210 840 488 936 346" />
                    </circle>
                    <circle r="3" fill="#ffcf80" opacity="0.9">
                      <animateMotion dur="3.8s" repeatCount="indefinite" begin={`${delay}s`}
                        path="M 460 346 C 556 192 660 480 698 346 C 736 210 840 488 936 346" />
                    </circle>
                  </g>
                ))}

                {/* ─── STREAM 3: Syngas rising up exhaust pipe (gold, 3-train) ─── */}
                {[0, 0.55, 1.1].map((delay, i) => (
                  <g key={`sg${i}`}>
                    <circle r="4.5" fill="#ffc340" opacity="0.90" filter="url(#glow-o)">
                      <animateMotion dur="1.7s" repeatCount="indefinite" begin={`${delay}s`}
                        path="M 636 136 L 636 3" />
                    </circle>
                    <circle r="2" fill="#ffe080" opacity="0.55">
                      <animateMotion dur="1.7s" repeatCount="indefinite" begin={`${delay + 0.14}s`}
                        path="M 636 136 L 636 3" />
                    </circle>
                  </g>
                ))}

                {/* ─── STREAM 4: Gas bridge — syngas travels to condenser (gold) ─── */}
                {[0, 1.3].map((delay, i) => (
                  <circle key={`gb${i}`} r="4.5" fill="#ffc340"
                    opacity={0.82 - i * 0.18} filter="url(#glow-o)">
                    <animateMotion dur="2.6s" repeatCount="indefinite" begin={`${delay}s`}
                      path="M 638 3 H 1028 V 28" />
                  </circle>
                ))}

                {/* ─── STREAM 5: Bio-oil condensing down column (cyan teardrop) ─── */}
                {[0, 1.7].map((delay, i) => (
                  <g key={`bo${i}`}>
                    <ellipse rx="4" ry="5.5" fill="#00d4b4" opacity="0.85" filter="url(#glow-b)">
                      <animateMotion dur="3.3s" repeatCount="indefinite" begin={`${delay}s`}
                        path="M 1035 28 V 440" />
                    </ellipse>
                    <ellipse rx="2" ry="2.5" fill="#80f0e0" opacity="0.6">
                      <animateMotion dur="3.3s" repeatCount="indefinite" begin={`${delay + 0.2}s`}
                        path="M 1035 28 V 440" />
                    </ellipse>
                  </g>
                ))}

                {/* ─── STREAM 6: Biochar through screw conveyor → drop → chute → bin ─── */}
                {/* Continuous path: screw (1109→1352) → fall (y303→450) → chute (1344,450→1566,572) */}
                {[0, 2.2, 4.4].map((delay, i) => (
                  <g key={`bc${i}`}>
                    <rect x="-6" y="-4" width="12" height="8" rx="2"
                      fill="#3a8a50" opacity="0.90" filter="url(#glow-g)">
                      <animateMotion dur="5.5s" repeatCount="indefinite" begin={`${delay}s`}
                        path="M 1109 303 H 1352 V 450 L 1566 572" />
                    </rect>
                    <circle r="2" fill="#1a4a28" opacity="0.8">
                      <animateMotion dur="5.5s" repeatCount="indefinite" begin={`${delay}s`}
                        path="M 1109 303 H 1352 V 450 L 1566 572" />
                    </circle>
                  </g>
                ))}

                {/* ─── MATERIAL LEGEND BAR ─── */}
                <g>
                  {/* Center is 860. Width 860 -> x = 860 - 430 = 430 */}
                  <rect x="430" y="655" width="860" height="28" rx="14"
                    fill="rgba(5,14,8,0.95)" stroke="rgba(141,220,110,0.25)" strokeWidth="1" />
                  {[
                    { cx: 480, col: '#8ddc6e', label: 'BIOMASS', filter: 'url(#glow-g)' },
                    { cx: 645, col: '#ff8c00', label: '650°C HEAT', filter: 'url(#glow-o)' },
                    { cx: 830, col: '#ffc340', label: 'SYNGAS', filter: 'url(#glow-o)' },
                    { cx: 1005, col: '#00d4b4', label: 'BIO-OIL', filter: 'url(#glow-b)' },
                    { cx: 1175, col: '#4fc26a', label: 'BIOCHAR', filter: 'url(#glow-g)' },
                  ].map(({ cx, col, label, filter: f }) => (
                    <g key={label}>
                      <circle cx={cx} cy={669} r="5" fill={col} filter={f} />
                      <text x={cx + 14} y="669" fontFamily="'Space Mono',monospace"
                        fontSize="10" fill="rgba(255,255,255,0.9)" dominantBaseline="middle" letterSpacing="0.05em">
                        {label}
                      </text>
                    </g>
                  ))}
                  {/* dividers: perfectly spaced between items */}
                  {[562, 737, 917, 1090].map(x => (
                    <line key={x} x1={x} y1="662" x2={x} y2="676" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  ))}
                </g>

              </g>
            )}

            {/* ════ ACTIVE PHASE POINTER ════ */}
            {!showFlow && ptrs.map((pos, i) => (
              <g key={i} style={{ opacity: activeCard === i ? 1 : 0, transition: 'opacity 0.5s' }}>
                <circle cx={pos.x} cy={pos.y} r="5" className="ptr-dot" />
                <circle cx={pos.x} cy={pos.y} r="13" className="ptr-ring" />
                <line x1={pos.x} y1={pos.y + 18} x2={pos.x} y2="685" className="ptr-line" />
              </g>
            ))}
          </svg>
        </div>

        {/* ── PHASE CARDS ── */}
        <div className="phase-cards-row">
          {PHASES.map((ph, i) => (
            <div key={i}
              className={`phase-card ${revealedCards[i] ? 'revealed' : ''} ${activeCard === i && !showFlow ? 'current' : ''} ${showFlow ? 'done' : ''}`}
              style={{ '--card-color': ph.color }}>
              <div className="pc-top">
                <span className="pc-num">{ph.id}</span>
                <span className="pc-lbl">{ph.label}</span>
              </div>
              <div className="pc-short">{ph.short}</div>
              <p className="pc-desc">{ph.desc}</p>
              <div className="pc-bar"><div className="pc-fill" style={{ width: revealedCards[i] ? '100%' : '0%' }} /></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

const Hero = () => {
  const [particles] = useState(() => Array.from({ length: 35 }));

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Handle bar fills
          entry.target.querySelectorAll('.bar-fill').forEach(bar => {
            if (bar.dataset.width) {
              setTimeout(() => {
                bar.style.width = bar.dataset.width;
              }, 200);
            }
          });
        }
      });
    }, { threshold: 0.15 });

    const targets = document.querySelectorAll('.reveal');
    targets.forEach(t => observer.observe(t));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="hero">
      <div className="particles-container">
        {particles.map((_, i) => (
          <div key={i} className="particle" style={{
            '--x': `${Math.random() * 100}%`,
            '--dur': `${3 + Math.random() * 4}s`,
            '--delay': `${Math.random() * 5}s`,
            '--drift': `${Math.random() * 60 - 30}px`,
            '--drift2': `${Math.random() * 60 - 30}px`,
            background: Math.random() > 0.6 ? '#8ddc6e' : (Math.random() > 0.85 ? '#b8d96a' : undefined)
          }} />
        ))}
      </div>
      <div className="hero-inner reveal">
        <span className="hero-meta">PLANET SOLUTIONS PVT. LTD. · BHUBANESWAR, ODISHA</span>
        <h1 className="hero-title">BIOCHAR</h1>
        <p className="hero-subtitle italic">Ancient soil technology. Modern carbon markets.</p>
        <div className="hero-stat-row">
          <div className="hero-stat">
            <span className="num">~2.5T</span>
            <span className="desc">CO₂e FIXED PER TONNE</span>
          </div>
          <div className="hero-stat">
            <span className="num">1000+</span>
            <span className="desc">YEARS STABLE IN SOIL</span>
          </div>
          <div className="hero-stat">
            <span className="num">30%</span>
            <span className="desc">CROP YIELD UPLIFT</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const TransformationFlow = () => {
  return (
    <section className="flow-section" id="process">
      <span className="section-label reveal">The transformation</span>
      <h2 className="section-title reveal">WASTE → CHAR → CREDIT</h2>

      <div className="process-flow">
        {/* 01 WASTE */}
        <div className="process-step step-waste reveal">
          <div className="step-spine">
            <div className="step-icon-wrap">🌾</div>
            <div className="step-connector"></div>
          </div>
          <div className="step-body">
            <div className="step-number">01 / FEEDSTOCK</div>
            <h3 className="step-title">Agricultural Waste</h3>
            <p className="step-desc">
              Crop residue — rice husk, paddy straw, sugarcane bagasse, coconut shells — is collected from fields and mills. This biomass contains carbon absorbed from the atmosphere during the plant's growth cycle. Normally it would decompose or burn openly, releasing all that carbon back as CO₂ within months.
            </p>
            <div className="mini-flow">
              <div className="mini-node" style={{borderColor:'#5a7a40',color:'#a8c870'}}>Rice Husk</div>
              <span className="mini-arrow">→</span>
              <div className="mini-node" style={{borderColor:'#5a7a40',color:'#a8c870'}}>Paddy Straw</div>
              <span className="mini-arrow">→</span>
              <div className="mini-node" style={{borderColor:'#5a7a40',color:'#a8c870'}}>Coconut Shell</div>
              <span className="mini-arrow">→</span>
              <div className="mini-node" style={{borderColor:'#5a7a40',color:'#a8c870'}}>Wood Chips</div>
            </div>
            <div className="tag-row">
              <span className="tag">Zero-cost feedstock</span>
              <span className="tag">Farmer partnership</span>
              <span className="tag">Carbon-loaded biomass</span>
            </div>
          </div>
        </div>

        {/* 02 PYROLYSIS */}
        <div className="process-step step-pyrolysis reveal">
          <div className="step-spine">
            <div className="step-icon-wrap">🔥</div>
            <div className="step-connector"></div>
          </div>
          <div className="step-body">
            <div className="step-number">02 / CONVERSION</div>
            <h3 className="step-title">Pyrolysis</h3>
            <p className="step-desc">
              The biomass enters a sealed kiln or retort reactor and is heated to 400–700°C in near-absence of oxygen. Without oxygen it cannot combust — instead it undergoes thermochemical decomposition, breaking apart into three co-products simultaneously.
            </p>
            <div className="chem-block">
              <div className="chem-label">Pyrolysis reaction</div>
              <div className="chem-equation">
                Biomass (C·H·O) <span className="arrow">──<sup className="heat">400–700°C, –O₂</sup>──→</span><br/>
                <span style={{color:'#b0d8a0'}}>Biochar (stable C)</span> + <span style={{color:'#8ddc6e'}}>Syngas (CO + H₂)</span> + <span style={{color:'#a8c870'}}>Bio-oil (tar)</span>
              </div>
            </div>
            <div style={{margin:'16px 0'}}>
              <div className="temp-gauge">
                <span className="temp-meta">Temp range</span>
                <div className="temp-bar-wrap"><div className="temp-bar" style={{'--target-width':'75%'}}></div></div>
                <span className="temp-label">700°C</span>
              </div>
            </div>
            <div className="tag-row">
              <span className="tag">No open burning</span>
              <span className="tag">Syngas → energy</span>
              <span className="tag">40–50% carbon yield</span>
            </div>
          </div>
        </div>

        {/* 03 BIOCHAR */}
        <div className="process-step step-char reveal">
          <div className="step-spine">
            <div className="step-icon-wrap">⬛</div>
            <div className="step-connector"></div>
          </div>
          <div className="step-body">
            <div className="step-number">03 / THE PRODUCT</div>
            <h3 className="step-title">Biochar</h3>
            <p className="step-desc">
              What remains is biochar — a highly porous, recalcitrant carbon material. The original plant microstructure is preserved, creating vast internal surface area (up to 400 m²/g). Carbon is now locked in aromatic ring structures that resist microbial decomposition for centuries to millennia.
            </p>
            <div className="chem-block" style={{borderLeftColor:'#6a9c5e'}}>
              <div className="chem-label" style={{color:'#6a9c5e'}}>Carbon structure after pyrolysis</div>
              <div className="chem-equation" style={{fontSize:'0.8rem'}}>
                <span style={{color:'#a0c890'}}>Labile cellulose/lignin</span> <span className="arrow">→</span> <span style={{color:'var(--cream)'}}>Polycyclic aromatic carbon</span><br/>
                <span style={{color:'var(--mist)', opacity: 0.6}}>Half-life: weeks–months</span> <span className="arrow">→</span> <span style={{color:'var(--mist)'}}>Half-life: 100–10,000 years</span>
              </div>
            </div>
            <div className="tag-row">
              <span className="tag">Stable aromatic C</span>
              <span className="tag">~80% carbon content</span>
              <span className="tag">400m² surface/g</span>
              <span className="tag">pH 7–10 liming effect</span>
            </div>
          </div>
        </div>

        {/* 04 SOIL */}
        <div className="process-step step-soil reveal">
          <div className="step-spine">
            <div className="step-icon-wrap">🌱</div>
            <div className="step-connector"></div>
          </div>
          <div className="step-body">
            <div className="step-number">04 / DEPLOYMENT</div>
            <h3 className="step-title">Soil Application</h3>
            <p className="step-desc">
              Biochar is blended with compost or fertiliser and applied to agricultural soil at 2–10 tonnes/hectare. Its honeycomb pore structure retains water and nutrients, hosting beneficial microbes. For Odisha's rain-fed farmers this means reduced drought stress, lower fertiliser runoff, and measurable yield improvements.
            </p>
            <div className="mini-flow">
              <div className="mini-node" style={{borderColor:'#8ddc6e',color:'#8ddc6e'}}>Water retention ↑</div>
              <span className="mini-arrow">+</span>
              <div className="mini-node" style={{borderColor:'#8ddc6e',color:'#8ddc6e'}}>Nutrient CEC ↑</div>
              <span className="mini-arrow">+</span>
              <div className="mini-node" style={{borderColor:'#8ddc6e',color:'#8ddc6e'}}>Microbial habitat</div>
            </div>
            <div className="tag-row">
              <span className="tag">Farmer co-benefit</span>
              <span className="tag">Yield uplift 10–30%</span>
              <span className="tag">Reduced fertiliser use</span>
            </div>
          </div>
        </div>

        {/* 05 CREDITS */}
        <div className="process-step step-credit reveal">
          <div className="step-spine">
            <div className="step-icon-wrap">📜</div>
          </div>
          <div className="step-body">
            <div className="step-number">05 / MONETISATION</div>
            <h3 className="step-title">Carbon Credits</h3>
            <p className="step-desc">
              Each tonne of CO₂-equivalent durably stored as biochar is verified and tokenised as a carbon credit. MRV protocols quantify removal via sampling, lab analysis, and modelling. Credits list on Puro.earth or Verra and sell to corporate buyers seeking high-permanence, co-benefit-rich offsets.
            </p>
            <div className="tag-row">
              <span className="tag">Puro.earth eligible</span>
              <span className="tag">Verra VCS / AMS-III</span>
              <span className="tag">India CCTS pipeline</span>
              <span className="tag">$80–200/tCO₂e</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PermanenceComparison = () => {
  return (
    <section className="permanence-section" id="permanence">
      <div className="permanence-inner">
        <span className="section-label reveal">Why biochar wins on permanence</span>
        <h2 className="permanence-title reveal">CARBON DURABILITY COMPARISON</h2>
        <div className="compare-grid">
          <div className="compare-card reveal">
            <div className="method" style={{color:'#7aaa50'}}>Avoided Deforestation</div>
            <div className="years" style={{color:'#7aaa50'}}>20–30</div>
            <div className="unit">years (estimated)</div>
            <p className="note">Reversible. Fire, policy change, or land use shift can release stored carbon rapidly.</p>
            <div className="bar-fill" style={{'--bar-color':'#7aaa50'}} data-width="15%"></div>
          </div>
          <div className="compare-card reveal">
            <div className="method" style={{color:'#4fc26a'}}>Soil Organic Carbon</div>
            <div className="years" style={{color:'#4fc26a'}}>5–50</div>
            <div className="unit">years (estimated)</div>
            <p className="note">Vulnerable to tillage and degradation. Permanence dependent on ongoing land management.</p>
            <div className="bar-fill" style={{'--bar-color':'#4fc26a'}} data-width="25%"></div>
          </div>
          <div className="compare-card reveal">
            <div className="method" style={{color:'var(--gold)'}}>Biochar</div>
            <div className="years" style={{color:'var(--gold)'}}>100–1,000+</div>
            <div className="unit">years (verified)</div>
            <p className="note">Polycyclic aromatic carbon resists decomposition. Physically stable once soil-applied.</p>
            <div className="bar-fill" style={{'--bar-color':'var(--gold)'}} data-width="80%"></div>
          </div>
          <div className="compare-card reveal">
            <div className="method" style={{color:'var(--mist)'}}>Direct Air Capture</div>
            <div className="years" style={{color:'var(--cream)'}}>1,000+</div>
            <div className="unit">years (geological)</div>
            <p className="note">Mineralized storage in basalt or saline aquifers. Comparable permanence but 10–40× higher cost.</p>
            <div className="bar-fill" style={{'--bar-color':'var(--mist)'}} data-width="100%"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CreditAnatomy = () => {
  return (
    <section className="credit-section" id="credits">
      <span className="section-label reveal">What gets sold</span>
      <h2 className="section-title reveal">ANATOMY OF A BIOCHAR CREDIT</h2>
      <div className="credit-card reveal">
        <div className="credit-grid">
          <div className="credit-field">
            <label>Issuer / Registry</label>
            <span className="value">Puro.earth · Verra VCS · India CCTS</span>
          </div>
          <div className="credit-field">
            <label>Credit Unit</label>
            <span className="value">1 tonne CO₂e removed and durably stored</span>
          </div>
          <div className="credit-field">
            <label>Permanence Tier</label>
            <span className="value">Class III — 100+ year durable removal</span>
          </div>
          <div className="credit-field">
            <label>Feedstock Origin</label>
            <span className="value">Agricultural residue — traceable farm-level sourcing</span>
          </div>
          <div className="credit-field">
            <label>MRV Method</label>
            <span className="value">Pyrolysis mass balance + soil sampling + EBC analysis</span>
          </div>
          <div className="credit-field">
            <label>Co-Benefits</label>
            <span className="value">SDG 2, 13, 15 · Farmer income uplift · Soil fertility</span>
          </div>
          <div className="credit-field">
            <label>Market Price</label>
            <span className="value">$80–200 per tCO₂e (voluntary) · ₹1,500–3,000 (CCTS)</span>
          </div>
          <div className="credit-field">
            <label>Vintage</label>
            <span className="value">Year of pyrolysis + application + verification</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <PyrolysisStory />
      <TransformationFlow />
      <PermanenceComparison />
      <CreditAnatomy />
      <footer className="footer">
        <div className="footer-content">
          <img src="/images/GreenASHA-Logo.png" alt="GreenASHA" className="footer-logo-img" />
          <p className="footer-sub">Pioneering Sustainable Horizons — © 2026 GREENASHA SOLUTIONS</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
