const base_url =
  // window.location.hostname === "localhost"
  //   ? "http://localhost"
  //   : window.location.hostname === "cams.bj.dev.energetikadevelepment.com"
  //   ? "http://dev.apicams.bj.dev.energetikadevelepment.com"
  // :
  "http://prod.apicams.bj.energetikadevelepment.com";
const webSocketPort = "20";
const sails_url = "http://prod.adminc5.bj.sails.energetikadevelepment.com";
const apiPort = "3000";
export default {
  base_url,
  sails_url,
  apiPort,
  webSocketPort
};
