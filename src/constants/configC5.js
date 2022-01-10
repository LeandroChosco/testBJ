import firebase from 'firebase'

var firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY_C5VIRTUAL,
  authDomain: process.env.REACT_APP_AUTHDOMAIN_C5VIRTUAL,
  databaseURL: process.env.REACT_APP_DATABASEURL_C5VIRTUAL,
  projectId: process.env.REACT_APP_PROJECTID_C5VIRTUAL,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET_C5VIRTUAL,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID_C5VIRTUAL,
  appId: process.env.REACT_APP_APPID_C5VIRTUAL,
};

var firebaseC5 = firebase

firebaseC5.initializeApp(firebaseConfig, 'c5virtual')

export default firebaseC5