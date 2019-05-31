import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";


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
import MobileHelp from './pages/CamaraForMobile';
import conections from './conections';
import Welcome from './pages/Welcome';

import firebase from './constants/config';
import firebaseC5 from './constants/configC5';

class App extends Component {

  state = {
    isAuthenticated: true,
    sideMenu:false,
    cameraInfoSide:false,
    cameraInfo: null,
    cameraID:null,
    cameraControl: false,
    showHeader:true,
    userInfo:{
      name:''
    },
    loadingRestart: false, 
    matches: [],
    sos:[],
    support:[],
    showNotification:false,
    fisrtTime: true, 
    fisrtTimeHelp:true,
    fisrtTimeSupport:true,
    firebase:{}
  }

  componentDidMount(){
    if(window.location.pathname.includes('mobile_help')){
      this.setState({showHeader:false})
      return true;
    }
    this._checkAuth()    
    if (!window.location.pathname.includes('detalles')&&!window.location.pathname.includes('analisis/')) {      

    }  else {
      this.setState({showHeader:false})
    }    
    
    firebase.firestore().collection('matches').orderBy('dateTime','desc').onSnapshot(docs=>{
      if (this.state.matches.length!==docs.size&&this.state.showNotification&&!this.state.fisrtTime) {
        this.showNot('Match','Nuevo match detectado','warning','Ver match',0)
      }
      if(this.state.fisrtTime)
        this.setState({fisrtTime:false})
      this.setState({matches:docs.docs.map(v=>{
        let value = v.data()
        value.dateTime = new Date(value.dateTime.toDate()).toLocaleString()
        return value
      })})
    })

    /*firebaseC5.firestore().collection('help').orderBy('dateTime','desc').onSnapshot(docs=>{
      if (this.state.matches.length!==docs.size&&this.state.showNotification&&!this.state.fisrtTimeHelp) {
        this.showNot('SOS','Nueva alerta de ayuda generada','error','Ver detalles',1)
      }
      if(this.state.fisrtTime)
        this.setState({fisrtTime:false})
      this.setState({sos:docs.docs.map(v=>{
        let value = v.data()
        value.dateTime = new Date(value.dateTime.toDate()).toLocaleString()
        return value
      })})
    })

    firebaseC5.firestore().collection('support').orderBy('dateTime','desc').onSnapshot(docs=>{
      if (this.state.matches.length!==docs.size&&this.state.showNotification&&!this.state.fisrtTimeSupport) {
        this.showNot('Solicitud de soporte','Nueva solicitud de soporte generada','info','Ver detalles',2)
      }
      if(this.state.fisrtTime)
        this.setState({fisrtTime:false})
      this.setState({support:docs.docs.map(v=>{
        let value = v.data()
        value.dateTime = new Date(value.dateTime.toDate()).toLocaleString()
        return value
      })})
    })*/
  }


  showNot = (title,message,type,label,action) => {
    const notification = this.refs.notificationSystem;
    if(notification){
      notification.addNotification({
        title:title,
        message: message,
        level: type,
        action: {
          label: label,
          callback: ()=> this.seeMatch(action)
        }
      });
    }
  }

  seeMatch = (id) => {
    console.log(id)
    this._cameraSideInfo(id)
  } 


  _reloadCams = () => {
    this.setState({loadingRestart:true})
    conections.restartStream().then(data=>{
      this.setState({loadingRestart:false})
      if (data.data.success) {
        const event = new Event('restartCamEvent')
        window.dispatchEvent(event)
      } else {
        alert('Error reiniciando las camaras')
      }
    })
  } 


  _checkAuth(){
    const isAuth = sessionStorage.getItem('isAuthenticated')    
    if (isAuth) {
      const data = JSON.parse(isAuth)
      this.setState({isAuthenticated:data.logged,userInfo:data.userInfo,showNotification:true}) 
      if (!window.location.pathname.includes('detalles')&&!window.location.pathname.includes('analisis/')) {      
        //setTimeout(this.showNot,10000)
      }  
    } else {
      this.setState({isAuthenticated:false}) 
      if(window.location.pathname!=='/'&&window.location.pathname!=='/login'){        
        window.location.href = window.location.href.replace(window.location.pathname,'/login')
      }
    }
  }

  _makeAuth = (userInfo) => {
    sessionStorage.setItem('isAuthenticated',JSON.stringify({logged:true,userInfo:userInfo}))    
    this.setState({userInfo:userInfo,showNotification:true})
    window.location.href = window.location.href.replace(window.location.pathname,'/')         
    if (!window.location.pathname.includes('detalles')&&!window.location.pathname.includes('analisis/')) {      
      //setTimeout(this.showNot,10000)
    }          
    setTimeout(this.setState({isAuthenticated:true}),500)
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
    this.setState({isAuthenticated: false, userInfo:{}})
    sessionStorage.removeItem('isAuthenticated')
  } 

  _toggleControls = (camera) =>{
    if(camera){
      this.setState({cameraControl:true, cameraInfo:camera})
    }  else {
      this.setState({cameraControl:false, cameraInfo:null})
    }
      
  }

  canAccess=(module_id)=>{
    let isValid = false
    const isAuth = JSON.parse(sessionStorage.getItem('isAuthenticated'))    
    if (isAuth) {
        if (isAuth.userInfo.modules) {
            isAuth.userInfo.modules.map(value=>{
                if (value.id===module_id) {
                    isValid = value
                    console.log(value)
                }
                return value;
            })            
        }
    } 
    return isValid
}
  
  render() {
    return (
    <Router>      
      <div className="fullcontainer">                
        {this.state.isAuthenticated&&this.state.showHeader?
          <Header 
            loadingRestart={this.state.loadingRestart} 
            toggleSideMenu = {this._toggleSideMenu} 
            logOut = {this._logOut} 
            isSidemenuShow={this.state.sideMenu} 
            cameraSideInfo={this._cameraSideInfo} 
            userInfo={this.state.userInfo} 
            _reloadCams={this._reloadCams}/>
          :null
        }     
        <SideBar toggleSideMenu = {this._toggleSideMenu} active={this.state.sideMenu}/>
        {this.state.cameraInfoSide?
          <CameraInfoSide 
            toggleSideMenu = {this._cameraSideInfo}  
            cameraID={this.state.cameraID}
            matchs={this.state.matches}/>
          :null
        }
        <Route path="/" exact render={(props) => 
          this.state.isAuthenticated? 
            <Redirect
            to={{
              pathname:this.state.userInfo.modules?this.state.userInfo.modules[0].id === 1 ? '/map':this.state.userInfo.modules[0].id === 2 ? '/analisis':'/welcome':'/welcome',
              state: { from: props.location }
            }}/>: 
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}/>
          }
        />
        <Route path="/map" exact render={(props) =><Map canAccess={this.canAccess}  {...props} />} />
        <Route path="/welcome" exact render={(props) =><Welcome {...props}/>} />
        <Route path="/login" exact render={(props) => <Login {...props} makeAuth={this._makeAuth} isAuthenticated={this.state.isAuthenticated}/> }/>
        <Route path="/analisis" exact render={(props) => <Analysis  canAccess={this.canAccess} {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/analisis/:id" exact render={(props) => <Analysis  canAccess={this.canAccess} {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />        
        <Route path="/detalles/:id" exact render={(props) => <Details  {...props} firebase={this.state.firebase} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/mobile_help/:id" exact render={(props) => <MobileHelp  {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />        
      </div>
      {this.state.cameraControl?<CameraControls camera={this.state.cameraInfo} toggleControls={this._toggleControls} active ={this.state.cameraControl}/>:null}
      <NotificationSystem ref='notificationSystem' />
        
    </Router>  
    );
  }
}

export default App;
