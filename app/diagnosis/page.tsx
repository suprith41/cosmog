"use client";

import { useEffect, useRef, useState } from "react";

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
    <main className="px-6 pb-24 pt-28 text-[#1a1a1a] sm:px-8 sm:pb-28 sm:pt-32">
      <div
        className={`mx-auto w-full ${
          isResultsView ? "max-w-[1280px]" : "max-w-[580px]"
        }`}
      >
        <div
          className={`animate-card-up ${
            isResultsView
              ? "bg-transparent p-0"
              : "rounded-[28px] border border-[#ece7df] bg-white p-7 shadow-[0_30px_90px_rgba(84,63,30,0.09)] sm:p-10"
          }`}
        >
          {!analysis || !analysisSections ? (
            <>
              <div className={`step-panel ${stepMotion}`}>
                <div className="text-center">
                  <p className="font-ui text-sm text-[#6b6b6b]">
                    Step {stepIndex + 1} of {steps.length}
                  </p>
                  <h1 className="mt-4 font-heading text-[clamp(32px,4vw,48px)] font-light italic leading-[1.2] tracking-tight text-[#1a1a1a] text-balance">
                    {currentStep.prompt}
                  </h1>
                  <p className="mx-auto mt-4 max-w-[460px] text-sm leading-7 text-[#6b6b6b]">
                    {currentStep.helper}
                  </p>
                </div>

                <div className="mt-10">
                  {"options" in currentStep ? (
                    <div className="space-y-3">
                      {currentStep.options.map((option) => {
                        const selected = formData[currentStep.key] === option;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => updateField(currentStep.key, option)}
                            className={`w-full rounded-[18px] border px-5 py-4 text-left font-ui text-[15px] leading-7 transition duration-200 ease-out ${
                              selected
                                ? "border-[#111111] bg-[#111111] text-white"
                                : "border-[#e0ddd8] bg-white text-[#1a1a1a] hover:translate-x-[6px] hover:shadow-[0_14px_28px_rgba(17,17,17,0.06)]"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <label className="block">
                      <span className="sr-only">{currentStep.prompt}</span>
                      <textarea
                        value={formData.description}
                        onChange={(event) =>
                          updateField("description", event.target.value)
                        }
                        rows={6}
                        placeholder={currentStep.placeholder}
                        className="w-full border-0 border-b border-[#ddd7cf] bg-transparent px-0 pb-4 text-[15px] leading-8 text-[#1a1a1a] outline-none transition placeholder:text-[#9a948b] focus:border-[#111111]"
                      />
                    </label>
                  )}
                </div>

                {error ? (
                  <p className="mt-6 text-center text-sm text-[#8a4b40]">{error}</p>
                ) : null}

                <div className="mt-10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={stepIndex === 0 || isSubmitting || isStepAnimating}
                    className="inline-flex min-w-24 items-center justify-center rounded-full border border-[#dfdad2] bg-white px-5 py-3 font-ui text-sm font-medium text-[#44403b] transition hover:shadow-[0_10px_22px_rgba(17,17,17,0.05)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Back
                  </button>

                  {isLastStep ? (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting || isStepAnimating}
                      className="inline-flex min-w-36 items-center justify-center rounded-full bg-[#111111] px-6 py-3 font-ui text-sm font-medium text-white transition hover:bg-[#000000] disabled:cursor-wait disabled:opacity-70"
                    >
                      {isSubmitting ? "Generating..." : "Generate diagnosis"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isStepAnimating}
                      className="inline-flex min-w-24 items-center justify-center rounded-full bg-[#111111] px-6 py-3 font-ui text-sm font-medium text-white transition hover:bg-[#000000] disabled:opacity-70"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="px-0 py-[60px] md:px-10 lg:px-12">
                <div className="text-center">
                  <p className="font-ui text-sm text-[#6b6b6b]">Diagnosis complete</p>
                  <h1 className="mt-4 font-heading text-3xl font-light italic leading-tight tracking-tight text-balance sm:text-4xl">
                    Your workflow diagnosis
                  </h1>
                  <p className="mx-auto mt-4 max-w-[640px] text-sm leading-7 text-[#6b6b6b]">
                    A structured diagnosis generated from the five answers you
                    provided.
                  </p>
                </div>

                <div className="mt-12">
                  <div className="mb-12">
                    <h2 className="mb-6 font-ui text-[11px] font-normal uppercase tracking-[0.2em] text-[#9a8f85]">
                      TOP ISSUES
                    </h2>
                    {analysisSections.issues.length ? (
                      <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {analysisSections.issues.map((issue, index) => (
                          <li
                            key={`${issue.title}-${issue.description}-${index}`}
                            className="rounded-[12px] border border-[#e8e4de] border-l-[3px] border-l-[#1a1a1a] bg-white p-7 text-sm leading-7 text-[#2f2a25]"
                          >
                            <span className="mr-2 font-semibold text-[#111111]">
                              {index + 1}.
                            </span>
                            <span className="inline-block align-top">
                              <span className="font-medium text-[#111111]">
                                {issue.title}
                              </span>
                              {issue.description ? (
                                <span className="block font-light text-[#2f2a25]">
                                  {issue.description}
                                </span>
                              ) : null}
                            </span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="rounded-[12px] border border-[#e8e4de] bg-white p-7 text-sm leading-7 text-[#2f2a25]">
                        The response did not include a separately parsed issues list.
                      </p>
                    )}
                  </div>

                  <div className="mb-12">
                    <h2 className="mb-6 font-ui text-[11px] font-normal uppercase tracking-[0.2em] text-[#9a8f85]">
                      ROOT CAUSE
                    </h2>
                    <p className="rounded-[12px] bg-[#f5f2ec] px-10 py-9 text-[17px] leading-[1.8] text-[#2f2a25]">
                      {analysisSections.rootCause || analysis}
                    </p>
                  </div>

                  <div>
                    <h2 className="mb-6 font-ui text-[11px] font-normal uppercase tracking-[0.2em] text-[#9a8f85]">
                      ACTIONS
                    </h2>
                    {analysisSections.actions.length ? (
                      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {analysisSections.actions.map((action, index) => (
                          <li
                            key={`${action}-${index}`}
                            className="rounded-[12px] border border-[#e8e4de] bg-white p-7 text-sm leading-7 text-[#2f2a25]"
                          >
                            {action}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="rounded-[12px] border border-[#e8e4de] bg-white p-7 text-sm leading-7 text-[#2f2a25]">
                        The response did not include a separately parsed action list.
                      </p>
                    )}
                  </div>

                  {analysisSections.workStyleInsight ? (
                    <div className="mt-12">
                      <h2 className="mb-6 font-ui text-[11px] font-normal uppercase tracking-[0.2em] text-[#9a8f85]">
                        WORK STYLE INSIGHT
                      </h2>
                      <p className="rounded-[12px] bg-[#1a1a1a] px-10 py-9 text-base leading-[1.8] text-white">
                        {analysisSections.workStyleInsight}
                      </p>
                    </div>
                  ) : null}
                </div>

                {!hasStructuredAnalysis ? (
                  <div className="mt-8">
                    <h2 className="font-heading text-base font-semibold italic tracking-[0.08em] text-[#6b6b6b]">
                      FULL RESPONSE
                    </h2>
                    <pre className="mt-4 whitespace-pre-wrap rounded-[20px] border border-[#ece7df] bg-[#fcfbf8] px-5 py-4 text-sm leading-7 text-[#2f2a25]">
                      {analysis}
                    </pre>
                  </div>
                ) : null}

                <div className="mt-10 text-center">
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="font-ui text-sm font-medium text-[#6b6b6b] underline decoration-[#cfc9c1] underline-offset-4 transition hover:text-[#111111]"
                  >
                    Start over
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
