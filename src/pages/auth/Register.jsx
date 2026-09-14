import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";

import { useAuthContext } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuthContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      navigate("/account");
    } catch (err) {
      console.error("Registration failed:", err);

      setError(
        err?.message ||
          "Unable to create your account. Please check your information.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-shell">
        {/* LEFT — BRAND */}
        <section className="auth-brand">
          <div className="auth-brand-inner">
            <Link to="/" className="auth-logo">
              <span className="auth-logo-mark">SE</span>

              <span>Software Empire</span>
            </Link>

            <div className="auth-brand-content">
              <span className="eyebrow">SOFTWARE INTELLIGENCE PLATFORM</span>

              <h1>
                Find the right software
                <span> for your business.</span>
              </h1>

              <p>
                Create your account and start discovering, comparing and
                evaluating software solutions for your business.
              </p>

              <div className="auth-benefits">
                <div>
                  <CheckCircle2 size={18} />
                  <span>Discover software for your business</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Compare software side by side</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Save your software shortlist</span>
                </div>
              </div>
            </div>

            <div className="auth-brand-footer">
              © {new Date().getFullYear()} Software Empire
            </div>
          </div>
        </section>

        {/* RIGHT — REGISTER */}
        <section className="auth-form-section">
          <div className="auth-form-wrapper">
            <Link to="/" className="auth-back">
              <ArrowLeft size={16} />
              Back to home
            </Link>

            <div className="auth-card">
              <div className="auth-card-header">
                <span className="eyebrow">GET STARTED</span>

                <h2>Create your account</h2>

                <p>Start making better software decisions for your business.</p>
              </div>

              {error && (
                <div className="auth-error" role="alert">
                  <strong>Registration failed</strong>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={submit} className="auth-form">
                {/* NAME */}
                <div className="auth-field">
                  <label htmlFor="name">Full name</label>

                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (error) setError("");
                    }}
                    placeholder="Your full name"
                  />
                </div>

                {/* EMAIL */}
                <div className="auth-field">
                  <label htmlFor="email">Work email</label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (error) setError("");
                    }}
                    placeholder="name@company.com"
                  />
                </div>

                {/* PASSWORD */}
                <div className="auth-field">
                  <label htmlFor="password">Password</label>

                  <div className="password-field">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Minimum 8 characters"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowPassword((current) => !current)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="auth-field">
                  <label htmlFor="password_confirmation">
                    Confirm password
                  </label>

                  <div className="password-field">
                    <input
                      id="password_confirmation"
                      type={showConfirmation ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={passwordConfirmation}
                      onChange={(event) => {
                        setPasswordConfirmation(event.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Confirm your password"
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      aria-label={
                        showConfirmation ? "Hide password" : "Show password"
                      }
                      onClick={() => setShowConfirmation((current) => !current)}
                    >
                      {showConfirmation ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <button
                  className="auth-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="auth-spinner" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </button>
              </form>

              {/* LOGIN */}
              <div className="auth-register">
                <span>Already have an account?</span>

                <Link to="/login">Sign in</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
