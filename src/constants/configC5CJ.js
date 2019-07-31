import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyANXNYbN33mWL1nMarlDuo4oCm0OYJ756s",
    authDomain: "c5cuajimalpa.firebaseapp.com",
    databaseURL: "https://c5cuajimalpa.firebaseio.com",
    projectId: "c5cuajimalpa",
    storageBucket: "",
    messagingSenderId: "321242403175",
    appId: "1:321242403175:web:9823cb773f4b4e20"
  };

var firebaseC5cuajimalpa = firebase

firebaseC5cuajimalpa.initializeApp(firebaseConfig,'c5cuajimalpa')

export default firebaseC5cuajimalpa