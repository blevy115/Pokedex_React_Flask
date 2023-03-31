import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { backEndClient } from "../api/clients";
import { useNavigate } from "react-router-dom";
import { SIGNUP_MUTATION } from "../api/backend";

export default function Signup() {
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
        navigate("/login", { replace: true });
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Name:</label>
        <input type="name" id="name" value={name} onChange={handleNameChange} />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />

        {/* <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        /> */}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
