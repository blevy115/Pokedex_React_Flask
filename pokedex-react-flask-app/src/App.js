import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Home from "./views/Home";
import PokemonCard from "./views/PokemonCard";


function PokemonCardErrorElement() {
  return (
    <>
      <Link to="/">Back to List</Link>
      <h2>Not valid Pokemon ID</h2>
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/pokemon/:pokemonId"
        element={<PokemonCard />}
        errorElement={<PokemonCardErrorElement />}
      />
    </>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
