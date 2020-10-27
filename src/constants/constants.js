const base_url =
  // window.location.hostname === "localhost"
  //   ? "http://localhost"
  //   : window.location.hostname === "cams.bj.dev.energetikadevelepment.com"
  //   ? "http://dev.apicams.bj.dev.energetikadevelepment.com"
  // :
  "http://18.222.228.237";
const webSocketPort = "20";
/* const sails_url = "http://prod.adminc5.bj.sails.energetikadevelepment.com"; */
const sails_url = "http://3.134.88.220";
/* const sails_url = "http://localhost"; */
const apiPort = "3000";
const sailsPort = "1337";
export default {
  base_url,
  sails_url,
  apiPort,
  webSocketPort,
  sailsPort
};
