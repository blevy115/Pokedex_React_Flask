import React from 'react';
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

import './App.css';
import Main from './views/Main';
import PokemonCard from './views/PokemonCard';

let router = createBrowserRouter([
  {
    path: "/",
    element: < Main />,
  },
  {
    path: "pokemon/:pokemonId",
    element: < PokemonCard />,
    errorElement: <><Link to="/">Back to List</Link><h2>Not valid Pokemon ID</h2></>,
  }
])

export default function App() {
  return <RouterProvider router={router} />;
}