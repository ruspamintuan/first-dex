import React, { useState, useEffect } from "react";
import { pokeSpriteMapper } from "../helpers/poke-helper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";

export default function PokeSprite({ sprites, gen }) {
  const [generation, setGeneration] = useState(gen);
  const [allSprites, setAllSprites] = useState(null);

  useEffect(() => {
    if (sprites) {
      setAllSprites(sprites);
    }
  }, [sprites]);

  function properCase(str) {
    const splitted = str.split("_");

    return splitted.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }

  return (
    <div style={{ width: "90%" }}>
      <div>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Generation</InputLabel>
          <Select
            defaultValue=""
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={generation}
            label="Generation"
            onChange={(val) => {
              setGeneration(val.target.value);
            }}>
            {Object.keys({ ...sprites.versions, "generation-ix": "" })
              .slice(Object.keys(sprites.versions).indexOf(gen))
              .map((game) => {
                return <MenuItem value={game}>{game.toUpperCase()}</MenuItem>;
              })}
          </Select>
        </FormControl>
      </div>
      <div style={{ height: "70vh", overflowY: "scroll" }}>
        <div>Default Sprites:</div>
        <Grid container spacing={2}>
          {pokeSpriteMapper(sprites).map((spr, index) => {
            return (
              <Grid key={index} item xs={3}>
                <div className="poke-sprites">
                  <div>
                    <img style={{ objectFit: "scale-down" }} width="100px" height="100px" alt={spr.label} src={spr.src}></img>
                  </div>
                  <div>{properCase(spr.label)}</div>
                </div>
              </Grid>
            );
          })}
        </Grid>
        {allSprites?.versions &&
          generation !== "generation-ix" &&
          allSprites?.versions[generation] &&
          Object.keys(allSprites?.versions[generation]).map((ver) => {
            const versionSprites = allSprites?.versions[generation];

            if (Object.values(versionSprites[ver]).filter((i) => i !== null).length > 0) {
              return (
                <div>
                  <div>{ver}</div>
                  <Grid container spacing={3}>
                    {pokeSpriteMapper(allSprites?.versions[generation][ver]).map((sprite, ind) => {
                      return (
                        <Grid key={ind} item xs={3}>
                          <div className="poke-sprites">
                            <div>
                              <img style={{ objectFit: "scale-down" }} width="100px" height="100px" alt={sprite.label} src={sprite.src}></img>
                            </div>
                            <div>{properCase(sprite.label)}</div>
                          </div>
                        </Grid>
                      );
                    })}
                  </Grid>
                </div>
              );
            } else {
              return null;
            }
          })}
      </div>
    </div>
  );
}
