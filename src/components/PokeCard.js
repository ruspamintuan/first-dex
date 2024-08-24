import React, { useEffect, useState } from "react";
import axios from "axios";
import pokeball from "../images/pokeball.svg";
import { useNavigate } from "react-router";
import CustomBackground from "../custom/CustomBackground";
import { getPokemonNameAndId } from "../helpers/poke-helper";
import PokeType from "../custom/PokeType";

export default function PokeCard({ data }) {
  const [pokemonData, setPokemonData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPokemon() {
      const result = await axios.get(data.pokemon_species.url.replace("-species", ""));
      setPokemonData(result.data);
      setLoading(false);
    }

    setLoading(true);
    fetchPokemon();
  }, [data]);

  return (
    <div className="pokecard-container">
      <CustomBackground pokemon={pokemonData} className="pokecard">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div
              className="pokecard-details"
              onClick={() => {
                navigate(`${pokemonData.id}`, {
                  state: {
                    pokemonData: pokemonData,
                    loading: loading,
                    data: data,
                  },
                });
              }}
            >
              <div className="poke-name">
                <div>{getPokemonNameAndId(pokemonData)}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div className="pokecard-left" style={{ minWidth: "50%" }}>
                  <div>
                    <div className="type-container">
                      {pokemonData.types.map((type) => {
                        return <PokeType style={{ width: "60%" }} type={type.type} />;
                      })}
                    </div>
                  </div>
                </div>
                <div className="pokecard-image-container">
                  <img
                    alt="pokemonSplash"
                    width={"100%"}
                    className="pokecard-pokemon"
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`}
                  ></img>
                  <img
                    alt="pokeballBg"
                    width={"100%"}
                    className="pokecard-pokeball"
                    src={pokeball}
                  ></img>
                </div>
              </div>
            </div>
          </>
        )}
      </CustomBackground>
    </div>
  );
}
