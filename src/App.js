import React from "react";
import Header from "./components/Header";
import PokedexMain from "./components/PokedexMain";
import { HashRouter } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Header />
        <PokedexMain />
      </HashRouter>
    </div>
  );
}

export default App;
