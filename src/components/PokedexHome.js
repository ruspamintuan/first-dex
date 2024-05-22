import React from "react";
import PokeCard from "./PokeCard";
import Grid from "@mui/material/Grid";

export default function PokedexHome({ pokeList }) {
  return (
    <div style={{ marginTop: "40px" }}>
      <Grid container spacing={2}>
        {pokeList.length > 0 &&
          pokeList.map((pokemon, index) => (
            <Grid key={index} item xs={4}>
              <PokeCard key={index} className="bordered" data={pokemon}></PokeCard>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
