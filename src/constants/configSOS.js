import firebase from "firebase";

 var firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY_TRACKINGLOCATIONRADARSOS,
  authDomain: process.env.REACT_APP_AUTHDOMAIN_TRACKINGLOCATIONRADARSOS,
  databaseURL: process.env.REACT_APP_DATABASEURL_TRACKINGLOCATIONRADARSOS,
  projectId: process.env.REACT_APP_PROJECTID_TRACKINGLOCATIONRADARSOS,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET_TRACKINGLOCATIONRADARSOS,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID_TRACKINGLOCATIONRADARSOS,
  appId: process.env.REACT_APP_APPID_TRACKINGLOCATIONRADARSOS,

 };

// Develop config
// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY_DEVRADARSOSDEV,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN_DEVRADARSOSDEV,
//   projectId: process.env.REACT_APP_PROJECTID_DEVRADARSOSDEV,
//   databaseURL: process.env.REACT_APP_DATABASEURL_DEVRADARSOSDEV,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET_DEVRADARSOSDEV,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID_DEVRADARSOSDEV,
//   appId: process.env.REACT_APP_APPID_DEVRADARSOSDEV,
// }

var firebaseSos = firebase;

firebaseSos.initializeApp(firebaseConfig, "sos");

export default firebaseSos;
