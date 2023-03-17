import React from 'react';
// import { Routes, Route } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
    errorElement: <h2>Note not found</h2>,
  }
])

export default function App() {
  return <RouterProvider router={router} />;
}