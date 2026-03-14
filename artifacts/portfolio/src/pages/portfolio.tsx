import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    gsap: any;
    ScrollTrigger: any;
    Swiper: any;
    Lenis: any;
  }
}

export default function PortfolioPage() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [techOpen, setTechOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    idea: "",
    budget: "",
  });
  const lastScrollY = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setNavScrolled(currentY > 20);
      if (currentY > lastScrollY.current && currentY > 80) {
        setNavHidden(true);
      } else {
        setNavHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Load scripts sequentially
    const loadScript = (src: string) =>
      new Promise<void>((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.onload = () => resolve();
        document.head.appendChild(s);
      });

    const init = async () => {
      await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js");
      await loadScript("https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js");

      const { gsap, ScrollTrigger, Swiper, Lenis } = window;
      if (!gsap || !ScrollTrigger) return;

      gsap.registerPlugin(ScrollTrigger);

      // Lenis smooth scroll
      if (Lenis) {
        const lenis = new Lenis({ lerp: 0.1, smooth: true });
        gsap.ticker.add((time: number) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
      }

      // Hero text reveal — first make them visible
      document.querySelectorAll(".hero-line, .hero-sub, .hero-ctas, .stat-badge, .hero-phone").forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
      });

      gsap.to(".hero-line", {
        opacity: 1,
        y: 0,
        stagger: 0.12,
        duration: 0.75,
        ease: "power2.out",
        delay: 0.15,
      });

      gsap.to(".hero-sub", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.55,
      });

      gsap.to(".hero-ctas", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.7,
      });

      gsap.to(".stat-badge", {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.85,
      });

      gsap.to(".hero-phone", {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.3,
      });

      // Phone float animation
      gsap.to(".phone-mockup", {
        y: -12,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Scroll reveals — set to invisible first, then animate in
      document.querySelectorAll(".reveal").forEach((el) => {
        gsap.set(el, { opacity: 0, y: 24 });
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        });
      });

      // Staggered card reveals
      document.querySelectorAll(".reveal-group").forEach((group) => {
        const cards = group.querySelectorAll(".reveal-card");
        gsap.set(cards, { opacity: 0, y: 24 });
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: group,
            start: "top 85%",
          },
        });
      });

      // Init Swiper
      if (Swiper && carouselRef.current) {
        swiperRef.current = new Swiper(carouselRef.current, {
          loop: true,
          effect: "slide",
          autoplay: {
            delay: 2800,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          navigation: {
            nextEl: ".swiper-btn-next",
            prevEl: ".swiper-btn-prev",
          },
        });
      }
    };

    init();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`App Project Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nBudget: ${formData.budget}\n\nIdea:\n${formData.idea}`
    );
    window.open(`mailto:mudassirashraf@icloud.com?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif", color: "#0F1117" }}>
      {/* Google Fonts */}
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin=""
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Sans:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
      />

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav
        className={`portfolio-nav ${navScrolled ? "scrolled" : ""} ${navHidden ? "hidden" : ""}`}
        style={{ padding: "0" }}
      >
        <div className="max-content" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "#1B2B5E",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 15,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              MA
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#0F1117", letterSpacing: "-0.3px" }}>
              Mudassir Ashraf
            </span>
          </a>

          {/* Desktop nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden md:flex">
            {["Services", "Process", "Work", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase())}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4B5563",
                  fontWeight: 500,
                  fontSize: 14,
                  cursor: "pointer",
                  padding: "8px 14px",
                  borderRadius: 8,
                  transition: "color 0.2s ease, background 0.2s ease",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "#1B2B5E";
                  (e.target as HTMLElement).style.background = "rgba(27,43,94,0.05)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "#4B5563";
                  (e.target as HTMLElement).style.background = "none";
                }}
              >
                {item}
              </button>
            ))}
            <a
              href="https://mudassir.xyz/dev"
              style={{
                color: "#9CA3AF",
                fontSize: 13,
                textDecoration: "none",
                padding: "8px 12px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Dev Portfolio
            </a>
            <button
              onClick={() => scrollTo("contact")}
              className="btn-primary"
              style={{ padding: "10px 22px", fontSize: 14 }}
            >
              Hire Me
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        id="hero"
        style={{
          paddingTop: 120,
          paddingBottom: 96,
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <div className="max-content">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 40,
              alignItems: "center",
            }}
            className="hero-grid"
          >
            {/* Left column */}
            <div style={{ maxWidth: 600 }}>
              <div style={{ marginBottom: 20 }}>
                <span className="badge-available">
                  <span className="pulse-dot" />
                  Available for new projects
                </span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(36px, 5vw, 52px)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-1.5px",
                  color: "#0F1117",
                  margin: "0 0 20px",
                }}
              >
                <span className="hero-line" style={{ display: "block" }}>
                  I Build Mobile Apps
                </span>
                <span className="hero-line" style={{ display: "block", color: "#1B2B5E" }}>
                  People Love.
                </span>
              </h1>

              <p
                className="hero-sub"
                style={{
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: "#4B5563",
                  marginBottom: 32,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Mudassir Ashraf — Mobile App Developer from Lahore. From your
                idea to a live app on the Play Store — I handle everything.
              </p>

              <div
                className="hero-ctas"
                style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}
              >
                <button
                  onClick={() => scrollTo("contact")}
                  className="btn-primary"
                >
                  Start Your App
                  <span className="btn-arrow">→</span>
                </button>
                <button
                  onClick={() => scrollTo("work")}
                  className="btn-ghost"
                >
                  See My Work ↓
                </button>
              </div>

              {/* Stats row */}
              <div
                style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
              >
                {[
                  { icon: "⭐", text: "5.0 on Play Store" },
                  { icon: "📱", text: "Live Published Apps" },
                  { icon: "⚡", text: "24h Response" },
                  { icon: "🛠", text: "4+ Tech Stacks" },
                ].map((s) => (
                  <span key={s.text} className="stat-badge">
                    <span>{s.icon}</span>
                    <span>{s.text}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right column — phone mockup */}
            <div
              className="hero-phone"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                paddingTop: 20,
              }}
            >
              <div className="phone-bg-circle" />
              <div className="phone-mockup">
                <img
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&q=80"
                  alt="Nova Solar Weather App"
                  className="phone-screen"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .hero-grid {
              grid-template-columns: 60fr 40fr !important;
            }
          }
        `}</style>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section id="services" className="section-pad section-alt">
        <div className="max-content">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1B2B5E", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
              Services
            </p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.8px", color: "#0F1117", margin: 0 }}>
              What I Can Build For You
            </h2>
          </div>

          <div
            className="reveal-group"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {[
              {
                icon: "📱",
                title: "Flutter Mobile Apps",
                desc: "Beautiful, fast cross-platform apps for iOS and Android — from design to live on app stores.",
                tech: ["Flutter", "Dart", "Firebase"],
              },
              {
                icon: "🤖",
                title: "Native Android Apps",
                desc: "High-performance native Android apps with Material Design and full Play Store publishing.",
                tech: ["Kotlin", "Jetpack", "Android SDK"],
              },
              {
                icon: "🔗",
                title: "REST API & Backend",
                desc: "Scalable API backends that power your mobile app — authentication, databases, and more.",
                tech: ["Node.js", "Express", "PostgreSQL"],
              },
              {
                icon: "🎨",
                title: "UI/UX Design",
                desc: "Clean, conversion-focused app design in Figma before a single line of code is written.",
                tech: ["Figma", "Material 3", "Design Systems"],
              },
              {
                icon: "🚀",
                title: "App Store Publishing",
                desc: "End-to-end publishing to Google Play — screenshots, descriptions, ASO, and compliance.",
                tech: ["Google Play", "ASO", "App Signing"],
              },
              {
                icon: "🔧",
                title: "App Maintenance",
                desc: "Ongoing updates, bug fixes, and feature additions to keep your app running smoothly.",
                tech: ["CI/CD", "Crashlytics", "Analytics"],
              },
            ].map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ─────────────────────────────────────────── */}
      <section id="process" className="section-pad">
        <div className="max-content">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1B2B5E", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
              How It Works
            </p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.8px", color: "#0F1117", margin: 0 }}>
              From Idea to App Store
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 32,
              maxWidth: 900,
              margin: "0 auto",
            }}
            className="reveal-group"
          >
            {[
              {
                n: "01",
                title: "Share Your Idea",
                desc: "Tell me what you want to build — no technical knowledge needed. Just describe the problem.",
              },
              {
                n: "02",
                title: "Plan & Quote",
                desc: "I'll send a clear proposal: scope, timeline, and transparent fixed pricing. No surprises.",
              },
              {
                n: "03",
                title: "Build & Review",
                desc: "You'll see regular progress updates. Full transparency — review at every milestone.",
              },
              {
                n: "04",
                title: "Launch",
                desc: "Your app goes live on the Play Store. I handle the full submission and publishing process.",
              },
            ].map((step) => (
              <div key={step.n} className="reveal-card" style={{}}>
                <div className="process-number" style={{ marginBottom: 16 }}>{step.n}</div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    marginBottom: 8,
                    color: "#0F1117",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "#4B5563",
                    margin: 0,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORK / PROJECTS ──────────────────────────────────── */}
      <section id="work" className="section-pad section-alt">
        <div className="max-content">
          <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1B2B5E", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
              Portfolio
            </p>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 700, letterSpacing: "-0.8px", color: "#0F1117", margin: "0 0 8px" }}>
              Apps I've Built
            </h2>
            <p style={{ fontSize: 16, color: "#4B5563", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
              Real apps. Real users. Live on the Play Store.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 28,
            }}
            className="reveal-group"
          >
            {/* Nova Solar Weather Card */}
            <div className="project-card reveal-card" style={{}}>
              {/* Card header */}
              <div style={{ padding: "24px 24px 0" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                  <div
                    className="project-app-icon"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #0F1117 0%, #1a1a3e 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 26,
                      flexShrink: 0,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    ☀️
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        margin: "0 0 3px",
                        color: "#0F1117",
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      Nova Solar Weather
                    </h3>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#4B5563",
                        margin: "0 0 8px",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Solar &amp; space weather tracker
                    </p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <span className="badge-live">
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#0EA66B",
                            display: "inline-block",
                          }}
                        />
                        Live on Play Store
                      </span>
                      <span className="badge-rating">⭐ 5.0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Screenshot carousel */}
              <div style={{ padding: "0 24px" }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
                  <button className="swiper-btn-prev">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <div
                    ref={carouselRef}
                    className="swiper"
                    style={{ flex: 1, overflow: "hidden" }}
                  >
                    <div className="swiper-wrapper" style={{ display: "flex", alignItems: "center" }}>
                      {[
                        "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&q=80",
                        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&q=80",
                        "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?w=300&q=80",
                        "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=80",
                      ].map((src, i) => (
                        <div className="swiper-slide" key={i} style={{ padding: "16px 0", display: "flex", justifyContent: "center" }}>
                          <div className="carousel-phone">
                            <img src={src} alt={`Screenshot ${i + 1}`} loading="lazy" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="swiper-pagination" style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 4, paddingBottom: 4 }} />
                  </div>
                  <button className="swiper-btn-next">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "16px 24px 24px" }}>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#4B5563",
                    marginBottom: 16,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  A beautifully designed weather app for Android used by space
                  weather enthusiasts worldwide. Rated{" "}
                  <strong style={{ color: "#0F1117" }}>5.0 ⭐</strong> by real
                  users on Google Play.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                    style={{ fontSize: 13, padding: "10px 18px" }}
                  >
                    View on Play Store
                    <span className="arrow-icon" style={{ fontSize: 12 }}>↗</span>
                  </a>
                  <a
                    href="https://github.com/mudassirashraf"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost"
                    style={{ fontSize: 13, padding: "10px 18px" }}
                  >
                    GitHub
                    <span className="arrow-icon">→</span>
                  </a>
                </div>
              </div>
            </div>

            {/* REST API Backend Card */}
            <ApiBackendCard />

            {/* CTA "Yours Next?" Card */}
            <div
              className="cta-project-card reveal-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "48px 32px",
                cursor: "pointer",
                minHeight: 300,
              }}
              onClick={() => scrollTo("contact")}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  background: "rgba(27,43,94,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  marginBottom: 20,
                }}
              >
                💡
              </div>
              <h3
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#1B2B5E",
                  marginBottom: 10,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Your App
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: "#4B5563",
                  marginBottom: 24,
                  lineHeight: 1.6,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Have an idea? Let's turn it into a real, live mobile app.
              </p>
              <button
                className="btn-primary"
                style={{ fontSize: 14 }}
              >
                Tell me your idea
                <span className="btn-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <section id="contact" className="section-pad">
        <div className="max-content">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 48,
              maxWidth: 900,
              margin: "0 auto",
            }}
            className="contact-grid"
          >
            <div className="reveal">
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1B2B5E", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
                Contact
              </p>
              <h2
                style={{
                  fontSize: "clamp(28px, 4vw, 36px)",
                  fontWeight: 700,
                  letterSpacing: "-0.8px",
                  color: "#0F1117",
                  marginBottom: 16,
                }}
              >
                Got an App Idea? Let's Build It.
              </h2>
              <p
                style={{
                  fontSize: 16,
                  lineHeight: 1.7,
                  color: "#4B5563",
                  marginBottom: 28,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Tell me what you want to build and I'll get back to you within
                24 hours with a clear plan. Free consultation — no commitment.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
                <a
                  href="mailto:mudassirashraf@icloud.com"
                  className="btn-ghost"
                  style={{ fontSize: 14 }}
                >
                  <span>✉️</span>
                  Send Email
                </a>
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                  style={{ fontSize: 14 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.524 5.845L0 24l6.332-1.501C8.038 23.468 9.983 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.853 0-3.598-.5-5.1-1.374l-.366-.218-3.756.891.944-3.652-.238-.376C2.517 15.624 2 13.872 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="reveal">
              <form
                onSubmit={handleFormSubmit}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
                  padding: 32,
                  border: "1px solid #F1F5F9",
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="form-label" htmlFor="name">Your Name</label>
                    <input
                      id="name"
                      name="name"
                      className="form-input"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="form-label" htmlFor="budget">Budget Range</label>
                  <select
                    id="budget"
                    name="budget"
                    className="form-input"
                    value={formData.budget}
                    onChange={handleFormChange}
                    style={{ appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
                  >
                    <option value="">Select your budget</option>
                    <option value="under-1k">Under $1,000</option>
                    <option value="1k-3k">$1,000 – $3,000</option>
                    <option value="3k-7k">$3,000 – $7,000</option>
                    <option value="7k-15k">$7,000 – $15,000</option>
                    <option value="15k+">$15,000+</option>
                  </select>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label className="form-label" htmlFor="idea">Describe Your App Idea</label>
                  <textarea
                    id="idea"
                    name="idea"
                    className="form-input"
                    rows={5}
                    placeholder="Tell me what problem your app solves, who the users are, and any key features you need..."
                    value={formData.idea}
                    onChange={handleFormChange}
                    required
                    style={{ resize: "vertical" }}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                  Send My Idea
                  <span className="btn-arrow">→</span>
                </button>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "#9CA3AF",
                    marginTop: 14,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Free consultation · No commitment · Response within 24h
                </p>
              </form>
            </div>
          </div>
        </div>

        <style>{`
          @media (min-width: 768px) {
            .contact-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────── */}
      <section className="footer-cta reveal">
        <div className="max-content" style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
              color: "#fff",
              marginBottom: 12,
              letterSpacing: "-0.8px",
            }}
          >
            Have an app idea?
          </h2>
          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 32,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            I'm currently taking on new projects — let's talk.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => scrollTo("contact")}
              style={{
                background: "#fff",
                color: "#1B2B5E",
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              Book a Free Call →
            </button>
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noreferrer"
              style={{
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 15,
                fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                padding: "14px 0",
              }}
            >
              <span>💬</span>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer
        style={{
          background: "#0F1117",
          padding: "40px 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-content">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: "#1B2B5E",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 13,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                MA
              </div>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Mudassir Ashraf
              </span>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                { label: "Services", id: "services" },
                { label: "Process", id: "process" },
                { label: "Work", id: "work" },
                { label: "Contact", id: "contact" },
              ].map((l) => (
                <button
                  key={l.label}
                  onClick={() => scrollTo(l.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.55)",
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = "#fff"; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <a
                href="mailto:mudassirashraf@icloud.com"
                style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
              >
                Email
              </a>
              <a
                href="https://github.com/mudassirashraf"
                target="_blank"
                rel="noreferrer"
                style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
              >
                GitHub
              </a>
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noreferrer"
                style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, textDecoration: "none", fontFamily: "'DM Sans', sans-serif" }}
              >
                Play Store
              </a>
            </div>
          </div>
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 13,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              © 2026 Mudassir Ashraf · Lahore 🇵🇰
            </p>
            <a
              href="https://mudassir.xyz/dev"
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 12,
                textDecoration: "none",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Are You a Developer or Recruiter? →
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Service Card Component ─── */
function ServiceCard({
  icon,
  title,
  desc,
  tech,
}: {
  icon: string;
  title: string;
  desc: string;
  tech: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="service-card reveal-card" style={{ padding: 28 }}>
      <span className="service-icon" style={{ fontSize: 32, marginBottom: 16, display: "block" }}>
        {icon}
      </span>
      <h3
        className="service-title"
        style={{
          fontSize: 17,
          fontWeight: 700,
          marginBottom: 8,
          color: "#0F1117",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 15,
          lineHeight: 1.7,
          color: "#4B5563",
          marginBottom: 14,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {desc}
      </p>
      <button
        className="tech-toggle-btn"
        onClick={() => setOpen((o) => !o)}
      >
        <span
          style={{
            display: "inline-block",
            transition: "transform 0.2s",
            transform: open ? "rotate(90deg)" : "rotate(0)",
          }}
        >
          ▶
        </span>
        Technical details
      </button>
      {open && (
        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {tech.map((t) => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── API Backend Card Component ─── */
function ApiBackendCard() {
  return (
    <div className="project-card reveal-card" style={{}}>
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
          <div
            className="project-app-icon"
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #0F1117 0%, #1e293b 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            🔗
          </div>
          <div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                margin: "0 0 3px",
                color: "#0F1117",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              REST API Backend
            </h3>
            <p
              style={{
                fontSize: 13,
                color: "#4B5563",
                margin: "0 0 8px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Scalable mobile app backend
            </p>
            <span className="badge-progress">
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#3B82F6",
                  display: "inline-block",
                }}
              />
              In Progress
            </span>
          </div>
        </div>
      </div>

      {/* Animated terminal */}
      <div style={{ padding: "0 24px" }}>
        <div className="terminal-window">
          <div className="terminal-line">
            <span style={{ color: "#64748B" }}>// GET</span>{" "}
            <span style={{ color: "#38BDF8" }}>/api/solar/live</span>
          </div>
          <div className="terminal-line" style={{ marginTop: 6 }}>
            <span style={{ color: "#4ADE80" }}>200 OK</span>{" "}
            <span style={{ color: "#94A3B8" }}>→</span>
          </div>
          <div className="terminal-line" style={{ marginTop: 4, paddingLeft: 12 }}>
            <span style={{ color: "#E2E8F0" }}>
              {"{"}&nbsp;<span style={{ color: "#F472B6" }}>"kpIndex"</span>:{" "}
              <span style={{ color: "#A3E635" }}>4.2</span>,
            </span>
          </div>
          <div className="terminal-line" style={{ paddingLeft: 12 }}>
            <span style={{ color: "#E2E8F0" }}>
              &nbsp;&nbsp;<span style={{ color: "#F472B6" }}>"forecast"</span>:{" "}
              <span style={{ color: "#FCD34D" }}>"Aurora likely"</span>{" "}
              {"}"}
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 24px 24px" }}>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.7,
            color: "#4B5563",
            marginBottom: 16,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Production-ready Node.js REST API with authentication, PostgreSQL
          database, and real-time data endpoints — powering mobile apps at scale.
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["Node.js", "Express", "PostgreSQL", "JWT"].map((t) => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
