const base_url = window.location.hostname === 'localhost' ?
    'http://localhost' :
    window.location.hostname === 'cams.bj.dev.energetikadevelepment.com' ? 
    'http://dev.apicams.bj.energetikadevelepment.com/' :
    'http://prod.apicams.bj.energetikadevelepment.com';
const webSocketPort = '20'
const apiPort = '3000'
 export default {
     base_url,
     apiPort,
     webSocketPort
 }
