import React, { useState } from "react";
import { typeColors, getTypeIcon } from "../helpers/poke-helper";
import axios from "axios";
import { Modal, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import Box from "@mui/material/Box";
import { extractId } from "../helpers/poke-helper";
import { styled } from "@mui/material/styles";

const PokeballAvatar = styled(Avatar)(({ theme }) => ({
  width: 40 /* Adjust size */,
  height: 40 /* Adjust size */,
  background: "linear-gradient(to bottom, red 50%, white 50%)",
  border: "2px solid black",
  position: "relative",
}));

export default function PokeType({ type, allowClick, ...props }) {
  const [showModal, setShowModal] = useState(false);
  const [typeDetails, setTypeDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const getTypeData = async () => {
    if (type && allowClick) {
      setShowModal(true);
      const result = await axios.get(`https://pokeapi.co/api/v2/type/${type?.name}`);
      console.log("Resulttt", result);
      setTypeDetails(result?.data);
      setLoading(false);
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "white",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    height: "50%",
  };

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <>
      <div
        className="poke-type"
        style={{ backgroundColor: typeColors[type.name], ...props.style }}
        onClick={async () => {
          await getTypeData();
        }}
      >
        <div style={{ minWidth: "15%", display: "flex" }}>
          <img alt="poketype-icon" style={{ width: "100%" }} src={getTypeIcon(type?.name)}></img>
        </div>
        <div style={{ minWidth: "90%", alignSelf: "center" }}>{type?.name?.toUpperCase()}</div>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box sx={modalStyle}>
          <div style={{ overflow: "scroll", height: "100%" }}>
            {loading ? (
              <div>LOADING...</div>
            ) : (
              <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                {typeDetails?.pokemon?.map((poke) => {
                  console.log("pokeee", poke);
                  // return <div>{`Pokemon - ${poke?.pokemon?.name}`}</div>;
                  return (
                    <ListItem>
                      <ListItemAvatar>
                        <PokeballAvatar
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractId(
                            poke?.pokemon?.url
                          )}.png`}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={capitalize(poke?.pokemon?.name)} />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
}
