"use client";

import { useRef, useState } from "react";

const RESPONSE_FIELDS = {
  id: "id",
  password: "password",
};

const SIGNUP_PATH = "/api/signup";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState(null);
  const submittingRef = useRef(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (submittingRef.current || credentials) return;
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").trim();
    if (!apiBase) {
      setError(
        "The signup service is not configured yet. Please contact NACOS support.",
      );
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setError("");

    const signupUrl = `${apiBase.replace(/\/+$/, "")}${SIGNUP_PATH}`;

    try {
      const response = await fetch(signupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (response.status !== 201) {
        const backendMessage =
          payload && typeof payload.message === "string" && payload.message.trim()
            ? payload.message
            : "";
        throw new Error(
          backendMessage || `We couldn’t generate your credentials (HTTP ${response.status}). Please try again.`,
        );
      }

      const id = payload?.[RESPONSE_FIELDS.id];
      const password = payload?.[RESPONSE_FIELDS.password];
      if (
        id === undefined ||
        id === null ||
        String(id).trim() === "" ||
        password === undefined ||
        password === null ||
        String(password).trim() === ""
      ) {
        throw new Error(
          "The server confirmed your signup but did not return a Student ID and password. Please contact NACOS support.",
        );
      }

      setCredentials({ id, password });
    } catch (submitError) {
      setError(
        submitError instanceof TypeError
          ? "We couldn’t connect to the signup service. Check your connection and try again."
          : submitError instanceof Error
            ? submitError.message
            : "Something went wrong while generating your credentials. Please try again.",
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page-shell">
      <header className="masthead">
        <div className="brand" aria-label="Kwara State University NACOS">
          <div className="brand-seal" aria-hidden="true">
            KW
          </div>
          <div>
            <p className="brand-name">KWASU · NACOS</p>
            <p className="brand-subtitle">Computing Students</p>
          </div>
        </div>
        <div className="masthead-note">Student Complaint Portal</div>
      </header>

      <main className="main-content">
        <section className="intro" aria-labelledby="page-title">
          <p className="eyebrow">Kwara State University</p>
          <h1 id="page-title">Student Complaint Portal</h1>
          <p className="intro-copy">
            A dedicated portal for KWASU NACOS students to raise concerns and
            connect with student representatives.
          </p>
          <div className="campus-mark" aria-hidden="true">
            <span className="mark-rule" />
            <span>For the KWASU computing community</span>
          </div>
        </section>

        <section className="form-card" aria-labelledby="form-heading">
          {credentials ? (
            <div className="success-state" role="status">
              <p className="form-kicker">Signup complete</p>
              <h2 id="form-heading">Your credentials have been generated</h2>
              <dl className="credential-list">
                <div className="credential-item">
                  <dt className="credential-label">Student ID</dt>
                  <dd className="credential-value">{String(credentials.id)}</dd>
                </div>
                <div className="credential-item">
                  <dt className="credential-label">Password</dt>
                  <dd className="credential-value">
                    {String(credentials.password)}
                  </dd>
                </div>
              </dl>
              <p className="credential-warning">
                Keep these credentials safe. You will need them to log in to
                the student complaint portal.
              </p>
              <a className="login-link" href="/login">
                <span>Continue to Login</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          ) : (
            <>
              <p className="form-kicker">Student access</p>
              <h2 id="form-heading">Create Your Credentials</h2>
              <p className="form-description">
                Enter your email address to generate your student portal
                credentials.
              </p>
              <form className="signup-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  required
                  disabled={isSubmitting}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "signup-error" : undefined}
                />
                {error ? (
                  <p className="error-message" id="signup-error" role="alert">
                    {error}
                  </p>
                ) : null}
                <button
                  className="primary-button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="button-spinner" aria-hidden="true" />
                  ) : null}
                  <span>
                    {isSubmitting
                      ? "Generating credentials..."
                      : "Generate My Credentials"}
                  </span>
                  {!isSubmitting ? (
                    <span className="button-arrow" aria-hidden="true">
                      →
                    </span>
                  ) : null}
                </button>
              </form>
              <p className="form-footnote">
                Use the email address associated with your KWASU student
                account.
              </p>
            </>
          )}
        </section>
      </main>

      <footer className="footer">
        <span>Kwara State University · NACOS</span>
        <span>Student Complaint Portal</span>
      </footer>
    </div>
  );
}