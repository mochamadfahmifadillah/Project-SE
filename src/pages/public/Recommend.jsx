import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CircleHelp,
  Factory,
  HeartHandshake,
  Landmark,
  LockKeyhole,
  Network,
  ShieldCheck,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

import PublicLayout from "../../layouts/PublicLayout";
import RecommendationResult from "./RecommendationResult";
import { getRecommendations } from "../../services/recommendationService";
import tokopediaLogo from "../../assets/images/tokopedia.png";
import bukalapakLogo from "../../assets/images/bukalapak.png";
import travelokaLogo from "../../assets/images/traveloka.webp";
import ruangguruLogo from "../../assets/images/ruangguru.png";
import jntLogo from "../../assets/images/jnt-express.png";
import sociollaLogo from "../../assets/images/sociolla.webp";
import mekariLogo from "../../assets/images/mekari.png";
import bcaLogo from "../../assets/images/bca.png";

/*
|--------------------------------------------------------------------------
| Recommendation Questions
|--------------------------------------------------------------------------
|
| 8 Questions
| + Summary
| + Results
| = 10 Steps
|
|--------------------------------------------------------------------------
*/

const questions = [
  {
    key: "business_type",
    label: "Business Type",
    question: "What type of business is your company?",
    description: "This helps us understand your operational context better.",
    options: [
      {
        value: "B2B",
        title: "B2B",
        description: "Business to Business",
        icon: Building2,
      },
      {
        value: "B2C",
        title: "B2C",
        description: "Business to Consumer",
        icon: Users,
      },
      {
        value: "B2B2C",
        title: "B2B2C",
        description: "Business to Business to Consumer",
        icon: Network,
      },
      {
        value: "Non-profit",
        title: "Non-profit",
        description: "Organization",
        icon: HeartHandshake,
      },
      {
        value: "Government",
        title: "Government",
        description: "Organization",
        icon: Landmark,
      },
      {
        value: "Other",
        title: "Other",
        description: "Please specify",
        icon: CircleHelp,
      },
    ],
  },

  {
    key: "business_size",
    label: "Business Size",
    question: "How large is your organization?",
    description:
      "Tell us about the size of your organization so we can find software that fits your scale.",
    options: [
      {
        value: "1-20",
        title: "1–20 employees",
        description: "Small business",
        icon: Users,
      },
      {
        value: "21-100",
        title: "21–100 employees",
        description: "Growing business",
        icon: Users,
      },
      {
        value: "101-500",
        title: "101–500 employees",
        description: "Medium business",
        icon: Users,
      },
      {
        value: "500+",
        title: "500+ employees",
        description: "Enterprise",
        icon: Building2,
      },
    ],
  },

  {
    key: "industry",
    label: "Industry",
    question: "Which industry best describes your business?",
    description:
      "Industry context helps us prioritize software commonly used in your field.",
    options: [
      {
        value: "Technology",
        title: "Technology",
        description: "Software, IT & digital",
        icon: Sparkles,
      },
      {
        value: "Retail",
        title: "Retail",
        description: "Retail & commerce",
        icon: Building2,
      },
      {
        value: "Finance",
        title: "Finance",
        description: "Financial services",
        icon: WalletCards,
      },
      {
        value: "Manufacturing",
        title: "Manufacturing",
        description: "Production & industry",
        icon: Factory,
      },
      {
        value: "Healthcare",
        title: "Healthcare",
        description: "Healthcare & medical",
        icon: HeartHandshake,
      },
      {
        value: "Other",
        title: "Other",
        description: "Another industry",
        icon: CircleHelp,
      },
    ],
  },

  {
    key: "key_needs",
    label: "Key Needs",
    question: "What are your key business needs?",
    description:
      "Choose the area where better software could make the biggest difference.",
    options: [
      {
        value: "Sales & CRM",
        title: "Sales & CRM",
        description: "Manage leads and customers",
        icon: Users,
      },
      {
        value: "Finance & ERP",
        title: "Finance & ERP",
        description: "Manage finance and resources",
        icon: WalletCards,
      },
      {
        value: "HR & People",
        title: "HR & People",
        description: "Manage employees and HR",
        icon: Users,
      },
      {
        value: "Operations",
        title: "Operations",
        description: "Improve daily operations",
        icon: Factory,
      },
      {
        value: "Marketing",
        title: "Marketing",
        description: "Grow and engage customers",
        icon: Sparkles,
      },
      {
        value: "Project Management",
        title: "Project Management",
        description: "Plan and manage projects",
        icon: Network,
      },
    ],
  },

  {
    key: "must_have_features",
    label: "Must-have Features",
    question: "Which features are must-haves for you?",
    description: "Select the capabilities that are essential to your workflow.",
    multiple: true,
    options: [
      {
        value: "Automation",
        title: "Automation",
        description: "Automate repetitive tasks",
        icon: Sparkles,
      },
      {
        value: "Analytics",
        title: "Analytics",
        description: "Reports and insights",
        icon: WalletCards,
      },
      {
        value: "Collaboration",
        title: "Collaboration",
        description: "Team collaboration",
        icon: Users,
      },
      {
        value: "Mobile",
        title: "Mobile App",
        description: "Work from anywhere",
        icon: Network,
      },
      {
        value: "AI",
        title: "AI Features",
        description: "AI-powered capabilities",
        icon: Sparkles,
      },
      {
        value: "Security",
        title: "Security",
        description: "Advanced security",
        icon: ShieldCheck,
      },
    ],
  },

  {
    key: "budget",
    label: "Budget",
    question: "What is your preferred software budget?",
    description:
      "Your budget helps us recommend solutions that are realistic for your organization.",
    options: [
      {
        value: "Free",
        title: "Free / Low Cost",
        description: "Best for starting out",
        icon: WalletCards,
      },
      {
        value: "$10–30",
        title: "$10–30 per user",
        description: "Affordable solutions",
        icon: WalletCards,
      },
      {
        value: "$30–75",
        title: "$30–75 per user",
        description: "Mid-range solutions",
        icon: WalletCards,
      },
      {
        value: "$75+",
        title: "$75+ per user",
        description: "Premium solutions",
        icon: WalletCards,
      },
    ],
  },

  {
    key: "team_size",
    label: "Team Size",
    question: "How large is the team that will use the software?",
    description:
      "This helps us estimate the scale and collaboration requirements.",
    options: [
      {
        value: "1-5",
        title: "1–5 users",
        description: "Small team",
        icon: Users,
      },
      {
        value: "6-20",
        title: "6–20 users",
        description: "Growing team",
        icon: Users,
      },
      {
        value: "21-50",
        title: "21–50 users",
        description: "Medium team",
        icon: Users,
      },
      {
        value: "50+",
        title: "50+ users",
        description: "Large team",
        icon: Users,
      },
    ],
  },

  {
    key: "integrations",
    label: "Integrations",
    question: "Which integrations are important to you?",
    description: "Choose the tools your new software should work with.",
    multiple: true,
    options: [
      {
        value: "Google Workspace",
        title: "Google Workspace",
        description: "Gmail, Drive & Calendar",
        icon: Network,
      },
      {
        value: "Microsoft 365",
        title: "Microsoft 365",
        description: "Microsoft productivity tools",
        icon: Network,
      },
      {
        value: "Slack",
        title: "Slack",
        description: "Team communication",
        icon: Network,
      },
      {
        value: "WhatsApp",
        title: "WhatsApp",
        description: "Customer communication",
        icon: Network,
      },
      {
        value: "Accounting",
        title: "Accounting",
        description: "Accounting systems",
        icon: WalletCards,
      },
      {
        value: "API",
        title: "API Access",
        description: "Custom integrations",
        icon: Network,
      },
    ],
  },
];

/* =========================================================
   TRUSTED BUSINESSES
========================================================= */

const trustedBusinesses = [
  {
    name: "Tokopedia",
    logo: tokopediaLogo,
  },
  {
    name: "Bukalapak",
    logo: bukalapakLogo,
  },
  {
    name: "Traveloka",
    logo: travelokaLogo,
  },
  {
    name: "Ruangguru",
    logo: ruangguruLogo,
  },
  {
    name: "J&T Express",
    logo: jntLogo,
  },
  {
    name: "Sociolla",
    logo: sociollaLogo,
  },
  {
    name: "Mekari",
    logo: mekariLogo,
  },
  {
    name: "BCA",
    logo: bcaLogo,
  },
];
/*
|--------------------------------------------------------------------------
| Empty Answers
|--------------------------------------------------------------------------
*/

const createEmptyAnswers = () =>
  questions.reduce((acc, question) => {
    acc[question.key] = question.multiple ? [] : "";
    return acc;
  }, {});

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function Recommend() {
  /*
   * ---------------------------------------------------------------
   * STEP STRUCTURE
   * ---------------------------------------------------------------
   *
   * 0 - 7  = 8 questions
   * 8      = Summary
   * 9      = Results
   *
   * UI displays:
   *
   * 1 - 8  = Questions
   * 9      = Summary
   * 10     = Results
   *
   * ---------------------------------------------------------------
   */

  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState(createEmptyAnswers());

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /*
   * Total wizard steps.
   *
   * 8 questions + 1 summary + 1 result = 10
   */
  const totalSteps = questions.length + 2;

  /*
   * Summary is step index 8.
   */
  const isSummary = step === questions.length;

  /*
   * Result is step index 9.
   */
  const isResult = step === questions.length + 1;

  /*
   * Current question only exists on question steps.
   */
  const currentQuestion = !isSummary && !isResult ? questions[step] : null;

  /*
   |--------------------------------------------------------------------------
   | Progress
   |--------------------------------------------------------------------------
   */

  const progress = Math.min(((step + 1) / totalSteps) * 100, 100);

  /*
   |--------------------------------------------------------------------------
   | Current Answer
   |--------------------------------------------------------------------------
   */

  const currentAnswer = currentQuestion ? answers[currentQuestion.key] : null;

  /*
   |--------------------------------------------------------------------------
   | Check Current Answer
   |--------------------------------------------------------------------------
   */

  const hasAnswer = currentQuestion
    ? currentQuestion.multiple
      ? Array.isArray(currentAnswer) && currentAnswer.length > 0
      : Boolean(currentAnswer)
    : true;

  /*
   |--------------------------------------------------------------------------
   | Choose Answer
   |--------------------------------------------------------------------------
   */

  const chooseAnswer = (value) => {
    if (!currentQuestion || loading) {
      return;
    }

    setError("");

    setAnswers((current) => {
      /*
       * Multiple selection
       */
      if (currentQuestion.multiple) {
        const selected = current[currentQuestion.key] || [];

        const exists = selected.includes(value);

        return {
          ...current,

          [currentQuestion.key]: exists
            ? selected.filter((item) => item !== value)
            : [...selected, value],
        };
      }

      /*
       * Single selection
       */
      return {
        ...current,
        [currentQuestion.key]: value,
      };
    });
  };

  /*
   |--------------------------------------------------------------------------
   | Get Display Value
   |--------------------------------------------------------------------------
   */

  const getAnswerLabel = (question) => {
    const value = answers[question.key];

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return "Not selected";
      }

      return value.join(", ");
    }

    return value || "Not selected";
  };

  /*
   |--------------------------------------------------------------------------
   | Continue
   |--------------------------------------------------------------------------
   */

  const handleContinue = async () => {
    if (loading) {
      return;
    }

    setError("");

    /*
     * ===============================================================
     * QUESTION STEP
     * ===============================================================
     */

    if (!isSummary && !isResult) {
      if (!hasAnswer) {
        setError("Please select an answer before continuing.");

        return;
      }

      setStep((current) => current + 1);

      return;
    }

    /*
     * ===============================================================
     * SUMMARY STEP
     * ===============================================================
     *
     * Submit answers to backend.
     */

    if (isSummary) {
      try {
        setLoading(true);

        console.log("========================================");
        console.log("SOFTWARE EMPIRE - RECOMMENDATION REQUEST");
        console.log("========================================");

        console.log("Answers:", answers);

        /*
         * Call recommendation API.
         */
        const response = await getRecommendations(answers);

        console.log("========================================");
        console.log("SOFTWARE EMPIRE - RECOMMENDATION RESPONSE");
        console.log("========================================");

        console.log("Response:", response);

        /*
         * ---------------------------------------------------------
         * Normalize API response
         * ---------------------------------------------------------
         *
         * Supports:
         *
         * {
         *   recommendations: [...]
         * }
         *
         * {
         *   data: {
         *     recommendations: [...]
         *   }
         * }
         *
         * [...]
         */

        let normalizedResult = response;

        /*
         * Direct array response
         */
        if (Array.isArray(response)) {
          normalizedResult = {
            recommendations: response,
          };
        }

        /*
         * Laravel wrapped response:
         *
         * {
         *   data: {
         *      recommendations: [...]
         *   }
         * }
         */
        if (
          normalizedResult?.data &&
          typeof normalizedResult.data === "object"
        ) {
          if (Array.isArray(normalizedResult.data?.recommendations)) {
            normalizedResult = normalizedResult.data;
          }
        }

        /*
         * If API returned:
         *
         * {
         *   data: [...]
         * }
         */
        if (Array.isArray(normalizedResult?.data)) {
          normalizedResult = {
            recommendations: normalizedResult.data,
          };
        }

        /*
         * Safety check.
         */
        if (!normalizedResult || typeof normalizedResult !== "object") {
          throw new Error("Recommendation API returned an invalid response.");
        }

        /*
         * Ensure recommendations exists.
         */
        if (!Array.isArray(normalizedResult.recommendations)) {
          normalizedResult = {
            ...normalizedResult,
            recommendations: [],
          };
        }

        console.log("Normalized recommendation result:", normalizedResult);

        /*
         * Save result.
         */
        setResult(normalizedResult);

        /*
         * Move to step 10.
         *
         * Array index:
         *
         * 0-7 = questions
         * 8   = summary
         * 9   = results
         */
        setStep(questions.length + 1);
      } catch (err) {
        console.error("========================================");

        console.error("SOFTWARE EMPIRE - RECOMMENDATION ERROR");

        console.error("========================================");

        console.error(err);

        console.error("API response:", err?.response?.data);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to generate recommendations. Please try again.",
        );
      } finally {
        setLoading(false);
      }

      return;
    }
  };

  /*
   |--------------------------------------------------------------------------
   | Back
   |--------------------------------------------------------------------------
   */

  const handleBack = () => {
    if (step === 0 || loading) {
      return;
    }

    /*
     * If somehow back is pressed from result,
     * return to summary.
     */
    if (isResult) {
      setStep(questions.length);

      return;
    }

    setStep((current) => current - 1);

    setError("");
  };

  /*
   |--------------------------------------------------------------------------
   | Retake
   |--------------------------------------------------------------------------
   */

  const handleRetake = () => {
    setStep(0);

    setAnswers(createEmptyAnswers());

    setResult(null);

    setError("");

    setLoading(false);
  };

  /*
   |--------------------------------------------------------------------------
   | Result
   |--------------------------------------------------------------------------
   |
   | IMPORTANT:
   |
   | We pass `currentStep={10}` to the result page so it can show
   | Results as the final wizard step.
   |
   */

  if (isResult && result) {
    return (
      <RecommendationResult
        answers={answers}
        result={result}
        onRetake={handleRetake}
        currentStep={10}
        totalSteps={10}
      />
    );
  }

  /*
   |--------------------------------------------------------------------------
   | Render Wizard
   |--------------------------------------------------------------------------
   */

  return (
    <PublicLayout>
      <main className="recommend-page">
        <div className="recommend-container">
          {/* =====================================================
              HEADER
          ====================================================== */}

          <section className="recommend-stepper">
            <div className="stepper-top">
              <div>
                <span className="recommend-eyebrow">SMART RECOMMENDATION</span>

                <h1>Recommendation Wizard</h1>
              </div>

              <div className="step-counter">
                Step {step + 1} of {totalSteps}
              </div>
            </div>

            {/* =====================================================
                STEPPER
            ====================================================== */}

            <div
              className="stepper"
              style={{
                "--recommend-progress": `${progress}%`,
              }}
            >
              {/* QUESTIONS 1-8 */}

              {questions.map((question, index) => {
                const active = index === step;

                const completed = index < step;

                return (
                  <div
                    key={question.key}
                    className={[
                      "step-item",
                      active ? "active" : "",
                      completed ? "completed" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <div className="step-circle">
                      {completed ? (
                        <Check size={13} strokeWidth={3} />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <span>{question.label}</span>
                  </div>
                );
              })}

              {/* =================================================
                  SUMMARY - STEP 9
              ================================================== */}

              <div
                className={[
                  "step-item",
                  isSummary ? "active" : "",
                  step > questions.length ? "completed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="step-circle">
                  {step > questions.length ? (
                    <Check size={13} strokeWidth={3} />
                  ) : (
                    9
                  )}
                </div>

                <span>Summary</span>
              </div>

              {/* =================================================
                  RESULTS - STEP 10
              ================================================== */}

              <div
                className={["step-item", isResult ? "active" : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="step-circle">10</div>

                <span>Results</span>
              </div>
            </div>
          </section>

          {/* =====================================================
              WIZARD CARD
          ====================================================== */}

          <section className="recommend-card">
            {/* ===================================================
                LEFT INFORMATION PANEL
            ==================================================== */}

            <aside className="recommend-info">
              <div className="recommend-illustration">
                <div className="building-main">
                  <div className="building-roof" />

                  <div className="building-body">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="mini-building left">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="mini-building right">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="cloud cloud-one" />

                <div className="cloud cloud-two" />
              </div>

              <div className="why-box">
                <div className="why-title">
                  <CircleHelp size={17} />

                  <strong>Why we ask this?</strong>
                </div>

                <p>
                  Your answers help us find software that truly fits your
                  business needs.
                </p>

                <div className="why-list">
                  <div>
                    <Sparkles size={15} />

                    <span>Personalized recommendation</span>
                  </div>

                  <div>
                    <Users size={15} />

                    <span>Save time & effort</span>
                  </div>

                  <div>
                    <Check size={15} />

                    <span>More accurate match</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* ===================================================
                QUESTION / SUMMARY
            ==================================================== */}

            <div className="recommend-question">
              {!isSummary ? (
                <>
                  <div className="question-heading">
                    <span className="question-eyebrow">
                      {currentQuestion.label}
                    </span>

                    <h2>{currentQuestion.question}</h2>

                    <p>{currentQuestion.description}</p>
                  </div>

                  {/* OPTIONS */}

                  <div className="recommend-options">
                    {currentQuestion.options.map((option) => {
                      const OptionIcon = option.icon;

                      const selected = currentQuestion.multiple
                        ? currentAnswer.includes(option.value)
                        : currentAnswer === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          className={[
                            "recommend-option",
                            selected ? "selected" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          onClick={() => chooseAnswer(option.value)}
                          disabled={loading}
                        >
                          <span className="option-icon">
                            <OptionIcon size={23} strokeWidth={1.8} />
                          </span>

                          <span className="option-copy">
                            <strong>{option.title}</strong>

                            <small>{option.description}</small>
                          </span>

                          <span className="option-check">
                            {selected && <Check size={13} strokeWidth={3} />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  {/* =================================================
                      SUMMARY
                  ================================================== */}

                  <div className="question-heading summary-heading">
                    <span className="question-eyebrow">Summary</span>

                    <h2>Review your answers</h2>

                    <p>
                      Make sure everything looks right before we find the best
                      software for you.
                    </p>
                  </div>

                  <div className="recommend-summary">
                    {questions.map((question, index) => (
                      <div key={question.key} className="summary-item">
                        <div className="summary-number">{index + 1}</div>

                        <div className="summary-content">
                          <span>{question.label}</span>

                          <strong>{getAnswerLabel(question)}</strong>
                        </div>

                        <button
                          type="button"
                          className="summary-edit"
                          onClick={() => setStep(index)}
                          disabled={loading}
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* =====================================================
                  ERROR
              ====================================================== */}

              {error && (
                <div className="recommend-error">
                  <strong>Unable to generate recommendations</strong>

                  <span>{error}</span>
                </div>
              )}

              {/* =====================================================
                  ACTIONS
              ====================================================== */}

              <div className="recommend-actions">
                <button
                  type="button"
                  className="recommend-back"
                  disabled={step === 0 || loading}
                  onClick={handleBack}
                >
                  <ArrowLeft size={17} />
                  Back
                </button>

                <div className="action-progress">
                  {Array.from({
                    length: totalSteps,
                  }).map((_, index) => (
                    <span
                      key={index}
                      className={index <= step ? "active" : ""}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="recommend-next"
                  disabled={loading || (!isSummary && !hasAnswer)}
                  onClick={handleContinue}
                >
                  {loading
                    ? "Finding..."
                    : isSummary
                      ? "Get My Recommendations"
                      : "Next"}

                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </section>

          {/* =====================================================
              SECURITY
          ====================================================== */}

          <section className="recommend-security">
            <div className="security-icon">
              <ShieldCheck size={27} />
            </div>

            <div className="security-copy">
              <strong>Your data is safe with us</strong>

              <p>
                We value your privacy and never share your information with
                third parties.
              </p>
            </div>

            <div className="security-items">
              <div>
                <ShieldCheck size={21} />

                <span>
                  <strong>GDPR</strong>
                  Compliant
                </span>
              </div>

              <div>
                <LockKeyhole size={21} />

                <span>
                  <strong>Secure</strong>
                  Encryption
                </span>
              </div>

              <div>
                <ShieldCheck size={21} />

                <span>
                  <strong>Privacy</strong>
                  Protected
                </span>
              </div>
            </div>
          </section>

          {/* =====================================================
              TRUSTED
          ====================================================== */}

          <section className="home-trusted">
            <div className="home-container">
              <p>Trusted by businesses worldwide</p>

              <div className="home-trusted-logos">
                {trustedBusinesses.map((business) => (
                  <div className="home-trusted-logo" key={business.name}>
                    <img
                      src={business.logo}
                      alt={business.name}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* =====================================================
              JOURNEY
          ====================================================== */}

          <section className="recommend-journey">
            <div>
              <span className="journey-icon blue">
                <CircleHelp size={22} />
              </span>

              <span>
                <strong>Answer Questions</strong>

                <small>about your business</small>
              </span>
            </div>

            <ArrowRight />

            <div>
              <span className="journey-icon green">
                <Sparkles size={22} />
              </span>

              <span>
                <strong>Our AI analyzes</strong>

                <small>thousands of software</small>
              </span>
            </div>

            <ArrowRight />

            <div>
              <span className="journey-icon purple">
                <Sparkles size={22} />
              </span>

              <span>
                <strong>Get personalized</strong>

                <small>recommendations</small>
              </span>
            </div>

            <ArrowRight />

            <div>
              <span className="journey-icon orange">
                <WalletCards size={22} />
              </span>

              <span>
                <strong>Compare & choose</strong>

                <small>the best fit</small>
              </span>
            </div>
          </section>
        </div>
      </main>
    </PublicLayout>
  );
}
