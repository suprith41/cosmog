"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "./diagnosis.css";

type FormData = {
  role: string;
  slowdown: string;
  bottleneck: string;
  clarity: string;
  description: string;
};

type QuestionKey = keyof FormData;

type ChoiceStep = {
  key: Exclude<QuestionKey, "description">;
  prompt: string;
  helper: string;
  options: string[];
};

type TextStep = {
  key: "description";
  prompt: string;
  helper: string;
  placeholder: string;
};

type Step = ChoiceStep | TextStep;

type ParsedIssue = {
  title: string;
  description: string;
};

type AnalysisSections = {
  issues: ParsedIssue[];
  rootCause: string;
  actions: string[];
  workStyleInsight: string;
};

type Role = "Engineering" | "Sales" | "Marketing" | "Design" | "Other";

type RoleQuestionSet = {
  slowdown: {
    question: string;
    options: string[];
  };
  bottleneck: {
    question: string;
    options: string[];
  };
  clarity: {
    question: string;
    options: string[];
  };
  description: {
    question: string;
  };
};

const questionsByRole: Record<Role, RoleQuestionSet> = {
  Engineering: {
    slowdown: {
      question: "In a typical week, what kills the most productive hours?",
      options: [
        "Sitting in meetings that don't need me",
        "Building on top of unclear requirements",
        "Waiting days for a PR review",
        "Fighting broken tooling or infra",
        "Other",
      ],
    },
    bottleneck: {
      question: "When work stalls completely, what is usually the reason?",
      options: [
        "PR sitting unreviewed for days",
        "Ticket had no clear acceptance criteria",
        "Blocked waiting on another team's API or service",
        "Nobody wrote down what done looks like",
        "Other",
      ],
    },
    clarity: {
      question: "When a ticket lands in your queue, how complete is it?",
      options: [
        "Ready to build — everything is there",
        "Mostly there but always a few gaps",
        "I spend time figuring out what done means",
        "It is basically a title and nothing else",
      ],
    },
    description: {
      question:
        "Walk me through a specific sprint or task where you lost the most time. What happened, and where did it break down?",
    },
  },
  Sales: {
    slowdown: {
      question: "What most often kills your selling time?",
      options: [
        "Internal meetings eating the day",
        "Waiting weeks for proposal sign-off",
        "No assets from marketing when I need them",
        "Drowning in CRM updates",
        "Other",
      ],
    },
    bottleneck: {
      question: "At what point do deals die or stall most often?",
      options: [
        "Stuck in legal or procurement forever",
        "Can't find who actually makes the decision",
        "Don't have the product answers prospects need",
        "Lost in a messy handoff between teams",
        "Other",
      ],
    },
    clarity: {
      question: "How well do you understand what is expected of you each quarter?",
      options: [
        "Crystal clear targets and playbook",
        "Clear targets but fuzzy on the how",
        "Targets shift or arrive late",
        "I am guessing most of the time",
      ],
    },
    description: {
      question:
        "Describe a deal or a week in your pipeline where the process completely broke down. What happened?",
    },
  },
  Marketing: {
    slowdown: {
      question: "What most often delays your work from shipping?",
      options: [
        "Endless approval rounds",
        "Briefs that arrive half-baked",
        "Waiting on design or copy from others",
        "Managing too many platforms at once",
        "Other",
      ],
    },
    bottleneck: {
      question: "Where does a campaign most often grind to a halt?",
      options: [
        "Budget stuck waiting for approval",
        "No single owner driving the campaign",
        "Flying blind without data or benchmarks",
        "Dependent on another team that moves slowly",
        "Other",
      ],
    },
    clarity: {
      question: "When a campaign brief arrives, how usable is it?",
      options: [
        "Complete with goals, audience, and timeline",
        "Good enough but missing key details",
        "Vague enough that I have to fill in the gaps",
        "It is barely a brief at all",
      ],
    },
    description: {
      question:
        "Describe a campaign or project that took far longer than it should have. Where did it go wrong?",
    },
  },
  Design: {
    slowdown: {
      question: "What most often stops you from doing your best design work?",
      options: [
        "Feedback that contradicts itself",
        "Requirements that change mid-design",
        "Waiting for content that never arrives",
        "Too many people with opinions",
        "Other",
      ],
    },
    bottleneck: {
      question: "What most often brings a design project to a complete stop?",
      options: [
        "Waiting for someone to approve the direction",
        "No one wrote a proper brief",
        "Making decisions without user data",
        "Design gets lost in the engineering handoff",
        "Other",
      ],
    },
    clarity: {
      question: "When a design task is handed to you, how briefed are you?",
      options: [
        "Fully briefed with goals and constraints",
        "Partially briefed — I piece the rest together",
        "I usually have to extract the brief myself",
        "I start designing with almost no direction",
      ],
    },
    description: {
      question:
        "Describe a recent project where the design process broke down. What was the moment it went off track?",
    },
  },
  Other: {
    slowdown: {
      question: "What most often eats into your productive time?",
      options: [
        "Too many meetings",
        "Work that arrives without context",
        "Waiting on other people",
        "Switching between too many tools",
        "Other",
      ],
    },
    bottleneck: {
      question:
        "When your work stops moving forward, what is usually blocking it?",
      options: [
        "No clear next step defined",
        "Waiting for someone to approve something",
        "Missing information to proceed",
        "Dependent on another team entirely",
        "Other",
      ],
    },
    clarity: {
      question: "When work is assigned to you, how clear is it?",
      options: [
        "Very clear — I know exactly what to do",
        "Mostly clear with some gaps",
        "Unclear enough that I lose time figuring it out",
        "Completely unclear almost every time",
      ],
    },
    description: {
      question:
        "Describe a specific moment in the last month where your work felt completely broken. What happened?",
    },
  },
};

function getQuestionsForRole(role: string) {
  return role in questionsByRole
    ? questionsByRole[role as Role]
    : questionsByRole.Other;
}

const initialData: FormData = {
  role: "",
  slowdown: "",
  bottleneck: "",
  clarity: "",
  description: "",
};

function isStepComplete(step: Step, formData: FormData) {
  const value = formData[step.key];
  return typeof value === "string" && value.trim().length > 0;
}

function removeBoldMarkers(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*\*/g, "").trim();
}

function cleanIssueLine(text: string) {
  return removeBoldMarkers(text).replace(/^(?:\d+\s*\.\s*)+/, "").trim();
}

function cleanActionLine(text: string) {
  return removeBoldMarkers(text).replace(/^[*-]\s*/, "").trim();
}

function parseIssue(text: string): ParsedIssue {
  const cleaned = cleanIssueLine(text);
  const separatorIndex = cleaned.indexOf(":");

  if (separatorIndex === -1) {
    return {
      title: cleaned,
      description: "",
    };
  }

  return {
    title: cleaned.slice(0, separatorIndex).trim(),
    description: cleaned.slice(separatorIndex + 1).trim(),
  };
}

function parseAnalysis(text: string): AnalysisSections {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const issues: string[] = [];
  const actions: string[] = [];
  const rootCause: string[] = [];
  const workStyleInsight: string[] = [];
  let currentSection: "issues" | "rootCause" | "actions" | "workStyleInsight" | null =
    null;

  for (const line of lines) {
    if (line === "TOP ISSUES:") {
      currentSection = "issues";
      continue;
    }

    if (line === "ROOT CAUSE:") {
      currentSection = "rootCause";
      continue;
    }

    if (line === "ACTIONS:") {
      currentSection = "actions";
      continue;
    }

    if (line === "WORK STYLE INSIGHT:") {
      currentSection = "workStyleInsight";
      continue;
    }

    if (currentSection === "issues" && /^\d+\.\s*/.test(line)) {
      issues.push(cleanIssueLine(line));
      continue;
    }

    if (currentSection === "issues" && issues.length) {
      issues[issues.length - 1] =
        `${issues[issues.length - 1]} ${cleanIssueLine(line)}`.trim();
      continue;
    }

    if (currentSection === "actions" && /^[*-]\s*/.test(line)) {
      actions.push(cleanActionLine(line));
      continue;
    }

    if (currentSection === "actions" && actions.length) {
      actions[actions.length - 1] =
        `${actions[actions.length - 1]} ${cleanActionLine(line)}`.trim();
      continue;
    }

    if (currentSection === "rootCause") {
      rootCause.push(removeBoldMarkers(line));
      continue;
    }

    if (currentSection === "workStyleInsight") {
      workStyleInsight.push(removeBoldMarkers(line));
    }
  }

  return {
    issues: issues.map(parseIssue),
    rootCause: rootCause.join(" "),
    actions,
    workStyleInsight: workStyleInsight.join(" "),
  };
}

export default function DiagnosisPage() {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [stepIndex, setStepIndex] = useState(0);
  const [analysis, setAnalysis] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepMotion, setStepMotion] = useState<
    "idle" | "exit-left" | "exit-right" | "enter-right" | "enter-left"
  >("idle");
  const [isStepAnimating, setIsStepAnimating] = useState(false);
  const animationTimers = useRef<number[]>([]);
  const roleQuestions = getQuestionsForRole(formData.role);
  const steps: Step[] = [
    {
      key: "role",
      prompt: "What best describes your day-to-day role?",
      helper: "Choose the option that matches your day-to-day work most closely.",
      options: ["Engineering", "Sales", "Marketing", "Design", "Other"],
    },
    {
      key: "slowdown",
      prompt: roleQuestions.slowdown.question,
      helper: "Pick the issue that shows up most often, even if other ones also matter.",
      options: roleQuestions.slowdown.options,
    },
    {
      key: "bottleneck",
      prompt: roleQuestions.bottleneck.question,
      helper: "Choose the point where progress most often stalls.",
      options: roleQuestions.bottleneck.options,
    },
    {
      key: "clarity",
      prompt: roleQuestions.clarity.question,
      helper: "Answer based on what usually happens, not the best-case week.",
      options: roleQuestions.clarity.options,
    },
    {
      key: "description",
      prompt: roleQuestions.description.question,
      helper: "A few concrete details help the diagnosis stay specific.",
      placeholder:
        "Example: I had to wait two days for approval, then found out a requirement had changed...",
    },
  ];

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;
  const canContinue = isStepComplete(currentStep, formData);
  const analysisSections = analysis ? parseAnalysis(analysis) : null;
  const isResultsView = Boolean(analysis && analysisSections);
  const hasStructuredAnalysis = Boolean(
    analysisSections &&
      (analysisSections.issues.length ||
        analysisSections.rootCause ||
        analysisSections.actions.length ||
        analysisSections.workStyleInsight),
  );

  function updateField(key: QuestionKey, value: string) {
    setFormData((current) => {
      if (key === "role") {
        return {
          role: value,
          slowdown: "",
          bottleneck: "",
          clarity: "",
          description: "",
        };
      }

      return {
        ...current,
        [key]: value,
      };
    });
    setError("");
  }

  function handleNext() {
    if (!canContinue) {
      setError("Please complete this step before continuing.");
      return;
    }

    animateToStep(Math.min(stepIndex + 1, steps.length - 1), "next");
  }

  function handleBack() {
    setError("");
    animateToStep(Math.max(stepIndex - 1, 0), "back");
  }

  async function handleSubmit() {
    if (!canContinue) {
      setError("Please describe a recent inefficient situation before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const rawResponse = await response.text();
      let payload: {
        analysis?: string;
        result?: string;
        error?: string;
      } = {};

      try {
        payload = JSON.parse(rawResponse) as typeof payload;
      } catch {
        throw new Error(
          rawResponse.startsWith("<!DOCTYPE")
            ? "The API returned an HTML error page instead of JSON."
            : rawResponse || "Analysis failed.",
        );
      }

      const analysisText = payload.analysis || payload.result;

      if (!response.ok || !analysisText) {
        throw new Error(payload.error || "Analysis failed.");
      }

      setAnalysis(analysisText);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while generating the diagnosis.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRestart() {
    clearAnimationTimers();
    setFormData(initialData);
    setStepIndex(0);
    setAnalysis("");
    setError("");
    setIsSubmitting(false);
    setStepMotion("idle");
    setIsStepAnimating(false);
  }

  function clearAnimationTimers() {
    animationTimers.current.forEach((timer) => window.clearTimeout(timer));
    animationTimers.current = [];
  }

  function animateToStep(targetIndex: number, direction: "next" | "back") {
    if (targetIndex === stepIndex || isStepAnimating) {
      return;
    }

    clearAnimationTimers();
    setIsStepAnimating(true);
    setStepMotion(direction === "next" ? "exit-left" : "exit-right");

    const exitTimer = window.setTimeout(() => {
      setStepIndex(targetIndex);
      setStepMotion(direction === "next" ? "enter-right" : "enter-left");

      const enterTimer = window.setTimeout(() => {
        setStepMotion("idle");
      }, 20);

      const finishTimer = window.setTimeout(() => {
        setIsStepAnimating(false);
      }, 320);

      animationTimers.current.push(enterTimer, finishTimer);
    }, 300);

    animationTimers.current.push(exitTimer);
  }

  useEffect(() => {
    return () => {
      clearAnimationTimers();
    };
  }, []);

  return (
    <main className={`diagnosis-shell ${isResultsView ? "diagnosis-shell--results" : ""}`}>
      <div className="diagnosis-noise" aria-hidden="true" />
      <div className="diagnosis-glow diagnosis-glow--one" aria-hidden="true" />
      <div className="diagnosis-glow diagnosis-glow--two" aria-hidden="true" />

      <header className="diagnosis-nav">
        <Link href="/" className="diagnosis-brand">Cosmog</Link>
        <div className="diagnosis-nav__status">
          <span className="diagnosis-nav__pulse" aria-hidden="true" />
          {isResultsView ? "Analysis complete" : "Workflow scan"}
        </div>
      </header>

      {!analysis || !analysisSections ? (
        <div className="diagnosis-layout">
          <aside className="diagnosis-rail" aria-label="Diagnosis progress">
            <div className="diagnosis-sculpture" aria-hidden="true">
              <div className="diagnosis-sculpture__ring diagnosis-sculpture__ring--one" />
              <div className="diagnosis-sculpture__ring diagnosis-sculpture__ring--two" />
              <div className="diagnosis-sculpture__core">✦</div>
            </div>

            <div className="diagnosis-rail__copy">
              <p className="diagnosis-kicker">Signal collection</p>
              <h2>Five answers. One clearer picture.</h2>
              <p>
                Each response adds another layer to your personal workflow map.
              </p>
            </div>

            <ol className="diagnosis-progress">
              {steps.map((step, index) => {
                const isActive = index === stepIndex;
                const isComplete = index < stepIndex;

                return (
                  <li
                    key={step.key}
                    className={`${isActive ? "is-active" : ""} ${isComplete ? "is-complete" : ""}`}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span>{isComplete ? "✓" : String(index + 1).padStart(2, "0")}</span>
                    <i aria-hidden="true" />
                  </li>
                );
              })}
            </ol>
          </aside>

          <section className="question-scene">
            <div className="question-card animate-card-up">
              <div className="question-card__depth" aria-hidden="true" />
              <div className="question-card__header">
                <p>Question {String(stepIndex + 1).padStart(2, "0")}</p>
                <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}% mapped</span>
              </div>

              <div className={`step-panel ${stepMotion}`}>
                <div className="question-intro">
                  <h1>{currentStep.prompt}</h1>
                  <p>{currentStep.helper}</p>
                </div>

                <div className="question-inputs">
                  {"options" in currentStep ? (
                    <div className="choice-grid">
                      {currentStep.options.map((option, optionIndex) => {
                        const selected = formData[currentStep.key] === option;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => updateField(currentStep.key, option)}
                            className={`choice-card ${selected ? "is-selected" : ""}`}
                            aria-pressed={selected}
                          >
                            <span className="choice-card__index">
                              {String(optionIndex + 1).padStart(2, "0")}
                            </span>
                            <span className="choice-card__text">{option}</span>
                            <span className="choice-card__mark" aria-hidden="true">
                              {selected ? "✦" : "↗"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <label className="story-field">
                      <span>Describe the moment</span>
                      <textarea
                        value={formData.description}
                        onChange={(event) => updateField("description", event.target.value)}
                        rows={7}
                        placeholder={currentStep.placeholder}
                      />
                      <small>{formData.description.length} characters captured</small>
                    </label>
                  )}
                </div>

                {error ? <p className="diagnosis-error">{error}</p> : null}

                <div className="question-actions">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={stepIndex === 0 || isSubmitting || isStepAnimating}
                    className="diagnosis-button diagnosis-button--secondary"
                  >
                    <span aria-hidden="true">←</span> Back
                  </button>

                  {isLastStep ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || isStepAnimating}
                      className="diagnosis-button diagnosis-button--primary"
                    >
                      {isSubmitting ? (
                        <>Reading signals <span className="button-loader" aria-hidden="true" /></>
                      ) : (
                        <>Generate diagnosis <span aria-hidden="true">✦</span></>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isStepAnimating}
                      className="diagnosis-button diagnosis-button--primary"
                    >
                      Next signal <span aria-hidden="true">→</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="results-wrap animate-card-up">
          <header className="results-hero">
            <div>
              <p className="diagnosis-kicker">Your pattern map is ready</p>
              <h1>Your workflow diagnosis.</h1>
              <p className="results-hero__copy">
                The signals in your five answers point to the following friction,
                root cause, and practical next moves.
              </p>
            </div>
            <div className="results-emblem" aria-hidden="true">
              <span>✦</span>
              <i />
              <b>03</b>
            </div>
          </header>

          <section className="report-section">
            <div className="report-heading">
              <span>01</span>
              <div><p>Detected patterns</p><h2>Top friction points</h2></div>
            </div>
            {analysisSections.issues.length ? (
              <ol className="issue-grid">
                {analysisSections.issues.map((issue, index) => (
                  <li key={`${issue.title}-${issue.description}-${index}`} className={`issue-card issue-card--${index + 1}`}>
                    <span className="issue-card__number">0{index + 1}</span>
                    <div>
                      <h3>{issue.title}</h3>
                      {issue.description ? <p>{issue.description}</p> : null}
                    </div>
                    <span className="issue-card__orb" aria-hidden="true" />
                  </li>
                ))}
              </ol>
            ) : (
              <p className="report-fallback">The response did not include a separately parsed issues list.</p>
            )}
          </section>

          <section className="report-section">
            <div className="report-heading">
              <span>02</span>
              <div><p>The connecting signal</p><h2>Root cause</h2></div>
            </div>
            <div className="root-cause-panel">
              <div className="root-cause-panel__visual" aria-hidden="true">
                <span className="root-node root-node--one" />
                <span className="root-node root-node--two" />
                <span className="root-node root-node--three" />
                <span className="root-line root-line--one" />
                <span className="root-line root-line--two" />
                <strong>✦</strong>
              </div>
              <p>{analysisSections.rootCause || analysis}</p>
            </div>
          </section>

          <section className="report-section">
            <div className="report-heading">
              <span>03</span>
              <div><p>Your next moves</p><h2>Actions to take now</h2></div>
            </div>
            {analysisSections.actions.length ? (
              <ul className="action-stack">
                {analysisSections.actions.map((action, index) => (
                  <li key={`${action}-${index}`}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{action}</p>
                    <i aria-hidden="true">↗</i>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="report-fallback">The response did not include a separately parsed action list.</p>
            )}
          </section>

          {analysisSections.workStyleInsight ? (
            <section className="insight-report">
              <div>
                <p className="diagnosis-kicker diagnosis-kicker--light">A note about how you work</p>
                <h2>Work style insight</h2>
              </div>
              <blockquote>{analysisSections.workStyleInsight}</blockquote>
              <span className="insight-report__star" aria-hidden="true">✦</span>
            </section>
          ) : null}

          {!hasStructuredAnalysis ? (
            <section className="report-section">
              <div className="report-heading">
                <span>••</span>
                <div><p>Unstructured analysis</p><h2>Full response</h2></div>
              </div>
              <pre className="full-response">{analysis}</pre>
            </section>
          ) : null}

          <div className="results-actions">
            <button type="button" onClick={handleRestart} className="diagnosis-button diagnosis-button--primary">
              Start a new diagnosis <span aria-hidden="true">↻</span>
            </button>
            <Link href="/" className="diagnosis-button diagnosis-button--secondary">
              Back to Cosmog
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
