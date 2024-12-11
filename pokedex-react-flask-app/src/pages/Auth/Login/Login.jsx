import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { backEndClient } from "../../../api/clients";
import {
  LOGIN_MUTATION,
  GUEST_LOGIN_MUTATION,
} from "../../../api/queries/backend";

import { LoginLoading } from "../../../components";

import "../Auth.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    client: backEndClient,
  });
  const [guestLoginMutation] = useMutation(GUEST_LOGIN_MUTATION, {
    client: backEndClient,
  });
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginMutation({ variables: { email, password } });
      if (!response.data.login.token || !response.data.login.user) {
        throw new Error("Login Failed");
      }
      localStorage.setItem("token", response.data.login.token);
      localStorage.setItem("user", JSON.stringify(response.data.login.user));
      localStorage.setItem("role", "member");
      navigate("/pokemon", { replace: true });
    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
  }

  async function handleGuestLogin() {
    setLoading(true);
    try {
      const response = await guestLoginMutation();
      if (!response.data.guestLogin.token || !response.data.guestLogin.user) {
        throw new Error("Guest Login Failed");
      }
      localStorage.setItem("token", response.data.guestLogin.token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.guestLogin.user)
      );
      localStorage.setItem("role", "guest");
      navigate("/pokemon", { replace: true });
    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
  }

  return (
    <>
      {loading && <LoginLoading />}
      <div className="auth-container">
        <div className="auth-form-container">
          <form
            className={`auth-form ${loading ? "form-loadding" : ""}`}
            onSubmit={handleSubmit}
          >
            <div className="auth-redirect">
              <Link to="/signup">Need an account, Sign Up</Link>
            </div>
            <h1 className="auth-title">Pok&eacute;mon Companion</h1>

            <div className="auth-form-field">
              <label htmlFor="auth-email">Email:</label>
              <input
                type="email"
                id="auth-email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div className="auth-form-field">
              <label htmlFor="auth-password">Password:</label>
              <input
                type="password"
                id="auth-password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            {error && <span className="error">{error}</span>}
            <div className="auth-button-container">
              <button className="auth-form-submit" type="submit">
                Log In
              </button>
              <button
                className="auth-form-submit"
                type="button"
                onClick={handleGuestLogin}
              >
                Guest
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
