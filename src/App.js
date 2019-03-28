import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Login from './pages/Login'
import Map from './pages/Map'
import Analysis from './pages/Analysis';

import Header from './components/Header';
import SideBar from './components/SideBar';
import CameraInfoSide from './components/CameraInfoSide';

import './App.css';
import CameraControls from './components/CameraControls';

class App extends Component {

  state = {
    isAuthenticated: true,
    sideMenu:false,
    cameraInfoSide:false,
    cameraInfo: null,
    cameraID:null,
    cameraControl: false
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
    this.setState({cameraInfoSide: !this.state.cameraInfoSide, cameraID:cameraInfo})
  }

  _logOut = () => {
    this.setState({isAuthenticated: false})
  } 

  _toggleControls = (camera) =>{
    if(camera){
      this.setState({cameraControl:true, cameraInfo:camera})
    }  else {
      this.setState({cameraControl:false, cameraInfo:null})
    }
      
  }
  render() {
    return (
      <Router>
      <div className="fullcontainer">        
        {this.state.isAuthenticated?<Header toggleSideMenu = {this._toggleSideMenu} logOut = {this._logOut}/>:null}     
        <SideBar toggleSideMenu = {this._toggleSideMenu} active={this.state.sideMenu}/>
        {this.state.cameraInfoSide?<CameraInfoSide toggleSideMenu = {this._cameraSideInfo}  cameraInfo={this.state.cameraInfo}/>:null}
        <Route path="/" exact render={(props) => this.state.isAuthenticated?<Map />:<Login {...props} makeAuth={this._makeAuth} isAuthenticated={this.state.isAuthenticated}/>} />
        <Route path="/analisis" exact render={(props) => <Analysis {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/analisis/:id" exact render={(props) => <Analysis {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />        
      </div>
      {this.state.cameraControl?<CameraControls camera={this.state.cameraInfo} toggleControls={this._toggleControls} active ={this.state.cameraControl}/>:null}
    </Router>  
    );
  }
}

export default App;
