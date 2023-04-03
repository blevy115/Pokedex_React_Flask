import React, { useState } from "react";
import { LOGIN_MUTATION } from "../api/backend";
import { backEndClient } from "../api/clients";
import { useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    client: backEndClient,
  });
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ variables: { email, password } })
      .then((response) => {
        if (!response.data.login.token || !response.data.login.user) {
          throw new Error("Login Failed");
        }
        localStorage.setItem("token", response.data.login.token);
        localStorage.setItem("user", JSON.stringify(response.data.login.user));
        navigate("/", { replace: true });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
        <h1 className="auth-title">Pokemon Companion</h1>
          <div className="auth-redirect">
            <Link to="/signup">Need an account, Sign Up</Link>
          </div>
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
          <button className="auth-form-submit" type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
}
