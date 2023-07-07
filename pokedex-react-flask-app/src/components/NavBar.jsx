import React, { useState } from "react";
import { LOGOUT_MUTATION } from "../api/backend";
import { backEndClient } from "../api/clients";
import { useMutation } from "@apollo/client";
import { useNavigate, NavLink } from "react-router-dom";

const NavBar = () => {
  const [, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();

  const [logoutMutation] = useMutation(LOGOUT_MUTATION, {
    client: backEndClient,
  });

  const handleLogout = async () => {
    await logoutMutation();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login", { replace: true });
  };

  return (
    <nav id="nav-bar">
      <ul>
        <li>
          <NavLink to="/pokemon" activeclassname="active">
            Pokemon
          </NavLink>
        </li>
        <li>
          <NavLink to="/moves" activeclassname="active">
            Moves
          </NavLink>
        </li>
        <li>
          <NavLink to="/favourites" activeclassname="active">
            Favourites
          </NavLink>
        </li>
        <li className="logout">
          <a href="#" onClick={handleLogout}>
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
