import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { HiMenuAlt4, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@apollo/client";

import { backEndClient } from "../../api/clients";
import { LOGOUT_MUTATION } from "../../api/queries/backend";

import "./NavBar.scss";

const NavBar = () => {
  const [, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [toggle, setToggle] = useState(false);
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
    <nav className="app__navbar">
      <ul className="app__navbar-links">
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
          <NavLink to="/abilities" activeclassname="active">
            Abilities
          </NavLink>
        </li>
        <li>
          <NavLink to="/favourites" activeclassname="active">
            Favourites
          </NavLink>
        </li>
      </ul>
      <ul className="app__navbar-links">
        <li className="logout">
          <a href="#" onClick={handleLogout}>
            Logout
          </a>
        </li>
      </ul>

      <div className="app__navbar-menu">
        <HiMenuAlt4 onClick={() => setToggle(true)} />
        <AnimatePresence>
          {toggle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                x: 200,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              whileInView={{ x: [200, 0] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <HiX onClick={() => setToggle(false)} />
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
                  <NavLink to="/abilities" activeclassname="active">
                    Abilities
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar;
