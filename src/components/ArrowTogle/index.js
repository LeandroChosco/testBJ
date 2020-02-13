import React, { useState } from "react";
import "./style.css";

import { Icon } from "semantic-ui-react";

const ArrowToggle = props => {
  const [flecha, guardarFlecha] = useState(true);
  const changeArrow = () => {
    props.ocultarMatches(!flecha);
    guardarFlecha(!flecha);
  };
  return (
    <button className="container" onClick={changeArrow}>
      <Icon name={flecha ? "arrow right" : "arrow left"} size="big" />
    </button>
  );
};

export default ArrowToggle;
