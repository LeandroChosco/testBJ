import React, { useState } from 'react'
import mapStyles from "./mapStyles";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import warning from "../../assets/images/warning.svg";
export default function MapaGoogle(props) {

  function Map() {
    const { dataMap } = props
    const [selectMarker, setSelectMarker] = useState(null);

    return (
      <GoogleMap
        defaultZoom={14}
        defaultCenter={{ lat: 19.3984, lng: -99.15766 }}
        defaultOptions={{ styles: mapStyles }}
      >
        {dataMap.length > 0 &&
          dataMap.map((incident, index) => (
            <Marker
              key={index}
              position={{
                lat: parseFloat(
                  incident.camera.camData.google_cordenate.split(",")[0]
                ),
                lng: parseFloat(
                  incident.camera.camData.google_cordenate.split(",")[1]
                ),
              }}
              onClick={() => setSelectMarker(incident)}
              icon={{
                url: warning,
                scaledSize: new window.google.maps.Size(25, 25),
              }}
            />
          ))}
        {selectMarker && (
          <InfoWindow
            position={{
              lat: parseFloat(
                selectMarker.camera.camData.google_cordenate.split(",")[0]
              ),
              lng: parseFloat(
                selectMarker.camera.camData.google_cordenate.split(",")[1]
              ),
            }}
            onCloseClick={() => {
              setSelectMarker(null);
            }}
          >
            <div>
              <h3>{selectMarker.tag} </h3>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    );
  }

  const WrappedMap = withScriptjs(withGoogleMap(Map));
  return (

    <WrappedMap
      // googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_APIKEY_C5VIRTUAL}`}
      googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBz_MJT1pf14hIqVQ-Sy43pKby3hrhmmEo&v=3.exp&libraries=geometry,drawing,places`}
      loadingElement={<div style={{ height: `100%` }} />}
      containerElement={<div style={{ height: `100%` }} />}
      mapElement={<div style={{ height: `100%` }} />}
    />

  )

}
