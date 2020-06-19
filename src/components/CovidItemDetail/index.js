import React, { useEffect, useState } from "react";
import { Image, Header, Button, Radio } from "semantic-ui-react";

import "./style.css";
import MapContainer from "../../components/MapContainer/index.js";
import { Modal, Navbar } from "react-bootstrap";
import conections from "../../conections";
import constants from "../../constants/constants";

const mapOptions = {
  center: { lat: 19.45943, lng: -99.208588 },
  zoom: 15,
  mapTypeId: "roadmap",
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  openConfirm: false,
  typeConfirm: false,
  openSelection: false,
  checked: ""
};

const CovidItemDetail = props => {
  const mapOptions = {
    center: { lat: 19.45943, lng: -99.208588 },
    zoom: 15,
    mapTypeId: "roadmap",
    zoomControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    openConfirm: false,
    typeConfirm: false,
    openSelection: false,
    checked: ""
  };
  //   const place = [
  //     {
  //       name: "Carrilo Puerto , 413 ,Tacuba Miguel Hidalgo CDMX",
  //       lat: 19.45943,
  //       lng: -99.208588,
  //       id: 1,
  //       webSocket: "ws://18.222.106.238:1001"
  //     }
  //   ];

  const [places, setPlaces] = useState([]);
  const [dataComplete, setDataComplete] = useState({});
  const [loading, setLoading] = useState(true);
  const [geolocation, setGeolocation] = useState([]);

  useEffect(() => {
    let data = camDataPeticion();
    console.log(data);
  }, []);

  const camDataPeticion = () => {
    let nameToGet = props.match.params.id.split(".");
    conections
      .getOnTermicPhotoData(nameToGet.join(""))
      .then(res => {
        console.log(res);
        setTimeout(() => {
          setGeolocation(
            res.data.data[0].camData[0].google_cordenate.split(",")
          );
          setDataComplete(res.data.data[0]);
          setPlaces([
            {
              name:
                res.data.data[0].camData[0].street +
                " No. " +
                res.data.data[0].camData[0].number +
                " Col. " +
                res.data.data[0].camData[0].town,
              lat: 19.3724767,
              lng: -99.1607861,
              id: 1,
              webSocket: "ws://18.222.106.238:1001"
            }
          ]);
          setLoading(false);
        }, 1000);
        return res.data.data[0];
      })
      .catch(err => {
        console.log(err);
      });
  };

  const _onMapLoad = map => {
    const marker = [];

    places.map((value, index) => {
      marker[index] = new window.google.maps.Marker({
        position: { lat: value.lat, lng: value.lng },
        map: map,
        title: value.name,
        extraData: value
      });
      map.setCenter({ lat: value.lat, lng: value.lng });
      return true;
    });
  };
  if (loading === true) {
    return <h4>CARGANDO...</h4>;
  }
  return (
    <div>
      <Navbar sticky="top" expand="lg" variant="light" bg="mh">
        <Navbar.Text>Camara {dataComplete.cam_id} Alerta Covid</Navbar.Text>
      </Navbar>
      <div className="mapContainerForDetail">
        <MapContainer
          options={mapOptions}
          places={places}
          onMapLoad={_onMapLoad}
        />
      </div>
      <div className="row">&nbsp;</div>

      <div className="card">
        <div className="card">
          <div className="row">
            <div className="col-4">
              <div className="card-image">
                <Image
                  wrapped
                  size="medium"
                  src={
                    constants.sails_url +
                    ":" +
                    constants.sails_port +
                    "/" +
                    dataComplete.relative_path +
                    "/" +
                    dataComplete.name
                  }
                />
              </div>
            </div>
            <div className="col-8">
              <h4>Datos de Cámara</h4>
              <div className="row">
                <div className="col-12">
                  <b>Ubicación:</b>
                  <div className="">
                    {dataComplete.camData[0].street +
                      " No. " +
                      dataComplete.camData[0].number +
                      "," +
                      " Col. " +
                      dataComplete.camData[0].town +
                      ", " +
                      dataComplete.camData[0].township}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CovidItemDetail;
