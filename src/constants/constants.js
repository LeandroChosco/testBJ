import favicon from '../assets/images/icons/favicon.jpg'
// Produccion
const sails_url = "https://customer-bj-api.radarapptechnologies.com";
const radar_backend = "https://api.radarapptechnologies.com/graphql";
const express_url = "http://3.15.181.186";

//ligas de dashboard embebed
const dashboard="http://95.216.37.253:6868/dashboard/iframes?user_id=1";
const detialDashboard="http://95.216.37.253:6868/dashboard/iframes/"

//Dev
//sails_url genera token de autenticacion 
// const sails_url = "https://customer-bj-api-dev.radarapptechnologies.com";
// const radar_backend = "https://api.radarapptechnologies.com/graphql";

const webSocketPort = '20';
const apiPort = "3000";
const sailsPort = "1337";
const ptzPort = "3001";
const client = 'Benito Juárez';
const clientFirebase="Benito Juárez";
const urlSoftGuard = "http://softguard.radarapptechnologies.com:8080/";
const urlPath = favicon;
const socket_url = "https://service-io-general-socket.radarapptechnologies.com/";
const api_axxon = "https://customer-alvaro-obregon-axxon-api.radarapptechnologies.com/axxon/camera/hls/serial-number";
const server_axxon = "https://apiaxxonhistory.radarapptechnologies.com";


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
  urlSoftGuard,
  socket_url,
  api_axxon,
  server_axxon
};
