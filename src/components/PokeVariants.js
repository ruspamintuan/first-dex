import React from "react";

export default function PokeVariants({ variant, shiny }) {
  function convertToTitleCase(input) {
    const words = input.split("-");
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(" ");
  }

  return (
    <>
      <div style={{ width: "90%" }}>
        {variant
          .filter((i) => !i.is_default)
          .map((vari) => {
            const id = vari.pokemon.url.replace("https://pokeapi.co/api/v2/pokemon/", "").replace("/", "");
            return (
              <div style={{ textAlign: "center" }} className="div-bordered">
                <img
                  alt="pokevariant"
                  width={"20%"}
                  src={
                    shiny
                      ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${id}.png`
                      : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
                  }></img>
                <div>{convertToTitleCase(vari.pokemon.name)}</div>
              </div>
            );
          })}
      </div>
    </>
  );
}
