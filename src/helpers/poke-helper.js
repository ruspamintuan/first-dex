import bug from "../images/icons/bug.svg";
import dark from "../images/icons/dark.svg";
import dragon from "../images/icons/dragon.svg";
import electric from "../images/icons/electric.svg";
import fairy from "../images/icons/fairy.svg";
import fighting from "../images/icons/fighting.svg";
import fire from "../images/icons/fire.svg";
import flying from "../images/icons/flying.svg";
import ghost from "../images/icons/ghost.svg";
import grass from "../images/icons/grass.svg";
import ground from "../images/icons/ground.svg";
import ice from "../images/icons/ice.svg";
import normal from "../images/icons/normal.svg";
import poison from "../images/icons/poison.svg";
import psychic from "../images/icons/psychic.svg";
import rock from "../images/icons/rock.svg";
import steel from "../images/icons/steel.svg";
import water from "../images/icons/water.svg";

export function getTypeIcon(type) {
  switch (type) {
    case "bug":
      return bug;
    case "dark":
      return dark;
    case "dragon":
      return dragon;
    case "electric":
      return electric;
    case "fairy":
      return fairy;
    case "fighting":
      return fighting;
    case "fire":
      return fire;
    case "flying":
      return flying;
    case "ghost":
      return ghost;
    case "grass":
      return grass;
    case "ground":
      return ground;
    case "ice":
      return ice;
    case "normal":
      return normal;
    case "poison":
      return poison;
    case "psychic":
      return psychic;
    case "rock":
      return rock;
    case "steel":
      return steel;
    case "water":
      return water;
    default:
      return normal;
  }
}

export function pokeSpriteMapper(sprites) {
  const validSprites = [];
  Object.keys(sprites).forEach((key) => {
    if (key !== "other" && key !== "versions" && sprites[key]) {
      if (key === "animated") {
        Object.keys(sprites[key]).forEach((item) => {
          if (sprites[key][item]) {
            validSprites.push({
              label: `${key}_${item}`,
              src: sprites[key][item],
            });
          }
        });
      } else {
        validSprites.push({
          label: key,
          src: sprites[key],
        });
      }
    }
  });

  return validSprites;
}

export function groupMovesByVersion(moves) {
  return moves.reduce((result, current) => {
    current.version_group_details.forEach((move) => {
      // Creates object with gameversion as key
      if (!result[move.version_group.name]) {
        result[move.version_group.name] = {};
      }

      if (!result[move.version_group.name][move.move_learn_method.name]) {
        result[move.version_group.name][move.move_learn_method.name] = [];
      }

      result[move.version_group.name][move.move_learn_method.name].push({
        ...current.move,
        method: move.move_learn_method.name,
        level: move.level_learned_at,
      });
    });

    return result;
  }, {});
}

function pokeSpeciesIdParser(link) {
  return link.replace("https://pokeapi.co/api/v2/pokemon-species/", "").replace("/", "");
}

export async function evolutionBuilder(data) {
  const line = {
    basic: data.chain.species.name,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeSpeciesIdParser(data.chain.species.url)}.png`,
    shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokeSpeciesIdParser(data.chain.species.url)}.png`,
    id: pokeSpeciesIdParser(data.chain.species.url),
  };

  if (data.chain.evolves_to.length !== 0) {
    const firstStage = data.chain.evolves_to.map((variant) => {
      const evolution = {
        name: variant.species.name,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeSpeciesIdParser(variant.species.url)}.png`,
        shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokeSpeciesIdParser(variant.species.url)}.png`,
        id: pokeSpeciesIdParser(variant.species.url),
      };

      const evoMethods = [];
      // For multi-evolution methods
      variant.evolution_details.forEach((detail) => {
        const evoDetails = {
          trigger: detail.trigger.name,
        };
        Object.keys(detail).forEach((key) => {
          if (detail[key] && key !== "trigger") {
            evoDetails[key] = detail[key]?.name || detail[key];
          }
        });

        if (evoDetails?.min_level) {
          evoDetails.level = evoDetails.min_level;
          delete evoDetails.min_level;
        }

        // Push only if details is complete (trigger isn't the only property)
        if (Object.keys(evoDetails).length > 1 || (Object.keys(evoDetails).length === 1 && evoDetails.trigger !== "level-up")) {
          evoMethods.push(evoDetails);
        }
      });

      evolution.methods = evoMethods;

      if (variant.evolves_to.length > 0) {
        const secondStage = variant.evolves_to.map((evolve) => {
          const nextEvo = {
            name: evolve.species.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeSpeciesIdParser(evolve.species.url)}.png`,
            shiny: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokeSpeciesIdParser(evolve.species.url)}.png`,
            id: pokeSpeciesIdParser(evolve.species.url),
          };

          const evoMethods = [];
          // For multi-evolution methods
          evolve.evolution_details.forEach((detail) => {
            const nextEvoDetails = {
              trigger: detail.trigger.name,
            };
            Object.keys(detail).forEach((key) => {
              if (detail[key] && key !== "trigger") {
                nextEvoDetails[key] = detail[key]?.name || detail[key];
              }
            });

            if (nextEvoDetails?.min_level) {
              nextEvoDetails.level = nextEvoDetails.min_level;
              delete nextEvoDetails.min_level;
            }

            // Push only if details is complete (trigger isn't the only property)
            if (Object.keys(nextEvoDetails).length > 1 || (Object.keys(nextEvoDetails).length === 1 && nextEvoDetails.trigger !== "level-up")) {
              evoMethods.push(nextEvoDetails);
            }
          });

          nextEvo.methods = evoMethods;

          return nextEvo;
        });

        evolution.secondStage = secondStage;
      }

      return evolution;
    });

    line.firstStage = firstStage;
  }

  return line;
}

export const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const levelUpMapper = (evoDetail) => {
  let levelUp = "";

  if (evoDetail?.min_beauty) {
    levelUp += `Beauty`;
  } else if (evoDetail?.min_happiness) {
    levelUp += `Happiness`;
  } else if (evoDetail?.min_affection) {
    levelUp += `Affection`;
  } else if (evoDetail?.level) {
    levelUp += `Level ${evoDetail.level}`;
  }

  if (evoDetail.gender) {
    levelUp += evoDetail.gender === 1 ? ` (Female)` : ` (Male)`;
  }

  if (evoDetail.known_move_type) {
    levelUp += `(Knows ${evoDetail.known_move_type} type move)`;
  }

  if (evoDetail.location) {
    levelUp += ` (${evoDetail.location})`;
  }

  if (evoDetail.time_of_day) {
    levelUp += ` (${evoDetail.time_of_day})`;
  }

  return levelUp;
};

const tradeMapper = (evoDetail) => {
  if (evoDetail?.trade_species) {
    return `Trade for ${evoDetail.trade_species}`;
  } else if (evoDetail?.held_item) {
    return `Trade (with ${evoDetail.held_item})`;
  }

  return `Trade`;
};

export const evoMethodMapper = (evolution) => {
  const method = evolution.trigger;

  switch (method) {
    case "level-up":
      return levelUpMapper(evolution);
    case "shed":
      return "Pokeball + Space in Party when evolving Nincada";
    case "trade":
      return tradeMapper(evolution);
    case "use-item":
      return `Use ${evolution?.item}`;
    default:
      return "EVOLVE";
  }
};

export const getPokemonNameAndId = (pokemonData) => {
  return `#${pokemonData?.id?.toString().padStart(3, "0")} - ${pokemonData?.name?.toString().toUpperCase()}`;
};

export const extractId = (url) => {
  return url.replace("https://pokeapi.co/api/v2/pokemon/", "").replace("/", "");
};
