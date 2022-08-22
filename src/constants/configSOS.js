import firebase from "firebase";
import {
  //prod
// REACT_APP_APIKEY_TRACKINGLOCATIONRADARSOS,
// REACT_APP_AUTHDOMAIN_TRACKINGLOCATIONRADARSOS,
// REACT_APP_DATABASEURL_TRACKINGLOCATIONRADARSOS,
// REACT_APP_PROJECTID_TRACKINGLOCATIONRADARSOS,
// REACT_APP_STORAGEBUCKET_TRACKINGLOCATIONRADARSOS,
// REACT_APP_MESSAGINGSENDERID_TRACKINGLOCATIONRADARSOS,
// REACT_APP_APPID_TRACKINGLOCATIONRADARSOS,
//dev
REACT_APP_APIKEY_DEVRADARSOSDEV,
REACT_APP_AUTHDOMAIN_DEVRADARSOSDEV,
REACT_APP_PROJECTID_DEVRADARSOSDEV,
REACT_APP_DATABASEURL_DEVRADARSOSDEV,
REACT_APP_STORAGEBUCKET_DEVRADARSOSDEV,
REACT_APP_MESSAGINGSENDERID_DEVRADARSOSDEV,
REACT_APP_APPID_DEVRADARSOSDEV
} from '../env.js'

/* Production */

// const firebaseConfig = {
//   apiKey:REACT_APP_APIKEY_TRACKINGLOCATIONRADARSOS,
//   authDomain:REACT_APP_AUTHDOMAIN_TRACKINGLOCATIONRADARSOS,
//   databaseURL:REACT_APP_DATABASEURL_TRACKINGLOCATIONRADARSOS,
//   projectId:REACT_APP_PROJECTID_TRACKINGLOCATIONRADARSOS,
//   storageBucket:REACT_APP_STORAGEBUCKET_TRACKINGLOCATIONRADARSOS,
//   messagingSenderId:REACT_APP_MESSAGINGSENDERID_TRACKINGLOCATIONRADARSOS,
//   appId:REACT_APP_APPID_TRACKINGLOCATIONRADARSOS,

//  };

// Develop config
const firebaseConfig = {
  apiKey:REACT_APP_APIKEY_DEVRADARSOSDEV,
  authDomain:REACT_APP_AUTHDOMAIN_DEVRADARSOSDEV,
  projectId:REACT_APP_PROJECTID_DEVRADARSOSDEV,
  databaseURL:REACT_APP_DATABASEURL_DEVRADARSOSDEV,
  storageBucket:REACT_APP_STORAGEBUCKET_DEVRADARSOSDEV,
  messagingSenderId:REACT_APP_MESSAGINGSENDERID_DEVRADARSOSDEV,
  appId:REACT_APP_APPID_DEVRADARSOSDEV,
}

var firebaseSos = firebase;

firebaseSos.initializeApp(firebaseConfig, "sos");

export default firebaseSos;
