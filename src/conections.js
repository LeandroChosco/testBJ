import Axios from 'axios';
import constants from './constants/constants';

export default {
  getOnTermicPhotoData: (name) => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/termicfiles-one/' + name);
  },
  getDesconocidos: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getUnknow/?limit=50');
  },
  getDetecciones: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getMatches/');
  },
  createPersons: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/create/persons/', data);
  },
  getPersons: (type) => {
    if (type) return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getPersons/?type=' + type);
    else return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getPersons/');
  },
  makeLogin: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/login', data);
  },
  restartStream: (dns = constants.apiStream) => {
    return Axios.put(dns + ':' + constants.apiPort + '/control-cams/restart-streaming3/all');
  },
  restartOneStream: (dns = constants.apiStream, id) => {
    return Axios.put(dns + ':' + constants.apiPort + '/control-cams/restart-streaming3/' + id);
  },
  sendTicket: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/tickets/create/', data);
  },
  /*
  snapShot: (camara_id) => {
    const user_id = getUserID();
    return Axios.post(constants.sails_url + ':' + constants.apiPort + '/control-cams/screenshot/' + camara_id + '/?user_id=' + user_id);
  },
  stopRecord: (data, camera_id) => {
    const user_id = getUserID();
    return Axios.put(constants.sails_url + ':' + constants.apiPort + '/control-cams/stop-record/' + camera_id + '/?user_id=' + user_id, data);
  },
  startRecord: (data, camera_id) => {
    const user_id = getUserID();
    return Axios.post(constants.sails_url + ':' + constants.apiPort + '/control-cams/start-record/' + camera_id + '/?user_id=' + user_id, data);
  },
  getCamData: (camera_id) => {
    const user_id = getUserID();
    return Axios.get(constants.sails_url + ':' + constants.apiPort + '/control-cams/' + camera_id + '/data/?user_id=' + user_id);
  },
  */
  // Nuevos endpoint para menejor de media
  snapShotV2: (camara_id) => {
    const user_id = getUserID();
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/control-cams/screenshotV2/' + camara_id + '/?user_id=' + user_id);
  },
  stopRecordV2: (data, camera_id) => {
    const user_id = getUserID();
    return Axios.put(constants.sails_url + ':' + constants.sailsPort + '/control-cams/stop-recordV2/' + camera_id + '/?user_id=' + user_id, data);
  },
  startRecordV2: (data, camera_id) => {
    const user_id = getUserID();
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/control-cams/start-recordV2/' + camera_id + '/?user_id=' + user_id, data);
  },
  deleteMedia: (camera_id, media_id) => {
    return Axios.delete(constants.sails_url + ':' + constants.sailsPort + '/cams/' + camera_id + '/' + media_id + '/1/V2');
  },
  // Nuevos endpoints con salis
  getCamDataV2: (camera_id) => {
    const user_id = getUserID();
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/control-cams/' + camera_id + '/data?user_id=' + user_id);
  },
  getAllCams: () => {
    const user_id = getUserID();
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/control-cams/all-cams/?user_id=' + user_id);
  },
  getCamsOffline: () => {
    const user_id = getUserID();
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/control-cams/cams-offline/?user_id=' + user_id);
  },
  getCamDataHistory: (camera_id, num_cam) => {
    const user_id = getUserID();
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/control-cams/' + camera_id + '/' + num_cam + '/video-history/?user_id=' + user_id);
  },
  getTickets: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/tickets');
  },
  getTicket: (id) => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/tickets/?ticket_id=' + id);
  },
  // Endpoint para ticket en pingüino
  toProcess: (data) => {
    data.user_id = getUserID();
    return Axios.put(constants.sails_url + ':' + constants.sailsPort + '/tickets/toprocess/', data);
  },
  toClose: (data) => {
    data.user_id = getUserID();
    return Axios.put(constants.sails_url + ':' + constants.sailsPort + '/tickets/toclose/', data);
  },
  dashboardCams: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/dashboard/cams');
  },
  dashboardTickets: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/dashboard/tickets');
  },
  dashboardTotalRecognition: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/dashboard/detected');
  },
  dashboardRecognitionAges: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/dashboard/ageranges');
  },
  dashboardRecognitionPerDay: (filter = '') => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/dashboard/peoplefordays' + filter);
  },
  dashboardRecognitionMood: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/dashboard/mood');
  },
  dashboardCameraPerPerson: () => {
    return Axios.get(`${constants.sails_url}:${constants.sailsPort}/dashboard/numberofpeoplepercamera`);
  },
  dashboardPersons: () => {
    return Axios.get(`${constants.sails_url}:${constants.sailsPort}/dashboard/person`)
  },
  loadCams: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/cams?sort=num_cam asc&active=1&limit=1000&populate=false');
  },
  changeCamStatus: (id) => {
    return Axios.put(constants.sails_url + ':' + constants.sailsPort + '/control-cams/change-status/' + id);
  },
  loadCamsCuadrantes: (id_cuadrante) => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/control-cams/cuadrantecams/?id_cuadrante=' + id_cuadrante);
  },
  getCuadrantes: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/control-cams/cuadrantes/');
  },
  newCuadrante: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/control-cams/newcuadrante/', data);
  },
  addCamsCuadrante: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/control-cams/cuadrantecam', data);
  },
  getCamsCuadrante: (id_cuadrante) => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/control-cams/cuadrantescams/?id_cuadrante=' + id_cuadrante);
  },
  deleteCuadrante: (id_cuadrante) => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/control-cams/cuadrante/?id_cuadrante=' + id_cuadrante);
  },
  getMatches: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/matchApi');
  },
  getCamMatches: (num_cam) => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/matchApi?num_cam=' + num_cam);
  },
  getCamMatchesDetail: (matchId) => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/matchApi/' + matchId);
  },
  getCambyNumCam: (num_cam) => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/cams?num_cam=' + num_cam);
  },
  getMoreInformationByCam: (num_cam) => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/control-cams/single-cam/?cam_id=' + num_cam);
  },
  getLimitsCam: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/limits-zone/');
  },
  getMatchAPI: (data) => {
    if (data !== undefined) {
      return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getmatch/?id_match=' + data);
    } else {
      return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getmatch/');
    }
  },
  getCollectionvsblty: (data) => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/face/vsblty/?id_person=' + data);
  },
  getHelp: (data) => {
    if (data !== undefined) {
      return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/gethelp/?id_help=' + data);
    } else {
      return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/gethelp/');
    }
  },
  getSupport: (data) => {
    if (data !== undefined) {
      return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getsupport/?id_support=' + data);
    } else {
      return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getsupport/');
    }
  },
  checkSupport: (data) => {
    if (data !== undefined) {
      return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getsupport/?id_support=' + data);
    }
  },
  postStatusSupportUndefined: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/status/support/', data);
  },
  postSupportToProcess: (data) => {
    data.user_id = getUserID();
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/postsupport/toprocess/', data);
  },
  postSupportClose: (data) => {
    data.user_id = getUserID();
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/postsupport/close/', data);
  },
  postMatchUpdate: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/update/match/', data);
  },
  postHelpStatus: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/givehelp', data);
  },
  getComplaints: (data) => {
    if (data !== undefined) {
      return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getcomplaints/?id_complaint=' + data);
    } else {
      return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getcomplaints');
    }
  },
  getCalls: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getcalls/');
  },
  getMessages: () => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getmessages/');
  },
  getUsers: (data) => {
    if (data !== undefined) {
      return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getuserss/?user_creation=' + data);
    } else {
      return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/getuserss/');
    }
  },
  getChatMessages: (user_creation) => {
    return Axios.get(constants.sails_url + ':' + constants.sailsPort + '/admin/users/?user_creation=' + user_creation);
  },
  sendMessageChat: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/update/message/', data);
  },
  postChangeChat: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.sailsPort + '/update/change/', data);
  },
  // Opciones PTZ
  newOnvifDevice: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.ptzPort + '/onvif/new/device', data);
  },
  getProfilePTZ: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.ptzPort + '/onvif/get/profile', data);
  },
  continuousMovePTZ: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.ptzPort + '/onvif/continuous/move/ptz', data);
  },
  stopPTZ: (data) => {
    return Axios.post(constants.sails_url + ':' + constants.ptzPort + '/onvif/stop/ptz', data);
  },
  cancelRadarAlert: (params) => {
    return Axios.post(constants.radar_backend, {
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
    });
  },
  sendNotificationByProfile: (params) => {
    return Axios.post(constants.radar_backend, {
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
    });
  },
  getAllPoliceIncidentType: () => {
    return Axios.post(constants.radar_backend, {
      query:
        `query {
          getAllPoliceIncidentType {
            id
            name
            can_write
          }
        }`
    });
  },
  getAllPoliceSector: () => {
    return Axios.post(constants.radar_backend, {
      query:
        `query {
          getAllPoliceSector {
            id
            name
          }
        }`
    });
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
