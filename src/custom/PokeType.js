import React, { useState } from "react";
import { typeColors, getTypeIcon } from "../helpers/poke-helper";
import axios from "axios";
import { Modal } from "@mui/material";
import Box from '@mui/material/Box';

export default function PokeType({ type, ...props }) {
  const [showModal, setShowModal] = useState(false)
  const [typeDetails, setTypeDetails] = useState({})
  const getTypeData = async () => {
    if(type) {
      const result = await axios.get(`https://pokeapi.co/api/v2/type/${type?.name}`)
      console.log("Resulttt", result)
      // setShowModal(true)
      setTypeDetails(result?.data)
    }
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    bgcolor: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    height: "100%"
  };

  return (
     <>
      <div className="poke-type" style={{ backgroundColor: typeColors[type.name], ...props.style }} onClick={async () => {
        await getTypeData()
      }}>
        <div style={{ minWidth: "15%", display: "flex" }}>
          <img alt="poketype-icon" style={{ width: "100%" }} src={getTypeIcon(type?.name)}></img>
        </div>
        <div style={{ minWidth: "90%", alignSelf: "center" }}>{type?.name?.toUpperCase()}</div>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)} >
        <Box sx={modalStyle}> 
          <div>
            {typeDetails?.pokemon?.map((poke) => {
              console.log("pokeee", poke)
              return (
                <div>
                  {`Pokemon - ${poke?.pokemon?.name}`}
                </div>
              )
            })}
          </div>
        </Box>
      </Modal>
     </>
  );
}
