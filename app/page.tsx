"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const howItWorksSteps = [
  {
    number: "01",
    title: "Answer 5 questions",
    description: "Quick, structured, no fluff.",
  },
  {
    number: "02",
    title: "AI reads your responses",
    description: "Finds your specific friction points.",
  },
  {
    number: "03",
    title: "Get your diagnosis",
    description: "Issues, root cause, and next steps.",
  },
];

export default function Home() {
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const socialProofQuestions = [
    "Who's slowing me down?",
    "Why are my tasks unclear?",
    "What's my real bottleneck?",
    "Why do I leave meetings confused?",
    "Where am I losing time?",
  ];

  useEffect(() => {
    function handleScroll() {
      setIsNavScrolled(window.scrollY > 16);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        className={`animate-nav-drop fixed inset-x-0 top-0 z-50 border-b border-[#e8e4de] transition-all duration-300 ${
          isNavScrolled
            ? "bg-[#faf8f4]/92 shadow-[0_12px_36px_rgba(17,17,17,0.06)] backdrop-blur-xl"
            : "bg-transparent backdrop-blur-md"
        }`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: "rgba(240, 236, 228, 0.6)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
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

      <section className="relative flex min-h-screen flex-col px-6 pb-16 pt-28 sm:px-8">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center text-center">
          <div
            className="animate-fade-up inline-flex items-center rounded-full border border-[#c8c4bc] bg-white/78 px-4 py-2 font-ui text-xs font-medium uppercase tracking-[0.18em] text-[#3a3a3a] shadow-[0_12px_34px_rgba(17,17,17,0.04)] backdrop-blur-sm"
            style={{ animationDelay: "0s" }}
          >
            AI-Powered Workflow Diagnosis
          </div>
          <div className="hero-divider mt-5 h-px w-24 bg-[#d8d2c8]" />
          <h1
            className="animate-fade-up mt-8 max-w-4xl font-heading text-[clamp(52px,7vw,80px)] font-light italic leading-[1.1] tracking-[-0.02em] text-[#0f0f0f] text-balance"
            style={{ animationDelay: "0.2s" }}
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

      <section id="how-it-works" className="px-6 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-2xl">
            <p className="font-ui text-sm uppercase tracking-[0.2em] text-[#6b6b6b]">
              How it works
            </p>
            <h2 className="mt-4 font-heading text-[clamp(32px,4vw,48px)] font-light italic tracking-tight text-[#0f0f0f] text-balance">
              How it works
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {howItWorksSteps.map((item, index) => (
              <article
                key={item.number}
                data-reveal
                className="scroll-fade rounded-[12px] border border-[#e8e4de] bg-[#ffffff] p-8 shadow-[0_18px_50px_rgba(17,17,17,0.04)]"
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                <p className="font-heading text-[64px] font-light italic leading-none text-[#1a1a1a]/[0.12]">
                  {item.number}
                </p>
                <h3 className="mt-8 font-heading text-[20px] font-normal italic leading-tight text-[#1a1a1a]">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-xs text-sm leading-7 text-[#4a4a4a]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="about"
        className="border-t border-[#e0ddd8] bg-[#f0ece4] px-10 py-[100px]"
      >
        <div className="mx-auto max-w-4xl">
          <p className="font-ui text-sm uppercase tracking-[0.2em] text-[#4a4a4a]">
            About
          </p>
          <h2
            data-reveal
            className="scroll-fade mt-4 font-heading text-[clamp(32px,4vw,48px)] font-light italic tracking-tight text-[#0f0f0f] text-balance"
            style={{ transitionDelay: "0s" }}
          >
            Built for people who move fast
          </h2>
          <div className="mx-auto mt-6 flex max-w-[600px] flex-col gap-5 text-center text-[16px] leading-[1.8] text-[#4a4a4a]">
            <p
              data-reveal
              className="scroll-fade"
              style={{ transitionDelay: "0.1s" }}
            >
              Cosmog is an AI-powered workflow diagnostic tool. You answer 5
              structured questions about your role, your blockers, and how you
              work — and Cosmog tells you exactly what is slowing you down.
            </p>
            <p
              data-reveal
              className="scroll-fade"
              style={{ transitionDelay: "0.2s" }}
            >
              Unlike generic productivity advice, Cosmog reads your specific
              situation. It identifies your top friction points, finds the root
              cause connecting them, and gives you three concrete actions you
              can take immediately.
            </p>
            <p
              data-reveal
              className="scroll-fade"
              style={{ transitionDelay: "0.3s" }}
            >
              Built as a lightweight tool for engineers, designers, product
              managers, and anyone who wants clarity on why their work feels
              harder than it should.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e8e4de] px-8 py-6">
        <div className="flex w-full items-center justify-between gap-4">
          <p className="font-ui text-[24px] font-medium uppercase tracking-[0.08em]">
            Cosmog
          </p>
          <p className="text-sm text-[#4a4a4a]">Built with AI</p>
        </div>
      </footer>
    </main>
  );
}
