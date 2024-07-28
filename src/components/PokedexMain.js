import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import PokedexHome from "./PokedexHome";
import PokeModal from "./PokeModal";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useLocation } from "react-router";

export default function PokedexMain() {
  const [pokeList, setPokeList] = useState([]);
  const [pokeListDetails, setPokeListDetails] = useState([]);
  const [shown, setShown] = useState([]);
  const [currentCount, setCurrentCount] = useState(10);
  const [pokedexList, setPokedexList] = useState([]);
  const [pokedex, setPokedex] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const filteredList = useMemo(() => pokeList?.filter((poke) => poke?.pokemon_species?.name?.includes(searchInput.toLowerCase())), [searchInput, pokeList]);
  const location = useLocation();

  useEffect(() => {
    setShown(filteredList.slice(0, currentCount));
  }, [filteredList, currentCount]);

  useEffect(() => {
    shown.forEach((poke) => {
      const found = pokeListDetails.find((item) => item?.pokemon_species?.name === poke.pokemon_species.name);
      if (!found) {
        setPokeListDetails((old) => [...old, poke]);
      }
    });
    // eslint-disable-next-line
  }, [shown]);

  function loadMore() {
    setCurrentCount((e) => e + 10);
  }

  const fetchPokeList = async function (url) {
    const result = await axios.get(url);
    setPokeList(result.data.pokemon_entries);
    setCurrentCount(10);
  };

  useEffect(() => {
    async function getPokedexList() {
      const result = await axios.get("https://pokeapi.co/api/v2/pokedex/?limit=40");

      setPokedexList(result.data.results);
      setPokedex(result.data.results[0]);
    }

    getPokedexList();
  }, []);

  useEffect(() => {
    if (pokedex && pokedexList) {
      const pokedexUrl = pokedexList.find((dex) => dex.name === pokedex.name).url;
      fetchPokeList(pokedexUrl);
    }
  }, [pokedex, pokedexList]);

  return (
    <div>
      {pokedexList?.length > 0 && pokedex && (
        <>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Pokedex</InputLabel>
            <Select
              defaultValue=""
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={pokedex}
              label="Generation"
              on
              onChange={(val) => {
                setPokedex(val.target.value);
              }}>
              {pokedexList.map((dex) => {
                return <MenuItem value={dex}>{dex.name.toUpperCase()}</MenuItem>;
              })}
            </Select>
          </FormControl>
          <TextField id="standard-basic" label="Search" variant="standard" onKeyDown={(e) => {
            if (e.code === "Enter" || e.key === "Enter") {
              setSearchInput(e.target.value)
            }
          }}/>
        </>
      )}
      <Routes>
        <Route path="/pokedex" element={<Outlet />}>
          <Route path="" element={<PokedexHome pokeList={shown} />}></Route>
          <Route path=":id" element={<PokeModal />}></Route>
        </Route>
        <Route path="/" element={<Navigate to="/pokedex" replace />} />
      </Routes>
      {location?.pathname === "/pokedex/" && (
        <div
          style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "50px",
          height: "5vh",
        }}>
          <button style={{ width: "30%" }} onClick={() => loadMore()}>
            LOAD MORE
        </button>
        </div>
      )}
    </div>
  );
}
