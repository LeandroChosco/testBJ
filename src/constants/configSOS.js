import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyCOJ0U47a12lBNCX42tnvmfdQyXFmxCtOE",
  authDomain: "trackinglocationradar.firebaseapp.com",
  databaseURL: "https://trackinglocationradar.firebaseio.com",
  projectId: "trackinglocationradar",
  storageBucket: "trackinglocationradar.appspot.com",
  messagingSenderId: "907446810833",
  appId: "1:907446810833:web:3834373118214d8fc56df0",
};

var firebaseSos = firebase;

firebaseSos.initializeApp(firebaseConfig, "sos");

export default firebaseSos;
