import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";


import Login from './pages/Login'
import Map from './pages/Map'
import Analysis from './pages/Analysis';
import NotificationSystem from 'react-notification-system';

import Header from './components/Header';
import SideBar from './components/SideBar';
import CameraInfoSide from './components/CameraInfoSide';
import CameraControls from './components/CameraControls';

import './App.css';
import Details from './pages/Details';


class App extends Component {

  state = {
    isAuthenticated: true,
    sideMenu:false,
    cameraInfoSide:false,
    cameraInfo: null,
    cameraID:null,
    cameraControl: false,
    showHeader:true
  }
  



  componentDidMount(){
    this._checkAuth()    
    if (!window.location.pathname.includes('detalles')) {      
      setTimeout(this.showNot,10000)
    }  else {
      this.setState({showHeader:false})
    }
  }


  showNot = () => {
    const notification = this.refs.notificationSystem;
    notification.addNotification({
      title:'Match',
      message: 'Nuevo match detectado, Camara 1',
      level: 'error',
      action: {
        label: 'Ver match',
        callback: ()=> this.seeMatch(1)
      }
    });
  }

  seeMatch = (id) => {
    console.log(id)
    this._cameraSideInfo(id)
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
        {this.state.isAuthenticated&&this.state.showHeader?<Header toggleSideMenu = {this._toggleSideMenu} logOut = {this._logOut} isSidemenuShow={this.state.sideMenu} cameraSideInfo={this._cameraSideInfo}/>:null}     
        <SideBar toggleSideMenu = {this._toggleSideMenu} active={this.state.sideMenu}/>
        {this.state.cameraInfoSide?<CameraInfoSide toggleSideMenu = {this._cameraSideInfo}  cameraID={this.state.cameraID}/>:null}
        <Route path="/" exact render={(props) => this.state.isAuthenticated?<Map />:<Login {...props} makeAuth={this._makeAuth} isAuthenticated={this.state.isAuthenticated}/>} />
        <Route path="/analisis" exact render={(props) => <Analysis {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/analisis/:id" exact render={(props) => <Analysis {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />        
        <Route path="/detalles/:id" exact render={(props) => <Details {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />        
      </div>
      {this.state.cameraControl?<CameraControls camera={this.state.cameraInfo} toggleControls={this._toggleControls} active ={this.state.cameraControl}/>:null}
      <NotificationSystem ref='notificationSystem' />
        
    </Router>  
    );
  }
}

export default App;
