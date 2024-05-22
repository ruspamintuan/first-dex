import React, { useEffect, useState } from "react";
import { groupMovesByVersion } from "../helpers/poke-helper";
import { Tabs } from "@mui/material";
import { Tab } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { typeColors } from "../helpers/poke-helper";

export default function PokeMoves({ moves }) {
  const [groupedMoves, setGroupedMoves] = useState(groupMovesByVersion(moves));
  const version = Object.keys(groupedMoves);
  const [gameVersion, setGameVersion] = useState(version[0]);
  const [moveMethods, setMoveMethods] = useState([]);
  const [method, setMethod] = useState("");

  useEffect(() => {
    const availableMethods = Object.keys(groupedMoves[gameVersion]).sort();
    setMoveMethods(availableMethods);
    setMethod(availableMethods[0]);
    //eslint-disable-next-line
  }, [gameVersion]);

  useEffect(() => {
    async function getMoveDetails() {
      if (moveMethods && method) {
        const activeMoves = groupedMoves[gameVersion][method];
        const found = activeMoves.find((move) => move.type && move.id);
        if (!found) {
          const mappedMoveDetails = activeMoves.map(async (move) => {
            const res = await axios.get(move.url);

            if (method === "machine") {
              const machineVersion = res.data.machines.find((ver) => ver.version_group.name === gameVersion);

              if (machineVersion?.machine?.url) {
                const machineDetails = await axios.get(machineVersion?.machine?.url);
                return { ...move, ...res.data, machine: machineDetails?.data?.item?.name };
              }
            }

            return { ...move, ...res.data };
          });

          const moveDetails = await Promise.all(mappedMoveDetails);
          setGroupedMoves((prev) => {
            const detailed = {
              [method]: moveDetails,
            };

            const updatedMoves = { ...groupedMoves[gameVersion], ...detailed };

            return { ...prev, ...{ [gameVersion]: updatedMoves } };
          });
        }
      }
    }

    getMoveDetails();
    //eslint-disable-next-line
  }, [moveMethods, method]);

  return (
    <div style={{ width: "90%" }}>
      <div>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Game</InputLabel>
          <Select
            defaultValue=""
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={gameVersion}
            label="Game"
            onChange={(val) => {
              setGameVersion(val.target.value);
            }}>
            {version.map((game) => {
              return <MenuItem value={game}>{game.toUpperCase()}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </div>
      <div>
        <div style={{ display: "flex" }}>
          <Tabs value={method} onChange={(e, val) => setMethod(val)} orientation="horizontal">
            {moveMethods.map((method, index) => {
              return <Tab label={method} value={method} />;
            })}
          </Tabs>
        </div>
      </div>

      <div style={{ height: "70vh", overflowY: "scroll" }}>
        <div style={{ display: "flex" }}>
          <div style={{ minWidth: "10%", textAlign: "center" }}>{method === "machine" ? "#" : "LEVEL"}</div>
          <div style={{ minWidth: "30%", textAlign: "center" }}>NAME</div>
          <div style={{ minWidth: "10%", textAlign: "center" }}>POWER</div>
          <div style={{ minWidth: "10%", textAlign: "center" }}>ACCURACY</div>
          <div style={{ minWidth: "10%", textAlign: "center" }}>PP</div>
          <div style={{ minWidth: "14%", textAlign: "center" }}>TYPE</div>
          <div style={{ minWidth: "15%", textAlign: "center" }}>CATEGORY</div>
        </div>
        {groupedMoves[gameVersion][method] &&
          groupedMoves[gameVersion][method]
            .sort((a, b) => a.level - b.level || a?.machine?.localeCompare(b?.machine))
            .map((move) => {
              return (
                <div style={{ display: "flex", marginTop: "10px", marginBottom: "10px", paddingTop: "10px", paddingBottom: "10px", borderTop: "2px solid black", borderBottom: "2px solid black" }}>
                  <div style={{ minWidth: "10%", textAlign: "center", alignSelf: "center" }}>{move.level || move?.machine?.toUpperCase() || "-"}</div>
                  <div style={{ minWidth: "30%", textAlign: "center", alignSelf: "center" }}>{move.name.replaceAll("-", " ").toUpperCase()}</div>
                  <div style={{ minWidth: "10%", textAlign: "center", alignSelf: "center" }}>{move.power || "-"}</div>
                  <div style={{ minWidth: "10%", textAlign: "center", alignSelf: "center" }}>{move.accuracy || "-"}</div>
                  <div style={{ minWidth: "10%", textAlign: "center", alignSelf: "center" }}>{move.pp}</div>
                  <div style={{ minWidth: "14%", textAlign: "center", alignSelf: "center", border: "2px solid black", borderRadius: "40px", backgroundColor: typeColors[move?.type?.name] }}>
                    {move?.type?.name?.toUpperCase() || ""}
                  </div>
                  <div style={{ minWidth: "15%", textAlign: "center", alignSelf: "center" }}>{move?.damage_class?.name?.toUpperCase() || ""}</div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
