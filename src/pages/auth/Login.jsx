import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";

import { useAuthContext } from "../../context/AuthContext";
import logo from "../../assets/images/software-empire.png"

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login({
        email,
        password,
      });

      navigate("/account");
    } catch (err) {
      console.error("Login failed:", err);

      setError(
        err?.message ||
          "Unable to sign in. Please check your email and password.",
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

              <img
                src={logo}
                alt="Software Empire"
                className="auth-logo-image"
              />
            </Link>

            <div className="auth-brand-content">
              <span className="eyebrow">SOFTWARE INTELLIGENCE PLATFORM</span>

              <h1>
                Make better software
                <span> decisions.</span>
              </h1>

              <p>
                Discover, compare and evaluate software solutions built for
                modern businesses.
              </p>

              <div className="auth-benefits">
                <div>
                  <CheckCircle2 size={18} />
                  <span>Compare software side by side</span>
                </div>

                <div>
                  <CheckCircle2 size={18} />
                  <span>Get recommendations for your business</span>
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

        {/* RIGHT — LOGIN */}
        <section className="auth-form-section">
          <div className="auth-form-wrapper">
            <Link to="/" className="auth-back">
              <ArrowLeft size={16} />
              Back to home
            </Link>

            <div className="auth-card">
              <div className="auth-card-header">
                <span className="eyebrow">WELCOME BACK</span>

                <h2>Sign in to your account</h2>

                <p>
                  Continue managing your software research and recommendations.
                </p>
              </div>

              {error && (
                <div className="auth-error" role="alert">
                  <strong>Sign in failed</strong>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={submit} className="auth-form">
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
                  <div className="auth-field-label">
                    <label htmlFor="password">Password</label>

                    <button
                      type="button"
                      className="auth-forgot"
                      onClick={() => {
                        alert("Password reset will be available soon.");
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="password-field">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Enter your password"
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

                {/* SUBMIT */}
                <button
                  className="auth-submit"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="auth-spinner" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              {/* REGISTER */}
              <div className="auth-register">
                <span>Don't have an account?</span>

                <Link to="/register">Create an account</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
