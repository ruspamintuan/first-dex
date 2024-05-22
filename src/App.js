import React, { useState } from "react";
import Header from "./components/Header";
import PokedexHome from "./components/PokedexHome";
import PokedexMain from "./components/PokedexMain";
import PokeItems from "./components/PokeItems";
import PokeModal from "./components/PokeModal";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import "./App.css";

function App() {
  const [poke, setPoke] = useState(false);
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <PokedexMain />
      </BrowserRouter>
    </div>
  );
}

export default App;
