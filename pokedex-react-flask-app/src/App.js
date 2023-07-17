import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import {
  AbilityDetail,
  AbilitySearch,
  Favourites,
  PokemonDetail,
  PokemonSearch,
  MoveDetail,
  MoveSearch,
  Login,
  Signup,
} from "./pages";
import { ProtectedRoute, AuthRoute } from "./wrapper/routes";

import "./App.css";

function PokemonDetailErrorElement() {
  return (
    <>
      <Link to="/pokemon">Back to List</Link>
      <h2>Not valid Pokemon ID</h2>
    </>
  );
}

function MoveDetailErrorElement() {
  return (
    <>
      <Link to="/moves">Back to List</Link>
      <h2>Not valid Move ID</h2>
    </>
  );
}

function AbilityDetailErrorElement() {
  return (
    <>
      <Link to="/ability">Back to List</Link>
      <h2>Not valid Ability ID</h2>
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/pokemon" element={<PokemonSearch />} />
        <Route path="/moves" element={<MoveSearch />} />
        <Route path="/abilities" element={<AbilitySearch />} />
        <Route
          path="/abilities/:abilityId"
          element={<AbilityDetail />}
          errorElement={<AbilityDetailErrorElement />}
        />
        <Route
          path="/pokemon/:pokemonId"
          element={<PokemonDetail />}
          errorElement={<PokemonDetailErrorElement />}
        />
        <Route
          path="/moves/:moveId"
          element={<MoveDetail />}
          errorElement={<MoveDetailErrorElement />}
        />
        <Route path="/favourites" element={<Favourites />} />
      </Route>
      <Route path="*" element={<Navigate to="/pokemon" />}></Route>
    </>
  )
);

export default function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}
