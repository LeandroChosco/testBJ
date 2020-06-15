import React, { Component } from "react";
import { Navbar, NavDropdown, Button, Nav } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import "../../assets/styles/util.css";
import "../../assets/styles/main.css";
import "../../assets/fonts/iconic/css/material-design-iconic-font.min.css";
import "../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css";
import "./style.css";

class Header extends Component {
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
              ? this.props.userInfo.modules.map(value => (
                  <Navbar.Text key={value.id}>
                    <Button
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
                            : null
                        }
                      ></i>
                      {value.name}
                    </Button>
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
  componentDidMount() {}
}

export default withRouter(Header);
