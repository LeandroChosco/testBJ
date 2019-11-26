const base_url = window.location.hostname === 'localhost' ?
    'http://localhost' :
    window.location.hostname === 'adminc5cuau-dev.s3-website.us-east-2.amazonaws.com/' ? 
    'http://prod.apicams.cuahutemoc.energetikadevelepment.com': //'http://dev.apicams.cuahutemoc.dev.energetikadevelepment.com' :
    'http://prod.apicams.cuahutemoc.energetikadevelepment.com';
const webSocketPort = '20'
const apiPort = '3000'
 export default {
     base_url,
     apiPort,
     webSocketPort
 }
