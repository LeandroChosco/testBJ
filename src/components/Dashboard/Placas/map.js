import React, {useState} from 'react'
import {
    GoogleMap,
    withScriptjs,
    withGoogleMap,
    Marker,
    InfoWindow,
  } from "react-google-maps";
  import circle from "../../../assets/images/circle.svg";
  export default function MapaGoogle ({setMarket,dataMap})  {

    function Map() {
        const [selectMarker, setSelectMarker] = useState(null);
      return (
        <GoogleMap
          defaultZoom={14}
          defaultCenter={{ lat: 19.3984, lng: -99.15766 }}
        >
          {dataMap.length > 0 &&
            dataMap.map((lpr, index) => (
              <Marker
                key={index}
                position={{
                  lat: parseFloat(
                    lpr.coord.latitude
                  ),
                  lng: parseFloat(
                    lpr.coord.longitude
                  ),
                }}
                onClick={() =>{
                  console.log(lpr)
                  setMarket(lpr)
                }}
                icon={{
                  url: circle,
                  scaledSize: lpr.totalCount<100 ? new window.google.maps.Size(lpr.totalCount, lpr.totalCount) : new window.google.maps.Size(100, 100),
                }}
              />
            ))}
          {/* {selectMarker && (
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
          )} */}
        </GoogleMap>
      );
    }
    
    const WrappedMap = withScriptjs(withGoogleMap(Map));
  return (
    
    <WrappedMap
    googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_APIKEY_C5VIRTUAL}`}
    loadingElement={<div style={{ height: `100%` }} />}
    containerElement={<div style={{ height: `100%` }} />}
    mapElement={<div style={{ height: `100%` }} />}
  />
     
  )
  
}
