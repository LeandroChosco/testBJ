import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import conections from "../../conections";
import UserDetails from "../../components/UserDetails";

class ModalMoreInformation extends Component {
  state = {
    dataUsuers: [],
    loading: true
  };
  render() {
    return (
      <Modal size="lg" show={this.props.modal} onHide={this.props.hide}>
        <Modal.Header closeButton>
          <h3>
            {this.state.dataCam
              ? this.state.dataCam
              : this.state.loading
              ? "Cargando.."
              : "Sin usuarios asignados"}
          </h3>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "60vh", overflowY: "auto" }}
          className="pl-0 pr-0"
        >
          {this.state.dataUsuers.length !== 0 ? (
            this.state.dataUsuers.map(user => (
              <UserDetails
                dataCamValue={this.props.dataCamValue}
                propsIniciales={this.props.propsIniciales}
                key={user.u_user_id}
                dataUser={user}
              ></UserDetails>
            ))
          ) : this.state.loading ? (
            <p style={{ textAlign: "center" }}>Obteniendo información..</p>
          ) : (
            <p style={{ textAlign: "center" }}>
              No hay información que mostrar
            </p>
          )}
        </Modal.Body>
      </Modal>
    );
  }

  componentDidMount() {
    //console.log("Info de camara: ", this.props.dataCamValue);
    //console.log("cam_id", this.props.cam_id);
    //console.log("datacam", this.props.data_cam);
    conections.getMoreInformationByCam(this.props.cam_id).then(res => {
      console.log("responde", res);
      if (res.data.success) {
        this.setState({
          dataUsuers: res.data.usersToCam,
          dataCam: this.props.data_cam,
          loading: false
        });
      } else {
        this.setState({ loading: false });
      }
    });
  }
}

export default ModalMoreInformation;
