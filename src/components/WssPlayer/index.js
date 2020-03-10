import React, { useEffect } from "react";
import { Card } from "react-bootstrap";
import JSMpeg from "jsmpeg-player";
import "./style.css";

const WssPlayer = ({ data }) => {
  // console.log("ENTRO AL COMPONENTE WSS");
  // console.log(data);

  let player = null;
  const appendID = `player${data.num_cam}`;
  useEffect(() => {
    try {
      // const player = () =>
      //   new JSMpeg.VideoElement(`#${appendID}`, data.dataCamValue.dns, {
      //     autoSetWrapperSize: false
      //   });
      // player();
      player = new JSMpeg.VideoElement(`#${appendID}`, data.dataCamValue.dns, {
        autoSetWrapperSize: false
      });
      console.log(data.num_cam);
      console.log(player);
    } catch (error) {
      console.log("Error player");
      console.log(error);
    }
    // return () => {
    //   player.destroy();
    // };
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
