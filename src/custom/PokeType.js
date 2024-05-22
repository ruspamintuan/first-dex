import React from "react";
import { typeColors, getTypeIcon } from "../helpers/poke-helper";

export default function PokeType({ type, ...props }) {
  return (
    <div className="poke-type" style={{ backgroundColor: typeColors[type.name], ...props.style }}>
      <div style={{ minWidth: "15%", display: "flex" }}>
        <img alt="poketype-icon" style={{ width: "100%" }} src={getTypeIcon(type?.name)}></img>
      </div>
      <div style={{ minWidth: "90%", alignSelf: "center" }}>{type?.name?.toUpperCase()}</div>
    </div>
  );
}
