const base_url = window.location.hostname === 'localhost' ?
    'http://localhost' :
    window.location.hostname === 'adminc5mh-dev.s3-website-us-east-1.amazonaws.com' ? 
    'http://dev.apicams.mh.dev.energetikadevelepment.com':
    'http://prod.apicams.mh.energetikadevelepment.com' ;
const webSocketPort = '20'
const apiPort = '3000'
 export default {
     base_url,
     apiPort,
     webSocketPort
 }
