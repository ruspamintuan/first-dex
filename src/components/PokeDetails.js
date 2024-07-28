import React, { useEffect, useState } from "react";
import axios from "axios";
import { evolutionBuilder, evoMethodMapper } from "../helpers/poke-helper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function PokeDetails({ pokemon, shiny }) {
  const [evoChain, setEvoChain] = useState([]);
  const [flavorTexts, setFlavorText] = useState("");
  const [gameVersions, setGameVersions] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [game, setGame] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("");
  const [descriptionKey, setDescriptionKey] = useState("");
  const isPhoneSize = useMediaQuery('(min-width:300px) and (max-width:599px)');
  const isSmall = useMediaQuery('(max-width:600px)');
  const isMedium = useMediaQuery('(min-width:601px) and (max-width:960px)');


  useEffect(() => {
    async function fetchEvolutionLine() {
      const result = await axios.get(pokemon?.evolution_chain?.url);
      setEvoChain(await evolutionBuilder(result.data));
    }

    if (pokemon?.evolution_chain?.url) {
      fetchEvolutionLine();
    }

    //eslint-disable-next-line
  }, [pokemon]);

  useEffect(() => {
    if (pokemon.flavor_text_entries) {
      const descriptions = pokemon.flavor_text_entries.reduce((res, curr) => {
        if (curr?.version?.name && curr?.version?.name) {
          res[`${curr?.version?.name}-${curr?.language?.name}`] = curr.flavor_text;
        }

        return { ...res };
      }, {});
      const gameVers = [...new Set(pokemon.flavor_text_entries.map((text) => text.version.name))];
      const langs = [...new Set(pokemon.flavor_text_entries.map((text) => text.language.name))];

      setGameVersions(gameVers);
      setLanguages(langs);
      setGame(gameVers[0]);
      setCurrentLanguage(langs[0]);
      setDescriptionKey(`${gameVers[0]}-${langs[0]}`);

      setFlavorText(descriptions);
    }
  }, [pokemon]);


  const languageMapping = {
    "ja-Hrkt": "Japanese",
    roomaji: "Official Roomaji",
    ko: "Korean",
    "zh-Hant": "Chinese",
    fr: "French",
    de: "German",
    en: "English",
    es: "Spanish",
    it: "Italian",
    cs: "Czech",
    ja: "Japanese",
    "zh-Hans": "Chinese Simplifed",
    "pt-BR": "Brazilian",
  };

  const cleanString = (str) => {
    return str.replace(/[\f\n\r\t\v\b]/g, ' ');
  };

  return (
    <div style={{ width: isSmall || isMedium ? "100%" : "90%" }}>
      <div style={{ display: "flex" }}>
        <div>
          {game && gameVersions.length > 0 && (
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Game</InputLabel>
              <Select
                defaultValue=""
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={game}
                label="Game"
                onChange={(val) => {
                  setGame(val.target.value);
                  setDescriptionKey(`${val.target.value}-${currentLanguage}`);
                }}>
                {gameVersions.map((game) => {
                  return <MenuItem value={game}>{game.toUpperCase()}</MenuItem>;
                })}
              </Select>
            </FormControl>
          )}
        </div>
        <div>
          {currentLanguage && languages.length > 0 && (
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">Language</InputLabel>
              <Select
                defaultValue=""
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={currentLanguage}
                label="Game"
                onChange={(val) => {
                  setCurrentLanguage(val.target.value);
                  setDescriptionKey(`${game}-${val.target.value}`);
                }}>
                {languages.map((lang) => {
                  return <MenuItem value={lang}>{languageMapping[lang]}</MenuItem>;
                })}
              </Select>
            </FormControl>
          )}
        </div>
      </div>

      <div className="div-bordered">
        <div>Description</div>
        {Object.keys(flavorTexts).length > 0 && descriptionKey && <div>{cleanString(flavorTexts[descriptionKey]) ||  "Data Unavailable"}</div>}
      </div>
      <div className="div-bordered">
        <div>Abilities</div>
        <div className="poke-ability-container">
          <div style={{ display: "flex", width: "50%" }}>
            {pokemon?.abilities?.map((ability) => {
              return (
                !ability.is_hidden && (
                  <div style={{ width: "100%" }} className="poke-ability">
                    {ability.ability.name.toUpperCase()}
                  </div>
                )
              );
            })}
          </div>
          <div style={{ width: "50%" }}>
            {pokemon?.abilities?.map((ability) => {
              return ability.is_hidden && <div className="poke-ability">{`Hidden Ability: ${ability.ability.name.toUpperCase()}`}</div>;
            })}
          </div>
        </div>
      </div>
      <div className="div-bordered">
        <div>Stats</div>
        <Grid container spacing={2}>
          {pokemon.stats.map((stat) => {
            return (
              <Grid item xl={2} xs={4}>
                <div className="stat-container">
                  <div style={{alignSelf: "center"}}>{stat.stat.name.toUpperCase()}</div>
                  <div style={{ display: "flex", justifyContent: "center", fontWeight: "bold" }}>{stat.base_stat}</div>
                </div>
              </Grid>
            );
          })}
          
          <Grid item xl={12} xs={12}>
            <div>
              <div>TOTAL</div>
              <div style={{ display: "flex", justifyContent: "center", fontWeight: "bold" }}>{pokemon.stats.reduce((acc, curr) => acc + curr.base_stat, 0)}</div>
            </div>
          </Grid>
        </Grid>
      </div>
      <div className="div-bordered" style={{ overflowY: "auto"}}>
        {evoChain.basic && (
          <>
            {isPhoneSize ? (
              <div className="evolution-container-phone" style={{ minHeight: "100%", width: "310px" }}>
              <div>
                <img alt="pokemonBasic" src={shiny ? evoChain.shiny : evoChain.sprite}></img>
                <div style={{ textAlign: "center" }}>{evoChain.basic.toUpperCase()}</div>
              </div>
              <div>
                <div>
                  {evoChain?.firstStage?.map((variant) => {
                    return (
                      <div key={variant.name} style={{ display: "flex" }}>
                        <div className="evoMethod-container">
                          {variant.methods.map((method) => {
                            return (
                              <div key={method.trigger} className="poke-evoMethod">
                                <div>
                                  <ArrowRightAltIcon />
                                </div>
                                <div className="poke-evoMethodSpecific">{evoMethodMapper(method)}</div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="firstEvo-container">
                          <img alt="pokemonMid" src={shiny ? variant.shiny : variant.sprite}></img>
                          <div>{variant.name.toUpperCase()}</div>
                        </div>

                        {variant.secondStage && 
                        <div className="secondStage-container">
                            {variant.secondStage.map((vari) => {
                              return (
                                <div key={vari.name} style={{ display: "flex" }}>
                                  <div className="evoMethod-container">
                                    {vari.methods.map((method) => {
                                      return (
                                        <div key={method.trigger} className="poke-evoMethod">
                                          <div>
                                            <ArrowRightAltIcon />
                                          </div>
                                          <div className="poke-evoMethodSpecific">{evoMethodMapper(method)}</div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                  <div>
                                    <img alt="pokemonFinal" src={shiny ? vari.shiny : vari.sprite}></img>
                                    <div>{vari.name.toUpperCase()}</div>
                                  </div>
                                </div>
                              );
                          })}
                        </div>
                        }
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            ) : 
              (
                <div className="evolution-container" style={{ minHeight: "100%" }}>
                  <div>
                    <img alt="pokemonBasic" src={shiny ? evoChain.shiny : evoChain.sprite}></img>
                    <div style={{ textAlign: "center" }}>{evoChain.basic.toUpperCase()}</div>
                  </div>
                  <div>
                    <div>
                      {evoChain?.firstStage?.map((variant) => {
                        return (
                          <div key={variant.name} style={{ display: "flex" }}>
                            <div className="evoMethod-container">
                              {variant.methods.map((method) => {
                                return (
                                  <div key={method.trigger} className="poke-evoMethod">
                                    <div>
                                      <ArrowRightAltIcon />
                                    </div>
                                    <div className="poke-evoMethodSpecific">{evoMethodMapper(method)}</div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="firstEvo-container">
                              <img alt="pokemonMid" src={shiny ? variant.shiny : variant.sprite}></img>
                              <div>{variant.name.toUpperCase()}</div>
                            </div>

                            {variant.secondStage && 
                            <div className="secondStage-container">
                                {variant.secondStage.map((vari) => {
                                  return (
                                    <div key={vari.name} style={{ display: "flex" }}>
                                      <div className="evoMethod-container">
                                        {vari.methods.map((method) => {
                                          return (
                                            <div key={method.trigger} className="poke-evoMethod">
                                              <div>
                                                <ArrowRightAltIcon />
                                              </div>
                                              <div className="poke-evoMethodSpecific">{evoMethodMapper(method)}</div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                      <div>
                                        <img alt="pokemonFinal" src={shiny ? vari.shiny : vari.sprite}></img>
                                        <div>{vari.name.toUpperCase()}</div>
                                      </div>
                                    </div>
                                  );
                              })}
                            </div>
                            }
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )
            }
          </>
        )}
      </div>
    </div>
  );
}
