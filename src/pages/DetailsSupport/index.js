import React, { Component, Fragment } from "react";
import "./style.css";
import MapContainer from "../../components/MapContainer/index.js";
import firebaseC5cuajimalpa from "../../constants/configC5CJ";
import { Navbar } from "react-bootstrap";
import conections from "../../conections";
import CameraStream from "../../components/CameraStream";
import { Button } from "semantic-ui-react";
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

class DetailsSupport extends Component {
  state = {
    support: {},
    created: new Date(),
    cat_problems: [
      "Otro",
      "No puede dar de alta su cámara",
      "No visualiza su camara",
      "No puede tomar fotos",
      "No puede tomar videos"
    ],
    ticket: {}
  };

  render() {
    const { support, ticket } = this.state;
    console.log(support);
    return (
      <div>
        <Navbar sticky="top" expand="lg" variant="light" bg="mh">
          <Navbar.Text
            style={{
              fontWeight: "bold",
              color: "white"
            }}
          >
            Nueva Solicitud de soporte
          </Navbar.Text>
        </Navbar>
        <div className="card">
          {support.data_cam ? (
            <div className="row" style={{ height: "250px" }}>
              <div className="col">
                <MapContainer
                  options={mapOptions}
                  onMapLoad={this._onMapLoad}
                />
              </div>
              <div className="col">
                <CameraStream
                  style={{ height: "250px" }}
                  hideTitle
                  marker={{
                    extraData: {
                      num_cam: support.data_cam[0].num_cam,
                      cameraID: support.data_cam[0].num_cam,
                      webSocket:
                        "ws://" +
                        support.data_cam[0].UrlStreamToCameras[0].Url.dns_ip +
                        ":" +
                        support.data_cam[0].port_output_streaming,
                      dataCamValue: support.data_cam[0]
                    }
                  }}
                />
              </div>
            </div>
          ) : null}
          <div className="row">&nbsp;</div>
          <Fragment>
            <div className="row" style={{ height: "100%" }}>
              {support.data_cam ? (
                <div className="col">
                  <b>Ubicación: </b> {support.data_cam[0].street}{" "}
                  {support.data_cam[0].number}, {support.data_cam[0].town},{" "}
                  {support.data_cam[0].township}, {support.data_cam[0].state}
                </div>
              ) : null}
            </div>
            <div className="row">
              <div className="col">
                <b>Fecha y hora: </b> {support.dateTime}
              </div>
              <div className="col">
                <b>Problema: </b>{" "}
                {support.id_problem !== 0
                  ? this.state.cat_problems[support.id_problem]
                  : support.msg}
              </div>
            </div>
            <div className="row">
              <div className="col">
                <b>Usuario: </b> {support.user_name}
              </div>
              <div className="col">
                <b>Contacto: </b> {support.user_email}
                {ticket.UserCreation
                  ? ", " + ticket.UserCreation.cellphone
                  : null}
              </div>
            </div>
          </Fragment>
          {ticket.id !== undefined ? (
            ticket.status === 1 ? (
              <Button onClick={this.toProcess}>Atender</Button>
            ) : null
          ) : null}
          {ticket.id !== undefined ? (
            ticket.status > 1 ? (
              <Fragment>
                <div className="row" style={{ height: "100%" }}>
                  <div className="col">
                    <b>
                      Usuario{" "}
                      {ticket.status === 2
                        ? "atendiendo ticket"
                        : "que cierro ticket"}
                      :{" "}
                    </b>
                    {ticket.UserUpdate.display_name}
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <b>Fecha y hora ultimo movimiento: </b>{" "}
                    {new Date(ticket.date_update).toLocaleString()}
                  </div>
                </div>
                {ticket.status === 3 ? (
                  <div className="row">
                    <div className="col">
                      <b>Solucion: </b> {ticket.solution}
                    </div>
                  </div>
                ) : null}
              </Fragment>
            ) : null
          ) : null}
          {ticket.id !== undefined ? (
            ticket.status === 2 ? (
              <Button onClick={this.toClose}>Cerrar</Button>
            ) : null
          ) : null}
        </div>
      </div>
    );
  }

  _onMapLoad = map => {
    map.setCenter(
      new window.google.maps.LatLng(
        parseFloat(
          this.state.support.data_cam[0].google_cordenate.split(",")[0]
        ),
        parseFloat(
          this.state.support.data_cam[0].google_cordenate.split(",")[1]
        )
      )
    );
    new window.google.maps.Marker({
      position: {
        lat: parseFloat(
          this.state.support.data_cam[0].google_cordenate.split(",")[0]
        ),
        lng: parseFloat(
          this.state.support.data_cam[0].google_cordenate.split(",")[1]
        )
      },
      map: map,
      title: "Soporte"
    });
  };

  toProcess = async () => {
    try {
      const res = await conections.toProcess({
        ticket_id: this.state.ticket.id
      });
      console.log(res);
      if (res.status === 200) {
        const data = res.data;
        if (data.success) {
          firebaseC5cuajimalpa
            .app("c5cuajimalpa")
            .firestore()
            .collection("support")
            .doc(this.props.match.params.id)
            .update({ status: 2 });
        } else {
          alert("Error al querer atender ticket. " + data.msg);
        }
      } else {
        alert("Error al querer atender ticket. Error de conexion");
      }
    } catch (err) {
      alert("Error al querer atender ticket. Error de conexion");
    }
  };

  toClose = async () => {
    try {
      var solution = prompt(
        "Por favor ingrese de manera clara la solucion al problema presentado"
      );
      if (solution === "" || solution === null) {
        alert("Ingresar una solucion");
        return;
      }
      const res = await conections.toClose({
        ticket_id: this.state.ticket.id,
        solution: solution
      });
      console.log(res);
      if (res.status === 200) {
        const data = res.data;
        if (data.success) {
          firebaseC5cuajimalpa
            .app("c5cuajimalpa")
            .firestore()
            .collection("support")
            .doc(this.props.match.params.id)
            .update({ status: 3 });
        } else {
          alert("Error al querer atender ticket. " + data.msg);
        }
      } else {
        alert("Error al querer atender ticket. Error de conexion");
      }
    } catch (err) {
      alert("Error al querer atender ticket. Error de conexion");
    }
  };

  componentDidMount() {
    //console.log(this.props.match.params.id)
    firebaseC5cuajimalpa
      .app("c5cuajimalpa")
      .firestore()
      .collection("support")
      .doc(this.props.match.params.id)
      .onSnapshot(doc => {
        //console.log('resSupport', doc)
        if (doc.exists) {
          let value = doc.data();

          const created = new Date(value.dateTime.toDate());
          value.dateTime = new Date(value.dateTime.toDate()).toLocaleString();
          //console.log(value)
          this.setState({ support: value, created: created });
          conections
            .getTicket(value.ticket_id)
            .then(res => {
              //console.log(res)
              if (res.status === 200) {
                const data = res.data;
                if (data.success) {
                  if (data.data != null) {
                    this.setState({ ticket: data.data });
                  }
                }
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
  }
}

export default DetailsSupport;
