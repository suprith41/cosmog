"use client";

import Link from "next/link";
import { useEffect } from "react";

const howItWorksSteps = [
  {
    number: "01",
    title: "Answer 5 questions",
    description:
      "Go through a short structured interview designed to surface the real friction in your workflow. Questions adapt to your role — an engineer gets different questions than a designer or a sales rep.",
  },
  {
    number: "02",
    title: "AI reads your responses",
    description:
      "Your answers are analyzed by an AI consultant trained to identify workflow patterns. It looks for the specific combination of slowdowns, bottlenecks, and clarity gaps that are unique to your situation.",
  },
  {
    number: "03",
    title: "Get your personal diagnosis",
    description:
      "Receive a detailed breakdown of your top issues, the root cause connecting them, and three concrete actions tailored to your role and context. No generic advice — only what applies to you.",
  },
];

export default function Home() {
  const socialProofQuestions = [
    "Who's slowing me down?",
    "Why are my tasks unclear?",
    "What's my real bottleneck?",
    "Why do I leave meetings confused?",
    "Where am I losing time?",
  ];

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="text-[#1a1a1a]">
      <nav
        className="animate-nav-drop fixed inset-x-0 top-0 z-50 bg-transparent transition-all duration-300"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: "transparent",
        }}
      >
        <div className="flex w-full items-center justify-between px-8 py-4">
          <Link
            href="/"
            className="font-ui text-[24px] font-medium uppercase tracking-[0.08em]"
          >
            Cosmog
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#how-it-works"
              className="hidden px-3 py-2 font-ui text-sm text-[#1a1a1a] transition hover:text-[#111111] sm:inline-flex"
            >
              How it works
            </a>
            <a
              href="#about"
              className="hidden px-3 py-2 font-ui text-sm text-[#1a1a1a] transition hover:text-[#111111] sm:inline-flex"
            >
              About
            </a>
            <Link
              href="/diagnosis"
              className="inline-flex items-center justify-center rounded-full bg-[#111111] px-4 py-2.5 font-ui text-sm font-medium text-white transition duration-200 ease-out hover:scale-[1.03] hover:opacity-[0.85] sm:px-5"
              style={{
                backgroundColor: "#111111",
                color: "#ffffff",
                padding: "16px 40px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Montserrat, sans-serif",
                letterSpacing: "0.08em",
                textDecoration: "none",
                display: "inline-block",
                border: "none",
                cursor: "pointer",
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="hero-section relative flex min-h-screen flex-col overflow-hidden px-6 pb-16 pt-28 sm:px-8">
        <div className="hero-section__overlay absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center text-center">
          <div
            className="animate-fade-up inline-flex items-center rounded-full border border-[#c8c4bc] bg-white/78 px-4 py-2 font-ui text-xs font-medium uppercase tracking-[0.18em] text-[#3a3a3a] shadow-[0_12px_34px_rgba(17,17,17,0.04)] backdrop-blur-sm"
            style={{ animationDelay: "0s" }}
          >
            AI-Powered Workflow Diagnosis
          </div>
          <div className="hero-divider mt-5 h-px w-24 bg-[#d8d2c8]" />
          <h1
            className="animate-fade-up mt-8 max-w-4xl font-instrument-serif text-[clamp(52px,7vw,80px)] leading-[1.1] tracking-[-0.02em] text-[#0f0f0f] text-balance"
            style={{
              animationDelay: "0.2s",
              fontFamily: "var(--font-instrument-serif), Georgia, serif",
              fontStyle: "normal",
              fontWeight: 400,
            }}
          >
            Where your work breaks down.
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-[520px] text-center text-[18px] font-light leading-[1.8] text-[#4a4a4a]"
            style={{ animationDelay: "0.4s" }}
          >
            Five questions. One honest diagnosis. No generic advice — just a
            clear picture of exactly where your workflow is breaking and what to
            do about it.
          </p>
          <Link
            href="/diagnosis"
            className="animate-fade-up mt-10 inline-block cursor-pointer rounded-full border-0 bg-[#111111] px-[40px] py-[16px] font-ui text-[14px] font-medium tracking-[0.08em] text-[#ffffff] no-underline transition duration-200 ease-out hover:scale-[1.03]"
            style={{
              animationDelay: "0.6s",
              backgroundColor: "#111111",
              color: "#ffffff",
              padding: "16px 40px",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: "500",
              fontFamily: "Montserrat, sans-serif",
              letterSpacing: "0.08em",
              textDecoration: "none",
              display: "inline-block",
              border: "none",
              cursor: "pointer",
            }}
          >
            Start Diagnosis →
          </Link>
          <div
            className="animate-fade-up mt-8 flex max-w-4xl flex-wrap justify-center gap-2"
            style={{ animationDelay: "0.8s" }}
          >
            {socialProofQuestions.map((question) => (
              <span
                key={question}
                className="rounded-full border border-[#c8c4bc] bg-transparent px-3 py-1.5 text-center text-[12px] text-[#4a4a4a]"
              >
                {question}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="post-hero-shell">
        <section
          id="how-it-works"
          className="process-section relative overflow-hidden px-6 py-24 sm:px-8 lg:py-32"
        >
          <div className="process-aurora process-aurora--one" aria-hidden="true" />
          <div className="process-aurora process-aurora--two" aria-hidden="true" />

          <div className="relative z-10 mx-auto w-full max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.48fr] lg:items-end">
              <div data-reveal className="scroll-fade max-w-3xl">
                <p className="section-eyebrow">How Cosmog works</p>
                <h2 className="section-heading mt-5 text-[clamp(40px,6vw,72px)] leading-[0.98] tracking-[-0.055em] text-[#4b3654] text-balance">
                  Turn daily friction into a clear signal.
                </h2>
              </div>
              <p
                data-reveal
                className="section-copy scroll-fade max-w-sm text-[18px] leading-8 text-[#4b3654]/75 lg:justify-self-end"
                style={{ transitionDelay: "0.12s" }}
              >
                A focused five-question scan that finds the pattern behind the
                slowdown—not another productivity score.
              </p>
            </div>

            <div className="process-grid mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
              {howItWorksSteps.map((item, index) => (
                <div
                  key={item.number}
                  data-reveal
                  className="card-scene scroll-fade"
                  style={{ transitionDelay: `${0.12 + index * 0.12}s` }}
                >
                  <article className={`dimension-card dimension-card--${index + 1}`}>
                    <div className="dimension-card__plane" aria-hidden="true" />
                    <div className="dimension-card__top">
                      <span className="dimension-card__number">{item.number}</span>
                      <span className="mini-cube" aria-hidden="true">
                        <span className="mini-cube__face mini-cube__face--front" />
                        <span className="mini-cube__face mini-cube__face--back" />
                        <span className="mini-cube__face mini-cube__face--right" />
                        <span className="mini-cube__face mini-cube__face--left" />
                        <span className="mini-cube__face mini-cube__face--top" />
                        <span className="mini-cube__face mini-cube__face--bottom" />
                      </span>
                    </div>
                    <div className="dimension-card__content">
                      <p className="dimension-card__label">Signal layer</p>
                      <h3 className="section-heading mt-3 text-[26px] leading-[1.08] tracking-[-0.035em] text-[#4b3654]">
                        {item.title}
                      </h3>
                      <p className="section-copy mt-5 text-[16px] leading-7 text-[#4b3654]/80">
                        {item.description}
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="signal-section relative overflow-hidden px-6 py-24 sm:px-8 lg:py-32"
        >
          <div className="signal-grid" aria-hidden="true" />
          <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <p className="section-eyebrow section-eyebrow--light">Your diagnosis</p>
              <h2
                data-reveal
                className="section-heading scroll-fade mt-5 text-[clamp(40px,5vw,64px)] leading-[1.02] tracking-[-0.05em] text-[#fcecc7] text-balance"
              >
                See what your work has been trying to tell you.
              </h2>
              <p
                data-reveal
                className="section-copy scroll-fade mt-7 max-w-xl text-[19px] leading-8 text-[#fcecc7]/78"
                style={{ transitionDelay: "0.1s" }}
              >
                Cosmog connects your blockers, handoffs, and clarity gaps into
                one readable picture. You get the root cause, the friction it
                creates, and three concrete actions tailored to your role.
              </p>
              <div
                data-reveal
                className="scroll-fade mt-9 flex flex-wrap gap-3"
                style={{ transitionDelay: "0.18s" }}
              >
                {["Root cause", "Top friction", "3 next actions"].map((label) => (
                  <span key={label} className="signal-pill">
                    <span aria-hidden="true">✦</span> {label}
                  </span>
                ))}
              </div>
            </div>

            <div
              data-reveal
              className="orbital-scene scroll-fade"
              style={{ transitionDelay: "0.16s" }}
              aria-label="Animated visualization connecting workflow friction to a clear diagnosis"
            >
              <div className="orbital-panel">
                <div className="orbital-panel__header">
                  <span>Pattern map</span>
                  <span>Live scan · 03 signals</span>
                </div>
                <div className="orbit-space">
                  <div className="orbit orbit--outer" aria-hidden="true">
                    <span className="orbit__node" />
                  </div>
                  <div className="orbit orbit--inner" aria-hidden="true">
                    <span className="orbit__node" />
                  </div>
                  <div className="signal-core" aria-hidden="true">
                    <span>✦</span>
                  </div>
                  <span className="orbit-label orbit-label--one">unclear inputs</span>
                  <span className="orbit-label orbit-label--two">slow handoffs</span>
                  <span className="orbit-label orbit-label--three">lost focus</span>
                </div>
                <div className="orbital-panel__footer">
                  <span>Friction</span>
                  <span className="orbital-arrow" aria-hidden="true">→</span>
                  <span>Root cause</span>
                  <span className="orbital-arrow" aria-hidden="true">→</span>
                  <span>Next move</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="closing-section px-6 py-24 sm:px-8 lg:py-32">
          <div
            data-reveal
            className="closing-card scroll-fade mx-auto max-w-6xl overflow-hidden rounded-[36px] px-7 py-12 sm:px-12 lg:px-16 lg:py-16"
          >
            <div className="closing-card__star" aria-hidden="true">✦</div>
            <div className="relative z-10 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="section-eyebrow">Five questions. Real clarity.</p>
                <h2 className="section-heading mt-5 text-[clamp(38px,5vw,62px)] leading-[1.02] tracking-[-0.05em] text-[#4b3654] text-balance">
                  Stop guessing where your energy goes.
                </h2>
                <p className="section-copy mt-5 max-w-xl text-[18px] leading-8 text-[#4b3654]/75">
                  Your workflow already contains the answer. Cosmog helps you
                  see it in a few focused minutes.
                </p>
              </div>
              <Link href="/diagnosis" className="closing-button">
                Start diagnosis <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </section>

        <footer className="site-footer px-6 py-8 sm:px-8">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6">
            <p className="section-heading text-xl font-semibold tracking-[-0.03em] text-[#4b3654]">
              Cosmog
            </p>
            <p className="footer-note">Make work make sense · 2026</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
