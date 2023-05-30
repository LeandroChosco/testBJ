import React, { Component } from "react";
// import logo from "../../assets/images/logo.jpeg"
import logo from '../../assets/images/icons/favicon.jpg'
import "../../assets/styles/util.css";
import "../../assets/styles/main.css";
import "../../assets/fonts/iconic/css/material-design-iconic-font.min.css";
import "./style.css";
import { JellyfishSpinner } from "react-spinners-kit";
import { ToastsContainer, ToastsStore } from "react-toasts";
import Conections from "../../conections";
import constants from '../../constants/constants';
import { ACCESS_TOKEN, RADAR_ID, SAILS_ACCESS_TOKEN } from '../../constants/token'
import ModalResetPassword from "./ModalResetPassword";

class Login extends Component {
  state = {
    username: "",
    pass: "",
    error: null,
    loading: false,
    showModal: false,
  };

  _handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  _handleModal = () => {
    if (!this.state.showModal) {
      this.setState({ showModal: true })
    }
  }

  _hideModal = () => {
    this.setState({ showModal: false })
  }

  _makeLogin = async () => {
    const { username, pass } = this.state;
    if (username !== "" && pass !== "") {
      let userInfo = {
        user_login: username,
        user_password: btoa(pass)
      };
      let userInfoRadar = {
        email: username,
        password: (pass)
      }
      //Crear una funcion de control si sale error
      const dataToken = await Conections.makeLoginRadar(userInfoRadar);
      const token = `Bearer ${dataToken.data.data.userSignIn.token}`

      token && localStorage.setItem(RADAR_ID, dataToken.data.data.userSignIn.userData.id);


      this.setState({ loading: true });
      Conections.makeLogin(userInfo)
        .then(response => {
          localStorage.setItem(SAILS_ACCESS_TOKEN, response.data.data.info_user.token)
          localStorage.setItem(ACCESS_TOKEN, token);
          Conections.getClients().then(res => {
            const data = res.data.data.getClients.filter(c => c.name === constants.client);
            constants.urlPath =
              data[0].photo_path != null ? constants.urlPath = data[0].photo_path :
                constants.urlPath
          })
          const userResponse = response.data;
          if (userResponse.success && userResponse.data.login) {
            this.props.makeAuth(userResponse.data.info_user);
          } else {
            ToastsStore.error(userResponse.msg);
            this.setState({ loading: false, error: userResponse.msg });
          }
          this.setState({ loading: false });
        })
        .catch(error => {
          this.setState({ loading: false, error: error });
        });
    } else {
      ToastsStore.error("Los campos no pueden estar vacios");
    }
  };

  render() {
    const { showModal } = this.state
    return (
      <div className="limiter">
        <ToastsContainer store={ToastsStore} />
        {!this.props.isAuthenticated ? (
          <div className="container-login100 cityBackground">
            <div className="wrap-login100">
              <form
                className="login100-form validate-form"
                id="loginForm"
                data-toggle="validator"
              >
                <span className="login100-form-logo">
                  <img
                    src={logo}
                    style={{ width: "100%", borderRadius: "50%" }}
                    alt="MC"
                  />
                </span>
                <span className="login100-form-title p-b-34 p-t-27">
                  Iniciar Sesión
                </span>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter username"
                >
                  <input
                    className="input100"
                    type="text"
                    name="username"
                    placeholder="Usuario"
                    onChange={this._handleChange}
                    required="required"
                    id="username"
                  />
                  <span
                    className="focus-input100"
                    data-placeholder="&#xf207;"
                  ></span>
                </div>
                <div
                  className="wrap-input100 validate-input"
                  data-validate="Enter password"
                >
                  <input
                    className="input100"
                    type="password"
                    name="pass"
                    placeholder="Contraseña"
                    onChange={this._handleChange}
                    required="required"
                    id="password"
                  />
                  <span
                    className="focus-input100"
                    data-placeholder="&#xf191;"
                  ></span>
                </div>
                {/* <div className="contact100-form-checkbox">
						    <input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" />
						    <label className="label-checkbox100" htmlFor="ckb1">
							    Recordarme
						    </label>
					    </div> */}
                <div className="container-login100-form-btn">
                  <JellyfishSpinner
                    loading={this.state.loading}
                    size={38}
                    color="white"
                  />
                  <button
                    className="login100-form-btn"
                    type="button"
                    onClick={this._makeLogin}
                  >
                    Iniciar Sesión
                  </button>
                </div>
                <div className="text-center p-t-90">
                  <a className="txt1" href="#div" onClick={this._handleModal}>
                    ¿Se te olvidó la contraseña?
                  </a>
                </div>
              </form>
              {
                showModal && <ModalResetPassword modal={showModal} hideModal={this._hideModal} logo={logo} />
              }
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Login;
