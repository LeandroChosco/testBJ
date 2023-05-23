import React from 'react';

import { Modal } from 'react-bootstrap';
import MapContainer from '../MapContainer';
import './style.css'
import constants from '../../constants/constants';
import MatchInfo from '../MatchInfo';
import MatchTimeline from '../MatchTimeline';
import CameraStream from '../CameraStream';

import { data, propsIniciales } from './object'

const mapOptions = {
  center: { lat: 19.45943, lng: -99.208588 },
  zoom: constants.zoomAlert,
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


const ModalMatch = ({ modalVisible, closeModal, info, allMatches }) => {

  const onMapLoad = (map) => {
    map.setCenter(
      new window.google.maps.LatLng(
        parseFloat(19.45943),
        parseFloat(-99.208588)
      )
    );
    new window.google.maps.Marker({
      position: {
        lat: parseFloat(19.45943),
        lng: parseFloat(-99.208588)
      },
      map: map,
      title: "Denuncia anonima"
    });
  };

  return (
    <Modal
      size='xl'
      backdrop={"static"}
      show={modalVisible}
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title  >Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="boxMap">
            <MapContainer
              options={mapOptions}
              onMapLoad={onMapLoad}
            />
          </div>
          <div className="cameraStream">
            <CameraStream className="cardModal"
              key={data.extraData.id}
              marker={data}
              propsIniciales={propsIniciales}
              height="235px"
              width="470px"
              border="10px solid #ccc !important"
              hideTitle="true"
              hideButton="true"
              style={{border: "none"}}
            />
          </div>
          <MatchInfo info={info} allMatches={allMatches} />
          <MatchTimeline allMatches={allMatches} info={info} />
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ModalMatch;