import React, { Component } from "react";
import { Navbar, NavDropdown, Button, Nav } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { FaShoePrints } from 'react-icons/fa';
import { ToastsContainer, ToastsStore } from "react-toasts";
import "../../assets/styles/util.css";
import "../../assets/styles/main.css";
import "../../assets/fonts/iconic/css/material-design-iconic-font.min.css";
import "../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "./style.css";
import ModalChangePassword from "./ModalChangePassword";
import ModalVersions from "./ModalVersions";
import { LANG } from "../../constants/token";
// import { Dropdown } from "semantic-ui-react";
import versions from "./versionInfo";

class Header extends Component {

  state = {
    showModal: false,
    showVersions: false,
    language: "spanish",
  }


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

  _goDashboard = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/dashboard");
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

  _goSospechosos = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/personas");
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

  _goSOS = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/sos");
  };

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

  _goFicha = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/policia");
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

  _goTracking = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/seguimiento");
  };

  _goCamerasInternal = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/camarasInternas");
  };

  _goMicrofono = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/Microfonos");
  }


  _goIncident = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/Incident");
  }


  _goLPR = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/LPR");
  }

  _goRegister = () => {
    if (this.props.isSidemenuShow) {
      this.props.toggleSideMenu();
    }
    document
      .getElementsByClassName("navbar-collapse")[0]
      .classList.remove("show");
    this.props.history.push("/settings");
  }

  // _goFicha = () => {
  //   if (this.props.isSidemenuShow) {
  //     this.props.toggleSideMenu();
  //   }
  //   document
  //     .getElementsByClassName("navbar-collapse")[0]
  //     .classList.remove("show");
  //   window.open('http://clientes.ubiqo.net/Publica/Inicio_Sesion.aspx?ReturnUrl=%2f', 'Ficha de Incidencias', 'height=600,width=1200');
  // };


  _handleModal = () => {
    if (!this.state.showModal) {
      this.setState({ showModal: true })
    }
  }

  _hideModal = () => {
    this.setState({ showModal: false })
  }

  _handleCuadrantes = () => {
    if (!this.state.showCuadrantes) {
      this.setState({ showCuadrantes: true })
    }
  }

  _hideCuadrantes = () => {
    this.setState({ showCuadrantes: false })
  }

  _showVersions = () => {
    this.setState({ showVersions: !this.state.showVersions })
  }

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

  _cameraSideInfo = () => {
    this.props.cameraSideInfo();
  };

  render() {
    const { showModal, showVersions } = this.state;
    // const languages = [
    //   {
    //     key: 'Español',
    //     flag: "mx",
    //     text: 'Español',
    //     value: 'spanish',
    //   },
    //   {
    //     key: 'English',
    //     flag: "us",
    //     text: 'English',
    //     value: 'english',
    //   }
    // ];

    if (localStorage.getItem(LANG) && this.state.language !== localStorage.getItem(LANG)) {
      this.setState({ language: localStorage.getItem(LANG) });
    };

    return (
      <Navbar style={{ transition: "all .2s linear" }} sticky="top" expand="lg" variant="dark" bg={this.props.darkMode ? "darkmode" : "mh"}>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="mr-auto">
            <ToastsContainer store={ToastsStore} />
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
                                              : value.id === 12
                                                ? this._goTracking
                                                : value.id === 13
                                                  ? this._goCamerasInternal
                                                  : value.id === 14
                                                    ? this._goMicrofono
                                                    : value.id === 15
                                                      ? this._goIncident
                                                      : value.id === 16
                                                        ? this._goLPR
                                                        : value.id === 17
                                                          ? this._goRegister
                                                          : null
                      }
                    >
                      {value.id === 12 ?
                        <FaShoePrints />
                        :
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
                                          : value.id === 8
                                            ? "fa fa-comments"
                                            : value.id === 9
                                              ? "fa fa-home"
                                              : value.id === 10
                                                ? "fa fa-taxi"
                                                : value.id === 11
                                                  ? "fa fa-bullhorn"
                                                  : value.id === 13
                                                    ? "fa fa-video-camera"
                                                    : value.id === 14
                                                      ? "fa fa-bullhorn"
                                                      : value.id === 15
                                                        ? "fa fa-bar-chart"
                                                        : value.id === 16
                                                          ? "fa fa-id-card"
                                                          : value.id === 17
                                                            ? "fa fa-id-card"
                                                            : null
                          }
                        ></i>
                      }
                      {value.name.includes("Ficha") ? 'Policía' : `${value.id === 12 ? " " : ""}${value.name}`}
                    </Button>
                  }
                </Navbar.Text>
              ))
              : null}
          </Nav>
          <Nav style={{ paddingRight: "3.5rem" }}>
            {/*this.props.userInfo.role_id === 1?<Button variant="outline-light"  onClick={this.props._reloadCams}>
                        <i className={this.props.loadingRestart?'fa fa-repeat fa-spin':"fa fa-repeat"}></i>
                </Button>:null*/}
            {/* <Dropdown
              placeholder='Language'
              closeOnBlur={false}
              fluid
              selection
              options={languages}
              onChange={this.props.handleLanguage}
              defaultValue={localStorage.getItem(LANG) || "spanish"}
              style={{
                background: "none",
                color: "white",
                border: "none",
                width: "8.5rem"
              }} 
            /> */}
            <NavDropdown
              className="light"
              title={this.props.userInfo.user_nicename}
            >
              <NavDropdown.Item onClick={this._handleModal}>
                {this.props.lang === "english" ? "Change password" : "Cambiar contraseña"}
              </NavDropdown.Item>
              {showModal && <ModalChangePassword modal={showModal} hideModal={this._hideModal} />}
              {
                (this.props.userInfo.role_id === 1 || this.props.userInfo.role_id === 2 || this.props.userInfo.role_id === 6) &&
                <NavDropdown.Item onClick={this._goRegister}>
                  Settings
                </NavDropdown.Item>
              }
              <NavDropdown.Item onClick={this._logOut}>
                {this.props.lang === "english" ? "Log out" : "Cerrar sesión"}
              </NavDropdown.Item>
              <NavDropdown.Item onClick={this._showVersions}>
                <p style={{ display: "flex", justifyContent: "center", marginTop: "0.2rem" }}>Versión {versions[0].version}</p>
              </NavDropdown.Item>
              {
                showVersions && <ModalVersions currentVersion={versions[0].version} modal={showVersions} hideModal={this._showVersions} />
              }

            </NavDropdown>
            {this.props.userInfo.role_id === 1 ? (
              <Button variant="outline-light" onClick={this._cameraSideInfo}>
                <i className="fa fa-bell"></i>
              </Button>
            ) : null}
            <Button variant="outline-light">
              <i className="arrow_forward"></i>
            </Button>
            <Button variant="outline-light" onClick={() => this.props.setDarkMode()}>
              {
                this.props.darkMode ?
                  <i class="fa fa-sun-o" aria-hidden="true"></i>
                  :
                  <i class="fa fa-moon-o" aria-hidden="true"></i>
              }
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
  componentDidMount() { }
}

export default withRouter(Header);
