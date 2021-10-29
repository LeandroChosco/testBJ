import favicon from '../assets/images/icons/favicon.jpg'
// Produccion
// const sails_url = 'http://prod.adminc5.bj.sails.energetikadevelepment.com';
// const sails_url = "http://3.21.75.143";
// const sails_url = "http://apibj.energetikatechnology.com"; //actual
// const radar_backend = "http://radarbackendprod.radarapptechnologies.com/graphql";
const express_url = "http://3.15.181.186";

//Dev
const sails_url = "http://18.191.101.241";
//const sails_url = "http://localhost";
const radar_backend = "http://radar-backend-test.us-east-1.elasticbeanstalk.com/graphql";
const webSocketPort = '20';
const apiPort = "3000";
const sailsPort = "1337";
const ptzPort = "3001";
const client = 'Benito Juárez';
const urlPath = favicon


export default {
  express_url,
  sails_url,
  apiPort,
  webSocketPort,
  sailsPort,
  ptzPort,
  radar_backend,
  client,
  urlPath
};
