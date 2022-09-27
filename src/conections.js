import Axios from 'axios';
import constants from './constants/constants';
import {SAILS_ACCESS_TOKEN,ACCESS_TOKEN} from './constants/token'
import {remove} from './helpers/remove'
let SailsToken = localStorage.getItem(SAILS_ACCESS_TOKEN);
let token = localStorage.getItem(ACCESS_TOKEN)

const connectedRadar = Axios.create({
  headers:{'Authorization':token}
})

const connectedSails =Axios.create({
  headers: {'Authorization': SailsToken}
})


const logOut = (config,TOKEN)=>{
  SailsToken = localStorage.getItem(TOKEN);  
   if(!SailsToken || SailsToken==null){
    remove();
   }else{
     config.headers.Authorization=SailsToken;
   }
}

const controlError =(err)=>{
  if(err.message==="Request failed with status code 500"){
    remove();
  }
}

connectedSails.interceptors.request.use(config =>{
  logOut(config,SAILS_ACCESS_TOKEN)
  return config;
},(err)=>{
  return Promise.reject(err);
})
connectedSails.interceptors.response.use(response=>{
  return response;
}, (err)=>{
   controlError(err)
  return Promise.reject(err);
})

connectedRadar.interceptors.request.use(config=>{
  logOut(config,ACCESS_TOKEN)
 return config;
},(err)=>{
  return Promise.reject(err);
})

connectedRadar.interceptors.response.use(response=>{
  return response;
}, (err)=>{
 controlError(err)
  return Promise.reject(err);
})



export default {

  // Dashboard LPR
  
  getLPRGroupType:()=>{
    return connectedSails.get(`${constants.sails_url}/lpr/byGroup`)
  },
  getLPRTotalDay:()=>{
    return connectedSails.get(`${constants.sails_url}/lpr/perDay`)
  },
  getLPRTotalWeek:()=>{
    return connectedSails.get(`${constants.sails_url}/lpr/perWeek`)
  },
  getLPRTotalMonth:()=>{
    return connectedSails.get(`${constants.sails_url}/lpr/perMonth`)
  },
  getLPRTableList:()=>{
    return connectedSails.get(`${constants.sails_url}/lpr/list`)
  },
  getLPRTotalAlerts:()=>{
    return connectedSails.get(`${constants.sails_url}/lpr/total`)
  },
  getLPRAlertHour:()=>{
    return connectedSails.get(`${constants.sails_url}/lpr/perHour`)
  },
  getLPRAlertWeek:()=>{
    return connectedSails.get(`${constants.sails_url}/lpr/perWeekHour`)
  },
  getOnTermicPhotoData: (name) => {
    return connectedSails.get(constants.sails_url + '/termicfiles-one/' + name);
  },
  getDesconocidos: () => {
    return connectedSails.get(constants.sails_url + '/getUnknow/?limit=50');
  },
  getDetecciones: () => {
    return connectedSails.get(constants.sails_url + '/getMatches/');
  },
  createPersons: (data) => {
    return connectedSails.post(constants.sails_url + '/create/persons/', data);
  },
  getPersons: (type) => {
    if (type) return connectedSails.get(constants.sails_url + '/getPersons/?type=' + type);
    else return connectedSails.get(constants.sails_url + '/getPersons/');
  },
  makeLogin: (data) => {
    return Axios.post(constants.sails_url + '/login', data);
  },
  restartStream: (dns = constants.apiStream) => {
    return connectedSails.put(dns + ':' + constants.apiPort + '/control-cams/restart-streaming3/all');
  },
  restartOneStream: (dns = constants.apiStream, id) => {
    return connectedSails.put(dns + ':' + constants.apiPort + '/control-cams/restart-streaming3/' + id);
  },
  sendTicket: (data) => {
    return connectedSails.post(constants.sails_url + '/tickets/create/', data);
  },
  /*
  snapShot: (camara_id) => {
    const user_id = getUserID();
    return connectedSails.post(constants.sails_url + ':' + constants.apiPort + '/control-cams/screenshot/' + camara_id + '/?user_id=' + user_id);
  },
  stopRecord: (data, camera_id) => {
    const user_id = getUserID();
    return connectedSails.put(constants.sails_url + ':' + constants.apiPort + '/control-cams/stop-record/' + camera_id + '/?user_id=' + user_id, data);
  },
  startRecord: (data, camera_id) => {
    const user_id = getUserID();
    return connectedSails.post(constants.sails_url + ':' + constants.apiPort + '/control-cams/start-record/' + camera_id + '/?user_id=' + user_id, data);
  },
  getCamData: (camera_id) => {
    const user_id = getUserID();
    return connectedSails.get(constants.sails_url + ':' + constants.apiPort + '/control-cams/' + camera_id + '/data/?user_id=' + user_id);
  },
  */
  // Nuevos endpoint para menejor de media
  snapShotV2: (camara_id) => {
    const user_id = getUserID();
    return connectedSails.post(constants.sails_url + '/control-cams/screenshotV2/' + camara_id + '/?user_id=' + user_id);
  },
  getCamerasInternal: () => {
    return connectedSails.get(constants.sails_url + '/control-cams/internal-cameras')
  },
  stopRecordV2: (data, camera_id) => {
    const user_id = getUserID();
    return connectedSails.put(constants.sails_url + '/control-cams/stop-recordV2/' + camera_id + '/?user_id=' + user_id, data);
  },
  startRecordV2: (data, camera_id) => {
    const user_id = getUserID();
    return connectedSails.post(constants.sails_url + '/control-cams/start-recordV2/' + camera_id + '/?user_id=' + user_id, data);
  },
  deleteMedia: (camera_id, media_id) => {
    return connectedSails.delete(constants.sails_url + '/cams/' + camera_id + '/' + media_id + '/1/V2');
  },
  // Nuevos endpoints con salis
  getCamDataV2: (camera_id) => {
    const user_id = getUserID();
    return connectedSails.get(constants.sails_url + '/control-cams/' + camera_id + '/data?user_id=' + user_id);
  },
  getAllCams: () => {
    const user_id = getUserID();
    return connectedSails.get(constants.sails_url + '/control-cams/all-cams/?user_id=' + user_id);
  },
  getCamsOffline: () => {
    const user_id = getUserID();
    return connectedSails.get(constants.sails_url + '/control-cams/cams-offline/?user_id=' + user_id);
  },
  getTokenApiStreamsCams: (protocol, dnsMbox, dns_port, secretKeyBody) =>{
    if(dns_port === 80 || dns_port === 443){
      return Axios.post(protocol +'://'+ dnsMbox + '/users/login', secretKeyBody)
    }
    return Axios.post(protocol +'://'+ dnsMbox + ':'+ dns_port + '/users/login', secretKeyBody)

  },
  getCamDataHistoryApiCams: (protocol, dnsMbox, dns_port, protocolStorage, dnsStorage, tokenStorage, numCam, token, portApiStore) => {
    
    if((dns_port === 80 || dns_port === 443) && (portApiStore === 80 || portApiStore === 443)){
      return Axios.get(protocol + '://' + dnsMbox  + '/historics/' + numCam + '/' + "?protocol=" +protocolStorage +"&dns=" +dnsStorage +"&token=" +tokenStorage, {headers:{
      'Authorization': token
    }});
    }
    if((dns_port === 80 || dns_port === 443) && (portApiStore !== 80 || portApiStore !== 443)){
      return Axios.get(protocol + '://' + dnsMbox  + '/historics/' + numCam + '/' + "?protocol=" +protocolStorage +"&dns=" +dnsStorage +"&token=" +tokenStorage, {headers:{
      'Authorization': token
    }});
    }
    if ((dns_port !== 80 || dns_port !== 443) && (portApiStore === 80 || portApiStore === 443)){
      return Axios.get(protocol + '://' + dnsMbox + ':' + dns_port + '/historics/' + numCam + '/' + "?protocol=" +protocolStorage +"&dns=" +dnsStorage +"&token=" +tokenStorage, {headers:{
      'Authorization': token
    }});
    }
    return Axios.get(protocol + '://' + dnsMbox + ':' + dns_port + '/historics/' + numCam + '/' + "?protocol=" +protocolStorage +"&dns=" +dnsStorage +"&token=" +tokenStorage, {headers:{
      'Authorization': token
    }});
    
  }, 
  getCamDataHistoryWhithOutProtocol: (protocol, dnsMbox, dns_port, protocolStorage, dnsStorage, tokenStorage, numCam, token, portApiStore)=>{
    if((dns_port === 80 || dns_port === 443) && (portApiStore === 80 || portApiStore === 443)){
      return Axios.get(protocol + '://' + dnsMbox  + '/historics/' + numCam, {headers:{
      'Authorization': token
    }});
    }
    if((dns_port === 80 || dns_port === 443) && (portApiStore !== 80 || portApiStore !== 443)){
      return Axios.get(protocol + '://' + dnsMbox  + '/historics/' + numCam,  {headers:{
      'Authorization': token
    }});
    }
    if ((dns_port !== 80 || dns_port !== 443) && (portApiStore === 80 || portApiStore === 443)){
      return Axios.get(protocol + '://' + dnsMbox + ':' + dns_port + '/historics/' + numCam, {headers:{
      'Authorization': token
    }});
    }
    return Axios.get(protocol + '://' + dnsMbox + ':' + dns_port + '/historics/' + numCam, {headers:{
      'Authorization': token
    }});
  },
  getCamDataHistory: (camera_id, num_cam, typeMBOX) => {
    const user_id = getUserID();
    return connectedSails.get(constants.sails_url + '/control-cams/' + camera_id + '/' + num_cam + '/video-history/?user_id=' + user_id + '&type_mbox=' + typeMBOX);
  },
  getTickets: () => {
    return connectedSails.get(constants.sails_url + '/tickets');
  },
  getTicket: (id) => {
    return connectedSails.get(constants.sails_url + '/tickets/?ticket_id=' + id);
  },
  // Endpoint para ticket en pingüino
  toProcess: (data) => {
    data.user_id = getUserID();
    return connectedSails.put(constants.sails_url + '/tickets/toprocess/', data);
  },
  toClose: (data) => {
    data.user_id = getUserID();
    return connectedSails.put(constants.sails_url + '/tickets/toclose/', data);
  },
  dashboardCams: () => {
    return connectedSails.get(constants.sails_url + '/dashboard/cams');
  },
  dashboardTickets: () => {
    return connectedSails.get(constants.sails_url + '/dashboard/tickets');
  },
  dashboardTotalRecognition: () => {
    return connectedSails.get(constants.sails_url + '/dashboard/detected');
  },
  dashboardRecognitionAges: () => {
    return connectedSails.get(constants.sails_url + '/dashboard/ageranges');
  },
  dashboardRecognitionPerDay: (filter = '') => {
    return connectedSails.get(constants.sails_url + '/dashboard/peoplefordays' + filter);
  },
  dashboardRecognitionMood: () => {
    return connectedSails.get(constants.sails_url + '/dashboard/mood');
  },
  dashboardCameraPerPerson: () => {
    return connectedSails.get(`${constants.sails_url}/dashboard/numberofpeoplepercamera`);
  },
  dashboardPersons: () => {
    return connectedSails.get(`${constants.sails_url}/dashboard/person`)
  },
  loadCams: () => {
    return connectedSails.get(constants.sails_url + '/cams?sort=num_cam asc&active=1&limit=1000&populate=false');
  },
  filterCams: (data) => {
    return connectedSails.post(constants.sails_url + '/control-cams/filter/cams', data);
  },
  filterOffCams: (data) => {
    return connectedSails.post(constants.sails_url + '/control-cams/filter/offCams', data);
  },
  filterQuadrantsById: (data) => {
    return connectedSails.post(constants.sails_url + '/control-cams/filter/quadrantById', data);
  },
  changeCamStatus: (id) => {
    return connectedSails.put(constants.sails_url + '/control-cams/change-status/' + id);
  },
  loadCamsCuadrantes: (id_cuadrante) => {
    return connectedSails.get(constants.sails_url + '/control-cams/cuadrantecams/?id_cuadrante=' + id_cuadrante);
  },
  getCuadrantes: () => {
    return connectedSails.get(constants.sails_url + '/control-cams/cuadrantes/');
  },
  newCuadrante: (data) => {
    return connectedSails.post(constants.sails_url + '/control-cams/newcuadrante/', data);
  },
  addCamsCuadrante: (data) => {
    return connectedSails.post(constants.sails_url + '/control-cams/cuadrantecam', data);
  },
  getCamsCuadrante: (id_cuadrante) => {
    return connectedSails.get(constants.sails_url + '/control-cams/cuadrantescams/?id_cuadrante=' + id_cuadrante);
  },
  deleteCuadrante: (id_cuadrante) => {
    return connectedSails.get(constants.sails_url + '/control-cams/cuadrante/?id_cuadrante=' + id_cuadrante);
  },
  getMatches: () => {
    return connectedSails.get(constants.sails_url + '/matchApi');
  },
  getCamMatches: (num_cam) => {
    return connectedSails.get(constants.sails_url + '/matchApi?num_cam=' + num_cam);
  },
  getCamMatchesDetail: (matchId) => {
    return connectedSails.get(constants.sails_url + '/matchApi/' + matchId);
  },
  getCambyNumCam: (num_cam) => {
    return connectedSails.get(constants.sails_url + '/cams?num_cam=' + num_cam);
  },
  getMoreInformationByCam: (num_cam) => {
    return connectedSails.get(constants.sails_url + '/control-cams/single-cam/?cam_id=' + num_cam);
  },
  getLimitsCam: () => {
    return connectedSails.get(constants.sails_url + '/limits-zone/');
  },
  getMatchAPI: (data) => {
    if (data !== undefined) {
      return connectedSails.get(constants.sails_url + '/getmatch/?id_match=' + data);
    } else {
      return connectedSails.get(constants.sails_url + '/getmatch/');
    }
  },
  getCollectionvsblty: (data) => {
    return connectedSails.get(constants.sails_url + '/face/vsblty/?id_person=' + data);
  },
  getHelp: (data) => {
    if (data !== undefined) {
      return connectedSails.get(constants.sails_url + '/gethelp/?id_help=' + data);
    } else {
      return connectedSails.get(constants.sails_url + '/gethelp/');
    }
  },
  getSupport: (data) => {
    if (data !== undefined) {
      return connectedSails.get(constants.sails_url + '/getsupport/?id_support=' + data);
    } else {
      return connectedSails.get(constants.sails_url + '/getsupport/');
    }
  },
  checkSupport: (data) => {
    if (data !== undefined) {
      return connectedSails.get(constants.sails_url + '/getsupport/?id_support=' + data);
    }
  },
  postStatusSupportUndefined: (data) => {
    return connectedSails.post(constants.sails_url + '/status/support/', data);
  },
  postSupportToProcess: (data) => {
    data.user_id = getUserID();
    return connectedSails.post(constants.sails_url + '/postsupport/toprocess/', data);
  },
  postSupportClose: (data) => {
    data.user_id = getUserID();
    return connectedSails.post(constants.sails_url + '/postsupport/close/', data);
  },
  postMatchUpdate: (data) => {
    return connectedSails.post(constants.sails_url + '/update/match/', data);
  },
  postHelpStatus: (data) => {
    return connectedSails.post(constants.sails_url + '/givehelp', data);
  },
  getComplaints: (data) => {
    if (data !== undefined) {
      return connectedSails.get(constants.sails_url + '/getcomplaints/?id_complaint=' + data);
    } else {
      return connectedSails.get(constants.sails_url + '/getcomplaints');
    }
  },
  getCalls: () => {
    return connectedSails.get(constants.sails_url + '/getcalls/');
  },
  getMessages: () => {
    return connectedSails.get(constants.sails_url + '/getmessages/');
  },
  getUsers: (data) => {
    if (data !== undefined) {
      return connectedSails.get(constants.sails_url + '/getuserss/?user_creation=' + data);
    } else {
      return connectedSails.get(constants.sails_url + '/getuserss/');
    }
  },
  getChatMessages: (user_creation) => {
    return connectedSails.get(constants.sails_url + '/admin/users/?user_creation=' + user_creation);
  },
  sendMessageChat: (data) => {
    return connectedSails.post(constants.sails_url + '/update/message/', data);
  },
  postChangeChat: (data) => {
    return connectedSails.post(constants.sails_url + '/update/change/', data);
  },
   //DashBOard link
   getDashboardEmbebed :()=>{
    return connectedSails.get(constants.dashboard);
  },
  getDetailDashboard :(id)=>{
    return connectedSails.get(constants.detialDashboard+id+'?user_id=1')
  },
  // Opciones PTZ
  newOnvifDevice: (urlhistory, urlhistoryport, data, protocoPTZ) => {

    let getUrlHistory = "0.0.0.0"
    let getUrlHistoryPort = "00"

    if (urlhistory != null) {
      getUrlHistory = urlhistory.toString()
    }

    if (urlhistoryport != null) {
      getUrlHistoryPort = urlhistoryport.toString()
    }

    return Axios.post(protocoPTZ + "://" + getUrlHistory + ':' + getUrlHistoryPort + '/onvif/new/device', data);
  },
  getProfilePTZ: (urlhistory, urlhistoryport, data, protocoPTZ) => {

    let getUrlHistory = "0.0.0.0"
    let getUrlHistoryPort = "00"

    if (urlhistory != null) {
      getUrlHistory = urlhistory.toString()
    }

    if (urlhistoryport != null) {
      getUrlHistoryPort = urlhistoryport.toString()
    }

    return Axios.post(protocoPTZ + "://" + getUrlHistory + ':' + getUrlHistoryPort + '/onvif/get/profile', data);
  },
  continuousMovePTZ: (urlhistory, urlhistoryport, data) => {

    var getUrlHistory = "0.0.0.0"
    var getUrlHistoryPort = "00"

    if (urlhistory != null) {
      getUrlHistory = urlhistory.toString()
    }

    if (urlhistoryport != null) {
      getUrlHistoryPort = urlhistoryport.toString()
    }

    return Axios.post("http://" + getUrlHistory + ':' + getUrlHistoryPort + '/onvif/continuous/move/ptz', data);
  },
  stopPTZ: (urlhistory, urlhistoryport, data) => {

    var getUrlHistory = "0.0.0.0"
    var getUrlHistoryPort = "00"

    if (urlhistory != null) {
      getUrlHistory = urlhistory.toString()
    }

    if (urlhistoryport != null) {
      getUrlHistoryPort = urlhistoryport.toString()
    }

    return Axios.post("http://" + getUrlHistory + ':' + getUrlHistoryPort + '/onvif/stop/ptz', data);
  },
  // Presets PTZ
  setPreset: (urlhistory, urlhistoryport, data) => {

    let getUrlHistory = "0.0.0.0"
    let getUrlHistoryPort = "00"

    if (urlhistory != null) {
      getUrlHistory = urlhistory.toString()
    }

    if (urlhistoryport != null) {
      getUrlHistoryPort = urlhistoryport.toString()
    }

    return Axios.post("http://" + getUrlHistory + ':' + getUrlHistoryPort + '/onvif/set/preset', data);
  },
  getPresets: (urlhistory, urlhistoryport, data) => {

    let getUrlHistory = "0.0.0.0"
    let getUrlHistoryPort = "00"

    if (urlhistory != null) {
      getUrlHistory = urlhistory.toString()
    }

    if (urlhistoryport != null) {
      getUrlHistoryPort = urlhistoryport.toString()
    }

    return Axios.post("http://" + getUrlHistory + ':' + getUrlHistoryPort + '/onvif/get/presets', data);
  },
  goToPresets: (urlhistory, urlhistoryport, data) => {

    let getUrlHistory = "0.0.0.0"
    let getUrlHistoryPort = "00"

    if (urlhistory != null) {
      getUrlHistory = urlhistory.toString()
    }

    if (urlhistoryport != null) {
      getUrlHistoryPort = urlhistoryport.toString()
    }

    return Axios.post("http://" + getUrlHistory + ':' + getUrlHistoryPort + '/onvif/go/to/presets', data);
  },
  removePreset: (urlhistory, urlhistoryport, data) => {

    let getUrlHistory = "0.0.0.0"
    let getUrlHistoryPort = "00"

    if (urlhistory != null) {
      getUrlHistory = urlhistory.toString()
    }

    if (urlhistoryport != null) {
      getUrlHistoryPort = urlhistoryport.toString()
    }

    return Axios.post("http://" + getUrlHistory + ':' + getUrlHistoryPort + '/onvif/remove/preset', data);
  },
  makeLoginRadar:(params)=>{
    return Axios.post(constants.radar_backend,{
      query:
      `query UserSignIn(
        $email:String!, 
        $password:String!
      ){
        userSignIn(
          email:$email
          password:$password
          is_web:true
        ){
         token
        }
      }      
      `,
      variables: {
        email: params.email,
        password: params.password,

      }
    })
  },

  getClients: () => {
    return Axios.post(constants.radar_backend, {
      query: `
       query {
        getClients{
          id
          name
          admin_email
          clave_municipal,
          photo_path
        }
      }`
    }
    );
  },
  cancelRadarAlert: (params) => {
    return connectedRadar.post(constants.radar_backend, {
      query:
        `mutation ($alertId: Int!, $latitude: String!, $longitude: String!, $profileId: Int!, $tracking_module: Boolean) {
            alertUpdate(
              alertId: $alertId, 
              latitude: $latitude, 
              longitude: $longitude, 
              profileId: $profileId, 
              tracking_module: $tracking_module
              ){
              id
              profile{
                id
              }
              status
            }
          }`,
      variables: params
    }
);
  },
  sendNotificationByProfile: (params) => {
    return connectedRadar.post(constants.radar_backend, {
      query:
        `mutation sendNotificationByProfile($profileId: Int!, $title: String!, $message: String!, $type: String!, $info: String!) {
          sendNotificationByProfile(
            profileId: $profileId
            title: $title
            message: $message
            type: $type
            info: $info
          ) {
            id
          }
        }`,
      variables: params
    }
);
  },
  getAllPoliceIncidentType: () => {
    return connectedRadar.post(constants.radar_backend, {
      query:
        `query {
          getAllPoliceIncidentType {
            id
            name
            can_write
          }
        }`
    }
);
  },
  getAllPoliceSector: () => {
    return connectedRadar.post(constants.radar_backend, {
      query:
        `query {
          getAllPoliceSector {
            id
            name
          }
        }`
    }
);
  }
};


function getUserID() {
  const isAuth = sessionStorage.getItem('isAuthenticated');
  if (isAuth) {
    const data = JSON.parse(isAuth);
    return data.user_id ? data.user_id : data.userInfo.user_id;
  }
  return 0;
}
