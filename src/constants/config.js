import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyC1nW0PWv_tl7a3TT1YeZgoohsdhMpRRhA",
  authDomain: "watchtower-7a145.firebaseapp.com",
  databaseURL: "https://watchtower-7a145.firebaseio.com",
  projectId: "watchtower-7a145",
  storageBucket: "watchtower-7a145.appspot.com",
  messagingSenderId: "62036046388",
  appId: "1:62036046388:web:efa0c0881ff8690b"
};

firebase.initializeApp(config)

export default firebase
