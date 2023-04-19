import React, {useState} from "react";
import { LOGOUT_MUTATION } from "../api/backend";
import { backEndClient } from "../api/clients";
import { useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";

export default function NavBar() {
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
    <nav>
      <ul>
        <li>
          <Link to="/pokemon">Pokemon</Link>
        </li>
        <li>
          <Link to="/moves">Moves</Link>
        </li>
        <li>
          <Link to="/favourites">Favourites</Link>
        </li>
        <li className="logout">
          <a href="#" onClick={handleLogout}>
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
}
