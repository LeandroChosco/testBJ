import React, { Component } from "react";
import { Image, Header, Button, Radio } from "semantic-ui-react";

import "./style.css";
import MapContainer from "../../components/MapContainer/index.js";
import firebase from "../../constants/config";
import { Modal, Navbar } from "react-bootstrap";
import confirmMatch from "../../constants/confirmMatch";
import conections from "../../conections";
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

class Details extends Component {
  state = {
    places: [
      {
        name: "Carrilo Puerto , 413 ,Tacuba Miguel Hidalgo CDMX",
        lat: 19.45943,
        lng: -99.208588,
        id: 1,
        webSocket: "ws://18.222.106.238:1001"
      }
    ],
    images: [{}, {}],
    idCamera: Math.floor(Math.random() * 10) + 1,
    match: {},
    loading: true
  };

  render() {
    if (this.state.loading === true) {
      return <h4>CARGANDO...</h4>;
    }
    return (
      <div>
        <Navbar sticky="top" expand="lg" variant="light" bg="mh">
          <Navbar.Text>Camara {this.state.idCamera}</Navbar.Text>
        </Navbar>
        <div className="mapContainerForDetail">
          <MapContainer
            options={mapOptions}
            places={this.state.places}
            onMapLoad={this._onMapLoad}
          />
        </div>
        <div className="row">&nbsp;</div>
        <div className="card">
          <div className="row imageContainer">
            <div className="col-1"></div>
            <div className="col-4 imageContainer">
              <div className="row">
                <div className="col imageContainer" align="center">
                  <h4>Imagen de camara</h4>
                  <div className="card-image">
                    {this.state.match.faceImage ? (
                      <Image
                        wrapped
                        size="small"
                        src={
                          "data:image/png;base64," + this.state.match.faceImage
                        }
                      />
                    ) : (
                      <Image
                        wrapped
                        size="small"
                        src={
                          this.state.match.name
                            ? "http://95.216.37.253:3000/images/" +
                              this.state.match.name.replace(/ /g, "") +
                              "/" +
                              this.state.match.messageId +
                              "-face.jpeg"
                            : this.state.imageCamera
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-2 center imageContainer">
              <div className="row">
                <div className="col" align="center">
                  <Header size="huge" color="brown">
                    {this.state.match
                      ? this.state.match.confidence
                        ? this.state.match.confidence
                        : this.state.match.Confidence
                      : ""}
                  </Header>
                </div>
              </div>
              <div className="row">
                <div className="col" align="center">
                  de coincidencia
                </div>
              </div>
            </div>
            <div className="col-4 imageContainer">
              <div className="row">
                <div className="col imageContainer" align="center">
                  <h4>Imagen registrada</h4>
                  <div className="card-image">
                    <Image
                      wrapped
                      size="small"
                      src={
                        this.state.match
                          ? this.state.match.name
                            ? "http://95.216.37.253:3000/images/" +
                              this.state.match.name.replace(/ /g, "") +
                              "/databaseImage.jpeg"
                            : ""
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-1"></div>
          </div>
        </div>
        <div className="row" style={{ width: "100%" }}>
          <div className="col" align="center">
            <b>Localizado en: </b> {this.state.match.location}
          </div>
        </div>
        {this.state.match.typeConfirm ? (
          <div className="row" style={{ width: "100%" }}>
            <div className="col" align="center">
              <b>Respuesta a evento: </b>{" "}
              {confirmMatch[this.state.match.typeConfirm].map(value => {
                if (value.type === this.state.match.messageConfirm) {
                  return <i>{value.msg}</i>;
                }
                return null;
              })}
            </div>
          </div>
        ) : null}
        <div className="card">
          <div className="row">
            <div className="col-6">
              <h4>Datos</h4>
              <div className="row">
                <div className="col-4">
                  <b>Nombre:</b>
                </div>
                <div className="col-8">{this.state.match.name}</div>
                <div className="col-4">
                  <b>Aliases:</b>
                </div>
                <div className="col-8">{this.state.match.name}</div>
                <div className="col-4">
                  <b>Detalles:</b>
                </div>
                <div className="col-8">{this.state.details}</div>
                <div className="col-4">
                  <b>Lugar de nacimiento:</b>
                </div>
                <div className="col-8">PASADENA, CALIFORNIA, United States</div>
                <div className="col-4">
                  <b>Fecha de nacimiento:</b>
                </div>
                <div className="col-8">March 28, 1979</div>
                <div className="col-4">
                  <b>Nacionalidad:</b>
                </div>
                <div className="col-8">American</div>
              </div>
            </div>
            <div className="col-6">
              <h4>Descripción fisica</h4>
              <div className="row">
                <div className="col-4">
                  <b>Altura:</b>
                </div>
                <div className="col-8">1.85 metros</div>
                <div className="col-4">
                  <b>Peso:</b>
                </div>
                <div className="col-8">82 kilogramos</div>
                <div className="col-4">
                  <b>Color de pelo:</b>
                </div>
                <div className="col-8">Negro</div>
                <div className="col-4">
                  <b>Color de ojos:</b>
                </div>
                <div className="col-8">Cafe</div>
                <div className="col-4">
                  <b>Marcas y cicatrices:</b>
                </div>
                <div className="col-8">
                  John Doe has a cleft chin and a surgical scar on this lower
                  back.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">&nbsp;</div>
        <div className="row">
          {this.state.match.status === false ||
          this.state.match.status === undefined ? (
            <div className="col center" align="center">
              <Button
                positive
                onClick={() => this.setState({ openConfirm: true })}
              >
                Confirmar evento
              </Button>
            </div>
          ) : null}
        </div>
        <div className="row">&nbsp;</div>

        <Modal
          show={this.state.openConfirm}
          onHide={() => this.setState({ openConfirm: false })}
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>¿Confirmar evento?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose(false)}>
              No
            </Button>
            <Button variant="primary" onClick={() => this.handleClose(true)}>
              Si
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.openSelection}
          onHide={() => this.setState({ openSelection: false })}
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            {this.state.typeConfirm !== undefined
              ? confirmMatch[this.state.typeConfirm].map(value => (
                  <Radio
                    label={value.msg}
                    onChange={() => {
                      this.setState({ checked: value.type });
                    }}
                    checked={this.state.checked === value.type}
                  />
                ))
              : null}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.saveChange}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  handleClose = type => {
    this.setState({
      openSelection: true,
      openConfirm: false,
      typeConfirm: type
    });
  };

  saveChange = () => {
    this.setState({ openSelection: false });
    firebase
      .firestore()
      .collection("matches")
      .doc(this.props.match.params.id)
      .get()
      .then(async data => {
        if (data.exists) {
          let value = data.data();
          value.status = 0;
          value.typeConfirm = this.state.typeConfirm;
          value.messageConfirm = this.state.checked;
          await firebase
            .firestore()
            .collection("matches")
            .doc(this.props.match.params.id)
            .set(value);
          window.close();
        }
      });
  };

  _onMapLoad = map => {
    const marker = [];
    this.state.places.map((value, index) => {
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

  componentDidMount() {
    firebase
      .firestore()
      .collection("matches")
      .doc(this.props.match.params.id)
      .get()
      .then(doc => {
        console.log(doc);
        if (doc.exists) {
          let value = doc.data();
          value.dateTime = new Date(value.dateTime.toDate()).toLocaleString();
          this.setState({ match: value, loading: false });
        } else {
          conections
            .getCamMatchesDetail(this.props.match.params.id)
            .then(response => {
              if (response.status === 200) {
                console.log(response.data);
                let data = response.data;

                data.dateTime = new Date(data.DwellTime).toLocaleString();
                this.setState({ match: data });
                console.log("data de match", data);
                conections
                  .getCambyNumCam(parseInt(data.num_cam))
                  .then(response => {
                    if (response.status === 200) {
                      if (response.data[0] === undefined) {
                        this.setState({ places: [], loading: false });
                        return;
                      }
                      let camData = {
                        id: response.data[0].id,
                        lat: parseFloat(
                          response.data[0].google_cordenate.split(",")[0]
                        ),
                        lng: parseFloat(
                          response.data[0].google_cordenate.split(",")[1]
                        ),
                        isHls: true,

                        real_num_cam:
                          response.data[0].num_cam < 10
                            ? "0" + response.data[0].num_cam.toString()
                            : response.data[0].num_cam.toString(),
                        camera_number: response.data[0].num_cam
                      };
                      console.log("here", camData);
                      this.setState({ places: [camData], loading: false });
                    }
                  });
              }
            })
            .catch(err => {
              console.log("error al obtener detalle de match", err);
            });
        }
      });
  }
}

export default Details;
