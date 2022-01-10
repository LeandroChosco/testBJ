import firebase from 'firebase'

/* Production */
// var firebaseConfig = {
//  apiKey:process.env.REACT_APP_APIKEY_C5BENITO,
//  authDomain:process.env.REACT_APP_AUTHDOMAIN_C5BENITO,
//  databaseURL:process.env.REACT_APP_DATABASEURL_C5BENITO,
//  projectId:process.env.REACT_APP_PROJECTID_C5BENITO,
//  storageBucket:process.env.REACT_APP_STORAGEBUCKET_C5BENITO,
//  messagingSenderId:process.env.REACT_APP_MESSAGINGSENDERID_C5BENITO,
//  appId: process.env.REACT_APP_APPID_C5BENITO
// };

/* Develop */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY_C5BENITODEV,
  authDomain: process.env.REACT_APP_AUTHDOMAIN_C5BENITODEV,
  databaseURL: process.env.REACT_APP_DATABASEURL_C5BENITODEV,
  projectId: process.env.REACT_APP_PROJECT_ID_C5BENITODEV,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET_C5BENITODEV,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID_C5BENITODEV,
  appId: process.env.REACT_APP_APPID_C5BENITODEV,
};

var firebaseC5Benito = firebase

firebaseC5Benito.initializeApp(firebaseConfig, 'c5benito')

export default firebaseC5Benito
