import React, { useState } from "react";
import { LOGIN_MUTATION } from "../api/backend";
import { backEndClient } from "../api/clients";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
