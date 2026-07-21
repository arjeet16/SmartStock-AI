import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaBuilding,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaLock,
  FaPhone,
  FaRobot,
  FaUser,
} from "react-icons/fa";
import toast from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const INITIAL_REGISTER_FORM = {
  full_name: "",
  company_name: "SmartStock AI",
  email: "",
  mobile_number: "",
  password: "",
  confirm_password: "",
};
function Login({ setIsLoggedIn }) {
const queryParams = new URLSearchParams(
  window.location.search
);

const resetToken = queryParams.get("token") || "";
const resetEmail = queryParams.get("email") || "";

const isResetPasswordPage =
  window.location.pathname === "/reset-password" &&
  Boolean(resetToken) &&
  Boolean(resetEmail);

  const [authMode, setAuthMode] = useState("login");

  const [identifier, setIdentifier] = useState(() => {
    return (
      localStorage.getItem(
        "smartstock_remembered_username"
      ) || ""
    );
  });

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [resetForm, setResetForm] = useState({
  new_password: "",
  confirm_password: "",
});

const [showResetPassword, setShowResetPassword] =
  useState(false);

const [showResetConfirmPassword, setShowResetConfirmPassword] =
  useState(false);
  const [rememberMe, setRememberMe] = useState(
    Boolean(
      localStorage.getItem(
        "smartstock_remembered_username"
      )
    )
  );

  const [registerForm, setRegisterForm] = useState(
    INITIAL_REGISTER_FORM
  );
  const [showRegisterPassword, setShowRegisterPassword] =
    useState(false);

  const [
    showRegisterConfirmPassword,
    setShowRegisterConfirmPassword,
  ] = useState(false);

  const [isLoading, setIsLoading] =
    useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
const [showForgotPassword, setShowForgotPassword] =
  useState(false);
  const handleRegisterChange = (event) => {
    const { name, value } = event.target;

    setRegisterForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier || !password) {
      toast.error(
        "Please enter your email or username and password."
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: cleanIdentifier,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Invalid email, username or password."
        );
      }

      if (rememberMe) {
  localStorage.setItem(
    "smartstock_remembered_username",
    cleanIdentifier
  );
} else {
  localStorage.removeItem(
    "smartstock_remembered_username"
  );
}

localStorage.setItem(
  "smartstock_is_logged_in",
  "true"
);

if (data.token) {
  localStorage.setItem(
    "smartstock_auth_token",
    data.token
  );
}

if (data.user) {
  localStorage.setItem(
    "smartstock_current_user",
    JSON.stringify(data.user)
  );
}

toast.success(
  `Welcome back${
    data.user?.full_name
      ? `, ${data.user.full_name}`
      : ""
  }`
);

setIsLoggedIn(true);
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error.message ||
          "Login failed. Please check the backend server."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const cleanName =
      registerForm.full_name.trim();

    const cleanEmail =
      registerForm.email.trim().toLowerCase();

    if (!cleanName || !cleanEmail) {
      toast.error(
        "Full name and email address are required."
      );
      return;
    }

    if (registerForm.password.length < 8) {
      toast.error(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (
      registerForm.password !==
      registerForm.confirm_password
    ) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...registerForm,
            full_name: cleanName,
            company_name:
              registerForm.company_name.trim() ||
              "SmartStock AI",
            email: cleanEmail,
            mobile_number:
              registerForm.mobile_number.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to create account."
        );
      }

      toast.success(
        "Account created successfully. You can now sign in."
      );

      setIdentifier(cleanEmail);
      setPassword("");
      setRegisterForm(INITIAL_REGISTER_FORM);
      setAuthMode("login");
    } catch (error) {
      console.error("Registration error:", error);

      toast.error(
        error.message ||
          "Unable to create your account."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
  setForgotEmail(
    identifier.includes("@") ? identifier : ""
  );

  setShowForgotPassword(true);
};
const submitForgotPassword = async (event) => {
  event.preventDefault();

  const email = forgotEmail.trim().toLowerCase();

  if (!email) {
    toast.error("Please enter your email address.");
    return;
  }

  try {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Unable to send password reset email."
      );
    }

    toast.success(
      data.message ||
        "Password reset link sent successfully."
    );

    setShowForgotPassword(false);
    setForgotEmail("");
  } catch (error) {
    console.error("Forgot password error:", error);

    toast.error(
      error.message ||
        "Unable to send password reset email."
    );
  } finally {
    setIsLoading(false);
  }
};
const submitResetPassword = async (event) => {
  event.preventDefault();

  const newPassword = resetForm.new_password;
  const confirmPassword = resetForm.confirm_password;

  if (!newPassword || !confirmPassword) {
    toast.error("Please complete both password fields.");
    return;
  }

  if (newPassword.length < 8) {
    toast.error(
      "Password must contain at least 8 characters."
    );
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  try {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: resetEmail,
          token: resetToken,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      }
    );

    const contentType =
      response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      throw new Error(
        `Backend returned status ${response.status}.`
      );
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to reset password."
      );
    }

    toast.success(
      data.message ||
        "Password reset successfully."
    );

    setResetForm({
      new_password: "",
      confirm_password: "",
    });

    setShowResetPassword(false);
    setIdentifier(resetEmail);
    setPassword("");

    window.history.replaceState(
      {},
      "",
      window.location.origin
    );
  } catch (error) {
    console.error("Reset password error:", error);

    toast.error(
      error.message || "Unable to reset password."
    );
  } finally {
    setIsLoading(false);
  }
};
  const handleGoogleLogin = () => {
    toast(
      "Google authentication will be connected after OAuth configuration."
    );
  };
useEffect(() => {
  if (isResetPasswordPage) {
    setShowResetPassword(true);
  }
}, [isResetPasswordPage]);
const [showNewPassword, setShowNewPassword] =
  useState(false);
  return (
    <main className="auth-page">
      <div className="auth-background-grid" />
      <div className="auth-orb auth-orb-one" />
      <div className="auth-orb auth-orb-two" />

      <section className="auth-shell">
        <div className="auth-brand-panel">
          <div>
            <div className="auth-brand-logo">
              <FaRobot />
            </div>

            <span className="auth-brand-badge">
              AI INVENTORY INTELLIGENCE
            </span>

            <h1>
              Make smarter inventory decisions with
              SmartStock AI.
            </h1>

            <p>
              Monitor stock health, forecast demand,
              identify risks and access executive
              business insights from one intelligent
              command center.
            </p>
          </div>

          <div className="auth-feature-grid">
            <article>
              <strong>AI Forecasting</strong>
              <span>
                Predict product demand and restocking
                needs.
              </span>
            </article>

            <article>
              <strong>Live Analytics</strong>
              <span>
                Track sales, profit and inventory
                performance.
              </span>
            </article>

            <article>
              <strong>Smart Alerts</strong>
              <span>
                Identify low-stock and revenue risk
                early.
              </span>
            </article>
          </div>
        </div>

        <div className="auth-form-panel">
          {authMode === "login" ? (
            <form
              className="auth-form-card"
              onSubmit={handleLogin}
            >
              <div className="auth-mobile-logo">
                <FaRobot />
              </div>

              <span className="auth-form-eyebrow">
                SECURE WORKSPACE ACCESS
              </span>

              <h2>Welcome back</h2>

              <p className="auth-form-subtitle">
                Sign in using your email address or
                existing admin username.
              </p>

              <label className="auth-field">
                <span>Email or Username</span>

                <div className="auth-input-wrapper">
                  <FaUser />

                  <input
                    type="text"
                    value={identifier}
                    onChange={(event) =>
                      setIdentifier(
                        event.target.value
                      )
                    }
                    placeholder="Email or username"
                    autoComplete="username"
                    disabled={isLoading}
                    required
                  />
                </div>
              </label>

              <label className="auth-field">
                <span>Password</span>

                <div className="auth-input-wrapper">
                  <FaLock />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash />
                    ) : (
                      <FaEye />
                    )}
                  </button>
                </div>
              </label>

              <div className="auth-form-options">
                <label className="auth-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(
                        event.target.checked
                      )
                    }
                  />

                  <span>Remember username</span>
                </label>

                <button
                  type="button"
                  className="auth-text-button"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-spinner" />
                    Signing in...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </button>

              <div className="auth-divider">
                <span>or continue with</span>
              </div>

              <button
                type="button"
                className="auth-google-button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <FaGoogle />
                Continue with Google
              </button>

              <p className="auth-create-account">
                New to SmartStock AI?

                <button
                  type="button"
                  onClick={() =>
                    setAuthMode("register")
                  }
                >
                  Create an account
                </button>
              </p>

              <small className="auth-security-note">
                Protected workspace access for
                authorized users.
              </small>
            </form>
          ) : (
            <form
              className="auth-form-card auth-register-card"
              onSubmit={handleRegister}
            >
              <button
                type="button"
                className="auth-back-button"
                onClick={() =>
                  setAuthMode("login")
                }
                disabled={isLoading}
              >
                <FaArrowLeft />
                Back to login
              </button>

              <span className="auth-form-eyebrow">
                CREATE YOUR WORKSPACE
              </span>

              <h2>Create account</h2>

              <p className="auth-form-subtitle">
                Set up your SmartStock AI workspace.
              </p>

              <div className="auth-register-grid">
                <label className="auth-field">
                  <span>Full Name</span>

                  <div className="auth-input-wrapper">
                    <FaUser />

                    <input
                      type="text"
                      name="full_name"
                      value={
                        registerForm.full_name
                      }
                      onChange={
                        handleRegisterChange
                      }
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                    />
                  </div>
                </label>

                <label className="auth-field">
                  <span>Company</span>

                  <div className="auth-input-wrapper">
                    <FaBuilding />

                    <input
                      type="text"
                      name="company_name"
                      value={
                        registerForm.company_name
                      }
                      onChange={
                        handleRegisterChange
                      }
                      placeholder="Company name"
                    />
                  </div>
                </label>

                <label className="auth-field auth-field-wide">
                  <span>Email Address</span>

                  <div className="auth-input-wrapper">
                    <FaEnvelope />

                    <input
                      type="email"
                      name="email"
                      value={registerForm.email}
                      onChange={
                        handleRegisterChange
                      }
                      placeholder="name@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </label>

                <label className="auth-field auth-field-wide">
                  <span>Mobile Number</span>

                  <div className="auth-input-wrapper">
                    <FaPhone />

                    <input
                      type="tel"
                      name="mobile_number"
                      value={
                        registerForm.mobile_number
                      }
                      onChange={
                        handleRegisterChange
                      }
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                    />
                  </div>
                </label>

                <label className="auth-field">
                  <span>Password</span>

                  <div className="auth-input-wrapper">
                    <FaLock />

                    <input
                      type={
                        showRegisterPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={
                        registerForm.password
                      }
                      onChange={
                        handleRegisterChange
                      }
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() =>
                        setShowRegisterPassword(
                          (previous) => !previous
                        )
                      }
                    >
                      {showRegisterPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>
                </label>

                <label className="auth-field">
                  <span>Confirm Password</span>

                  <div className="auth-input-wrapper">
                    <FaLock />

                    <input
                      type={
                        showRegisterConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirm_password"
                      value={
                        registerForm.confirm_password
                      }
                      onChange={
                        handleRegisterChange
                      }
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="auth-password-toggle"
                      onClick={() =>
                        setShowRegisterConfirmPassword(
                          (previous) => !previous
                        )
                      }
                    >
                      {showRegisterConfirmPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="auth-submit-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-spinner" />
                    Creating account...
                  </>
                ) : (
                  "Create SmartStock Account"
                )}
              </button>

              <p className="auth-create-account">
                Already have an account?

                <button
                  type="button"
                  onClick={() =>
                    setAuthMode("login")
                  }
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
           </section>

      {showForgotPassword && (
        <div
          className="auth-modal-backdrop"
          onMouseDown={() => {
            if (!isLoading) {
              setShowForgotPassword(false);
            }
          }}
        >
          <form
            className="auth-modal-card"
            onSubmit={submitForgotPassword}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="auth-modal-close"
              onClick={() =>
                setShowForgotPassword(false)
              }
              disabled={isLoading}
              aria-label="Close forgot password"
            >
              ×
            </button>

            <div className="auth-modal-icon">
              <FaEnvelope />
            </div>

            <span className="auth-form-eyebrow">
              PASSWORD RECOVERY
            </span>

            <h2>Forgot your password?</h2>

            <p>
              Enter the email address linked to your
              SmartStock AI account. We will send you a
              secure reset link.
            </p>

            <label className="auth-field">
              <span>Email Address</span>

              <div className="auth-input-wrapper">
                <FaEnvelope />

                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(event) =>
                    setForgotEmail(event.target.value)
                  }
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={isLoading}
                  autoFocus
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="auth-spinner" />
                  Sending reset link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <button
              type="button"
              className="auth-modal-back-button"
              onClick={() =>
                setShowForgotPassword(false)
              }
              disabled={isLoading}
            >
              Back to login
            </button>
          </form>
        </div>
      )}
      {showResetPassword && (
  <div className="auth-modal-backdrop">
    <form
      className="auth-modal-card"
      onSubmit={submitResetPassword}
    >
      <div className="auth-modal-icon">
        <FaLock />
      </div>

      <span className="auth-form-eyebrow">
        CREATE NEW PASSWORD
      </span>

      <h2>Reset your password</h2>

      <p>
        Enter a new secure password for{" "}
        <strong>{resetEmail}</strong>.
      </p>

      <label className="auth-field">
        <span>New Password</span>

        <div className="auth-input-wrapper">
          <FaLock />

          <input
           type={
  showNewPassword
    ? "text"
    : "password"
}
            value={resetForm.new_password}
            onChange={(event) =>
              setResetForm((previous) => ({
                ...previous,
                new_password: event.target.value,
              }))
            }
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            disabled={isLoading}
            required
          />

          <button
            type="button"
            className="auth-password-toggle"
            onClick={() =>
  setShowNewPassword(
    (previous) => !previous
  )
}
          >
            {showNewPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>
      </label>

      <label className="auth-field">
        <span>Confirm Password</span>

        <div className="auth-input-wrapper">
          <FaLock />

          <input
            type={
              showResetConfirmPassword
                ? "text"
                : "password"
            }
            value={resetForm.confirm_password}
            onChange={(event) =>
              setResetForm((previous) => ({
                ...previous,
                confirm_password:
                  event.target.value,
              }))
            }
            placeholder="Repeat new password"
            autoComplete="new-password"
            disabled={isLoading}
            required
          />

          <button
            type="button"
            className="auth-password-toggle"
            onClick={() =>
              setShowResetConfirmPassword(
                (previous) => !previous
              )
            }
          >
            {showResetConfirmPassword ? (
              <FaEyeSlash />
            ) : (
              <FaEye />
            )}
          </button>
        </div>
      </label>

      <button
        type="submit"
        className="auth-submit-button"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="auth-spinner" />
            Resetting password...
          </>
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  </div>
)}
    </main>
  );
}

export default Login;