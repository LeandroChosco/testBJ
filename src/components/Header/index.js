import React, { Component } from "react";
import { Navbar, NavDropdown, Button, Nav, DropdownButton, Dropdown } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import "../../assets/styles/util.css";
import "../../assets/styles/main.css";
import "../../assets/fonts/iconic/css/material-design-iconic-font.min.css";
import "../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "./style.css";

class Header extends Component {
  _goAlarma = () => {
    // if (this.props.isSidemenuShow) {
    //   this.props.toggleSideMenu();
    // }
    // document
    //   .getElementsByClassName("navbar-collapse")[0]
    //   .classList.remove("show");
    // window.open('http://alarma.energetikadevelepment.com:8080/', 'Alarma', 'height=600,width=1200');
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/alarm");
  };
  _goComplaint = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/servicios");
  };
  _goFicha = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    window.open('http://clientes.ubiqo.net/Publica/Inicio_Sesion.aspx?ReturnUrl=%2f', 'Ficha de Incidencias', 'height=600,width=1200');
  };
  _goCovid = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/covid");
  };
  _goSospechosos = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/personas");
  };

  _goCuadrantes = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/cuadrantes");
  };

  _goAnalitics = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/analisis");
  };

  _goChat = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/chat");
  };

  _cameraAction = () => {
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    if (!this.props.location.pathname.includes("/map")) {
      this.props.history.push("/map");
    } else {
      this.props.toggleSideMenu();
    }
  };

  _logOut = () => {
    if (this.props.sideMenu) {
      this.props._toggleSideMenu();
    }

    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/login");
    this.props.logOut();
  };

  _goDashboard = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/dashboard");
  };

  _goSOS = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/sos");
  };

  _cameraSideInfo = () => {
    this.props.cameraSideInfo();
  };

  render() {
    return (
      <Navbar sticky="top" expand="lg" variant="dark" bg="mh">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="mr-auto">
            {this.props.userInfo.modules
              ? this.props.userInfo.modules.map((value) => (
                <Navbar.Text key={value.id}>
                  {
                    // value.id === 9 ?
                    //   <DropdownButton
                    //     style={{ backgroundColor: '#186dad' }}
                    //     title={value.name}>
                    //     <i className="fa fa-home"></i>
                    //     <Dropdown.Item href="#/action-1">
                    //       <i className="fa fa-home"></i>
                    //       {value.name}
                    //     </Dropdown.Item>
                    //     <Dropdown.Item href="#/action-2">Fuego</Dropdown.Item>
                    //     <Dropdown.Item href="#/action-3">Medico</Dropdown.Item>
                    //     <Dropdown.Item href="#/action-3">Policia</Dropdown.Item>
                    //   </DropdownButton>
                    //   :
                    <Button
                      style={value.name.toLowerCase().includes(this.props.history.location.pathname.replace("/", "")) ? { color: '#186dad', backgroundColor: 'white' } : {}}
                      variant="outline-light"
                      onClick={
                        value.id === 1
                          ? this._cameraAction
                          : value.id === 2
                            ? this._goAnalitics
                            : value.id === 3
                              ? this._goChat
                              : value.id === 4
                                ? this._goDashboard
                                : value.id === 5
                                  ? this._goCuadrantes
                                  : value.id === 6
                                    ? this._goSospechosos
                                    : value.id === 7
                                      ? this._goCovid
                                      : value.id === 8
                                        ? this._goSOS
                                        : value.id === 9
                                          ? this._goAlarma
                                          : value.id === 10
                                            ? this._goFicha
                                            : value.id === 11
                                              ? this._goComplaint
                                              : null
                      }
                    >
                      <i
                        className={
                          value.id === 1
                            ? "fa fa-video-camera"
                            : value.id === 2
                              ? "fa fa-simplybuilt"
                              : value.id === 3
                                ? "fa fa-comments"
                                : value.id === 4
                                  ? "fa fa-bar-chart"
                                  : value.id === 5
                                    ? "fa fa-object-ungroup"
                                    : value.id === 6
                                      ? "fa fa-id-card"
                                      : value.id === 7
                                        ? "fa fa-user-md"
                                        : value.id == 8
                                          ? "fa fa-comments"
                                          : value.id == 9
                                            ? "fa fa-home"
                                            : value.id == 10
                                              ? "fa fa-taxi"
                                              : value.id == 11
                                                ? "fa fa-bullhorn"
                                                : null
                        }
                      ></i>
                      {value.name.includes("Ficha") ? 'Policía' : value.name}
                    </Button>
                  }
                </Navbar.Text>
              ))
              : null}
          </Nav>
          <Nav>
            {/*this.props.userInfo.role_id === 1?<Button variant="outline-light"  onClick={this.props._reloadCams}>
                        <i className={this.props.loadingRestart?'fa fa-repeat fa-spin':"fa fa-repeat"}></i>
                </Button>:null*/}
            <NavDropdown
              className="light"
              title={this.props.userInfo.user_nicename}
            >
              <NavDropdown.Item onClick={this._logOut}>
                Cerrar sesion
              </NavDropdown.Item>
            </NavDropdown>
            {this.props.userInfo.role_id === 1 ? (
              <Button variant="outline-light" onClick={this._cameraSideInfo}>
                <i className="fa fa-bell"></i>
              </Button>
            ) : null}
            <Button variant="outline-light">
              <i className="arrow_forward"></i>
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
  componentDidMount() { }
}

export default withRouter(Header);
