const base_url = window.location.hostname === 'localhost' ?
    'http://localhost' :
    window.location.hostname === 'cams.cuauhtemoc.dev.energetikadevelepment.com' ? 
    'http://dev.apicams.cuahutemoc.dev.energetikadevelepment.com' :
    'http://prod.apicams.cuahutemoc.energetikadevelepment.com';
const webSocketPort = '20'
const apiPort = '3000'
 export default {
     base_url,
     apiPort,
     webSocketPort
 }
