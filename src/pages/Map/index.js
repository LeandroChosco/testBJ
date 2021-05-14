import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { render } from 'react-dom';

import { JellyfishSpinner } from 'react-spinners-kit';
import { store } from '../../store';

import videojs from 'video.js';
import conections from '../../conections';
import MapContainer from '../../components/MapContainer';
import CameraStream from '../../components/CameraStream';

import * as QvrFileStationActions from '../../store/reducers/QvrFileStation/actions';

import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css';
import './style.css';
// import constants from "../../constants/constants";

const mapOptions = {
  center: { lat: 19.45943, lng: -99.208588 },
  zoom: 14,
  mapTypeId: "roadmap",
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  map: null,
  loading: false
};

class Map extends Component {
  state = {
    places: [],
    webSocket: "ws://18.222.106.238",
    moduleActions: {},
    markers: []
  };

  render() {
    return (
      <div className="map">
        <div
          style={{
            position: "absolute",
            top: "30%",
            background: "transparent",
            width: "100%"
          }}
          align="center"
        >
          <JellyfishSpinner
            size={250}
            color="#686769"
            loading={this.state.loading}
          />
        </div>
        <MapContainer
          options={mapOptions}
          places={this.state.places}
          onMapLoad={this._onMapLoad}
        />
      </div>
    );
  }

  _onMapLoad = map => {
    this.setState({ map: map });
    this._loadCams();
  };
  createInfoWindow = (e, map) => {
    // console.log(map);
    const infoWindow = new window.google.maps.InfoWindow({
      content:
        '<div id="infoWindow' + e.extraData.id + '" class="windowpopinfo"/>',
      position: { lat: e.position.lat(), lng: e.position.lng() }
    });
    const propsIniciales = this.props;
    // console.log("PROPS: ", this.propsIniciales);
    infoWindow.addListener(
      "domready",
      (function (marker, render, moduleActions) {
        return function () {
          render(
            <Provider store={store}>
              <CameraStream
                propsIniciales={propsIniciales}
                moduleActions={moduleActions}
                marker={marker}
                height={"300px"}
                showExternal
                hideButton={
                  marker.extraData.dataCamValue.control === 0
                    ? false
                    : true
                }
                showButtons={
                  marker.extraData.dataCamValue.control === 1
                    ? true
                    : false
                }
              />
            </Provider>,
            document.getElementById("infoWindow" + e.extraData.id)
          );
        };
      })(e, render, this.state.moduleActions)
    );
    infoWindow.open(map);
    const i = setInterval(() => {
      // console.log("infoWindow is bound to map: " + (infoWindow.getMap() ? true : false));
      if (!infoWindow.getMap()) {
        if (e && e.extraData) this._destroyFileVideos(e.extraData)


        infoWindow.close();
        clearInterval(i);
        if (e.extraData.isRtmp) {
          videojs("hls-player" + e.extraData.num_cam).dispose();
        }
      }
    }, 1000);
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
          this.props.QvrFileStationShareLink.QvrFileStationShareLink.data = listShare.data.filter((l) => l.cam_id !== camera.id);
        }
      }

      await this.props.getQvrFileStationAuthLogout({ url });
    }
  };

  componentDidMount() {
    // console.log(this.props);
    const isValid = this.props.canAccess(1);
    if (!isValid) {
      this.props.history.push("/welcome");
    }
    try {
      this.setState({
        moduleActions: JSON.parse(isValid.UserToModules[0].actions)
      });
    } catch (e) {
      console.log(e);
    }

    const navHeight = document.getElementsByTagName("nav")[0].scrollHeight;
    const documentHeight = window.innerHeight;
    let map = document.getElementsByClassName("map")[0]; //.style.height = documentHeight - navHeight
    map.style.height = documentHeight - navHeight + "px";
    map.style.maxHeight = documentHeight - navHeight + "px";
    window.addEventListener("resize", this._resizeMap);
    window.addEventListener("restartCamEvent", this._loadCameras, false);
  }

  componentWillUnmount() {
    // Destroy Qnap Link Shared
    let { markers } = this.state;
    let { QvrFileStationShareLink: listShare } = this.props.QvrFileStationShareLink;
    if (listShare && listShare.data && listShare.data.length > 0) {
      let findCameras = [];
      for (const list of listShare.data) {
        let findCamera = markers.find((c) => c.extraData.id === list.cam_id);
        if (findCamera && !findCameras.includes(findCamera)) {
          findCameras.push(findCamera)
          this._destroyFileVideos(findCamera.extraData);
        }
      }
    }

    window.removeEventListener("restartCamEvent", this._loadCameras, false);
  }

  _loadCams = () => {
    this.setState({ loading: true });
    for (let index = 0; index < this.state.markers.length; index++) {
      const element = this.state.markers[index];
      element.setMap(null);
    }
    conections.getAllCams().then(data => {
      // console.log("Marker: ", data.data);
      const camaras = data.data;
      let auxCamaras = [];
      let center_lat = 0;
      let center_lng = 0;
      let total = 0;
      let index = 1;
      camaras.map(value => {
        if (value.active === 1 && value.flag_streaming === 1) {
          if (value.google_cordenate !== "") {
            center_lat =
              center_lat + parseFloat(value.google_cordenate.split(",")[0]);
            center_lng =
              center_lng + parseFloat(value.google_cordenate.split(",")[1]);
            total = total + 1;
            auxCamaras.push({
              id: value.id,
              num_cam: index,
              lat: parseFloat(value.google_cordenate.split(",")[0]),
              lng: parseFloat(value.google_cordenate.split(",")[1]),
              name:
                value.street +
                " " +
                value.number +
                ", " +
                value.township +
                ", " +
                value.town +
                ", " +
                value.state +
                " #cam" +
                value.num_cam,
              isHls: value.tipo_camara === 3 ? false : true,
              url:
                value.UrlStreamMediaServer !== null
                  ? "http://" +
                  value.UrlStreamMediaServer.ip_url_ms +
                  ":" +
                  value.UrlStreamMediaServer.output_port +
                  value.UrlStreamMediaServer.name +
                  value.channel
                  : null,
              flag_color: value.flag_color,
              dataCamValue: value,
              tipo_camara: value.tipo_camara,
              fromMap: true
            });
            index++;
          }
        }
        return true;
      });
      center_lat = center_lat / total;
      center_lng = center_lng / total;
      this.state.map.setCenter(
        new window.google.maps.LatLng(center_lat, center_lng)
      );
      this.setState({ loading: false, places: auxCamaras });
      let marker = [];
      this.state.places.forEach((value, index) => {
        if (value.lat && value.lng) {
          if (value.flag_color === null) {
            value.flag_color =
              "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
          }
          marker[index] = new window.google.maps.Marker({
            position: { lat: value.lat, lng: value.lng },
            icon: {
              url: value.flag_color
            },
            map: this.state.map,
            title: value.name,
            extraData: value
          });
          window.google.maps.event.addListener(
            marker[index],
            "click",
            (function (marker, map, createInfoWindow) {
              return function () {
                createInfoWindow(marker, map);
              };
            })(marker[index], this.state.map, this.createInfoWindow)
          );
          return value;
        }
      });
      this.setState({ markers: marker });
    });
  };

  _resizeMap = () => {
    let navHeight;
    if (document.getElementsByTagName("nav")[0]) {
      navHeight = document.getElementsByTagName("nav")[0].scrollHeight;
    }
    const documentHeight = window.innerHeight;
    let map = document.getElementsByClassName("map")[0]; //.style.height = documentHeight - navHeight
    if (map) {
      map.style.height = documentHeight - navHeight + "px";
      map.style.maxHeight = documentHeight - navHeight + "px";
    }
  };
}

const mapStateToProps = (state) => ({
  QvrFileStationAuth: state.QvrFileStationAuth,
  QvrFileStationShareLink: state.QvrFileStationShareLink
});

const mapDispatchToProps = (dispatch) => ({
  getQvrFileStationAuthLogin: (params) => dispatch(QvrFileStationActions.getQvrFileStationAuthLogin(params)),
  getQvrFileStationAuthLogout: (params) => dispatch(QvrFileStationActions.getQvrFileStationAuthLogout(params)),
  getQvrFileStationDeleteShareLink: (params) => dispatch(QvrFileStationActions.getQvrFileStationDeleteShareLink(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
