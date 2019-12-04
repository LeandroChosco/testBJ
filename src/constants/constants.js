const base_url = window.location.hostname === 'localhost' ?
    'http://localhost' :
    window.location.hostname === 'cams.cuajimalpa.dev.energetikadevelepment.com' ? 
    'http://dev.apicams.cuajimalpa.dev.energetikadevelepment.com' :
    'http://prod.apicams.cuajimalpa.energetikadevelepment.com';
const webSocketPort = '20'
const apiPort = '3000'
 export default {
     base_url,
     apiPort,
     webSocketPort
 }
