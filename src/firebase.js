import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseApp =  firebase.initializeApp({
    apiKey: "AIzaSyBebQi5-urJyBRi5mRSbJaCrce2zMCL1O0",
  authDomain: "react-instagram-89156.firebaseapp.com",
  projectId: "react-instagram-89156",
  storageBucket: "react-instagram-89156.appspot.com",
  messagingSenderId: "548109860537",
  appId: "1:548109860537:web:601dd2d3a7fc49b12a2568",
  measurementId: "G-P4K7WHB726"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage};

//export default db;