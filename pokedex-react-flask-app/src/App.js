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
    <Route  element={<AuthRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/pokemon/:pokemonId"
          element={<PokemonCard />}
          errorElement={<PokemonCardErrorElement />}
        />
        <Route path="/favourites" element = {<Favourites />}/>
      </Route>
      <Route path="*" element={<Navigate to="/" />}></Route>
    </>
  )
);

export default function App() {
  return <RouterProvider router={router} />;
}
