const base_url = window.location.hostname === 'localhost' ?
    'http://localhost' :
    window.location.hostname === 'adminc5cuajimalpa-new.s3-website-us-east-1.amazonaws.com' ? 
    'http://dev.apicams.cuajimalpa.dev.energetikadevelepment.com' :
    'http://dev.apicams.cuajimalpa.dev.energetikadevelepment.com';
const webSocketPort = '20'
const apiPort = '3000'
 export default {
     base_url,
     apiPort,
     webSocketPort
 }
