import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";

import { backEndClient } from "../../../api/clients";
import { SIGNUP_MUTATION } from "../../../api/queries/backend";

import { LoginLoading } from "../../../components";

import "../Auth.scss";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [signupMutation] = useMutation(SIGNUP_MUTATION, {
    client: backEndClient,
  });
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

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
      const response = await signupMutation({
        variables: { name, email, password },
      });
      if (!response.data.signup.token || !response.data.signup.user) {
        throw new Error("Sign Up Failed");
      }
      localStorage.setItem("token", response.data.signup.token);
      localStorage.setItem("user", JSON.stringify(response.data.signup.user));
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
              <Link to="/login">Already have an account, Log In</Link>
            </div>
            <h1 className="auth-title">Pok&eacute;mon Companion</h1>
            <div className="auth-form-field">
              <label htmlFor="auth-name">Name:</label>
              <input
                type="name"
                id="auth-name"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div className="auth-form-field">
              <label htmlFor="auth-email">Email:</label>
              <input
                type="email"
                id="auth-email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="auth-form-field">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {error && <span className="error">{error}</span>}
            {/* <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        /> */}

            <button className="auth-form-submit" type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
