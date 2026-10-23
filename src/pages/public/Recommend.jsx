
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
*/

const questions = [
  {
    key: "business_type",
    label: "Business Type",
    question: "What type of business is your company?",
    description:
      "This helps us understand your operational context better.",
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
    description:
      "Select the capabilities that are essential to your workflow.",
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
    description:
      "Choose the tools your new software should work with.",
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

/*
|--------------------------------------------------------------------------
| Trusted Businesses
|--------------------------------------------------------------------------
*/

const trustedBusinesses = [
  { name: "Tokopedia", logo: tokopediaLogo },
  { name: "Bukalapak", logo: bukalapakLogo },
  { name: "Traveloka", logo: travelokaLogo },
  { name: "Ruangguru", logo: ruangguruLogo },
  { name: "J&T Express", logo: jntLogo },
  { name: "Sociolla", logo: sociollaLogo },
  { name: "Mekari", logo: mekariLogo },
  { name: "BCA", logo: bcaLogo },
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
| Normalize Recommendation Response
|--------------------------------------------------------------------------
*/

const normalizeRecommendationResponse = (response) => {
  if (Array.isArray(response)) {
    return { recommendations: response };
  }

  if (!response || typeof response !== "object") {
    throw new Error("Recommendation API returned an invalid response.");
  }

  let normalized = response;

  if (
    normalized.data &&
    typeof normalized.data === "object" &&
    !Array.isArray(normalized.data)
  ) {
    normalized = normalized.data;
  }

  if (Array.isArray(normalized.data)) {
    return { recommendations: normalized.data };
  }

  if (!Array.isArray(normalized.recommendations)) {
    return {
      ...normalized,
      recommendations: [],
    };
  }

  return normalized;
};

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

export default function Recommend() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(createEmptyAnswers);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = questions.length + 2;
  const isSummary = step === questions.length;
  const isResult = step === questions.length + 1;

  const currentQuestion =
    !isSummary && !isResult ? questions[step] : null;

  const currentAnswer = currentQuestion
    ? answers[currentQuestion.key]
    : null;

  const progress = Math.min(((step + 1) / totalSteps) * 100, 100);

  /*
  |--------------------------------------------------------------------------
  | Choose Answer
  |--------------------------------------------------------------------------
  */

  const chooseAnswer = (value) => {
    if (!currentQuestion || loading) return;

    setError("");

    setAnswers((current) => {
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

      return {
        ...current,
        [currentQuestion.key]: value,
      };
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Get Answer Label
  |--------------------------------------------------------------------------
  */

  const getAnswerLabel = (question) => {
    const value = answers[question.key];

    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "Belum dijawab";
    }

    return value || "Belum dijawab";
  };

  /*
  |--------------------------------------------------------------------------
  | Skip Question
  |--------------------------------------------------------------------------
  */

  const handleSkip = () => {
    if (!currentQuestion || loading) return;

    setError("");
    setStep((current) => current + 1);
  };

  /*
  |--------------------------------------------------------------------------
  | Continue / Generate Recommendations
  |--------------------------------------------------------------------------
  */

  const handleContinue = async () => {
    if (loading) return;

    setError("");

    // Semua pertanyaan bersifat opsional.
    if (!isSummary && !isResult) {
      setStep((current) => current + 1);
      return;
    }

    if (!isSummary) return;

    try {
      setLoading(true);

      console.log("Software Empire - Recommendation Request");
      console.log("Answers:", answers);

      const response = await getRecommendations(answers);
      const normalizedResult =
        normalizeRecommendationResponse(response);

      console.log(
        "Software Empire - Normalized Recommendation Result:",
        normalizedResult,
      );

      setResult(normalizedResult);
      setStep(questions.length + 1);
    } catch (err) {
      console.error("Software Empire - Recommendation Error:", err);
      console.error("API response:", err?.response?.data);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to generate recommendations. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Back
  |--------------------------------------------------------------------------
  */

  const handleBack = () => {
    if (step === 0 || loading) return;

    if (isResult) {
      setStep(questions.length);
      setError("");
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
  | Results Page
  |--------------------------------------------------------------------------
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
          {/* Header */}
          <section className="recommend-stepper">
            <div className="stepper-top">
              <div>
                <span className="recommend-eyebrow">
                  SMART RECOMMENDATION
                </span>
                <h1>Recommendation Wizard</h1>
              </div>

              <div className="step-counter">
                Step {step + 1} of {totalSteps}
              </div>
            </div>

            <div
              className="stepper"
              style={{ "--recommend-progress": `${progress}%` }}
            >
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

          {/* Wizard Card */}
          <section className="recommend-card">
            {/* Left Information Panel */}
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

            {/* Question / Summary */}
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

                  <div className="recommend-options">
                    {currentQuestion.options.map((option) => {
                      const OptionIcon = option.icon;

                      const selected = currentQuestion.multiple
                        ? Array.isArray(currentAnswer) &&
                          currentAnswer.includes(option.value)
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
                            {selected && (
                              <Check size={13} strokeWidth={3} />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  {/* Summary */}
                  <div className="question-heading summary-heading">
                    <span className="question-eyebrow">Summary</span>
                    <h2>Review your answers</h2>
                    <p>
                      Review your answers before we find software that may
                      fit your needs. You can leave any question unanswered.
                    </p>
                  </div>

                  <div className="recommend-summary">
                    {questions.map((question, index) => {
                      const answerLabel = getAnswerLabel(question);
                      const unanswered = answerLabel === "Belum dijawab";

                      return (
                        <div
                          key={question.key}
                          className="summary-item"
                        >
                          <div className="summary-number">
                            {index + 1}
                          </div>

                          <div className="summary-content">
                            <span>{question.label}</span>
                            <strong
                              className={
                                unanswered ? "summary-unanswered" : ""
                              }
                            >
                              {answerLabel}
                            </strong>
                          </div>

                          <button
                            type="button"
                            className="summary-edit"
                            onClick={() => {
                              setError("");
                              setStep(index);
                            }}
                            disabled={loading}
                          >
                            Edit
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Error */}
              {error && (
                <div className="recommend-error" role="alert">
                  <strong>Unable to generate recommendations</strong>
                  <span>{error}</span>
                </div>
              )}

              {/* Actions */}
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
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <span
                      key={index}
                      className={index <= step ? "active" : ""}
                    />
                  ))}
                </div>

                <div className="recommend-action-buttons">
                  {!isSummary && (
                    <button
                      type="button"
                      className="recommend-skip"
                      disabled={loading}
                      onClick={handleSkip}
                    >
                      Skip
                    </button>
                  )}

                  <button
                    type="button"
                    className="recommend-next"
                    disabled={loading}
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
            </div>
          </section>

          {/* Security */}
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

          {/* Trusted Businesses */}
          <section className="home-trusted">
            <div className="home-container">
              <p>Trusted by businesses worldwide</p>

              <div className="home-trusted-logos">
                {trustedBusinesses.map((business) => (
                  <div
                    className="home-trusted-logo"
                    key={business.name}
                  >
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

          {/* Journey */}
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
                <small>software options</small>
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
