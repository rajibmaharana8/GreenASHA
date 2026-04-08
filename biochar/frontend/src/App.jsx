import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

import {
  Leaf, Brain, BarChart2, LayoutDashboard,
  Factory, Wheat, Building2, Hammer, GraduationCap,
  TrendingUp, Globe, Zap,
  LineChart, Lightbulb, AlertTriangle, Award,
  ShieldCheck, CheckCircle2, ArrowRight, ArrowUpRight, Check,
  Home, Grid, Trash,
  PackageCheck, Clock, BookOpen, Network,
  Truck, Settings, Flame, Search, Coins
} from 'lucide-react';

/* ─── NAVBAR ─── */
function Navbar({ onDemoClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [direction, setDirection] = useState('up');
  const [isNavigating, setIsNavigating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigationTimeoutRef = useRef(null);

  useEffect(() => {
    let prevScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      const isMobile = window.innerWidth <= 1024;

      if (isNavigating || mobileMenuOpen || isMobile) {
        setDirection('up');
      } else {
        if (currentScrollY > 150) {
          setDirection(currentScrollY > prevScrollY ? 'down' : 'up');
        } else {
          setDirection('up');
        }
      }
      prevScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
  }, [isNavigating, mobileMenuOpen]);

  const handleNavClick = useCallback(() => {
    setIsNavigating(true);
    setDirection('up');
    setMobileMenuOpen(false); 
    
    if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    navigationTimeoutRef.current = setTimeout(() => setIsNavigating(false), 1500); 
  }, [isNavigating]);

  const handleDemoClick = (e) => {
    setMobileMenuOpen(false);
    if (onDemoClick) onDemoClick(e);
  };

  return (
    <nav className={`navbar ${scrolled ? 'is-scrolled' : ''} direction-${direction} ${mobileMenuOpen ? 'menu-open' : ''}`}>
      <div className="nav-inner">
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <img src="/images/GreenASHA-Logo.png" alt="GreenASHA Logo" className="brand-img" />
          <span className="tagline">AI Carbon Infrastructure</span>
        </a>
        
        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="nav-menu">
            <a href="#modules" onClick={handleNavClick} style={{"--i": 1}}>
              <span>PRODUCTS</span>
              <ArrowRight size={20} className="chevron mobile-only" />
            </a>
            <a href="#solutions" onClick={handleNavClick} style={{"--i": 2}}>
              <span>SOLUTIONS</span>
              <ArrowRight size={20} className="chevron mobile-only" />
            </a>
            <a href="#science" onClick={handleNavClick} style={{"--i": 3}}>
              <span>HOW IT WORKS</span>
              <ArrowRight size={20} className="chevron mobile-only" />
            </a>
            <a href="#technology" onClick={handleNavClick} style={{"--i": 4}}>
              <span>TECHNOLOGY</span>
              <ArrowRight size={20} className="chevron mobile-only" />
            </a>
            <a href="#roi" onClick={handleNavClick} style={{"--i": 5}}>
              <span>ROI CALCULATOR</span>
              <ArrowRight size={20} className="chevron mobile-only" />
            </a>
          </div>
          
          <div className="mobile-menu-footer mobile-only">
            <button className="btn btn-green full-btn" onClick={handleDemoClick}>Get a Demo</button>
          </div>

          <button className="btn btn-dark nav-cta desktop-only" onClick={handleDemoClick}>Get a Demo</button>
        </div>

        <button 
          className={`hamburger ${mobileMenuOpen ? 'is-active' : ''}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <span className="line"></span>
          <span className="line"></span>
          <span className="line"></span>
        </button>
      </div>
    </nav>
  );
}

/* ─── 1. HERO ─── */
function Hero({ onDemoClick }) {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <h1 className="hero-title">
            Build Carbon-Negative Infrastructure with <span className="accent">AI</span>
          </h1>
          <p className="hero-sub">
            The integrated platform for AI intelligence, biochar production, and high-integrity carbon credits — turning waste into verified carbon assets at scale.
          </p>
          <ul className="hero-bullets">
            {[
              "Carbon Removal + Revenue",
              "AI Optimization",
              "Real-time Monitoring"
            ].map((b, i) => (
              <li key={i}>
                <span className="check"><CheckCircle2 size={14} /></span>
                {b}
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <button onClick={onDemoClick} className="btn btn-dark">Get a Demo</button>
            <a href="#roi" className="btn btn-ghost">Calculate ROI</a>
          </div>
        </div>
        <div className="hero-img-wrap">
          <img src="/images/hero.png" alt="GreenASHA Carbon Infrastructure" />
          <div className="hero-stat-bubble">
            <span className="stat-num">850t</span>
            <span className="stat-label">CO₂ removed per project annually</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TRUSTED BY ─── */
function TrustedBy() {
  return (
    <div className="trusted-bar">
      <div className="container trusted-inner">
        <span className="trusted-label">Standards Compatible:</span>
        <div className="trusted-badges">
          {["Verra VCS", "Puro.earth", "Gold Standard", "ISO 14064"].map((b, i) => (
            <span key={i} className="std-badge">{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 2. PROBLEM ─── */
function Problem() {
  const problems = [
    { title: "Agricultural Waste Burning", body: "Uncontrolled burning releases methane and CO₂ with zero economic return — a systemic failure in agricultural value chains." },
    { title: "Lack of Carbon Monetization", body: "Most organizations have no pathway to convert sustainability actions into verified, tradeable carbon assets." },
    { title: "Inefficient Systems", body: "Traditional biomass processing lacks real-time optimization, causing yield losses and unreliable output quality." },
    { title: "No Intelligence Layer", body: "Sustainability infrastructure operates without AI, making it impossible to predict, optimize, or verify carbon outcomes." },
  ];
  return (
    <section className="section-problem">
      <div className="container">
        <div className="problem-intro">
          <span className="section-label">The Challenge</span>
          <h2>Carbon removal at scale requires more than goodwill.</h2>
          <p>Existing approaches fail because they lack the infrastructure intelligence to create verifiable, economic outcomes.</p>
        </div>
        <div className="problems-grid">
          {problems.map((p, i) => (
            <div key={i} className="problem-cell">
              <span className="problem-num">0{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 3. SOLUTION OVERVIEW ─── */
function Solution() {
  return (
    <section className="section-solution" id="solutions">
      <div className="solution-inner">
        {/* Left: Text */}
        <div className="solution-body">
          <h2>An integrated vertical for AI-powered carbon removal.</h2>
          <p>GreenASHA is not a hardware product. It is a full-stack carbon infrastructure platform that embeds AI intelligence across every stage of the biochar production and carbon credentialing process.</p>
          <ul className="hero-bullets solution-bullets" style={{ marginBottom: '40px' }}>
            {[
              "Biochar production & carbonization",
              "AI process optimization engine",
              "Digital Carbon MRV system",
              "Real-time impact dashboard"
            ].map((c, i) => (
              <li key={i}><div className="check"><Check size={14} strokeWidth={3} /></div>{c}</li>
            ))}
          </ul>
          <div className="solution-tagline">"From Waste to Verified Carbon Assets"</div>
        </div>
        {/* Right: Image */}
        <div className="solution-img-col">
          <div className="solution-img-mask">
            <img src="/images/biochar.png" alt="Biochar science — porous carbon structure" />
          </div>

          {/* Overlapping Glassmorphic Stats Card */}
          <div className="solution-stats-card">
            <div className="sol-stat">
              <span className="sol-stat-num">500+<span>yr</span></span>
              <span className="sol-stat-label">Carbon permanence</span>
            </div>
            <div className="sol-stat">
              <span className="sol-stat-num">30–60</span>
              <span className="sol-stat-label">Day deployment</span>
            </div>
            <div className="sol-stat">
              <span className="sol-stat-num">2.4<span>×</span></span>
              <span className="sol-stat-label">Average ROI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Modules() {
  const [activeSlide, setActiveSlide] = useState(0);
  const mods = [
    { Icon: Leaf, title: "Biochar Unit", sub: "Modular Hardware", body: "Scalable, high-efficiency pyrolysis reactors designed for consistent, high-purity biochar output across any feedstock type." },
    { Icon: Brain, title: "AI Engine", sub: "Prediction + Automation", body: "Continuous learning models that optimize reactor conditions in real time — maximizing yield and minimizing energy input." },
    { Icon: BarChart2, title: "Carbon MRV", sub: "Tracking + Compliance", body: "Digital monitoring, reporting and verification with full audit trails. Compliant with Verra VCS and Puro.earth frameworks." },
    { Icon: LayoutDashboard, title: "Intelligence Dashboard", sub: "Monitoring + Analytics", body: "Unified command center for financial and climate performance. Track carbon credits, production yield, and ROI live." },
  ];

  const handleScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const scrollWidth = e.target.scrollWidth;
    const clientWidth = e.target.clientWidth;
    
    // Percentage-based calculation is more robust for centered sliders
    const scrollPossible = scrollWidth - clientWidth;
    if (scrollPossible <= 0) return;
    
    const percentage = scrollLeft / scrollPossible;
    const newIndex = Math.round(percentage * (mods.length - 1));
    
    if (newIndex !== activeSlide && newIndex >= 0 && newIndex < mods.length) {
      setActiveSlide(newIndex);
    }
  };

  return (
    <section className="section-modules" id="modules">
      <div className="container" style={{ position: 'relative' }}>
        <div className="modules-header">
          <span className="section-label">Product Architecture</span>
          <h2>Modular by design. Unified in intelligence.</h2>
          <p>Each component works independently or as an integrated stack — built for enterprise carbon operations.</p>
        </div>
        <div className="modules-grid slider-container" onScroll={handleScroll}>
          {mods.map(({ Icon, title, sub, body }, i) => (
            <div key={i} className="module-card">
              <div className="module-icon"><Icon size={22} color="#00A843" /></div>
              <span className="eyebrow">{sub}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
        
        {/* Mobile Indicator Dots */}
        <div className="slider-dots phone-only">
          {mods.map((_, i) => (
            <div key={i} className={`dot ${i === activeSlide ? 'active' : ''}`}></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 5. HOW IT WORKS ─── */
function HowItWorks() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const steps = gsap.utils.toArray('.process-step');

    // Set initial states
    gsap.set('.process-progress-bar-fill', { scaleX: 0, transformOrigin: 'left' });
    steps.forEach(step => {
      gsap.set(step, { opacity: 0.15, y: 24 });
    });

    // Fire ONCE when section enters view — never reverses
    ScrollTrigger.create({
      trigger: '.process-flow',
      start: 'top 72%',
      once: true,
      onEnter: () => {
        // Animate the connecting line
        gsap.to('.process-progress-bar-fill', {
          scaleX: 1,
          duration: 2.2,
          ease: 'power3.out',
        });

        // Activate each step with a stagger
        steps.forEach((step, i) => {
          const dot = step.querySelector('.step-dot');
          const num = step.querySelector('.step-number');

          gsap.to(step, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            delay: i * 0.3,
            ease: 'back.out(1.4)',
          });

          gsap.to(dot, {
            backgroundColor: '#2E7D32',
            borderColor: '#2E7D32',
            color: '#ffffff',
            scale: 1.1,
            duration: 0.45,
            delay: i * 0.3 + 0.12,
            ease: 'back.out(1.7)',
            onComplete: () => {
              step.classList.add('active');
            },
          });

          gsap.to(num, {
            backgroundColor: '#1B3022',
            color: '#ffffff',
            duration: 0.3,
            delay: i * 0.3 + 0.15,
          });
        });
      },
    });
  }, { scope: sectionRef });

  const steps = [
    { 
      label: "Feedstock Sourcing", 
      desc: "Collection of agricultural waste, wood chips, or industrial biomass with <20% moisture content.",
      details: ["Moisture Sensing", "Contaminant Screening", "Volume Logging"],
      Icon: Truck 
    },
    { 
      label: "Pre-Processing", 
      desc: "Automated shredding and drying to ensure uniform particle size and optimal pyrolysis conditions.",
      details: ["Hammer Milling", "Flash Drying", "Magnetic Separation"],
      Icon: Settings 
    },
    { 
      label: "Continuous Pyrolysis", 
      desc: "Thermal decomposition in an oxygen-free environment at 450°C - 600°C using our screw reactor.",
      details: ["Oxygen Control", "Temp Stabilization", "Syngas Recovery"],
      Icon: Flame 
    },
    { 
      label: "Biochar Quenching", 
      desc: "Rapid cooling and stabilization of the biochar to prevent oxidation and lock in carbon.",
      details: ["Water Quenching", "Nutrient Loading", "Dust Suppression"],
      Icon: Leaf 
    },
    { 
      label: "AI Quality Analysis", 
      desc: "Real-time scanning of carbon content, surface area, and pore structure using edge AI.",
      details: ["Spectroscopy", "Purity Testing", "Yield Prediction"],
      Icon: Search 
    },
    { 
      label: "Credit Issuance", 
      desc: "Automated MRV data submission to global carbon registries for immediate credit generation.",
      details: ["Verra/Puro Sync", "Blockchain Ledger", "Revenue Payout"],
      Icon: Coins 
    },
  ];

  return (
    <section className="section-process" id="science" ref={sectionRef}>
      <div className="container">
        <div className="process-header">
          <span className="section-label">The GreenASHA Circular Process</span>
          <h2>Build Carbon-Negative Infrastructure with AI</h2>
          <p>Our end-to-end automated system transforms raw waste into high-value carbon assets with surgical precision.</p>
        </div>
        <div className="process-flow">
          <div className="process-progress-background"></div>
          <div className="process-progress-bar-fill"></div>

          {steps.map((s, i) => (
            <div key={i} className={`process-step ${i % 2 === 0 ? 'step-left' : 'step-right'}`}>
              <div className="step-dot">
                <s.Icon size={22} strokeWidth={1.8} />
                <div className="step-number">{i + 1}</div>
              </div>
              <div className="step-text">
                <h4>{s.label}</h4>
                <ul className="step-details">
                  {s.details.map((detail, idx) => (
                    <li key={idx}>
                      <span className="bullet"></span> {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 6. USE CASES ─── */
function UseCases() {
  const cases = [
    { Icon: Factory, name: "Manufacturing" },
    { Icon: Wheat, name: "Agriculture" },
    { Icon: Building2, name: "Municipal Waste" },
    { Icon: Hammer, name: "Construction" },
    { Icon: GraduationCap, name: "Institutions" },
  ];
  return (
    <section className="section-usecases">
      <div className="container">
        <div className="usecases-header">
          <span className="section-label">Industries We Serve</span>
          <h2>Built for scale across every sector generating organic waste.</h2>
        </div>
        <div className="usecases-list">
          {cases.map(({ Icon, name }, i) => (
            <div key={i} className="usecase-item">
              <div className="usecase-icon"><Icon size={26} strokeWidth={1.5} /></div>
              <h4>{name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 7. VALUE PROPOSITION ─── */
function ValueProp() {
  const values = [
    { Icon: TrendingUp, title: "Revenue", body: "Dual income from biochar sales and verified carbon credits. Average payback in 16–22 months." },
    { Icon: Globe, title: "Impact", body: "Measurable CO₂ removal and soil health improvement — with certificates your stakeholders can trust." },
    { Icon: Zap, title: "Efficiency", body: "AI-driven automation reduces labor costs and increases throughput by up to 24% versus manual operations." },
  ];
  return (
    <section className="section-value">
      <div className="container">
        <span className="section-label">Why GreenASHA</span>
        <h2 style={{ maxWidth: 'none', marginBottom: 64, fontSize: 'clamp(2rem,3.5vw,3rem)' }}>Value in three dimensions.</h2>
        <div className="value-grid">
          {values.map(({ title, body }, i) => (
            <div key={i} className="value-card">
              <div className="value-num">0{i + 1}</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 8. AI TECHNOLOGY ─── */
function TechSection() {
  const feats = [
    { Icon: LineChart, title: "Predictive Yield Modeling", body: "Forecast biochar output based on feedstock moisture and particle size." },
    { Icon: Lightbulb, title: "Smart Feedstock Recommendation", body: "AI ranks available feedstocks by carbon potential and energy cost." },
    { Icon: AlertTriangle, title: "Anomaly Detection", body: "Instant alerts on process deviation preventing sub-standard biochar." },
    { Icon: Award, title: "Carbon Scoring System", body: "Granular carbon permanence score linked to credit eligibility." },
  ];

  const leftFeats = feats.slice(0, 2);
  const rightFeats = feats.slice(2, 4);

  return (
    <section className="section-tech" id="technology">
      <div className="container">
        <div className="tech-header">
          <span className="eyebrow">AI Intelligence</span>
          <h2>Intelligence that learns with every ton.</h2>
          <p>Our AI engine doesn't just monitor — it continuously improves carbon outcomes across operations.</p>
        </div>

        <div className="tech-orb-wrap">
          <div className="tech-left-side">
            {leftFeats.map((f, i) => (
              <div key={i} className={`tech-node node-left-${i + 1}`}>
                <div className="node-icon"><f.Icon size={20} /></div>
                <div className="node-text">
                  <h4>{f.title}</h4>
                  <p>{f.body}</p>
                </div>
                <div className="node-line"></div>
              </div>
            ))}
          </div>

          <div className="tech-center-orb">
            <div className="orb-glow"></div>
            <div className="orb-inner">
              <img src="/images/biochar_ai_core.png" alt="AI Core" />
            </div>
          </div>

          <div className="tech-right-side">
            {rightFeats.map((f, i) => (
              <div key={i} className={`tech-node node-right-${i + 1}`}>
                <div className="node-line"></div>
                <div className="node-icon"><f.Icon size={20} /></div>
                <div className="node-text">
                  <h4>{f.title}</h4>
                  <p>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 9. DEPLOYMENT ─── */
function Deployment() {
  const cards = [
    { Icon: PackageCheck, num: "01", title: "Modular Setup", body: "Pre-engineered units ship ready to install. No civil works required beyond a concrete pad." },
    { Icon: Clock, num: "02", title: "30–60 Day Deployment", body: "From site survey to first operational run in under two months — guaranteed." },
    { Icon: BookOpen, num: "03", title: "Training + SOPs", body: "Full operator training, digital SOPs, and a dedicated customer success engineer." },
    { Icon: Network, num: "04", title: "Multi-Location Scale", body: "Replicate your operation across sites with shared AI intelligence and centralized monitoring." },
  ];
  return (
    <section className="section-deploy">
      <div className="container">
        <div className="deploy-header">
          <span className="section-label">Deployment Model</span>
          <h2>Fast to deploy. Built to scale.</h2>
          <p>Our modular approach removes the friction of traditional infrastructure projects.</p>
        </div>
        <div className="deploy-grid">
          {cards.map(({ Icon, num, title, body }, i) => (
            <div key={i} className="deploy-card">
              <div className="deploy-icon"><Icon size={22} color="#00A843" strokeWidth={1.5} /></div>
              <div className="deploy-num">{num}</div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Compliance() {
  const items = [
    "Verra VCS Compatible",
    "Puro.earth Framework",
    "Pollution Compliance",
    "CPCB Certified",
    "Integrated Safety",
    "Real-time Monitoring"
  ];

  const stats = [
    { num: "100%", label: "Audit-ready documentation generated automatically" },
    { num: "±2%", label: "Carbon measurement accuracy vs. lab verification" },
    { num: "500yr", label: "Minimum carbon permanence of biochar" },
  ];

  return (
    <section className="section-compliance">
      <div className="container compliance-grid">
        <div className="compliance-content">
          <span className="section-label">Compliance & Trust</span>
          <h2>Built to the highest global carbon standards.</h2>
          <p>Every GreenASHA deployment is designed to meet the strictest international carbon credentialing and pollution control requirements.</p>
          
          <div className="compliance-items-grid">
            {items.map((label, i) => (
              <div key={i} className="compliance-badge">
                <CheckCircle2 size={16} className="badge-icon" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="compliance-stats-cards">
          {stats.map((s, i) => (
            <div key={i} className="comp-stat-card">
              <div className="stat-accent"></div>
              <span className="comp-stat-num">{s.num}</span>
              <span className="comp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudy() {
  const stats = [
    { num: "1,200t", label: "Biomass Fixed", sub: "Verified outcome" },
    { num: "850t", label: "Carbon Removed", sub: "Permanent storage" },
    { num: "2.4×", label: "Yield ROI", sub: "Farmer profit lift" },
    { num: "48d", label: "Credit Speed", sub: "Time to market" },
  ];

  return (
    <section className="section-case-seamless">
      <div className="container">
        <div className="seamless-header">
           <span className="eyebrow-top">Real-World Outcome</span>
           <h2>Proven Impact: The Assam Pilot</h2>
           <p>Validation of carbon-negative infrastructure in small-holder farming contexts. Transforming agricultural residue into industrial-grade assets.</p>
        </div>

        <div className="seamless-dashboard">
          <div className="seamless-visual-pane">
             <div className="vignette-mask">
                <img src="/images/assam_pilot.png" alt="Assam Pilot" />
             </div>
          </div>

          <div className="seamless-stats-pane">
             {stats.map((s, i) => (
               <div key={i} className="seamless-stat-box">
                  <span className="box-num">{s.num}</span>
                  <span className="box-label">{s.label}</span>
                  <span className="box-sub">{s.sub}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── ROI CALCULATOR ─── */
function ROICalculator({ onDemoClick }) {
  const [feedstock, setFeedstock] = useState(25);
  const [type, setType] = useState('biomass');
  
  const types = [
    { id: 'biomass', label: 'AGRICULTURAL', icon: <Wheat size={18} /> },
    { id: 'wood', label: 'FORESTRY', icon: <Factory size={18} /> },
    { id: 'municipal', label: 'MUNICIPAL', icon: <Trash size={18} /> },
  ];

  const multiplier = type === 'wood' ? 1.08 : type === 'municipal' ? 0.82 : 1;
  const biochar = feedstock * 0.32 * multiplier;
  const revenue = Math.round((biochar * 180 + (biochar * 2.8 * 65)) * 365); // $180/t biochar + $65/t CORC
  const co2 = Math.round(biochar * 2.8 * 365);

  return (
    <section className="section-roi-premium" id="roi">
      <div className="container">
        <div className="roi-dashboard-new">
          {/* Left: Input Console */}
          <div className="roi-console">
            <span className="eyebrow-tech">ECONOMIC ENGINE</span>
            <h2 className="title-sm">Revenue Realization</h2>
            <p>Model your annual financial and environmental performance across verified carbon markets.</p>

            <div className="input-block">
              <label className="label-tech">1. FEEDSTOCK SOURCE</label>
              <div className="type-tiles-modern">
                {types.map(t => (
                  <button 
                    key={t.id} 
                    className={`type-tile-new ${type === t.id ? 'active' : ''}`}
                    onClick={() => setType(t.id)}
                  >
                    <div className="tile-icon-new">{t.icon}</div>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="input-block">
              <div className="slider-header-new">
                <label className="label-tech">2. DAILY THROUGHPUT</label>
                <span className="val-big">{feedstock}t/day</span>
              </div>
              <input 
                type="range" 
                min="10" max="500" step="10" 
                value={feedstock} 
                onChange={e => setFeedstock(+e.target.value)} 
                className="pro-slider"
              />
            </div>
            
            <button className="btn btn-green full-btn" style={{ marginTop: '20px' }} onClick={onDemoClick}>Download Investment Thesis</button>
          </div>

          {/* Right: Results Dash */}
          <div className="roi-monitor">
             <div className="monitor-card primary">
                <span className="monitor-label">EST. ANNUAL REVENUE (USD)</span>
                <div className="monitor-main">${revenue.toLocaleString()}</div>
                <div className="monitor-footer">Combined Biochar + CORC Revenue</div>
             </div>

             <div className="monitor-grid">
                <div className="monitor-card secondary">
                   <span className="monitor-label">CO₂ SEQUESTERED</span>
                   <div className="monitor-sub">{co2.toLocaleString()} t</div>
                </div>
                <div className="monitor-card secondary">
                   <span className="monitor-label">EST. PAYBACK</span>
                   <div className="monitor-sub">1.6 Yrs</div>
                </div>
             </div>

             <div className="monitor-quote">
                <Zap size={14} color="#00A843" />
                <span>Equivalent to the footprint of <strong>{(co2/4.6).toFixed(0).toLocaleString()}</strong> homes.</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 12. FINAL CTA ─── */
function ContactUs({ onDemoClick }) {
  return (
    <section className="section-contact-full" id="contact">
      <div className="container">
        <div className="contact-grid-wrap">
          <div className="contact-info-side">
            <span className="eyebrow-tech">Get in Touch</span>
            <h2>Start Your Carbon Journey</h2>
            <p>Ready to deploy high-integrity infrastructure? Connect with our technical team for a custom feasibility study.</p>
            
            <div className="contact-cards-stack">
              <div className="contact-info-card">
                 <div className="info-icon"><Globe size={20} /></div>
                 <div className="info-text">
                    <strong>Global Headquarters</strong>
                    <span>501, 5th Floor, Tower B, <br/>Global Business Park, Gurgaon, India</span>
                 </div>
              </div>
              <div className="contact-info-card">
                 <div className="info-icon"><ArrowRight size={20} /></div>
                 <div className="info-text">
                    <strong>Email Inquiries</strong>
                    <span>contact@greenasha.com</span>
                 </div>
              </div>
            </div>
          </div>

          <div className="contact-form-side">
             <form className="project-form">
                <div className="form-row">
                   <input type="text" placeholder="Full Name" required />
                   <input type="email" placeholder="Work Email" required />
                </div>
                <div className="form-row">
                   <input type="text" placeholder="Organization" required />
                   <input type="text" placeholder="Mobile Number" required />
                </div>
                <div className="form-group">
                   <select required>
                      <option value="">Select Project Type</option>
                      <option value="Agri-Waste">Agricultural Waste</option>
                      <option value="Forestry">Forestry / Wood Waste</option>
                      <option value="Municipal">Municipal Solid Waste</option>
                   </select>
                </div>
                <div className="form-group">
                   <textarea placeholder="Tell us about your project scale and goals..." rows="4"></textarea>
                </div>
                <button type="submit" className="btn btn-green full-btn">Submit Project Inquiry</button>
                <p className="form-alt">Or prefer a quick booking? <button type="button" className="text-link" onClick={onDemoClick}>Schedule a Demo</button></p>
             </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-logo">
              <img src="/images/GreenASHA-Logo.png" alt="GreenASHA Logo" className="brand-img" />
              <span className="tagline">AI Carbon Infrastructure</span>
            </div>
            <p>An AI-powered Carbon Infrastructure Platform for high-integrity biochar production and verified carbon removal.</p>
          </div>
          <div className="footer-nav-cols">
            <div className="footer-col">
              <h5>Platform</h5>
              <a href="#solutions">Solutions</a>
              <a href="#science">How It Works</a>
              <a href="#technology">AI Technology</a>
              <a href="#roi">ROI Calculator</a>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <a href="#">About Us</a>
              <a href="#">Case Studies</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-col">
              <h5>Compliance</h5>
              <a href="#">Verra VCS</a>
              <a href="#">Puro.earth</a>
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 GreenASHA. All rights reserved. Built by Presear Softwares.</span>
          <span>An AI-powered Carbon Infrastructure Platform</span>
        </div>
      </div>
    </footer>
  );
}

function ScheduleModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen && window.Calendly) {
      window.Calendly.initInlineWidget({
        url: 'https://calendly.com/rajibmaharana8200/30min?hide_landing_page_details=1&hide_gdpr_banner=1',
        parentElement: document.querySelector('.calendly-inline-widget'),
        prefill: {},
        utm: {}
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content calendly-modal-wrap" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header-simple">
          <span className="eyebrow-tech" style={{ color: '#00A843' }}>BOOK A SESSION</span>
          <h3 style={{ fontSize: '1.5rem', marginTop: '8px' }}>Schedule a Meeting</h3>
          <p style={{ fontSize: '14px', maxWidth: '400px', margin: '8px auto' }}>Select a time below to connect with our infrastructure team.</p>
        </div>

        {/* Optimized Official Calendly Inline Widget Container */}
        <div 
          className="calendly-inline-widget" 
          style={{ 
            minWidth: '320px', 
            height: '540px', /* Reduced for a more professional, snap-to-content look */
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
          }} 
        />
        
        <div className="modal-footer-info" style={{ marginTop: '16px' }}>
          <p style={{ fontSize: '10px' }}>Global Timezone Support Enabled</p>
        </div>
      </div>
    </div>
  );
}

/* ─── APP ─── */
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsModalOpen(prev => !prev);
  };

  return (
    <div className="site-wrapper">
      <Navbar onDemoClick={toggleModal} />
      
      <main id="main-content">
        <Hero onDemoClick={toggleModal} />
        <TrustedBy />
        <Problem />
        <Solution onDemoClick={toggleModal} />
        <Modules />
        <HowItWorks />
        <UseCases />
        <ValueProp />
        <TechSection />
        <Deployment />
        <Compliance />
        <CaseStudy />
        <ROICalculator onDemoClick={toggleModal} />
        <ContactUs onDemoClick={toggleModal} />
      </main>

      <Footer />
      <ScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

