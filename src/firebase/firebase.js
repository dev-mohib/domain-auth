import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

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
  apiKey: "AIzaSyAx_f3T2cKO11FJxbNMyOO3cS3ZPEFbmEI",
  authDomain: "domain-app-fbe04.firebaseapp.com",
  databaseURL: "https://domain-app-fbe04.firebaseio.com",
  projectId: "domain-app-fbe04",
  storageBucket: "domain-app-fbe04.appspot.com",
  messagingSenderId: "303396713920",
  appId: "1:303396713920:web:8e7c6927d2bd2f8afe0425",
  measurementId: "G-TQJ7TQPNCM"
};

if (!firebase.apps.length) {
  //initializing with the config object
  firebase.initializeApp(config);
}

//separting database API and authentication
const db = firebase.database();
const auth = firebase.auth();

const facebookProvider = new firebase.auth.FacebookAuthProvider();

export { db, auth, facebookProvider };
