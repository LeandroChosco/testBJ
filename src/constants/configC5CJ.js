import firebase from 'firebase'

// var firebaseConfig = {
//   apiKey: "AIzaSyDDq95BbNrQs6WZB-T9B7WTEF2YWr2Ibb0",
//   authDomain: "c5benito.firebaseapp.com",
//   databaseURL: "https://c5benito.firebaseio.com",
//   projectId: "c5benito",
//   storageBucket: "",
//   messagingSenderId: "959359457942",
//   appId: "1:959359457942:web:cff036937c7515fa"
// };
var firebaseConfig = {
  apiKey: 'AIzaSyBMKleAhkM-RbHMft-sBIOezloY9mOPUxk',
  authDomain: 'devradarsos.firebaseapp.com',
  databaseURL: 'https://devradarsos.firebaseio.com',
  projectId: 'devradarsos',
  storageBucket: 'devradarsos.appspot.com',
  messagingSenderId: '191185099682',
  appId: '1:191185099682:android:508b531d956f4a016bf0fb'
}

var firebaseC5Benito = firebase

firebaseC5Benito.initializeApp(firebaseConfig, 'c5benito')

export default firebaseC5Benito
