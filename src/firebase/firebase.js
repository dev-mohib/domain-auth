import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions"
//this config is being used for both development and production environment. Though, it is a best practice creating a second project and have two configs: one for production (prodConfig) and another for development (devConfig), so you choose the config based on the environment.
/*
const config = {
  apiKey: "AIzaSyAr5inSxEiWFT7ckRzPDna8N68DqMLelm0",
  authDomain: "login-register-85dd0.firebaseapp.com",
  databaseURL: "https://login-register-85dd0.firebaseio.com",
  projectId: "login-register-85dd0",
  storageBucket: "login-register-85dd0.appspot.com",
  messagingSenderId: "24475912936",
  appId: "1:24475912936:web:d654972ca956b99696175d",
  measurementId: "G-74SX017P8J",
}; */

const config = {
  apiKey: "AIzaSyDhnucxk3wUfDY7NSM8TGIY53zKukRHIWE",
  authDomain: "valiant-index-243410.firebaseapp.com",
  databaseURL: "https://valiant-index-243410.firebaseio.com",
  projectId: "valiant-index-243410",
  storageBucket: "valiant-index-243410.appspot.com",
  messagingSenderId: "295406841277",
  appId: "1:295406841277:web:21470cf0d4d1daaa21f6d4"
};

if (!firebase.apps.length) {
  //initializing with the config object
  firebase.initializeApp(config);
}

// firebase.functions().useFunctionsEmulator('http://localhost:3001');
//separting database API and authentication
const db = firebase.database();
const auth = firebase.auth();

const facebookProvider = new firebase.auth.FacebookAuthProvider();

export { db, auth, facebookProvider };
