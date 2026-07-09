import { useState } from "react";
import { FaLock, FaUser, FaRobot } from "react-icons/fa";


function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLoggedIn(true);
      } else {
        alert("Invalid Username or Password ❌");
      }
    } catch (error) {
      alert("Login failed. Please check backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-v2-page">
      <div className="login-blob login-blob-one"></div>
      <div className="login-blob login-blob-two"></div>

      <form className="login-v2-card" onSubmit={handleLogin}>
        <div className="login-v2-icon">
          <FaRobot />
        </div>

        <p className="login-v2-badge">SmartStock AI</p>

        <h1>Welcome Back</h1>

        <p className="login-v2-subtitle">
          Sign in to access your AI-powered inventory command center.
        </p>

        <div className="login-v2-field">
          <FaUser />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="login-v2-field">
          <FaLock />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="login-v2-btn" type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Login to Dashboard"}
        </button>
      </form>
    </div>
  );
}

export default Login;