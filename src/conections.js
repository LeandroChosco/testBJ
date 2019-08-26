import Axios from 'axios'
import constants from './constants/constants';

export default {

    makeLogin:(data)=>{
        return Axios.post(constants.base_url+':'+constants.apiPort+'/admin/login',data)
    },
    restartStream:(dns = constants.apiStream)=>{
        return Axios.put(dns+':'+constants.apiPort+'/control-cams/restart-streaming2/all')
    },
    sendTicket:(data)=> {
        return Axios.post(constants.base_url + ':' + constants.apiPort + '/tickets',data)
    },
    snapShot:(camara_id)=>{
        const user_id = getUserID() 
        return Axios.post(constants.base_url + ':' + constants.apiPort + '/control-cams/screenshot/' + camara_id+'?user_id='+user_id)
    },
    stopRecord: (data, camera_id)=> {
        const user_id = getUserID() 
        return Axios.put(constants.base_url + ':' + constants.apiPort + '/control-cams/stop-record/' + camera_id+'?user_id='+user_id,data)
    },
    startRecord:(data,camera_id)=>{
        const user_id = getUserID() 
        return Axios.post(constants.base_url + ':' + constants.apiPort + '/control-cams/start-record/' + camera_id+'?user_id='+user_id,data)        
    },
    getCamData:(camera_id)=>{
        const user_id = getUserID() 
        return Axios.get(constants.base_url + ':' + constants.apiPort + '/cams/' + camera_id + '/data?user_id='+user_id)
    },
    getAllCams:()=>{
        const user_id = getUserID() 
        return Axios.get(constants.base_url+':'+constants.apiPort+'/register-cams/all-cams?user_id='+user_id)
    },
    getCamDataHistory:(camera_id)=>{
        const user_id = getUserID() 
        return Axios.get(constants.base_url+':'+constants.apiPort+'/cams/'+camera_id+'/video_history?user_id='+user_id)
    },
    getTickets:()=>{
        return Axios.get(constants.base_url+':'+constants.apiPort+'/tickets')
    },
    getTicket:(id)=>{
        return Axios.get(constants.base_url+':'+constants.apiPort+'/tickets/'+id)
    },
    toProcess:(data)=>{
        data.user_id = getUserID()
        return Axios.put(constants.base_url+':'+constants.apiPort+'/tickets/toProcess',data)
    },
    toClose:(data)=>{
        data.user_id = getUserID()
        return Axios.put(constants.base_url+':'+constants.apiPort+'/tickets/toClose',data)
    },
    dashboardCams:()=>{        
        return Axios.get(constants.base_url+':1337/dashboard/cams')
    },
    dashboardTickets:()=>{        
        return Axios.get(constants.base_url+':1337/dashboard/tickets')
    }

    
}


function getUserID() {
    const isAuth = sessionStorage.getItem('isAuthenticated')    
    if (isAuth) {
      const data = JSON.parse(isAuth)

      return data.user_id ? data.user_id: data.userInfo.user_id 
    }
    return 0
}