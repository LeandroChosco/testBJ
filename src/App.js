import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";


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
import firebaseC5cuajimalpa from './constants/configC5CJ'
import Matches from './components/Matches';
import ArrowToggle from './components/ArrowToggle'
import DetailsEmergency from './pages/DetailsEmergency';
import Chat from './pages/Chat';
import ModalCall from './components/ModalCall';
import DetailsComplaiment from './pages/DetailsComplaiment';
import Tickets from './pages/Tickets';
import DetailsSupport from './pages/DetailsSupport';
import Dashboard from './pages/Dashboard'; 
import Cuadrantes from './pages/Cuadrantes'
import constants from './constants/constants';
import Sound from 'react-sound';
import sonido from './assets/tonos/notificacion.mp3'
import soundManager from 'soundmanager2'

let call = false

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
    calls:[],
    stopNotification:false,
    callIsGoing:false,
    fisrtTimeCall:true,
    reproducirSonido: false,
    showMatches: true
  }
  

  componentDidMount(){
    console.log(soundManager)
    soundManager.soundManager.setup({ ignoreMobileRestrictions: true });
    if(window.location.pathname.includes('mobile_help')){
      this.setState({showHeader:false})
      return true;
    }
    this._checkAuth()    
    if (!window.location.pathname.includes('detalles')&&!window.location.pathname.includes('analisis/')) {      

    }  else {
      this.setState({showHeader:false})
    }    
  }

  /*
    ----- matches reales ----
  sortConvs = (a,b) => {
    if (b.DwellTime < a.DwellTime) {
        return -1;
    }
    if (a.DwellTime < b.DwellTime) {
        return 1;
    }
    return 0;
  }



  matchesApiHandler = (event) => {
    console.log('matches handler',event)
    if (event.length !== undefined) {
      let data = event.sort(this.sortConvs)
      this.setState({matches:data})      
    } else {
      if( event.verb === 'created') {                
        let data =this.state.matches
        data.push(event.data)
        data = data.sort(this.sortConvs);                
        console.log(data)
        this.showNot('Match','Nuevo match detectado','warning','Ver match',0)
        this.setState({matches:data})     
      } 
      if( event.verb === 'updated') {      
        let data =this.state.matches
        data = data.map(match=>{
          if(match.id === event.id){
            match = {
                ...match,
                ...event.data
            }
          }
          return match
        }).sort(this.sortConvs);
        this.setState({matches:data})     
      }
    }
  }
      */


  loadData = () => {         
    if (process.env.NODE_ENV==='production'||true) {
      // --- matches planchados ---

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

      /*
      --- matches reales ----
      let io;
      if (socketIOClient.sails) {
        io = socketIOClient;
        if(!io.socket.isConnected()&&!io.socket.isConnecting()) {
          io.socket.reconnect()
        }
      } else {
        io = sailsIOClient(socketIOClient);
      }
      this.setState({io:io})          
      io.sails.url = constants.base_url+':1337';
      io.socket.get('/matchApi', this.matchesApiHandler)
      io.socket.on('/matchApi', this.matchesApiHandler)

      */
  
      firebaseC5.app('c5virtual').firestore().collection('help').orderBy('dateTime','desc').onSnapshot(docs=>{      
        if (this.state.sos.length!==docs.size&&this.state.showNotification&&!this.state.fisrtTimeHelp) {
          this.showNot('SOS','Nueva alerta de ayuda generada','error','Ver detalles',5,docs.docs[docs.docs.length-1].id)
          this.setState({reproducirSonido: true})
        }
        if(this.state.fisrtTimeHelp)
          this.setState({fisrtTimeHelp:false})
        this.setState({sos:docs.docs.map(v=>{
          let value = v.data()
          //console.log('value',value)
          if(value.dateTime.toDate)
            value.dateTime = new Date(value.dateTime.toDate()).toLocaleString()
          else 
            value.dateTime = value.date
          value.id = v.id
          return value
        })})
      })
      firebaseC5cuajimalpa.app('c5cuajimalpa').firestore().collection('support').orderBy('dateTime','desc').onSnapshot(docs=>{     
        if (this.state.support.length!==docs.size&&this.state.showNotification&&!this.state.fisrtTimeSupport) {
          this.showNot('Solicitud de soporte','Nueva solicitud de soporte generada','info','Ver detalles',4,docs.docs[0].id)
        }
        if(this.state.fisrtTimeSupport)
          this.setState({fisrtTimeSupport:false})
        this.setState({support:docs.docs.map(v=>{
          let value = v.data()
          if(value.dateTime.toDate)
            value.dateTime = new Date(value.dateTime.toDate()).toLocaleString()
          else 
            value.dateTime = value.date
          value.id = v.id
          return value
        })})
      })       
      
  
      firebaseC5.app('c5virtual').firestore().collection('complaints').orderBy('dateTime','desc').onSnapshot(docs=>{          
        if (this.state.complaiments.length!==docs.size&&this.state.showNotification&&!this.state.fisrtTimecomplaiments) {
          this.showNot('Nueva denuncia','Se ha recibido una nueva denuncia','info','Ver detalles',2,docs.docs[0].id)
          this.setState({reproducirSonido: true})
        }
        if(this.state.fisrtTimecomplaiments)
          this.setState({fisrtTimecomplaiments:false})
        this.setState({complaiments:docs.docs.map(v=>{
          let value = v.data()       
          value.id = v.id 
          return value
        })})
      }) 
  
      firebaseC5.app('c5virtual').firestore().collection('calls').orderBy('dateTime','desc').onSnapshot(docs => {
        if (this.state.showNotification&&!this.state.fisrtTimeCall&& !this.state.callIsGoing) {
          const notification = this.refs.notificationSystem;
          this.setState({stopNotification:true})      
          this.setState({callIsGoing:true})
          this.setState({reproducirSonido: true})  
          if (call) {
            call = false
            this.setState({callIsGoing:false})
            return
          }
          call = true
          //firebaseC5.app('c5virtual').firestore().collection('calls').add({...data,status:1,dateTime:new Date()}).then(doc=>{                      
            notification.addNotification({
              title:'Llama entrante de '+docs.docs[0].data().user_nicename,
              message: 'Se registro una llamada entrante',
              level: 'error',
              action: {
                label: 'Ver detalles',
                callback: ()=> {
                  //this.setState({modalCall:true, callInfo:{...data,id:doc.id}})                
                  window.location.href = window.location.href.replace(window.location.pathname,'/chat#message')
                }
              }
            });
            this.setState({callIsGoing:false})
        }
        if(this.state.fisrtTimeCall)
          this.setState({fisrtTimeCall:false})
        this.setState({calls:docs.docs.map(doc=>{
          let value = doc.data()
          return value})
        })
        this.setState({callIsGoing:false})
      })       
      firebaseC5cuajimalpa.app('c5cuajimalpa').firestore().collection('messages').orderBy('lastModification','desc').onSnapshot( docs=>{     
        console.log( docs.docChanges())
        let changes = docs.docChanges()
        if (changes.length === 1) {
          let index = changes[0].oldIndex
          let data = changes[0].doc.data()
          if (this.state.chats[index]) {
            if (this.state.chats[index].messages.length === data.messages.length) {
              this.setState({stopNotification:true})
            }
          }
        }
        if (this.state.showNotification&&!this.state.fisrtTimeChat&&!this.state.callIsGoing) {
          this.showNot('Mensaje de usuario','Nuevo mensaje de usuario','success','Ver detalles',3,0)
          if(changes[0].doc._hasPendingWrites === false)
            this.setState({reproducirSonido: true})
        }
        if(this.state.fisrtTimeChat)
          this.setState({fisrtTimeChat:false})                  
        var chats = docs.docs.map(v=>{
          let value = v.data()
          value.lastModification = new Date(value.lastModification.toDate()).toLocaleString()
          // value.messages = value.messages.map(message =>{
          //   message.dateTime = new Date(message.dateTime.toDate()).toLocaleString()
          //   return message
          //})
          value.id = v.id
          return value
        })      
        this.setState({chats:chats})
      })  
    }    
  }

  openSocket = (data) =>{
    console.log('socket open', data)
  }

  checkCall = (data) =>{    
    console.log(this.state.showNotification)
    //this.setState({callIsGoing:true})
    if (this.state.showNotification) {
      console.log('wewbsoket data',data)
      const notification = this.refs.notificationSystem;
      if(notification){
        this.setState({stopNotification:true})        
        //firebaseC5.app('c5virtual').firestore().collection('calls').add({...data,status:1,dateTime:new Date()}).then(doc=>{          
          notification.addNotification({
            title:'Llama entrante de '+data.user_nicename,
            message: 'Se registro una llamada entrante',
            level: 'error',
            action: {
              label: 'Ver detalles',
              callback: ()=> {
                //this.setState({modalCall:true, callInfo:{...data,id:doc.id}})                
                window.location.href = window.location.href.replace(window.location.pathname,'/chat#message')
              }
            }
          });
                    
        //})
      }
    }    
  }

  showNot = (title,message,type,label,action,id) => {
    const notification = this.refs.notificationSystem;
    if(notification&&!this.state.stopNotification&&!this.state.callIsGoing){
      notification.addNotification({
        title:title,
        message: message,
        level: type,
        action: {
          label: label,
          callback: ()=> 
            action===3?window.location.href = window.location.href.replace(window.location.search,'').replace(window.location.hash,'').replace(window.location.pathname,'/chat#message'):
            action===5?window.open(window.location.href.replace(window.location.search,'').replace(window.location.hash,'').replace(window.location.pathname,'/') + 'detalles/emergency/' + id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=650,height=500'):
            action===2?window.open(window.location.href.replace(window.location.pathname,'/').replace(window.location.search,'').replace(window.location.hash,'') + 'detalles/denuncia/' + id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=650,height=500'):
            action===4?window.open(window.location.href.replace(window.location.pathname,'/').replace(window.location.search,'').replace(window.location.hash,'') + 'detalles/soporte/' + id,'_blank','toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=650,height=500'):
            this.seeMatch(action)
        }
      });
    }
    if (this.state.stopNotification) {
      this.setState({stopNotification:false})
    }
  }

  seeMatch = (id) => {
    console.log(id)
    this._cameraSideInfo(id)
  } 


  _reloadCams = () => {
    this.setState({loadingRestart:true})
    conections.getAllCams().then(response=>{
      const data = response.data
      console.log(data)
      let dns = []      
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.active === 1 && element.flag_streaming === 1) {
          if (dns.indexOf('http://'+element.UrlStreamToCameras[0].Url.dns_ip) < 0 ) {
            dns.push('http://'+element.UrlStreamToCameras[0].Url.dns_ip)
          }
        } 
      }
      console.log(dns)
      let promises = []
      for (let index = 0; index < dns.length; index++) {
        const element = dns[index];
        promises.push(conections.restartStream(element))
        
      }
      Promise.all(promises).then(response=>{
        console.log(response)
        const event = new Event('restartCamEvent')
        window.dispatchEvent(event)
        this.setState({loadingRestart:false})
      }).catch(reason=>{
        console.log(reason)
        const event = new Event('restartCamEvent')
        window.dispatchEvent(event)
        this.setState({loadingRestart:false})
        alert('Error reiniciando algunas camaras')
      })
    }).catch(error =>{
      const event = new Event('restartCamEvent')
      window.dispatchEvent(event)
      this.setState({loadingRestart:false})
      alert('Error reiniciando algunas camaras')
    })
    /*conections.restartStream().then(data=>{
      this.setState({loadingRestart:false})
      if (data.data.success) {
        const event = new Event('restartCamEvent')
        window.dispatchEvent(event)
      } else {
        alert('Error reiniciando las camaras')
      }
    })*/
  } 


  _checkAuth(){
    const isAuth = sessionStorage.getItem('isAuthenticated')    
    if (isAuth) {
      const data = JSON.parse(isAuth)
      this.setState({isAuthenticated:data.logged,userInfo:data.userInfo,showNotification:true})       
      if (!window.location.pathname.includes('detalles')&&!window.location.pathname.includes('analisis/')) {      
        //setTimeout(this.showNot,10000)
        this.loadData()
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
    this.loadData()
    setTimeout(this.setState({isAuthenticated:true}),500)
  }

  _toggleSideMenu = () => {    
    this.setState({sideMenu: !this.state.sideMenu})
  }

  _cameraSideInfo = (cameraInfo) => {      
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

ocultarMatches = (value) => {
  this.setState({
    showMatches: value
  })
}

  render() {
    return (
    <Router>
      {this.state.reproducirSonido ? 
          <Sound 
              url={sonido}
              playStatus={Sound.status.PLAYING}
              onFinishedPlaying={()=>this.setState({reproducirSonido:false})}
          />
          :null
      }     
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
          (<React.Fragment>
          <ArrowToggle ocultarMatches={this.ocultarMatches} />   
            {this.state.showMatches ?
          <Matches 
          toggleSideMenu = {this._cameraSideInfo}  
          cameraID={this.state.cameraID}
          matchs={this.state.matches}/>  :null}
          </React.Fragment>)
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
            propsIniciales={this.state.chats}
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
        <Route path="/map" exact render={(props) =><Map canAccess={this.canAccess} showMatches={this.state.showMatches} {...props} chats={this.state.chats} />} />
        <Route path="/welcome" exact render={(props) =><Welcome {...props}/>} />
        <Route path="/login" exact render={(props) => <Login {...props} makeAuth={this._makeAuth} isAuthenticated={this.state.isAuthenticated}/> }/>
        <Route path="/analisis" exact render={(props) => <Analysis showMatches={this.state.showMatches} matches={this.state.matches} chats={this.state.chats}  canAccess={this.canAccess} {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/analisis/:id" exact render={(props) => <Analysis  canAccess={this.canAccess} {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />        
        <Route path="/detalles/emergency/:id" exact render={(props) => <DetailsEmergency  {...props} userInfo={this.state.userInfo} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/detalles/denuncia/:id" exact render={(props) => <DetailsComplaiment  {...props} userInfo={this.state.userInfo} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/detalles/soporte/:id" exact render={(props) => <DetailsSupport  {...props} userInfo={this.state.userInfo} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/detalles/:id" exact render={(props) => <Details  {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/mobile_help/:id" exact render={(props) => <MobileHelp  {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />        
        <Route path="/chat" exact render={(props) => <Chat showMatches={this.state.showMatches} stopNotification={()=>this.setState({stopNotification:true})} chats={this.state.chats} canAccess={this.canAccess}  {...props} userInfo={this.state.userInfo} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />  
        <Route path="/tickets" exact render={(props) => <Tickets canAccess={this.canAccess}  {...props} userInfo={this.state.userInfo} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />        
        <Route path="/dashboard" exact render={(props) => <Dashboard canAccess={this.canAccess}  showMatches={this.state.showMatches} {...props} userInfo={this.state.userInfo} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/cuadrantes" exact render={(props) => <Cuadrantes showMatches={this.state.showMatches} matches={this.state.matches} chats={this.state.chats} canAccess={this.canAccess} {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />
        <Route path="/cuadrantes/:id" exact render={(props) => <Cuadrantes matches={this.state.matches} chats={this.state.chats} canAccess={this.canAccess} {...props} toggleSideMenu = {this._cameraSideInfo} toggleControls={this._toggleControls}/>} />                                        
      </div>
      {this.state.cameraControl?<CameraControls camera={this.state.cameraInfo} toggleControls={this._toggleControls} active ={this.state.cameraControl}/>:null}
      <NotificationSystem ref='notificationSystem' />
      <div className="fullcontainerLayer"></div>
    </Router>  
    );
  }
}

export default App;
