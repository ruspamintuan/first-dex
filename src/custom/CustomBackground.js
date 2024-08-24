import React, { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";

export default function CustomBackground(props) {
  const [backgroundColor, setBackgroundColor] = useState("");
  const fac = new FastAverageColor();

  const getAverageColor = async () => {
    if (props.pokemon?.id && props.imageLoaded) {
      const res = await fac.getColorAsync(props.pokemon?.sprites.front_default);
      setBackgroundColor(res.hex);
    } else {
      setBackgroundColor("");
    }
  };

  useEffect(() => {
    setBackgroundColor("");
    getAverageColor();
    //eslint-disable-next-line
  }, [props.pokemon, props.imageLoaded]);

  return (
    <div style={{ background: backgroundColor }} className={props.className}>
      {props.children}
    </div>
  );
}
