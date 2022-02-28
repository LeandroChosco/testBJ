import favicon from '../assets/images/icons/favicon.jpg'
// Produccion
const sails_url = "https://bjapi.radarapptechnologies.com"; 
const radar_backend = "http://radarbackendprod.radarapptechnologies.com/graphql";
const express_url = "http://3.15.181.186";

//ligas de dashboard embebed
const dashboard="http://95.216.37.253:6868/dashboard/iframes?user_id=1";
const detialDashboard="http://95.216.37.253:6868/dashboard/iframes/"

//Dev
// sails_url genera token de autenticacion 
// const sails_url = "http://apibjdev.energetikatechnology.com/";
// const radar_backend = "https://radarbackendtest.energetikadevelepment.com/graphql";
const webSocketPort = '20';
const apiPort = "3000";
const sailsPort = "1337";
const ptzPort = "3001";
const client = 'Benito Juárez';
const clientFirebase="Benito Juárez";
const urlSoftGuard = "http://softguard.radarapptechnologies.com:8080/";
const urlPath = favicon


export default {
  express_url,
  sails_url,
  dashboard,
  detialDashboard,
  apiPort,
  clientFirebase,
  webSocketPort,
  sailsPort,
  ptzPort,
  radar_backend,
  client,
  urlPath,
  urlSoftGuard
};
