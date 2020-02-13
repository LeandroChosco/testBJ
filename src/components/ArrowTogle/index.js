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
    <React.Fragment>
      {flecha ? (
        <button className="containerToHide" onClick={changeArrow}>
          <Icon name="chevron circle right" size="big" />
        </button>
      ) : (
        <button className="containerToShow" onClick={changeArrow}>
          <Icon name="chevron circle left" size="big" />
        </button>
      )}
    </React.Fragment>
  );
};

export default ArrowToggle;
