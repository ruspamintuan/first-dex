import React, { Suspense } from "react";
import Grid from "@mui/material/Grid";
import { useMediaQuery } from "@mui/material";

const PokeCard = React.lazy(() => import("./PokeCard"));

export default function PokedexHome({ pokeList }) {
  const isSmall = useMediaQuery("(max-width:600px)");
  const isMedium = useMediaQuery("(min-width:601px) and (max-width:960px)");
  // const phoneSize = useMediaQuery('(min-width:300px) and (max-width:599px)');

  return (
    <div style={{ marginTop: "40px" }}>
      <Grid container spacing={2}>
        {pokeList.length > 0 &&
          pokeList.map((pokemon, index) => (
            <Grid key={index} item xs={isSmall ? 12 : isMedium ? 6 : 4}>
              <Suspense fallback={<div>LAZY LOADING...</div>}>
                <PokeCard key={index} className="bordered" data={pokemon}></PokeCard>
              </Suspense>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
