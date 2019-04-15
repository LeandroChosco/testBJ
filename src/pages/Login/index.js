import React, { Component } from 'react';
import favicon from '../../assets/images/icons/favicon.png'
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import './style.css'

class Login extends Component {

    state = {
        username:'',
        pass:''
    }

    _handleChange = (e) => {
        this.setState({[e.target.name]:e.target.value})        
    }

    _makeLogin = () => {
        const {username, pass} = this.state
        if (username !== '' && pass !== '') {
            if (username === 'admin' && pass === 'admin') {
                this.props.makeAuth()
            } else {
                if (username === 'lpriego' && pass === 'lpriego') {
					this.props.makeAuth('Luis Priego')
				}
            }	
        }
        else {
            
        }
    }

  render() {
    return (
        <div className="limiter">
		    <div className="container-login100 cityBackground">
			    <div className="wrap-login100">				
				    <form className="login100-form validate-form" id="loginForm" data-toggle="validator">
					    <span className="login100-form-logo">
						    <img src={favicon} style={{width: "60%"}} alt="mhlogo"/>						
					    </span>
					    <span className="login100-form-title p-b-34 p-t-27">
						    Iniciar Sesión
					    </span>
					    <div className="wrap-input100 validate-input" data-validate="Enter username">
						    <input className="input100" type="text" name="username" placeholder="Usuario" onChange={this._handleChange} required="required" id="username"/>
						    <span className="focus-input100" data-placeholder="&#xf207;"></span>
					    </div>
					    <div className="wrap-input100 validate-input" data-validate="Enter password">
						    <input className="input100" type="password" name="pass" placeholder="Contraseña" onChange={this._handleChange} required="required" id="password"/>
						    <span className="focus-input100" data-placeholder="&#xf191;"></span>
					    </div>
					    <div className="contact100-form-checkbox">
						    <input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" />
						    <label className="label-checkbox100" htmlFor="ckb1">
							    Recordarme
						    </label>
					    </div>
					    <div className="container-login100-form-btn">
						    <button className="login100-form-btn" type="button" onClick={this._makeLogin}>
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
	    </div>    
    );
  }
}

export default Login;