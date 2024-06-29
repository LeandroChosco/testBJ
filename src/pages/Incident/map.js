import React, { useEffect, useState } from 'react'
import mapStyles from "./mapStyles";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import warning from "../../assets/images/warnings/warning.svg";
import { arrayWarnings } from './arrayWarnings';
import ModalIncident from '../../components/ModalIncident';
import conections from '../../conections';

export default function MapaGoogle(props) {
  const { dataMap } = props;
  const [center, setCenter] = useState({ lat: 19.3984, lng: -99.15766 });

  function Map() {
    const [selectMarker, setSelectMarker] = useState(null);

    const filterMarker = (id) => {
      if (id) {
        setSelectMarker(true)
        conections.getIncidentById(id).then(response => {
          if (response.data.success) {
            setSelectMarker(response.data.data);
          };
        })
          .catch(err => console.log(err));
      } else {
        setSelectMarker(id);
      }
    };

    return (
      <GoogleMap
        defaultZoom={14}
        defaultCenter={{ lat: center.lat, lng: center.lng }}
        defaultOptions={{ styles: mapStyles }}
      >
        {dataMap.length > 0 &&
          dataMap.map((incident, index) => (
            <Marker
              key={index}
              position={{
                lat: parseFloat(
                  incident.coordinates.latitude
                ),
                lng: parseFloat(
                  incident.coordinates.longitude
                ),
              }}
              onClick={() => filterMarker(incident._id)}
              icon={{
                url: arrayWarnings.some(el => el.color === "#123123") ? arrayWarnings.find(el => el.color === "#123123").icon : warning,
                scaledSize: new window.google.maps.Size(25, 25),
              }}
            />
          ))}
        {
          selectMarker && <ModalIncident marker={selectMarker} hideModal={() => filterMarker(null)} />
        }
        {/* {selectMarker && (
          <InfoWindow
            position={{
              lat: parseFloat(
                selectMarker.coordinates.latitude
              ),
              lng: parseFloat(
                selectMarker.coordinates.longitude
              ),
            }}
            onCloseClick={() => {
              filterMarker(null);
            }}
          >
            <div>
              {
                selectMarker.tags.map((el, idx) => {
                  return <h3 key={idx}>{`#${el} `}</h3>
                })
              }
            </div>
          </InfoWindow>
        )} */}
      </GoogleMap>
    );
  }

  const WrappedMap = withScriptjs(withGoogleMap(Map));

  useEffect(() => {
    let averageLat = 0;
    let averageLng = 0;

    dataMap.forEach(el => {
      averageLat += parseFloat(el.coordinates.latitude);
      averageLng += parseFloat(el.coordinates.longitude);
    });

    if(!isNaN(averageLat) && !isNaN(averageLng)){
      let newCenter = {
        lat: averageLat / dataMap.length,
        lng: averageLng / dataMap.length,
      }; 
      setCenter(newCenter);
    };
    
  }, [dataMap]);

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
