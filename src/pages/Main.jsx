import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux';

import Login from './Login'
import Map from './Map'
import Analysis from './Analysis';
import NotificationSystem from 'react-notification-system';

import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Notifications from '../components/Notifications';
import CameraControls from '../components/CameraControls';

// import '../App.css';
import Details from './Details';
import MobileHelp from './CamaraForMobile';
import conections from '../conections';
import Welcome from './Welcome';
import firebaseC5Benito from '../constants/configC5CJ'
// import firebase from '../constants/config';
// import firebaseC5 from '../constants/configC5';
import Matches from '../components/Matches';
import DetailsEmergency from './DetailsEmergency';
import ModalCall from '../components/ModalCall';
import DetailsComplaiment from './DetailsComplaiment';
import Tickets from './Tickets';
import DetailsSupport from './DetailsSupport';
import Dashboard from './Dashboard';
import Cuadrantes from './Cuadrantes'
import Sospechosos from "./Sospechosos";
import AlarmChat from "./AlarmChat/index";
import Complaint from "./Complaint";
import ChatTracking from "./ChatTracking";
import constants from '../constants/constants';
import Sound from 'react-sound';
import sonido from '../assets/tonos/notificacion.mp3';
import soundManager from 'soundmanager2';
import ArrowToggle from '../components/ArrowTogle';
import CovidItemDetail from '../components/CovidItemDetail';
// import CovidTree from "./CovidTree";
import Covid from './Covid';
import RoberyNotification from '../components/RoberyNotification';
import socketIOClient from "socket.io-client";
import sailsIOClient from "sails.io.js";
import SosView from "./SOSview/index";
import firebaseSos from "../constants/configSOS";
import { MESSAGES_COLLECTION, COMPLAINT_COLLECTION, POLICE_COLLECTION } from "../Api/sos";
import {ACCESS_TOKEN,SAILS_ACCESS_TOKEN} from '../constants/token'

import Chat from './ChatPlus/index'
import Policia from './Policia';
// import { ContentSort } from 'material-ui/svg-icons';

var io = sailsIOClient(socketIOClient);

//Socket para servicio de alarmas
// const ioAlarmSocket = socketIOClient('http://ec2-18-191-81-252.us-east-2.compute.amazonaws.com:3000/c5')
// const ioAlarmSocket = socketIOClient('http://localhost:3000/c5')




let call = false

class Main extends Component {

  state = {
    isAuthenticated: true,
    sideMenu: false,
    cameraInfoSide: false,
    cameraInfo: null,
    cameraID: null,
    cameraControl: false,
    showHeader: true,
    userInfo: {
      name: ''
    },
    loadingRestart: false,
    matches: [],
    sos: [],
    support: [],
    fisrtTimeChat: true,
    chats: [],
    chatSelected: null,
    showNotification: false,
    fisrtTime: false,
    fisrtTimeHelp: true,
    fisrtTimeSupport: true,
    firebase: {},
    ws: null,
    fisrtTimecomplaiments: true,
    complaiments: [],
    modalCall: false,
    callInfo: {},
    calls: [],
    stopNotification: false,
    callIsGoing: false,
    fisrtTimeCall: true,
    reproducirSonido: false,
    showMatches: true,
    alertaCovid: [],
    alertaCovidd: [],
    alertaCovidState: false,
    newCovidState: false,
    newCovidItem: [],
    alertaCovidTmp: [],
    roberyNotification: {
      display: false,
      data: null
    },
    stateSos: [],
    datosAlcaldia: {},
    chatFirebase: undefined,
    indexSos: undefined,
    complaints: []
  }


  componentDidMount() {
    conections.getDesconocidos().then((res)=>{
      // console.log(res);
    }).catch(err=>{

      // console.log((err.message));
      if(err.message==="Request failed with status code 500"){

        sessionStorage.removeItem('isAuthenticated')
        localStorage.removeItem(ACCESS_TOKEN)
        localStorage.removeItem(SAILS_ACCESS_TOKEN)
        if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
          window.location.href = window.location.href.replace(window.location.pathname, '/login')
        }
      }
    })
    conections.getAllPoliceSector().then(response=>{
      if(response.data.errors){
        if(response.data.errors[0].message==="Unauthorized"){
          localStorage.removeItem(ACCESS_TOKEN,"")
          localStorage.removeItem(SAILS_ACCESS_TOKEN,"")
          sessionStorage.removeItem('isAuthenticated')
          if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
            window.location.href = window.location.href.replace(window.location.pathname, '/login')
          }
        };
      }
     
    })

    conections.getClients().then(res => {
      const data = res.data.data.getClients.filter(c => c.name === constants.client);
      constants.urlPath =
        data[0].photo_path != null
          ?
          constants.urlPath = data[0].photo_path :
          constants.urlPath
    })

    firebaseC5Benito
      .app('c5benito')
      .firestore()
      .collection('messages')
      .orderBy('lastModification', 'desc')
      .get()
      .then((docs) => {
        if (docs.docs.length > 0) {
          const chats = docs.docs.map((v) => {
            let value = v.data();
            value.lastModification = new Date(
              value.lastModification.toDate()
            ).toString();
            value.id = v.id;
            return value;
          });
          this.setState({ chats });
        }
      });
    io.sails.url = `${constants.sails_url}`;
    io.socket.get('/termicfiles', (data) => {
      let covidTmp = [];
      if (data && data.data) {
        data.data.forEach(element => {
          if (element.camData[0].termic_type === 1) {
            covidTmp.push(element);
          }
        });
      }
      this.setState({ alertaCovidd: data.data, alertaCovid: data.data, alertaCovidTmp: covidTmp, alertaCovidState: true })
    })
    io.socket.on('foo', (data) => {
      const notification = this.refs.notificationSystem;
      let tmpArr = [...this.state.alertaCovid]
      tmpArr.unshift(data.data)
      let covidTmp = [...this.state.alertaCovidTmp]

      if (data.data.camData[0].termic_type === 1) {
        covidTmp.unshift(data.data)
      }
      this.setState({ reproducirSonido: true, alertaCovidTmp: covidTmp, alertaCovid: tmpArr, newCovidItem: data.data, newCovidState: true })
      if (data.data.camData[0].termic_type === 1) {
        notification.addNotification({
          title: 'Alerta Covid en ' + data.data.camData[0].township,
          message: "Camara: " + data.data.cam_id + " Dirección: " + data.data.camData[0].street + " " + data.data.camData[0].number + " Col." + data.data.camData[0].town,
          level: 'error',
          action: {
            label: 'Ver detalles',
            callback: () => {
              window.open(
                window.location.href
                  .replace(window.location.pathname, "/")
                  .replace(window.location.search, "")
                  .replace(window.location.hash, "") +
                "detalles/covid/" +
                data.data.name,
                "_blank",
                "toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=650,height=400"
              );
            }
          }
        })
      }
      // setTimeout(() => {
      //   this.setState({newCovidState: false})
      // }, 500);
    })

    soundManager.soundManager.setup({ ignoreMobileRestrictions: true });
    if (window.location.pathname.includes('mobile_help')) {
      this.setState({ showHeader: false })
      return true;
    }
    this._checkAuth()
    if (!window.location.pathname.includes('detalles') && !window.location.pathname.includes('analisis/')) {

    } else {
      this.setState({ showHeader: false })
    }

  }

  componentDidUpdate(prevProps) {
    conections.getDesconocidos().then((res)=>{
      // console.log(res);
    }).catch(err=>{

      // console.log((err.message));
      if(err.message==="Request failed with status code 500"){
        localStorage.removeItem(ACCESS_TOKEN,"")
        localStorage.removeItem(SAILS_ACCESS_TOKEN,"")
        sessionStorage.removeItem('isAuthenticated')
        if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
          window.location.href = window.location.href.replace(window.location.pathname, '/login')
        }
      }
    })
    conections.getAllPoliceSector().then(response=>{
      if(response.data.errors){
        if(response.data.errors[0].message==="Unauthorized"){
          localStorage.removeItem(ACCESS_TOKEN,"")
          localStorage.removeItem(SAILS_ACCESS_TOKEN,"")
          sessionStorage.removeItem('isAuthenticated')
          if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
            window.location.href = window.location.href.replace(window.location.pathname, '/login')
          }
        };
      }
     
    })

    const { limits: prevLimits } = prevProps;
    const { limits } = this.props;
    if (prevLimits !== limits) {
      if (limits && limits.data && limits.data.id) {
        this.setState({
          datosAlcaldia: limits.data
        })
        // const { clave_municipal } = limits.data;
        firebaseSos
          .app("sos")
          .firestore()
          .collection(MESSAGES_COLLECTION)
          // .where("c5_admin_clave", "==", clave_municipal)
          .orderBy("lastModification", "desc")
          .get()
          .then(docs => {
            const chatSOS = docs.docs.map((i) => {
              let data = i.data();
              data.lastModification = new Date(
                data.lastModification.toDate()
              ).toString();
              data.id = i.id;
              return data;
            });
            this.setState({ stateSos: chatSOS })
            this.loadData()
          });
      }
    }
  }

  //  ----- matches reales ----
  /* sortConvs = (a, b) => {
    if (b.DwellTime < a.DwellTime) {
      return -1;
    }
    if (a.DwellTime < b.DwellTime) {
      return 1;
    }
    return 0;
  } */

  /* matchesApiHandler = (event) => {
    if (event.length !== undefined) {
      let data = event.sort(this.sortConvs)
      this.setState({ matches: data })
    } else {
      if (event.verb === 'created') {
        let data = this.state.matches
        data.push(event.data)
        data = data.sort(this.sortConvs);
        this.showNot('Match', 'Nuevo match detectado', 'warning', 'Ver match', 0)
        this.setState({ matches: data })
      }
      if (event.verb === 'updated') {
        let data = this.state.matches
        data = data.map(match => {
          if (match.id === event.id) {
            match = {
              ...match,
              ...event.data
            }
          }
          return match
        }).sort(this.sortConvs);
        this.setState({ matches: data })
      }
    }
  } */

  _newCovidItem = () => {
    if (this.state.newCovidState) {
      this.setState({ newCovidState: false })
    }
  }

  _alertaCovidState = () => {
    if (this.state.alertaCovidState) {
      this.setState({ alertaCovidState: false })
    }
  }

  loadData = () => {
    if (process.env.NODE_ENV === 'production' || true) {
      // --- matches planchados ---
      conections.getMatchAPI().then(docs => {
        if (this.state.matches.length !== docs.data.length && this.state.showNotification && !this.state.fisrtTime) {
          this.showNot(
            "Match",
            "Nuevo match detectado",
            "warning",
            "ver match",
            0
          );
        }
        if (this.state.fisrtTime) {
          this.setState({ fisrtTime: false });
        }
        this.setState({
          matches: docs.data.map(v => {
            let value = v
            if (value.dateTime) {
              value.dateTime = new Date(
                value.dateTime
              ).toString();
            } else {
              value.dateTime = value.date;
            }
            return value
          })
        })
      })
    }

    /* firebaseC5Benito.firestore().collection('matches').orderBy('dateTime', 'desc').onSnapshot(docs => {
      if (this.state.matches.length !== docs.size && this.state.showNotification && !this.state.fisrtTime) {
        this.showNot('Match', 'Nuevo match detectado', 'warning', 'Ver match', 0)
      }
      if (this.state.fisrtTime)
        this.setState({ fisrtTime: false })
      this.setState({
        matches: docs.docs.map(v => {
          let value = v.data()
          value.dateTime = new Date(value.dateTime.toDate()).toString()
          return value
        })
      })
    }) */
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
    io.sails.url = constants.sails_url+':1337';
    io.socket.get('/matchApi', this.matchesApiHandler)
    io.socket.on('/matchApi', this.matchesApiHandler)
 
    */
    if (this.state.datosAlcaldia && this.state.datosAlcaldia.clave_municipal) {
      firebaseSos
        .app('sos')
        .firestore()
        .collection(POLICE_COLLECTION)
        .where('active', '==', true)
        .where('clientId', '==', this.state.datosAlcaldia.clave_municipal)
        .onSnapshot((snap) => {
          let docsModified = snap.docChanges().filter((item) => item.type === 'modified');
          if (docsModified.length > 0 && (snap.docs.length === 1 || docsModified.length !== snap.docs.length)) {
            docsModified.map(async (d) => {
              const { policeList, isAlarm, alarmType, trackingType, messageId, c5_notification, time } = d.doc.data();
              const { status, reason } = policeList.pop();
              if (c5_notification && status !== null) {
                if (isAlarm) {
                  switch (alarmType) {
                    case 'Policia':
                      this.showAlarmNot("Alarma Fisica - Policia", status ? `El policia a aceptado la incidencia. Tiempo estimado de llegada: ${time}` : `El policia asignado a rechazado la incidencia. Razon: ${reason}. Reasigna a otro policia.`, "error", "Ver detalles", 0, messageId);
                      break;
                    case 'Fuego':
                      this.showAlarmNot("Alarma Fisica - Fuego", status ? `El policia a aceptado la incidencia. Tiempo estimado de llegada: ${time}` : `El policia asignado a rechazado la incidencia. Razon: ${reason}. Reasigna a otro policia.`, "error", "Ver detalles", 1, messageId);
                      break;
                    case 'Médico':
                      this.showAlarmNot("Alarma Fisica - Médico", status ? `El policia a aceptado la incidencia. Tiempo estimado de llegada: ${time}` : `El policia asignado a rechazado la incidencia. Razon: ${reason}. Reasigna a otro policia.`, "error", "Ver detalles", 2, messageId);
                      break;
                    default:
                      break;
                  }
                } else {
                  switch (trackingType) {
                    case 'Seguridad':
                      this.showSOSNot("SOS - Seguridad", status ? `El policia a aceptado la incidencia. Tiempo estimado de llegada: ${time}` : `El policia asignado a rechazado la incidencia. Razon: ${reason}. Reasigna a otro policia.`, "error", "Ver detalles", 0, messageId);
                      break;
                    case 'Protección Civil':
                      this.showSOSNot("SOS - Proteccion Civil", status ? `El policia a aceptado la incidencia. Tiempo estimado de llegada: ${time}` : `El policia asignado a rechazado la incidencia. Razon: ${reason}. Reasigna a otro policia.`, "error", "Ver detalles", 1, messageId);
                      break;
                    case 'Emergencia Médica':
                      this.showSOSNot("SOS - Emergencia Medica", status ? `El policia a aceptado la incidencia. Tiempo estimado de llegada: ${time}` : `El policia asignado a rechazado la incidencia. Razon: ${reason}. Reasigna a otro policia.`, "error", "Ver detalles", 2, messageId);
                      break;
                    case 'Seguimiento Por Hora':
                      this.showTrackingNot("Seguimiento - Por Hora", status ? `El policia a aceptado la incidencia. Tiempo estimado de llegada: ${time}` : `El policia asignado a rechazado la incidencia. Razon: ${reason}. Reasigna a otro policia.`, "error", "Ver detalles", 0, messageId);
                      break;
                    case 'Seguimiento Por Destino':
                      this.showTrackingNot("Seguimiento - Por Destino", status ? `El policia a aceptado la incidencia. Tiempo estimado de llegada: ${time}` : `El policia asignado a rechazado la incidencia. Razon: ${reason}. Reasigna a otro policia.`, "error", "Ver detalles", 1, messageId);
                      break;
                    default:
                      break;
                  }
                }
                firebaseSos.app('sos').firestore().collection(POLICE_COLLECTION).doc(d.doc.id).update({ c5_notification: false });
              }
            });
          }
        });

      firebaseSos
        .app("sos")
        .firestore()
        .collection(MESSAGES_COLLECTION)
        // .where("c5_admin_clave", "==", this.state.datosAlcaldia.clave_municipal)
        .orderBy("lastModification", "desc")
        .onSnapshot((docs) => {
          if (this.state.stateSos.length > 0) {
            let changes = docs.docChanges();
            if (changes.length > 0 && changes.length < 5) {
              const changed_data = changes[0].doc.data();
              const changed_id = changes[0].doc.id;
              if (changes[0].type === "added") {

                let founded = this.state.stateSos.find(item => item.id === changed_id);
                if (!founded) {
                  if (this.state.fisrtTimeChat) this.setState({ fisrtTimeChat: false });
                  changed_data['id'] = changed_id;
                  let aux_chat_sos = [...this.state.stateSos];
                  aux_chat_sos.unshift(changed_data)
                  this.setState({
                    stateSos: aux_chat_sos
                  });
                  if (
                    this.state.showNotification &&
                    !this.state.fisrtTimeChat &&
                    !this.state.callIsGoing
                  ) {
                    this.setState({ reproducirSonido: true });
                    switch (changed_data.trackingType) {
                      case 'Seguridad':
                        this.showSOSNot("SOS - Seguridad", "Nuevo mensaje de usuario", "error", "Ver detalles", 0, changed_id);
                        break;
                      case 'Protección Civil':
                        this.showSOSNot("SOS - Proteccion Civil", "Nuevo mensaje de usuario", "error", "Ver detalles", 1, changed_id);
                        break;
                      case 'Emergencia Médica':
                        this.showSOSNot("SOS - Emergencia Medica", "Nuevo mensaje de usuario", "error", "Ver detalles", 2, changed_id);
                        break;
                      case 'Seguimiento Por Hora':
                        this.showTrackingNot("Seguimiento - Por Hora", "Nuevo mensaje de usuario", "error", "Ver detalles", 0, changed_id);
                        break;
                      case 'Seguimiento Por Destino':
                        this.showTrackingNot("Seguimiento - Por Destino", "Nuevo mensaje de usuario", "error", "Ver detalles", 1, changed_id);
                        break;
                      default:
                        break;
                    }
                  }
                }
              } else {
                if (this.state.fisrtTimeChat) this.setState({ fisrtTimeChat: false });
                const find_conv_index = this.state.stateSos.findIndex(item => item.id === changed_id);
                let aux_sos_chat = [...this.state.stateSos];
                let aux_obj = Object.assign(changed_data, {});
                if (find_conv_index >= 0) {
                  if (this.state.stateSos[find_conv_index].messages.length !== changed_data.messages.length) {
                    const aux_array = [...changed_data.messages];
                    const current_message = aux_array.pop();
                    aux_obj = {
                      ...aux_obj,
                      lastModification: new Date(aux_obj.lastModification.toDate()).toString(),
                      id: changed_id
                    }
                    aux_sos_chat[find_conv_index] = aux_obj;
                    this.setState({
                      stateSos: aux_sos_chat
                    }, () => {
                      if (
                        this.state.showNotification &&
                        !this.state.fisrtTimeChat &&
                        !this.state.callIsGoing
                      ) {
                        if (current_message && current_message.from.includes("user")) {
                          this.setState({ reproducirSonido: true });
                          switch (changed_data.trackingType) {
                            case 'Seguridad':
                              this.showSOSNot("SOS - Seguridad", "Nuevo mensaje de usuario", "error", "Ver detalles", 0, changed_id);
                              break;
                            case 'Protección Civil':
                              this.showSOSNot("SOS - Proteccion Civil", "Nuevo mensaje de usuario", "error", "Ver detalles", 1, changed_id);
                              break;
                            case 'Emergencia Médica':
                              this.showSOSNot("SOS - Emergencia Medica", "Nuevo mensaje de usuario", "error", "Ver detalles", 2, changed_id);
                              break;
                            case 'Seguimiento Por Hora':
                              this.showTrackingNot("Seguimiento - Por Hora", "Nuevo mensaje de usuario", "error", "Ver detalles", 0, changed_id);
                              break;
                            case 'Seguimiento Por Destino':
                              this.showTrackingNot("Seguimiento - Por Destino", "Nuevo mensaje de usuario", "error", "Ver detalles", 1, changed_id);
                              break;
                            default:
                              break;
                          }
                        }
                      }
                    });
                  } else {
                    if (this.state.stateSos[find_conv_index].critical_state !== changed_data.critical_state) {
                      aux_obj = {
                        ...aux_obj,
                        lastModification: new Date(aux_obj.lastModification.toDate()).toString(),
                        id: changed_id
                      }
                      aux_sos_chat[find_conv_index] = aux_obj;
                      this.setState({
                        stateSos: aux_sos_chat
                      }, () => {
                        this.setState({ reproducirSonido: true });
                        switch (changed_data.trackingType) {
                          case 'Seguimiento Por Hora':
                            this.showTrackingNot("Seguimiento - Por Hora", "Cambio en el nivel de criticidad", "error", "Ver detalles", 0, changed_id);
                            break;
                          case 'Seguimiento Por Destino':
                            this.showTrackingNot("Seguimiento - Por Destino", "Cambio en el nivel de criticidad", "error", "Ver detalles", 1, changed_id);
                            break;
                          default:
                            break;
                        }
                      })
                    } else if (this.state.stateSos[find_conv_index].c5Unread !== changed_data.c5Unread) {
                      aux_obj = {
                        ...aux_obj,
                        lastModification: new Date(aux_obj.lastModification.toDate()).toString(),
                        id: changed_id
                      }
                      aux_sos_chat[find_conv_index] = aux_obj;
                      this.setState({
                        stateSos: aux_sos_chat
                      })
                    } else {

                    }
                  }
                }
              }
            }
          }
        });
    }

    firebaseSos
      .app('sos')
      .firestore()
      .collection(COMPLAINT_COLLECTION)
      .orderBy('fecha_modificacion', 'desc')
      .onSnapshot((docs) => {
        let { complaints, showNotification, callIsGoing } = this.state;
        if (complaints.length > 0) {
          let changes = docs.docChanges();
          if (changes.length > 0 && changes.length < 5) {
            const CREATED_ID = changes[0].doc.id;
            if (changes[0].type === 'added') {
              let founded = complaints.find((item) => item.id === CREATED_ID);
              if (!founded) {
                if (showNotification && !callIsGoing) {
                  this.setState({ reproducirSonido: true });
                  this.showComplaintNot(
                    'Solicitud de servicios',
                    'Nueva solicitud de servicios',
                    'info',
                    'Ver detalles',
                    CREATED_ID
                  );
                }
              }
            }
          }
        }

        let newComplaints = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        this.setState({ complaints: newComplaints });
      });

    firebaseC5Benito
      .app('c5benito')
      .firestore()
      .collection('messages')
      .orderBy('lastModification', 'desc')
      .onSnapshot(docs => {
        let changes = docs.docChanges();
        if (changes.length > 0) {
          const index = changes[0].oldIndex;
          const data = changes[0].doc.data();
          const changed_id = changes[0].doc.id;
          if (this.state.chats[index]) {
            if (this.state.chats[index].messages.length === data.messages.length) {
              this.setState({ stopNotification: true });
            } else {
              if (this.state.fisrtTimeChat) this.setState({ fisrtTimeChat: false })
              const chats = docs.docs.map(v => {
                let value = v.data()
                value.lastModification = new Date(
                  value.lastModification.toDate()
                ).toString()
                value.id = v.id
                return value
              });

              if (
                this.state.showNotification &&
                !this.state.fisrtTimeChat &&
                !this.state.callIsGoing
              ) {
                this.setState({ reproducirSonido: true, chats, stopNotification: false });
                if (typeof data.alarmType === 'string') {
                  switch (data.alarmType) {
                    case 'Policia':
                      this.showAlarmNot('Mensaje de usuario', 'Nuevo mensaje - Policia', 'success', 'Ir a chat', 0, changes[0].doc.id)
                      break;
                    case 'Fuego':
                      this.showAlarmNot('Mensaje de usuario', 'Nuevo mensaje - Fuego', 'success', 'Ir a chat', 1, changes[0].doc.id)
                      break;
                    case 'Médico':
                      this.showAlarmNot('Mensaje de usuario', 'Nuevo mensaje - Médico', 'success', 'Ir a chat', 2, changes[0].doc.id)
                      break;
                    default:
                      break;
                  }
                } else {
                  this.showNot(
                    'Mensaje de usuario',
                    'Nuevo mensaje de usuario',
                    'success',
                    'Ver detalles',
                    0,
                    changes[0].doc.id
                  );
                }
              }
            }
          } else {
            const { chats } = this.state;
            if (changes[0].type === "added" && chats.length > 0) {
              let founded = this.state.chats.find(item => item.id === changed_id);

              if (!founded) {
                if (this.state.fisrtTimeChat) this.setState({ fisrtTimeChat: false });
                const chats = docs.docs.map(v => {
                  let value = v.data()
                  value.lastModification = new Date(
                    value.lastModification.toDate()
                  ).toString()
                  value.id = v.id
                  return value
                });
                this.setState({ reproducirSonido: true, chats, stopNotification: false });
                if (
                  this.state.showNotification &&
                  !this.state.fisrtTimeChat &&
                  !this.state.callIsGoing
                ) {
                  this.showNot(
                    'Mensaje de usuario',
                    'Nuevo mensaje de usuario',
                    'success',
                    'Ver detalles',
                    0,
                    changes[0].doc.id
                  );
                }
              }
            }
          }
          //   let index = changes[0].oldIndex;
          //   let data = changes[0].doc.data();
          //   if (this.state.chats[index]) {
          //     if (
          //       this.state.chats[index].messages.length === data.messages.length
          //     ) {
          //       this.setState({ stopNotification: true });
          //     }
          //   }
          // if (this.state.fisrtTimeChat) this.setState({ fisrtTimeChat: false })
          // const chats = docs.docs.map(v => {
          //     let value = v.data()
          //     value.lastModification = new Date(
          //         value.lastModification.toDate()
          //     ).toString()
          //     value.id = v.id
          //     return value
          // })

          // this.setState({ chats })
        }
      })



    firebaseC5Benito.app('c5benito').firestore().collection('help').orderBy('dateTime', 'desc').onSnapshot(docs => {
      if (this.state.sos.length !== docs.size && this.state.showNotification && !this.state.fisrtTimeHelp) {
        this.showNot('SOS', 'Nueva alerta de ayuda generada', 'error', 'Ver detalles', 5, docs.docs[docs.docs.length - 1].id)
        this.setState({ reproducirSonido: true })
      }
      if (this.state.fisrtTimeHelp)
        this.setState({ fisrtTimeHelp: false })
      this.setState({
        sos: docs.docs.map(v => {
          let value = v.data();
          if (value.dateTime.toDate)
            value.dateTime = new Date(value.dateTime.toDate()).toString()
          else
            value.dateTime = value.date
          value.id = v.id
          return value
        })
      })
    })

    firebaseC5Benito.app('c5benito').firestore().collection('support').orderBy('dateTime', 'desc').onSnapshot(docs => {
      if (this.state.support.length !== docs.size && this.state.showNotification && !this.state.fisrtTimeSupport) {
        this.showNot('Solicitud de soporte', 'Nueva solicitud de soporte generada', 'info', 'Ver detalles', 4, docs.docs[0].id)
      }
      if (this.state.fisrtTimeSupport)
        this.setState({ fisrtTimeSupport: false })
      this.setState({
        support: docs.docs.map(v => {
          let value = v.data()
          if (value.dateTime.toDate)
            value.dateTime = new Date(value.dateTime.toDate()).toString()
          else
            value.dateTime = value.date
          value.id = v.id
          return value
        })
      })
    })


    firebaseC5Benito.app('c5benito').firestore().collection('complaints').orderBy('dateTime', 'desc').onSnapshot(docs => {
      if (this.state.complaiments.length !== docs.size && this.state.showNotification && !this.state.fisrtTimecomplaiments) {
        this.showNot('Nueva denuncia', 'Se ha recibido una nueva denuncia', 'info', 'Ver detalles', 2, docs.docs[0].id)
        this.setState({ reproducirSonido: true })
      }
      if (this.state.fisrtTimecomplaiments)
        this.setState({ fisrtTimecomplaiments: false })
      this.setState({
        complaiments: docs.docs.map(v => {
          let value = v.data()
          value.id = v.id
          return value
        })
      })
    })

    firebaseC5Benito.app('c5benito').firestore().collection('calls').orderBy('dateTime', 'desc').onSnapshot(docs => {
      if (this.state.showNotification && !this.state.fisrtTimeCall && !this.state.callIsGoing) {
        // const notification = this.refs.notificationSystem;
        this.setState({ stopNotification: false })
        this.setState({ callIsGoing: false })
        this.setState({ reproducirSonido: false })
        if (call) {
          call = false
          this.setState({ callIsGoing: false })
          return
        }
        call = false
        //firebaseC5.app('c5cuajimalpa').firestore().collection('calls').add({...data,status:1,dateTime:new Date()}).then(doc=>{                      
        /* notification.addNotification({
          title: 'Llama entrante de ' + docs && docs.docs.length > 0 && docs.docs[0].data().user_nicename,
          message: 'Se registro una llamada entrante',
          level: 'error',
          action: {
            label: 'Ver detalles',
            callback: () => {
              let userFound = false;

              this.state.chats.forEach((chat) => {
                if (chat.user_creation === docs.docs[0].data().user_id && this.state.chats.length > 0) {
                  userFound = true;
                  // window.location.href = window.location.href.replace(window.location.pathname, '/chat#'+chat.user_creation)
                  // this.props.history.push('/chat?f=2&u='+chat.user_creation);
                  if (userFound) {
                    this.setState({
                      roberyNotification: {
                        display: true,
                        data: chat
                      },
                      callIsGoing: false
                    })
                  }

                }
              })
            }


          }
        }); */
        this.setState({ callIsGoing: false })
      }
      if (this.state.fisrtTimeCall)
        this.setState({ fisrtTimeCall: false })
      this.setState({
        calls: docs.docs.map(doc => {
          let value = doc.data()
          return value
        })
      })
      this.setState({ callIsGoing: false })
    })


    // Socket desarollo conectado a alarma
    firebaseSos
      .app("sos")
      .firestore()
      .collection('alarms')
      //  .where("c5_admin_clave", "==", this.state.datosAlcaldia[0].clave_municipal)
      .orderBy("createdAt", "desc")
      .onSnapshot((docs) => {
        let changes = docs.docChanges();
        let doc_change = changes.filter(item => item.type === "modified");
        if (doc_change.length > 0) {
          const doc_data = doc_change.map(item => ({ id: item.doc.id, data: item.doc.data() }));
          if (doc_data.length > 0) {
            doc_data.forEach(d => {
              const { data } = d;
              if (data && data.chatId) {
                const { police, fire, medical, partial_armed, away_armed } = data.alarmedStatus;
                if (police || partial_armed || away_armed) {
                  this.showAlarmNot('Activacion  de Alarma', 'Nuevo solicitud de auxilio - Policia', 'error', 'Ir a chat', 0, data.chatId)
                }
                if (fire) {
                  this.showAlarmNot('Activacion de Alarma', 'Nuevo solicitud de auxilio - Fuego', 'error', 'Ir a chat', 1, data.chatId)
                }
                if (medical) {
                  this.showAlarmNot('Activacion de Alarma', 'Nuevo solicitud de auxilio - Medico', 'error', 'Ir a chat', 2, data.chatId)
                }
              }
            })
          }

        }
      });
  }

  notificationRoute = () => {
    this.setState({
      showNotification: true,
      fisrtTimeCall: false,
      callIsGoing: false,
      roberyNotification: {
        display: false
      }
    })
  }

  // openSocket = (data) =>{
  //   console.log('socket open', data)
  // }

  checkCall = (data) => {
    this.setState({ callIsGoing: true })
    if (this.state.showNotification) {
      const notification = this.refs.notificationSystem;
      if (notification) {
        this.setState({ stopNotification: true })
        firebaseC5Benito.app('c5benito').firestore().collection('calls').add({ ...data, status: 1, dateTime: new Date() }).then(doc => {
          notification.addNotification({
            title: 'Llama entrante de ' + data.user_nicename,
            message: 'Se registro una llamada entrante',
            level: 'error',
            action: {
              label: 'Ver detalles',
              callback: () => {
                this.setState({ modalCall: true, callInfo: { ...data, id: doc.id } })
                window.location.href = window.location.href.replace(window.location.pathname, '/chat#message')
              }
            }
          });

        })
      }
    }
  }

  showAlarmNot = (title, message, type, label, action, id) => {
    const chatId = id
    const notification = this.refs.notificationSystem;
    if (notification && !this.state.callIsGoing) {
      notification.addNotification({
        title: title,
        message: message,
        level: type,
        action: {
          label: label,
          callback: () =>
            action === 0 ? window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/alarm/0/${chatId}`) : // Fuego
              action === 1 ? window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/alarm/1/${chatId}`) : // Policia
                action === 2 ? window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/alarm/2/${chatId}`) : // Medico
                  null
        }
      });
    }
  }

  showTrackingNot = (title, message, type, label, action, id) => {
    const chatId = id
    const notification = this.refs.notificationSystem;
    if (notification && !this.state.callIsGoing) {
      notification.addNotification({
        title: title,
        message: message,
        level: type,
        action: {
          label: label,
          callback: () =>
            action === 0 ? window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/seguimiento/0/${chatId}`) : // Hora
              action === 1 ? window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/seguimiento/1/${chatId}`) : // Destino
                null
        }
      });
    }
  };

  showSOSNot = (title, message, type, label, action, id) => {
    // const chatId = id
    const notification = this.refs.notificationSystem;
    if (notification && !this.state.callIsGoing) {
      notification.addNotification({
        title: title,
        message: message,
        level: type,
        action: {
          label: label,
          callback: () => this.handleSOSRedirect(action, id)
          // action === 0 ? window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/sos/0/${chatId}`) : // Seguridad
          //     action === 1 ? window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/sos/1/${chatId}`) : // Protección civil
          //         action === 2 ? window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/sos/2/${chatId}`) : // Emergencia médica
          //             null
        }
      });
    }
  }

  handleSOSRedirect = (action, chatId) => {
    return window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/sos/${action}/${chatId}`)
  }

  showComplaintNot = (title, message, type, label, id) => {
    const notification = this.refs.notificationSystem;
    if (notification && !this.state.callIsGoing) {
      notification.addNotification({
        title: title,
        message: message,
        level: type,
        action: {
          label: label,
          callback: () => this.handleComplaintsRedirect(id)
        }
      });
    }
  }

  handleComplaintsRedirect = (complaintId) => {
    return window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/servicios/${complaintId}`)
  }

  showNot = (title, message, type, label, action, id) => {
    const notification = this.refs.notificationSystem;
    if (notification && !this.state.stopNotification && !this.state.callIsGoing) {
      notification.addNotification({
        title: title,
        message: message,
        level: type,
        action: {
          label: label,
          callback: () =>
            action === 0 ? window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/chat/0/${id}`) :
              action === 2 ? window.open(window.location.href.replace(window.location.pathname, '/').replace(window.location.search, '').replace(window.location.hash, '') + 'detalles/denuncia/' + id, '_blank', 'toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=650,height=500') :
                action === 3 ? window.location.href = window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, `/sos`) :
                  action === 4 ? window.open(window.location.href.replace(window.location.pathname, '/').replace(window.location.search, '').replace(window.location.hash, '') + 'detalles/soporte/' + id, '_blank', 'toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=650,height=500') :
                    action === 5 ? window.open(window.location.href.replace(window.location.search, '').replace(window.location.hash, '').replace(window.location.pathname, '/') + 'detalles/emergency/' + id, '_blank', 'toolbar=0,location=0,directories=0,status=1,menubar=0,titlebar=0,scrollbars=1,resizable=1,width=650,height=500') :
                      this.seeMatch(action)
        }
      });
    }
    if (this.state.stopNotification) {
      this.setState({ stopNotification: false })
    }
  }

  seeMatch = (id) => {
    this._cameraSideInfo(id)
  }

  _reloadCams = () => {
    this.setState({ loadingRestart: true })
    conections.getAllCams().then(response => {
      const data = response.data;
      let dns = []
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element.active === 1 && element.flag_streaming === 1) {
          if (dns.indexOf('http://' + element.UrlStreamToCameras[0].Url.dns_ip) < 0) {
            dns.push('http://' + element.UrlStreamToCameras[0].Url.dns_ip)
          }
        }
      }

      let promises = []
      for (let index = 0; index < dns.length; index++) {
        const element = dns[index];
        promises.push(conections.restartStream(element))

      }
      Promise.all(promises).then(response => {
        const event = new Event('restartCamEvent')
        window.dispatchEvent(event)
        this.setState({ loadingRestart: false })
      }).catch(reason => {
        const event = new Event('restartCamEvent')
        window.dispatchEvent(event)
        this.setState({ loadingRestart: false })
        alert('Error reiniciando algunas camaras')
      })
    }).catch(error => {
      const event = new Event('restartCamEvent')
      window.dispatchEvent(event)
      this.setState({ loadingRestart: false })
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

  _checkAuth() {
    const isAuth = sessionStorage.getItem('isAuthenticated')
    if (isAuth) {
      const data = JSON.parse(isAuth)
      this.setState({ isAuthenticated: data.logged, userInfo: data.userInfo, showNotification: true })
      if (!window.location.pathname.includes('detalles') && !window.location.pathname.includes('analisis/')) {
        //setTimeout(this.showNot,10000)
        this.loadData()
      }
    } else {
      this.setState({ isAuthenticated: false })
      if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
        window.location.href = window.location.href.replace(window.location.pathname, '/login')
      }
    }
  }

  _makeAuth = (userInfo) => {
    sessionStorage.setItem('isAuthenticated', JSON.stringify({ logged: true, userInfo: userInfo }))
    this.setState({ userInfo: userInfo, showNotification: true })
    window.location.href = window.location.href.replace(window.location.pathname, '/')
    if (!window.location.pathname.includes('detalles') && !window.location.pathname.includes('analisis/')) {
      //setTimeout(this.showNot,10000)
    }
    this.loadData()
    setTimeout(this.setState({ isAuthenticated: true }), 500)
  }

  _toggleSideMenu = () => {
    this.setState({ sideMenu: !this.state.sideMenu })
  }

  _cameraSideInfo = (cameraInfo) => {
    this.setState({ cameraInfoSide: !this.state.cameraInfoSide, cameraID: cameraInfo })
  }

  _logOut = () => {
    this.setState({ isAuthenticated: false, userInfo: {} })
    sessionStorage.removeItem('isAuthenticated')
  }

  _toggleControls = (camera) => {
    if (camera) {
      this.setState({ cameraControl: true, cameraInfo: camera })
    } else {
      this.setState({ cameraControl: false, cameraInfo: null })
    }

  }

  canAccess = (module_id) => {
    let isValid = false
    const isAuth = JSON.parse(sessionStorage.getItem('isAuthenticated'))
    if (isAuth) {
      if (isAuth.userInfo.modules) {
        isAuth.userInfo.modules.map(value => {
          if (value.id === module_id) {
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
        {
          this.state.roberyNotification.display &&
          <RoberyNotification notificationRoute={this.notificationRoute} userId={this.state.roberyNotification.data} />
        }

        {this.state.reproducirSonido ?
          <Sound
            url={sonido}
            playStatus={Sound.status.PLAYING}
            onFinishedPlaying={() => this.setState({ reproducirSonido: false })}
            onError={(e) => console.log("ON SOUND ERROR: ", e)}

          />
          : null
        }
        {this.state.modalCall ? <ModalCall data={this.state.callInfo} modal={this.state.modalCall} hideModal={() => this.setState({ modalCall: false, callInfo: {} })} /> : null}
        <div className="fullcontainer">
          {this.state.isAuthenticated && this.state.showHeader ?
            <Header
              sideMenu={this.state.sideMenu}
              _toggleSideMenu={this._toggleSideMenu}
              loadingRestart={this.state.loadingRestart}
              toggleSideMenu={this._toggleSideMenu}
              logOut={this._logOut}
              isSidemenuShow={this.state.sideMenu}
              cameraSideInfo={this._cameraSideInfo}
              userInfo={this.state.userInfo}
              _reloadCams={this._reloadCams} />
            : null
          }
          {this.state.isAuthenticated && this.state.showHeader ?
            (<React.Fragment>
              <ArrowToggle ocultarMatches={this.ocultarMatches} />
              {this.state.showMatches ?
                <Matches
                  toggleSideMenu={this._cameraSideInfo}
                  cameraID={this.state.cameraID}
                  matchs={this.state.matches} /> : null}
            </React.Fragment>)
            : null
          }
          {this.state.isAuthenticated &&
            <SideBar toggleSideMenu={this._toggleSideMenu} active={this.state.sideMenu} chats={this.state.chats} />
          }
          {this.state.isAuthenticated && this.state.cameraInfoSide ?
            <Notifications
              toggleSideMenu={this._cameraSideInfo}
              cameraID={this.state.cameraID}
              help={this.state.sos}
              support={this.state.support}
              complaiments={this.state.complaiments}
              calls={this.state.calls}
              alertaCovid={this.state.alertaCovidTmp}
              complaints={this.state.complaints}
            />
            : null
          }
          <Route path="/" exact render={(props) =>
            this.state.isAuthenticated ?
              <Redirect
                to={{
                  pathname: this.state.userInfo.modules ? this.state.userInfo.modules[0].id === 1 ? '/map' : this.state.userInfo.modules[0].id === 2 ? '/analisis' : '/welcome' : '/welcome',
                  state: { from: props.location }
                }} /> :
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: props.location }
                }} />
          }
          />
          <Route
            path="/sos/:tabIndex?/:chatId?"
            exact
            render={(props) => (
              <SosView
                // ms={this.stateSos}
                chats={this.state.stateSos}
                {...props}
                stopNotification={() =>
                  this.setState({ stopNotification: true })
                }
              />
            )}
          ></Route>
          <Route path="/map" exact render={(props) => <Map showMatches={this.state.showMatches} canAccess={this.canAccess}  {...props} chats={this.state.chats} />} />
          <Route path="/welcome" exact render={(props) => <Welcome {...props} />} />
          <Route path="/login" exact render={(props) => <Login {...props} makeAuth={this._makeAuth} isAuthenticated={this.state.isAuthenticated} />} />
          <Route path="/analisis" exact render={(props) => <Analysis showMatches={this.state.showMatches} matches={this.state.matches} chats={this.state.chats} canAccess={this.canAccess} {...props} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route path="/analisis/:id" exact render={(props) => <Analysis canAccess={this.canAccess} {...props} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route path="/detalles/covid/:id" exact render={(props) => <CovidItemDetail  {...props} alertaCovidd={this.state.alertaCovidd} alertaCovid={this.state.alertaCovid} userInfo={this.state.userInfo} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route path="/detalles/emergency/:id" exact render={(props) => <DetailsEmergency  {...props} userInfo={this.state.userInfo} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route path="/detalles/denuncia/:id" exact render={(props) => <DetailsComplaiment  {...props} userInfo={this.state.userInfo} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route path="/detalles/soporte/:id" exact render={(props) => <DetailsSupport  {...props} userInfo={this.state.userInfo} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route path="/detalles/:id" exact render={(props) => <Details  {...props} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route path="/mobile_help/:id" exact render={(props) => <MobileHelp  {...props} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route
            path="/chat/:alarmIndex?/:chatId?"
            exact
            render={(props) => (
              <Chat
                chats={this.state.chats.filter(item => (typeof item.alarmType !== 'string'))}
                {...props}
                userInfo={this.state.userInfo}
                chatFirebase={this.state.chatFirebase}
                stopNotification={() =>
                  this.setState({ stopNotification: true })
                }
              />
            )}
          />
          <Route path="/tickets" exact render={(props) => <Tickets canAccess={this.canAccess}  {...props} userInfo={this.state.userInfo} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route path="/dashboard" exact render={(props) => <Dashboard showMatches={this.state.showMatches} canAccess={this.canAccess}  {...props} userInfo={this.state.userInfo} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route path="/cuadrantes" exact render={(props) => <Cuadrantes showMatches={this.state.showMatches} matches={this.state.matches} chats={this.state.chats} canAccess={this.canAccess} {...props} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route path="/cuadrantes/:id" exact render={(props) => <Cuadrantes matches={this.state.matches} chats={this.state.chats} canAccess={this.canAccess} {...props} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route path='/personas' exact render={(props) => <Sospechosos showMatches={this.state.showMatches} chats={this.state.chats} canAccess={this.canAccess} {...props} toggleSideMenu={this._cameraSideInfo} toggleControls={this - this._toggleControls} />} />
          <Route path='/policia' exact render={(props) => <Policia showMatches={this.state.showMatches} chats={this.state.chats} canAccess={this.canAccess} {...props} toggleSideMenu={this._cameraSideInfo} toggleControls={this - this._toggleControls} />} />
          <Route path="/covid" exact render={(props) => <Covid alertaCovidState={this.state.alertaCovidState} _alertaCovidState={this._alertaCovidState} _newCovidItem={this._newCovidItem} newCovidState={this.state.newCovidState} newCovidItem={this.state.newCovidItem} alertaCovid={this.state.alertaCovid} showMatches={this.state.showMatches} matches={this.state.matches} chats={this.state.chats} canAccess={this.canAccess} {...props} toggleSideMenu={this._cameraSideInfo} toggleControls={this._toggleControls} />} />
          <Route
            path="/alarm/:alarmIndex?/:chatId?"
            exact
            render={(props) => (
              <AlarmChat
                chats={this.state.chats.filter(item => (typeof item.alarmType === 'string'))}
                {...props}
                userInfo={this.state.userInfo}
                chatFirebase={this.state.chatFirebase}
                stopNotification={() =>
                  this.setState({ stopNotification: true })
                }
              />
            )}
          />
          <Route
            path="/servicios/:complaintId?"
            exact
            render={(props) => (
              <Complaint
                {...props}
                complaints={this.state.complaints}
                userInfo={this.state.userInfo}
              />
            )}
          />
          <Route
            path="/seguimiento/:tabIndex?/:chatId?"
            exact
            render={(props) => (
              <ChatTracking
                {...props}
                chats={this.state.stateSos}
                stopNotification={() => this.setState({ stopNotification: true })}
              />
            )}
          />
        </div>
        {this.state.cameraControl ? <CameraControls camera={this.state.cameraInfo} toggleControls={this._toggleControls} active={this.state.cameraControl} /> : null}
        <NotificationSystem ref='notificationSystem' />
        <div className="fullcontainerLayer"></div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  limits: state.limits
});

const mapDispatchToProps = dispatch => ({
});



export default connect(mapStateToProps, mapDispatchToProps)(Main);