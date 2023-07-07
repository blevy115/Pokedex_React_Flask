import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { backEndClient } from "../api/clients";
import { useNavigate } from "react-router-dom";
import { SIGNUP_MUTATION } from "../api/backend";
import { Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation({ variables: { name, email, password } })
      .then((response) => {
        console.log(response);
        if (!response.data.signup.token || !response.data.signup.user) {
          throw new Error("Sign Up Failed");
        }
        localStorage.setItem("token", response.data.signup.token);
        localStorage.setItem("user", JSON.stringify(response.data.signup.user));
        navigate("/pokemon", { replace: true });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
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
  );
};

export default Signup;
