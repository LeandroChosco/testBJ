import favicon from '../assets/images/icons/favicon.jpg'
// Produccion
// const sails_url = 'http://prod.adminc5.bj.sails.energetikadevelepment.com';
// const sails_url = "http://3.21.75.143";
const sails_url = "https://bjapi.radarapptechnologies.com"; //actual
const radar_backend = "http://radarbackendprod.radarapptechnologies.com/graphql";
const express_url = "http://3.15.181.186";

//ligas de dashboard embebed
const dashboard="http://95.216.37.253:6868/dashboard/iframes?user_id=1";
const detialDashboard="http://95.216.37.253:6868/dashboard/iframes/"

//Dev
// const sails_url = "http://adminc5dockerbj.us-east-1.elasticbeanstalk.com";
// const sails_url = "http://localhost";
// const radar_backend = "https://radarbackendtest.energetikadevelepment.com/graphql";
const webSocketPort = '20';
const apiPort = "3000";
const sailsPort = "1337";
const ptzPort = "3001";
const client = 'Benito Juárez';
const clientFirebase="Benito Juárez";
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
  urlPath
};
