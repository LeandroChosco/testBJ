import firebase from 'firebase'

/* Production */
// var firebaseConfig = {
//   apiKey: "AIzaSyDDq95BbNrQs6WZB-T9B7WTEF2YWr2Ibb0",
//   authDomain: "c5benito.firebaseapp.com",
//   databaseURL: "https://c5benito.firebaseio.com",
//   projectId: "c5benito",
//   storageBucket: "",
//   messagingSenderId: "959359457942",
//   appId: "1:959359457942:web:cff036937c7515fa"
// };

/* Develop */
const firebaseConfig = {
  apiKey: 'AIzaSyDPzqD06v8lAWD3uZy_8A6rfSOy9zXmXIE',
  authDomain: 'c5benitodev.firebaseapp.com',
  databaseURL: 'https://c5benitodev.firebaseio.com',
  projectId: 'c5benitodev',
  storageBucket: 'c5benitodev.appspot.com',
  messagingSenderId: '342714394776',
  appId: '1:342714394776:android:3451ef1e07ecd9263a48ed'
};

var firebaseC5Benito = firebase

firebaseC5Benito.initializeApp(firebaseConfig, 'c5benito')

export default firebaseC5Benito
