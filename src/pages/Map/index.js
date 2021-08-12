import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { render } from 'react-dom';
import moment from 'moment';

import { JellyfishSpinner } from 'react-spinners-kit';
import { store } from '../../store';

import conections from '../../conections';
import MapContainer from '../../components/MapContainer';
import CameraStream from '../../components/CameraStream';

import firebaseSos from '../../constants/configSOS';
import { POLICE_TRACKING_COLLECTION } from '../../Api/sos';
import * as QvrFileStationActions from '../../store/reducers/QvrFileStation/actions';

import police_blue from '../../assets/images/icons/maps/police_blue.png';
import police_yellow from '../../assets/images/icons/maps/police_yellow.png';
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css';
import './style.css';

const MARKERS = {
  police_available: police_blue,
  police_unavailable: police_yellow
};
const MAP_OPTIONS = {
  center: { lat: 19.45943, lng: -99.208588 },
  zoom: 14,
  mapTypeId: 'roadmap',
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  map: null,
  loading: false
};

class Map extends Component {
  state = {
    map: null,
    places: [],
    unsub: null,
    markers: [],
    markersPolice: [],
    moduleActions: {}
  };

  componentDidMount() {
    const isValid = this.props.canAccess(1);
    if (!isValid) this.props.history.push('/welcome');
    try {
      this.setState({ moduleActions: JSON.parse(isValid.UserToModules[0].actions) });
    } catch (e) {}

    const navHeight = document.getElementsByTagName('nav')[0].scrollHeight;
    const documentHeight = window.innerHeight;
    let map = document.getElementsByClassName('map')[0];
    map.style.height = documentHeight - navHeight + 'px';
    map.style.maxHeight = documentHeight - navHeight + 'px';
    window.addEventListener('resize', this._resizeMap);
    window.addEventListener('restartCamEvent', this._loadCameras, false);
  }
  componentDidUpdate(prevProps) {
    const { limits: limitsPrev } = prevProps;
    const { map, unsub } = this.state;
    const { limits } = this.props;
    try {
      const { data: { id } } = limits;
      if (map && id && (limitsPrev !== limits || !unsub)) this._loadPolices();
    } catch (e) {}
  }
  componentWillUnmount() {
    const { unsub, markers } = this.state;
    if (unsub) unsub();

    // Destroy Qnap Link Shared
    let { QvrFileStationShareLink: listShare } = this.props.QvrFileStationShareLink;
    if (listShare && listShare.data && listShare.data.length > 0) {
      let findCameras = [];
      for (const list of listShare.data) {
        let findCamera = markers.find((c) => c.extraData.id === list.cam_id);
        if (findCamera && !findCameras.includes(findCamera)) {
          findCameras.push(findCamera);
          this._destroyFileVideos(findCamera.extraData);
        }
      }
    }

    window.removeEventListener('restartCamEvent', this._loadCameras, false);
  }

  render() {
    return (
      <div className='map'>
        <div style={{ position: 'absolute', top: '30%', background: 'transparent', width: '100%' }} align='center'>
          <JellyfishSpinner size={250} color='#686769' loading={this.state.loading} />
        </div>
        <MapContainer options={MAP_OPTIONS} places={this.state.places} onMapLoad={this._onMapLoad} />
      </div>
    );
  }

  _onMapLoad = (map) => {
    this.setState({ map: map });
    this._loadCams();
  };
  _createInfoWindow = (marker, map) => {
    const { position, extraData: { id, isPolice } } = marker;

    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div id="infoWindow${id}" class="windowpopinfo"/>`,
      position: { lat: position.lat(), lng: position.lng() }
    });

    infoWindow.addListener(
      'domready',
      ((marker, render, _render) => {
        return () => {
          const { extraData: { id } } = marker;
          render(_render(marker), document.getElementById(`infoWindow${id}`));
        };
      })(marker, render, isPolice ? this._renderInfoPolice : this._renderInfo)
    );
    infoWindow.open(map);
    const i = setInterval(() => {
      if (!infoWindow.getMap()) {
        infoWindow.close();
        clearInterval(i);
      }
    }, 1000);
  };
  _renderInfo = (marker) => {
    const { extraData } = marker;
    const { moduleActions } = this.state;
    const propsIniciales = this.props;

    return (
      <Provider store={store}>
        <CameraStream
          propsIniciales={propsIniciales}
          moduleActions={moduleActions}
          marker={marker}
          height={'300px'}
          showExternal
          hideButton={extraData.dataCamValue.control === 0 ? false : true}
          showButtons={extraData.dataCamValue.control === 1 ? true : false}
        />
      </Provider>
    );
  };
  _renderInfoPolice = (marker) => {
    const { available, police_name, updatedAt } = marker.extraData;
    return (
      <div style={{ width: '97%' }}>
        <Row>
          <Col>
            <h3 style={{ color: 'black', fontWeight: 'bold' }}>{police_name}</h3>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <p style={{ color: 'black', fontWeight: 'bold' }}>Fecha de la última localización:</p>
          </Col>
          <Col>
            <p>{moment.unix(updatedAt.seconds).format('DD/MM/YYYY')}</p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <p style={{ color: 'black', fontWeight: 'bold' }}>Hora de la última localización:</p>
          </Col>
          <Col>
            <p>{moment.unix(updatedAt.seconds).format('hh:mm:ss')}</p>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <p style={{ color: 'black', fontWeight: 'bold' }}>Estado:</p>
          </Col>
          <Col>
            <p>{available ? 'Disponible' : 'No Disponible'}</p>
          </Col>
        </Row>
      </div>
    );
  };
  _destroyFileVideos = async (camera) => {
    if (camera.dataCamValue && camera.dataCamValue.qnap_server_id && camera.dataCamValue.qnap_channel) {
      let { ptcl, host, port, user, pass } = camera.dataCamValue.qnap_server_id;
      let url = `${ptcl}${host}${port ? `:${port}` : null}`;
      await this.props.getQvrFileStationAuthLogin({ url, user, pass });

      let { QvrFileStationAuth: auth } = this.props.QvrFileStationAuth;
      let { QvrFileStationShareLink: listShare } = this.props.QvrFileStationShareLink;
      if (auth && auth.authSid && listShare && listShare.data) {
        let findListShare = listShare.data.filter((l) => l.cam_id === camera.id);
        if (findListShare && findListShare.length > 0) {
          for (const list of findListShare) {
            let params = { url, sid: auth.authSid, file_total: list.links.length, ssid: list.ssid };
            await this.props.getQvrFileStationDeleteShareLink(params);
          }
          this.props.QvrFileStationShareLink.QvrFileStationShareLink.data = listShare.data.filter(
            (l) => l.cam_id !== camera.id
          );
        }
      }

      await this.props.getQvrFileStationAuthLogout({ url });
    }
  };
  _loadCams = async () => {
    this.setState({ loading: true });
    let newMarkers = [], center_lat = 0, center_lng = 0, total = 0;
    for (let index = 0; index < this.state.markers.length; index++) {
      const element = this.state.markers[index];
      element.setMap(null);
    }

    const data = await conections.getAllCams();
    const camaras = data.data;
    const newPlaces = camaras.map((d, index) => {
      let urlHistory = null;
      let urlHistoryPort = null;
      if ("urlhistory" in d) urlHistory = d.urlhistory
      if ("urlhistoryport" in d) urlHistoryPort = d.urlhistoryport

      center_lat = center_lat + parseFloat(d.google_cordenate.split(',')[0]);
      center_lng = center_lng + parseFloat(d.google_cordenate.split(',')[1]);
      total = total + 1;

      const value = {
        id: d.id,
        num_cam: index + 1,
        lat: parseFloat(d.google_cordenate.split(',')[0]),
        lng: parseFloat(d.google_cordenate.split(',')[1]),
        name: `${d.street} ${d.number}, ${d.township}, ${d.town}, ${d.state} #cam${d.num_cam}`,
        isHls: d.tipo_camara === 3 ? false : true,
        url:
          d.UrlStreamMediaServer !== null
            ? `http://${d.UrlStreamMediaServer.ip_url_ms}:${d.UrlStreamMediaServer.output_port}${d.UrlStreamMediaServer
                .name}${d.channel}`
            : null,
        flag_color: d.flag_color ? d.flag_color : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
        dataCamValue: d,
        tipo_camara: d.tipo_camara,
        fromMap: true,
        urlHistory: urlHistory,
        urlHistoryPort: urlHistoryPort
      };

      if (value.lat && value.lng) {
        newMarkers[index] = new window.google.maps.Marker({
          position: { lat: value.lat, lng: value.lng },
          icon: { url: value.flag_color },
          map: this.state.map,
          title: value.name,
          extraData: value
        });

        window.google.maps.event.addListener(
          newMarkers[index],
          'click',
          ((marker, currentMap, infoWindow) => {
            return () => infoWindow(marker, currentMap);
          })(newMarkers[index], this.state.map, this._createInfoWindow)
        );
      }
      return value;
    });

    center_lat = center_lat / total;
    center_lng = center_lng / total;
    this.state.map.setCenter(new window.google.maps.LatLng(center_lat, center_lng));
    this.setState({ loading: false, places: newPlaces, markers: newMarkers });
  };
  _loadPolices = () => {
    const { map } = this.state;
    const { limits: { data: { clave_municipal } } } = this.props;

    const unsubPolice = firebaseSos
      .app('sos')
      .firestore()
      .collection(POLICE_TRACKING_COLLECTION)
      .where('clientId', '==', clave_municipal)
      .onSnapshot(async (snap) => {
        this.setState({ loading: true });

        // Init
        const { markersPolice } = this.state;
        if (markersPolice.length <= 0 && snap && snap.docs.length > 0) {
          snap.docs.forEach((d) => {
            const { active, policeId } = d.data();
            if (active) this._addMarker({ id: `pol-${policeId}`, ...d.data() }, map);
          });
        }

        // Added
        let docsAdded = snap.docChanges().filter((item) => item.type === 'added');
        if (docsAdded.length > 0 && ((docsAdded.length !== snap.docs.length) || snap.docs.length === 1)) {
          docsAdded.forEach((d) => {
            const { active, policeId } = d.doc.data();
            if (active) this._addMarker({ id: `pol-${policeId}`, ...d.doc.data() }, map);
          });
        }

        // Modified
        let docsModified = snap.docChanges().filter((item) => item.type === 'modified');
        if (docsModified.length > 0 && ((docsModified.length !== snap.docs.length) || snap.docs.length === 1)) {
          docsModified.forEach((d) => {
            const { active, policeId } = d.doc.data();
            const marker = markersPolice[policeId];

            if (active && marker && marker.extraData !== { id: `pol-${policeId}`, ...d.doc.data() }) {
              this._removeMarker({ id: `pol-${policeId}`, ...d.doc.data() });
              this._addMarker({ id: `pol-${policeId}`, ...d.doc.data() }, map);
            } else {
              if (active) this._addMarker({ id: `pol-${policeId}`, ...d.doc.data() }, map);
              else this._removeMarker({ id: `pol-${policeId}`, ...d.doc.data() });
            }
          });
        }
        this.setState({ loading: false });
      });

    this.setState({ unsub: unsubPolice });
  };
  _addMarker = (police) => {
    const { map, markersPolice } = this.state;
    const { id, available, policeId, police_name, lastLocation: { latitude, longitude } } = police;

    markersPolice[policeId] = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      icon: MARKERS[`police_${available ? '' : 'un'}available`],
      map: map,
      title: police_name,
      extraData: { id, ...police, isPolice: true }
    });

    window.google.maps.event.addListener(
      markersPolice[policeId],
      'click',
      ((police, currentMap, infoWindow) => {
        return () => infoWindow(police, currentMap);
      })(markersPolice[policeId], map, this._createInfoWindow)
    );
  };
  _removeMarker = (police) => {
    const { markersPolice } = this.state;
    let newMarkers = [];
    markersPolice.forEach((marker) => {
      if (marker.extraData.policeId !== police.policeId) newMarkers[marker.extraData.policeId] = marker;
      else marker.setMap(null);
    });
    this.setState({ markersPolice: newMarkers });
  };
  _resizeMap = () => {
    let navHeight;
    if (document.getElementsByTagName('nav')[0]) navHeight = document.getElementsByTagName('nav')[0].scrollHeight;
    const documentHeight = window.innerHeight;
    let map = document.getElementsByClassName('map')[0];
    if (map) {
      map.style.height = documentHeight - navHeight + 'px';
      map.style.maxHeight = documentHeight - navHeight + 'px';
    }
  };
}

const mapStateToProps = (state) => ({
  limits: state.limits,
  QvrFileStationAuth: state.QvrFileStationAuth,
  QvrFileStationShareLink: state.QvrFileStationShareLink
});

const mapDispatchToProps = (dispatch) => ({
  getQvrFileStationAuthLogin: (params) => dispatch(QvrFileStationActions.getQvrFileStationAuthLogin(params)),
  getQvrFileStationAuthLogout: (params) => dispatch(QvrFileStationActions.getQvrFileStationAuthLogout(params)),
  getQvrFileStationDeleteShareLink: (params) => dispatch(QvrFileStationActions.getQvrFileStationDeleteShareLink(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
