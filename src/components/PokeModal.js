import React, { useEffect, useState } from "react";
import pokeball from "../images/pokeball.svg";
import { Tabs } from "@mui/material";
import { Tab } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import PokeVariants from "./PokeVariants";
import PokeDetails from "./PokeDetails";
import PokeMoves from "./PokeMoves";
import PokeSprite from "./PokeSprite";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import CustomBackground from "../custom/CustomBackground";
import PokeType from "../custom/PokeType";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function PokeModal() {
  const location = useLocation();
  const navi = useNavigate();
  const [shiny, setShiny] = useState(false);
  const [tab, setTab] = useState(1);
  const [pokemonDetails, setPokemonDetails] = useState(location?.state?.pokemonData);
  const [descriptionKey] = useState("");

  useEffect(() => {
    if (!location?.state) {
      return navi("/");
    }

    const { pokemonData } = location?.state;
    async function fetchPokemonDetails() {
      const result = await axios.get(pokemonData.species.url);
      setPokemonDetails({ ...pokemonData, ...result.data });
    }

    fetchPokemonDetails();
    //eslint-disable-next-line
  }, []);

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  console.log({ pokemonDetails });

  return (
    <div className="container">
      <div className="card">
        <div className="card-content">
          <CustomBackground pokemon={pokemonDetails} className="">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ minWidth: "30%" }}>
                <div>
                  <ArrowBackIcon
                    onClick={() => {
                      navi(-1);
                    }}
                    style={{ cursor: "pointer" }}
                    fontSize="large"
                  />
                </div>
                <div className="pokecard-image-container">
                  <img
                    alt="pokemonsplash"
                    width={"100%"}
                    className="pokecard-pokemon"
                    src={shiny ? pokemonDetails.sprites.other["official-artwork"].front_shiny : pokemonDetails.sprites.other["official-artwork"].front_default}></img>
                  <img alt="pokeball-bg" width={"100%"} className="pokecard-pokeball" src={pokeball}></img>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          value={!shiny}
                          onChange={(e) => {
                            setShiny(!shiny);
                          }}
                        />
                      }
                      label="Shiny"
                    />
                  </FormGroup>
                </div>

                <div style={{ textAlign: "center", fontWeight: "bolder", fontSize: "36px" }}>{capitalize(location?.state?.data.pokemon_species.name)}</div>
                <div style={{ display: "flex", padding: "15px", justifyContent: "center" }}>
                  {pokemonDetails.types.map((type) => {
                    return <PokeType type={type.type} style={{ width: "75%" }} />;
                  })}
                </div>
              </div>
              <div style={{ minWidth: "69%" }}>
                <div style={{ display: "flex" }}></div>
                <div style={{ display: "flex" }}>
                  <Tabs value={tab} onChange={(e, val) => setTab(val)} orientation="vertical">
                    <Tab label="Information" value={1} />
                    <Tab label="Moves" value={2} />
                    <Tab label="Sprites" value={3} />
                    {pokemonDetails.varieties && pokemonDetails.varieties.length > 1 && <Tab label="Variants" value={4} />}
                  </Tabs>
                  {tab === 1 && <PokeDetails descriptionKey={descriptionKey} pokemon={pokemonDetails} shiny={shiny} />}
                  {tab === 2 && <PokeMoves moves={pokemonDetails.moves} />}
                  {tab === 3 && <PokeSprite sprites={pokemonDetails.sprites} gen={pokemonDetails?.generation?.name} />}
                  {tab === 4 && <PokeVariants variant={pokemonDetails?.varieties} shiny={shiny} />}
                </div>
              </div>
            </div>
          </CustomBackground>
        </div>
      </div>
    </div>
  );
}
