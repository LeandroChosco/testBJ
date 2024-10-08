import React, { useEffect, useState } from "react";
import { Image } from "semantic-ui-react";

import "./style.css";
import MapContainer from "../../components/MapContainer/index.js";
import { Navbar } from "react-bootstrap";
import conections from "../../conections";
import constants from "../../constants/constants";
import CovidTree from "../../pages/CovidTree";
import { Tab } from "semantic-ui-react";

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
    console.log(props);
    let data = camDataPeticion();
    console.log(data, geolocation);
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
      <Tab
        menu={{ secondary: true, pointing: true }}
        panes={[
          {
            menuItem: "Datos de camara",
            render: () => (
              <Tab.Pane attached={false}>
                <div className="card">
                  <div className="row">
                    <div className="col-4">
                      <div className="card-image">
                        <Image
                          wrapped
                          size="medium"
                          src={
                            constants.sails_url +
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
              </Tab.Pane>
            )
          },
          {
            menuItem: "Arbol de posible contagio",
            render: () => (
              <Tab.Pane attached={false}>
                <CovidTree />
              </Tab.Pane>
            )
          }
        ]}
      />

      <div className="card"></div>
    </div>
  );
};

export default CovidItemDetail;
