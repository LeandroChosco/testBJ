import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Login from './pages/Login'
import Map from './pages/Map'
import Analysis from './pages/Analysis';

import Header from './components/Header';
import SideBar from './components/SideBar';
import CameraInfoSide from './components/CameraInfoSide';

import './App.css';

class App extends Component {

  state = {
    isAuthenticated: true,
    sideMenu:false,
    cameraInfoSide:false,
    cameraInfo: null
  }
  
  componentDidMount(){
    this._checkAuth()
  }

  _checkAuth(){
    const isAuth = sessionStorage.getItem('isAuthenticated')
    this.setState({isAuthenticated:isAuth})
  }

  _makeAuth = () => {
    sessionStorage.setItem('isAuthenticated',true)
    this.setState({isAuthenticated:true})
  }

  _toggleSideMenu = () => {    
    this.setState({sideMenu: !this.state.sideMenu})
  }

  _cameraSideInfo = (cameraInfo) => {  
    console.log(cameraInfo)  
    console.log(this.state.cameraInfoSide)
    this.setState({cameraInfoSide: !this.state.cameraInfoSide, cameraInfo:cameraInfo})
  }

  render() {
    return (
      <Router>
      <div className="fullcontainer">        
        {this.state.isAuthenticated?<Header toggleSideMenu = {this._toggleSideMenu} />:null}     
        <SideBar toggleSideMenu = {this._toggleSideMenu} active={this.state.sideMenu}/>
        <CameraInfoSide toggleSideMenu = {this._cameraSideInfo} active={this.state.cameraInfoSide} cameraInfo={this.state.cameraInfo}/>
        <Route path="/" exact render={(props) => this.state.isAuthenticated?<Map />:<Login {...props} makeAuth={this._makeAuth} isAuthenticated={this.state.isAuthenticated}/>} />
        <Route path="/analisis" exact render={(props) => <Analysis {...props} toggleSideMenu = {this._cameraSideInfo}/>} />
      </div>
    </Router>  
    );
  }
}

export default App;
