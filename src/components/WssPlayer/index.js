import React, { useEffect } from "react";
import { Card } from "react-bootstrap";
import JSMpeg from "jsmpeg-player";
import "./style.css";

const WssPlayer = ({ data }) => {
  console.log("ENTRO AL COMPONENTE WSS");
  console.log(data);

  const appendID = `player${data.num_cam}`;

  useEffect(() => {
    try {
      var player = () =>
        new JSMpeg.VideoElement(
          `#${appendID}`,
          "wss://feeds.juganudigital.com/98457a6a",
          { autoSetWrapperSize: false }
        );
      player();
    } catch (error) {
      console.log("Error player");
      console.log(error);
    }
  }, []);

  return (
    <React.Fragment>
      <div
        id={appendID}
        className={
          data.fromMap
            ? "video-socket-contenedor-mapa"
            : "video-socket-contenedor-analisis"
        }
      ></div>
    </React.Fragment>
  );
};

export default WssPlayer;
