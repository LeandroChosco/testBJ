import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

import socketIOClient from "socket.io-client";

import Login from './pages/Login'
import Map from './pages/Map'
import Analysis from './pages/Analysis';
import NotificationSystem from 'react-notification-system';

import Header from './components/Header';
import SideBar from './components/SideBar';
import Notifications from './components/Notifications';
import CameraControls from './components/CameraControls';

import './App.css';
import Details from './pages/Details';
import MobileHelp from './pages/CamaraForMobile';
import conections from './conections';
import Welcome from './pages/Welcome';

import firebase from './constants/config';
import firebaseC5 from './constants/configC5';
import Matches from './components/Matches';
import DetailsEmergency from './pages/DetailsEmergency';
import Chat from './pages/Chat';
import ModalCall from './components/ModalCall';

const fakeCall={
  active: 0,
  cam_id: 4,  
  cat_carrier_id: 1,  
  cell_phone: 0,  
  cellphone: "+525539700952", 
  comment: "",  
  date_creation: null,  
  date_update: null,  
  display_name: "Evangelina  Shanchez Guadarrama",  
  dns: "172.30.23.217", 
  flag_record_movie: 1, 
  flag_streaming: 0,  
  google_cordenate: "19.4594683,-99.2085305", 
  id: 4,  
  keep_video_days: 1, 
  num_cam: 2, 
  number: 46, 
  password: "371CF5E046", 
  path_photo: "/",  
  personal_name: "Elsa aldrade mendez", 
  phone: 55276520,  
  port_output_streaming: 2002,  
  ssid_name: "INFINITUM641E69", 
  state: "Ciudad de México",  
  street: "Río Napo", 
  town: "Argentina Poniente", 
  township: "Miguel hidalgo", 
  type_camare_id: 1,  
  user_creation: 28,  
  user_id: 30,  
  user_login: "labeba090354@gmail.com", 
  user_nicename: "Evangelina  Shanchez Guadarrama", 
  user_update: 0
}

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
    fisrtTimeChat:true,
    chats:[],
    showNotification:false,
    fisrtTime: true, 
    fisrtTimeHelp:true,
    fisrtTimeSupport:true,
    firebase:{},
    ws:null,
    fisrtTimecomplaiments:true,
    complaiments:[],
    modalCall:false,
    callInfo:{},
    calls:[]
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

    firebaseC5.app('c5virtual').firestore().collection('help').orderBy('dateTime','desc').onSnapshot(docs=>{      
      if (this.state.sos.length!==docs.size&&this.state.showNotification&&!this.state.fisrtTimeHelp) {
        //this.showNot('SOS','Nueva alerta de ayuda generada','error','Ver detalles',1)
        window.open(window.location.href.replace(window.location.pathname,'/') + 'detalles/emergency/' + docs.docs[docs.docs.length-1].id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=650,height=500')
      }
      if(this.state.fisrtTimeHelp)
        this.setState({fisrtTimeHelp:false})
      this.setState({sos:docs.docs.map(v=>{
        let value = v.data()
        value.dateTime = new Date(value.dateTime.toDate()).toLocaleString()
        value.id = v.id
        return value
      })})
    })
    firebaseC5.app('c5virtual').firestore().collection('support').orderBy('dateTime','desc').onSnapshot(docs=>{     
      if (this.state.support.length!==docs.size&&this.state.showNotification&&!this.state.fisrtTimeSupport) {
        this.showNot('Solicitud de soporte','Nueva solicitud de soporte generada','info','Ver detalles',2)
      }
      if(this.state.fisrtTimeSupport)
        this.setState({fisrtTimeSupport:false})
      this.setState({support:docs.docs.map(v=>{
        let value = v.data()
        value.dateTime = new Date(value.dateTime.toDate()).toLocaleString()
        value.id = v.id
        return value
      })})
    }) 
    

    firebaseC5.app('c5virtual').firestore().collection('complaints')/*.orderBy('dateTime','desc')*/.onSnapshot(docs=>{  
      console.log('complaiments',docs.docs)   
      if (this.state.complaiments.length!==docs.size&&this.state.showNotification&&!this.state.fisrtTimcomplaiments) {
        this.showNot('Nueva denuncia','Se ha recibido una nueva denuncia','info','Ver detalles',2)
      }
      if(this.state.fisrtTimecomplaiments)
        this.setState({fisrtTimecomplaiments:false})
      this.setState({complaiments:docs.docs.map(v=>{
        let value = v.data()        
        return value
      })})
    }) 

    firebaseC5.app('c5virtual').firestore().collection('calls').orderBy('dateTime','desc').onSnapshot(docs => {
      this.setState({calls:docs.docs.map(doc=>{
        let value = doc.data()
        return value})
      })
    })
    
    firebaseC5.app('c5virtual').firestore().collection('messages').orderBy('lastModification','desc').onSnapshot(docs=>{     
      if (this.state.showNotification&&!this.state.fisrtTimeChat) {
        this.showNot('Mensaje de usuario','Nuevo mensaje de usuario','success','Ver detalles',3,0)
      }
      if(this.state.fisrtTimeChat)
        this.setState({fisrtTimeChat:false})      
      this.setState({chats:docs.docs.map(v=>{
        let value = v.data()
        value.lastModification = new Date(value.lastModification.toDate()).toLocaleString()
        /*value.messages = value.messages.map(message =>{
          message.dateTime = new Date(message.dateTime.toDate()).toLocaleString()
          return message
        })*/
        value.id = v.id
        return value
      })})
    }) 
    const socket = socketIOClient('http://95.216.37.253:3011');
    socket.on("messages", this.checkCall);
    setTimeout(()=>this.checkCall(fakeCall),5000)

  }

  openSocket = (data) =>{
    console.log('socket open', data)
  }

  checkCall = (data) =>{
    console.log(data)
    console.log(this.state.showNotification)
    if (this.state.showNotification) {
      console.log('wewbsoket data',data)
      const notification = this.refs.notificationSystem;
      if(notification){        
        firebaseC5.app('c5virtual').firestore().collection('calls').add({...data,status:1,dateTime:new Date()}).then(doc=>{
          notification.addNotification({
            title:'Llama entrante de '+data.user_nicename,
            message: 'Se registro una llamada entrante',
            level: 'error',
            action: {
              label: 'Ver detalles',
              callback: ()=> {
                this.setState({modalCall:true, callInfo:{...data,id:doc.id}})
                firebaseC5.app('c5virtual').firestore().collection('calls').doc(doc.id).update({status:0})
              }
            }
          });
        })
      }
    }    
  }

  showNot = (title,message,type,label,action,id) => {
    const notification = this.refs.notificationSystem;
    if(notification){
      notification.addNotification({
        title:title,
        message: message,
        level: type,
        action: {
          label: label,
          callback: ()=> action===3?window.location.href = window.location.href.replace(window.location.pathname,'/chat#message'):this.seeMatch(action)
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
      {this.state.modalCall?<ModalCall data={this.state.callInfo} modal={this.state.modalCall} hideModal={()=>this.setState({modalCall:false, callInfo:{}})} />:null  }
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
        {this.state.isAuthenticated&&this.state.showHeader?
          <Matches 
          toggleSideMenu = {this._cameraSideInfo}  
          cameraID={this.state.cameraID}
          matchs={this.state.matches}/>  
          :null
        }           
        <SideBar toggleSideMenu = {this._toggleSideMenu} active={this.state.sideMenu}/>
        {this.state.cameraInfoSide?
          <Notifications 
            toggleSideMenu = {this._cameraSideInfo}  
            cameraID={this.state.cameraID}
            help={this.state.sos}
            support={this.state.support}
            complaiments={this.state.complaiments}
            calls={this.state.calls}
            />
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
        <Route path="/detalles/emergency/:id" exact render={(props) => <DetailsEmergency  {...props} userInfo={this.state.userInfo} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/detalles/:id" exact render={(props) => <Details  {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/mobile_help/:id" exact render={(props) => <MobileHelp  {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />        
        <Route path="/chat" exact render={(props) => <Chat chats={this.state.chats} canAccess={this.canAccess}  {...props} userInfo={this.state.userInfo} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />        
      </div>
      {this.state.cameraControl?<CameraControls camera={this.state.cameraInfo} toggleControls={this._toggleControls} active ={this.state.cameraControl}/>:null}
      <NotificationSystem ref='notificationSystem' />
      <div className="fullcontainerLayer"></div>
    </Router>  
    );
  }
}

export default App;
