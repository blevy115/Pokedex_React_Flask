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
  ItemDetail,
  ItemSearch,
  LocationSearch,
  LocationDetail,
  PokemonDetail,
  PokemonSearch,
  EggGroupList,
  EggGroupDetail,
  MoveDetail,
  MoveSearch,
  Login,
  Signup,
  TypeList,
  TypeDetail,
  Teams,
  TeamEdit,
} from "./pages";
import { ProtectedRoute, AuthRoute } from "./wrapper/routes";

import "./App.scss";

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
      <Link to="/abilities">Back to List</Link>
      <h2>Not valid Ability ID</h2>
    </>
  );
}

function ItemDetailErrorElement() {
  return (
    <>
      <Link to="/items">Back to List</Link>
      <h2>Not valid Item ID</h2>
    </>
  );
}

function LocationDetailErrorElement() {
  return (
    <>
      <Link to="/items">Back to List</Link>
      <h2>Not valid Location ID</h2>
    </>
  );
}

function EggGroupDetailErrorElement() {
  return (
    <>
      <Link to="/egg-groups">Back to List</Link>
      <h2>Not valid Location ID</h2>
    </>
  );
}

function TeamErrorElement() {
  return (
    <>
      <Link to="/teams">Back to List</Link>
      <h2>Not valid Team ID</h2>
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
        <Route path="/locations" element={<LocationSearch />} />
        <Route path="/items" element={<ItemSearch />} />
        <Route path="/moves" element={<MoveSearch />} />
        <Route path="/abilities" element={<AbilitySearch />} />
        <Route path="/egg-groups" element={<EggGroupList />} />
        <Route path="/types" element={<TypeList />} />
        <Route
          path="/abilities/:abilityId"
          element={<AbilityDetail />}
          errorElement={<AbilityDetailErrorElement />}
        />
        <Route
          path="/items/:itemId"
          element={<ItemDetail />}
          errorElement={<ItemDetailErrorElement />}
        />
        <Route
          path="/locations/:locationId"
          element={<LocationDetail />}
          errorElement={<LocationDetailErrorElement />}
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
        <Route
          path="/egg-groups/:eggGroupId"
          element={<EggGroupDetail />}
          errorElement={<EggGroupDetailErrorElement />}
        />
        <Route path="/types/:typeId" element={<TypeDetail />} />
      </Route>
      <Route element={<ProtectedRoute allowGuest={false} />}>
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/teams" element={<Teams />} />
        <Route
          path="/teams/:teamId"
          element={<TeamEdit />}
          errorElement={<TeamErrorElement />}
        />
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
