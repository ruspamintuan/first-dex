import React from "react";
import PokeCard from "./PokeCard";
import Grid from "@mui/material/Grid";
import { useMediaQuery } from "@mui/material";

export default function PokedexHome({ pokeList }) {
  const isSmall = useMediaQuery('(max-width:600px)');
  const isMedium = useMediaQuery('(min-width:601px) and (max-width:960px)');
  // const phoneSize = useMediaQuery('(min-width:300px) and (max-width:599px)');

  return (
    <div style={{ marginTop: "40px" }}>
      <Grid container spacing={2}>
        {pokeList.length > 0 &&
          pokeList.map((pokemon, index) => (
            <Grid key={index} item xs={isSmall ? 12: isMedium ? 6 : 4}>
              <PokeCard key={index} className="bordered" data={pokemon}></PokeCard>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
