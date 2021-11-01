import React, { Component } from "react";
import favicon from '../../assets/images/icons/favicon.jpg'
import "../../assets/styles/util.css";
import "../../assets/styles/main.css";
import "../../assets/fonts/iconic/css/material-design-iconic-font.min.css";
import "./style.css";
import { JellyfishSpinner } from "react-spinners-kit";
import { ToastsContainer, ToastsStore } from "react-toasts";
import Conections from "../../conections";
import constants from '../../constants/constants';

class Login extends Component {
  state = {
    username: "",
    pass: "",
    error: null,
    loading: false
  };

  _handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  _makeLogin = () => {
    const { username, pass } = this.state;
    if (username !== "" && pass !== "") {
      let userInfo = {
        user_login: username,
        user_password: btoa(pass)
      };
      this.setState({ loading: true });
      Conections.makeLogin(userInfo)
        .then(response => {
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
                    src={favicon}
                    style={{ width: "100%", borderRadius: "50%" }}
                    alt="Benito"
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
                  <a className="txt1" href="#div">
                    ¿Se te olvido la contraseña?
                  </a>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default Login;
