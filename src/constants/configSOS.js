import firebase from "firebase";

// var firebaseConfig = {
//   apiKey: "AIzaSyCOJ0U47a12lBNCX42tnvmfdQyXFmxCtOE",
//   authDomain: "trackinglocationradar.firebaseapp.com",
//   databaseURL: "https://trackinglocationradar.firebaseio.com",
//   projectId: "trackinglocationradar",
//   storageBucket: "trackinglocationradar.appspot.com",
//   messagingSenderId: "907446810833",
//   appId: "1:907446810833:web:3834373118214d8fc56df0",
// };

// Develop config
const firebaseConfig = {
  apiKey: 'AIzaSyBMKleAhkM-RbHMft-sBIOezloY9mOPUxk',
  authDomain: 'devradarsos.firebaseapp.com',
  databaseURL: 'https://devradarsos.firebaseio.com',
  projectId: 'devradarsos',
  storageBucket: 'devradarsos.appspot.com',
  messagingSenderId: '191185099682',
  appId: '1:191185099682:android:508b531d956f4a016bf0fb'
}

var firebaseSos = firebase;

firebaseSos.initializeApp(firebaseConfig, "sos");

export default firebaseSos;
