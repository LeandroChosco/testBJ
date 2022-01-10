import firebase from 'firebase'

const config = {
  apiKey: process.env.REACT_APP_APIKEY_CONFIG_WATCHTOWER,
  authDomain: process.env.REACT_APP_AUTHDOMAIN_CONFIG_WATCHTOWER,
  databaseURL: process.env.REACT_APP_DATABASEURL_CONFIG_WATCHTOWER,
  projectId: process.env.REACT_APP_PROJECTID_CONFIG_WATCHTOWER,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET_CONFIG_WATCHTOWER,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID_CONFIG_WATCHTOWER,
  appId:process.env.REACT_APP_APPID_CONFIG_WATCHTOWER,
};

firebase.initializeApp(config)

export default firebase
