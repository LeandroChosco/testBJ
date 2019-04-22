import React, { Component } from 'react';
import {Navbar, NavDropdown, Button, Nav} from 'react-bootstrap'
import { withRouter } from "react-router-dom";
import '../../assets/styles/util.css';
import '../../assets/styles/main.css';
import '../../assets/fonts/iconic/css/material-design-iconic-font.min.css'
import '../../assets/fonts/font-awesome-4.7.0/css/font-awesome.min.css'
import './style.css'

class Header extends Component {
    _goAnalitics = () => {
        if(this.props.isSidemenuShow){
            this.props.toggleSideMenu()
        }
        document.getElementsByClassName('navbar-collapse')[0].classList.remove('show')
        this.props.history.push('/analisis')
    }

    _cameraAction = () => {    
        document.getElementsByClassName('navbar-collapse')[0].classList.remove('show')    
        if(this.props.location.pathname.includes("/analisis")||this.props.location.pathname.includes("/detalles")){
            this.props.history.push('/')
        } else {
            this.props.toggleSideMenu()
        }

    }

    _logOut = () => {
        document.getElementsByClassName('navbar-collapse')[0].classList.remove('show')
        this.props.history.push('/')
        this.props.logOut()
    }

    _cameraSideInfo = () => {
        this.props.cameraSideInfo()
    }

  render() {
    return (
        <Navbar sticky="top" expand="lg" variant="light" bg="mh">                       
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse className="justify-content-end">
                <Nav className="mr-auto">
                    <Navbar.Text >
                        <Button variant="outline-light" onClick = {this._cameraAction}>
                            <i className="fa fa-video-camera"></i>
                            Camaras
                        </Button>
                    </Navbar.Text>
                    <Navbar.Text >                       
                            <Button variant="outline-light" onClick = {this._goAnalitics}>
                                <i className="fa fa-simplybuilt"></i>
                                Analisis
                            </Button>                                             
                    </Navbar.Text>
                </Nav>
                <Nav>     
                    <Button variant="outline-light"  onClick={this.props._reloadCams}>
                        <i className={this.props.loadingRestart?'fa fa-repeat fa-spin':"fa fa-repeat"}></i>
                    </Button>                                                            
                    <NavDropdown className="light" title={this.props.userInfo.name}>
                        <NavDropdown.Item onClick={this._logOut}>Cerrar sesion</NavDropdown.Item>
                    </NavDropdown>
                    <Button variant="outline-light"  onClick={this._cameraSideInfo}>
                        <i className="fa fa-bell"></i>
                    </Button>                                           
                    
                </Nav>
                
            </Navbar.Collapse>
        </Navbar>
    );
  }
  componentDidMount(){
  }
}

export default withRouter(Header);