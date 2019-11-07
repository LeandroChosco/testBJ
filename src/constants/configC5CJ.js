import firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyDVdmSf9QE5KdHNDCSrXwXr3N7QnHaujtg",
  authDomain: "c5virtual.firebaseapp.com",
  databaseURL: "https://c5virtual.firebaseio.com",
  projectId: "c5virtual",
  storageBucket: "c5virtual.appspot.com",
  messagingSenderId: "816774088533",
  appId: "1:816774088533:web:9ccb8a57de78b7c2"
};


var firebaseC5cuajimalpa = firebase

firebaseC5cuajimalpa.initializeApp(firebaseConfig,'c5cuajimalpa')

export default firebaseC5cuajimalpa
