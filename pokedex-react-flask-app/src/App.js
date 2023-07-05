import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Link,
  Navigate
} from "react-router-dom";
import "./App.css";
import Login from "./views/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import Signup from "./views/Signup";
import Favourites from "./views/Favourites";
import PokemonSearch from "./views/PokemonSearch";
import PokemonCard from "./views/PokemonCard";
import MoveSearch from "./views/MoveSearch";
import MoveCard from "./views/MoveCard";

function PokemonCardErrorElement() {
  return (
    <>
      <Link to="/pokemon">Back to List</Link>
      <h2>Not valid Pokemon ID</h2>
    </>
  );
}

function MoveCardErrorElement() {
  return (
    <>
      <Link to="/moves">Back to List</Link>
      <h2>Not valid Move ID</h2>
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route  element={<AuthRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/pokemon" element={<PokemonSearch />} />
        <Route path="/moves" element={<MoveSearch />} />
        <Route
          path="/pokemon/:pokemonId"
          element={<PokemonCard />}
          errorElement={<PokemonCardErrorElement />}
        />
        <Route
          path="/moves/:moveId"
          element={<MoveCard />}
          errorElement={<MoveCardErrorElement />}
        />
        <Route path="/favourites" element = {<Favourites />}/>
      </Route>
      <Route path="*" element={<Navigate to="/pokemon" />}></Route>
    </>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
