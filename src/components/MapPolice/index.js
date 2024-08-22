import React, { Component } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { render } from 'react-dom';
import moment from 'moment';

import Loading from '../Loading';
import firebaseSos from '../../constants/configSOS';
import { POLICE_TRACKING_COLLECTION, getPoliceByMessage, createDocPolice } from '../../Api/sos';

import shoes_red from '../../assets/images/icons/maps/shoes_red.png';
import police_blue from '../../assets/images/icons/maps/p1_blue_car.png';
import police_yellow from '../../assets/images/icons/maps/p1_yellow_car.png';
import { styles } from './styles';
import './style.css';

const MARKERS = {
  user: shoes_red,
  available: police_blue,
  unavailable: police_yellow
};

class MapPolice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      error: null,
      unsub: null,
      loading: true,
      policeIncident: [],
      markers: []
    };
  }

  componentDidMount() {
    if (!window.google) {
      // Google Key
      let key = 'AIzaSyCHiHNfeGxYKOZRj-57F957Xe08f64fLHo';
      if (process.env.NODE_ENV === 'production') key = 'AIzaSyDVdmSf9QE5KdHNDCSrXwXr3N7QnHaujtg';

      // Create Script
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://maps.google.com/maps/api/js?key=${key}`;
      let x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(script, x);
      script.addEventListener('load', () => this.onScriptLoad());
    } else this.onScriptLoad();
  }

  componentWillUnmount() {
    const { unsub } = this.state;
    if (unsub) unsub();
  }

  render() {
    const { loading, error } = this.state;
    const { show, _handlePoliceState } = this.props;

    return (
      <Modal show={show} centered={true} size={'xl'} onHide={_handlePoliceState}>
        <Modal.Header closeButton>Mandar Unidad</Modal.Header>
        <Modal.Body>
          {error ? (
            <p>{error}</p>
          ) : (
            <div>
              <p> Policias Disponibles: </p>
              <Row style={styles.mapCointainer}>
                {loading && <Loading />}
                <div className={loading ? 'd-none' : ''} style={styles.map} ref='mapDiv' />
              </Row>
            </div>
          )}
          <hr />

          <div style={styles.buttonsFooter}>
            <Button style={styles.button} variant='danger' onClick={() => _handlePoliceState()}>
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  onScriptLoad = () => {
    try {
      // Map
      const { mapDiv } = this.refs;
      const { incident, tracking: { pointCoords }, limits: { data: { clave_municipal } } } = this.props;
      const { latitude: lat, longitude: lng } = pointCoords[pointCoords.length - 1];
      const coords = { lat: parseFloat(lat), lng: parseFloat(lng) };
      const map = new window.google.maps.Map(mapDiv, this._getOptions(coords));

      // Marker Person Incident
      new window.google.maps.Marker({ position: coords, map: map, title: incident.user_name, icon: MARKERS.user });

      // Markers Polices
      const unsub = firebaseSos
        .app('sos')
        .firestore()
        .collection(POLICE_TRACKING_COLLECTION)
        .where('clientId', '==', clave_municipal)
        .onSnapshot(async (snap) => {
          this.setState({ loading: true });

          const { success, data } = await getPoliceByMessage(incident.id);
          if (success && data && data.policeList) this.setState({ policeIncident: data.policeList });

          // Init
          const { markers } = this.state;
          if (markers.length <= 0 && snap && snap.docs.length > 0) {
            snap.docs.forEach((d) => {
              const { active } = d.data();
              if (active) this._addMarker({ id: d.id, ...d.data() }, map);
            });
          }

          // Added
          let docsAdded = snap.docChanges().filter((item) => item.type === 'added');
          if (docsAdded.length > 0 && docsAdded.length !== snap.docs.length) {
            docsAdded.forEach((d) => {
              const { active } = d.doc.data();
              if (active) this._addMarker({ id: d.doc.id, ...d.doc.data() }, map);
            });
          }

          // Modified
          let docsModified = snap.docChanges().filter((item) => item.type === 'modified');
          if (docsModified.length > 0 && docsModified.length !== snap.docs.length) {
            docsModified.forEach((d) => {
              const { active, policeId } = d.doc.data();
              const marker = markers[policeId];

              if (active && marker && marker.extraData !== { id: d.doc.id, ...d.doc.data() }) {
                this._removeMarker({ id: d.doc.id, ...d.doc.data() });
                this._addMarker({ id: d.doc.id, ...d.doc.data() }, map);
              } else {
                if (active) this._addMarker({ id: d.doc.id, ...d.doc.data() }, map);
                else this._removeMarker({ id: d.doc.id, ...d.doc.data() });
              }
            });
          }
          this.setState({ loading: false });
        });

      this.setState({ map, unsub });
    } catch (error) {
      this.setState({ error });
    }
  };

  _addMarker = (police, map) => {
    const { markers, policeIncident } = this.state;
    const { id, available, policeId, police_name, lastLocation: { latitude, longitude } } = police;

    let foundPolice = policeIncident.find((p) => p.id === policeId);

    markers[policeId] = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      icon: MARKERS[`${available ? '' : 'un'}available`],
      map: map,
      title: police_name,
      extraData: { id, ...police, stateList: foundPolice }
    });

    window.google.maps.event.addListener(
      markers[policeId],
      'click',
      ((police, currentMap, infoWindow) => {
        return () => infoWindow(police, currentMap);
      })(markers[policeId], map, this._createInfoWindow)
    );
  };

  _removeMarker = (police) => {
    const { markers } = this.state;
    let newMarkers = [];
    markers.forEach((marker) => {
      if (marker.extraData.policeId !== police.policeId) newMarkers[marker.extraData.policeId] = marker;
      else marker.setMap(null);
    });
    this.setState({ markers: newMarkers });
  };

  _createInfoWindow = (marker, map) => {
    const { position, extraData } = marker;
    const { policeId } = extraData;

    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div id="infoWindow${policeId}" class="windowpopinfo"/>`,
      position: { lat: position.lat(), lng: position.lng() }
    });

    infoWindow.addListener(
      'domready',
      ((police, render, _render) => {
        return () => {
          const { policeId } = police;
          render(_render(police), document.getElementById(`infoWindow${policeId}`));
        };
      })(extraData, render, this._renderInfo)
    );
    infoWindow.open(map);
    const i = setInterval(() => {
      if (!infoWindow.getMap()) {
        infoWindow.close();
        clearInterval(i);
      }
    }, 1000);
  };

  _renderInfo = (police) => {
    const { available, policeId, police_name, updatedAt, stateList } = police;
    const { incident, tracking } = this.props;
    const disabled = stateList && stateList.status === false;

    return (
      <div style={styles.infoWindow}>
        <Row>
          <Col>
            <h3 style={styles.text}>{police_name}</h3>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <p style={styles.text}>Fecha de la última localización:</p>
          </Col>
          <Col>
            <p>{moment.unix(updatedAt.seconds).format('DD/MM/YYYY')}</p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <p style={styles.text}>Hora de la última localización:</p>
          </Col>
          <Col>
            <p>{moment.unix(updatedAt.seconds).format('hh:mm:ss')}</p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <p style={styles.text}>Estado:</p>
          </Col>
          <Col>
            <p>{available ? 'Disponible' : 'No Disponible'}</p>
          </Col>
        </Row>
        <hr />
        {stateList && stateList.status === false && (
          <div>
            <Row>
              <Col>
                <p style={styles.text} align="center">* El policia ya ha denegado esta incidencia. Razon: {stateList.reason}.</p>
              </Col>
            </Row>
            <hr />
          </div>
        )}
        <div style={styles.buttonsFooter}>
          <Button
            style={styles.button}
            variant={available ? 'info' : 'warning'}
            onClick={async () => {
              const { limits, _handlePoliceState } = this.props;
              this.setState({ loading: true });
              const data = await createDocPolice(incident, tracking, policeId, limits);
              this.setState({ loading: false });
              _handlePoliceState();
              if (!data.success) alert('Se ha asignado el policia, pero no hemos podido enviar la notificacion.');
            }}
            disabled={!available || disabled}
          >
            Asignar
          </Button>
        </div>
      </div>
    );
  };

  _getOptions = (center) => {
    return {
      center: { ...center },
      zoom: 15,
      mapTypeId: 'roadmap',
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      openConfirm: false,
      typeConfirm: false,
      openSelection: false,
      checked: ''
    };
  };
}

const mapStateToProps = (state) => ({ limits: state.limits });
const mapDispatchToProps = (dispatch) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(MapPolice);
