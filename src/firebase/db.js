//this is going to store Firebase realtime database API code
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import firebase from "firebase/app";

//##########3 user API

//create an user and store it at users/id path (it's an asynchronous func)
export const doCreateUser = (id, fullname, email) =>
  db.ref(`users/${id}`).set({
    fullname,
    email,
  });
export const doCreateDomain = (domain) =>
  db.ref(`domains`).push({
    id: uuidv4(),
    domain,
  });
//returns all users from firebase realtime db
export const onceGetUsers = () => db.ref("users").once("value");
export const onceGetDomains = () => {
  return db
    .ref("domains")
    .once("value")
    .then((snapshot) => {
      console.log(snapshot.val());
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        console.log(childData.domain);
      });
    });
};
export const checkDomainExistsAlready = (domain) => {
  console.log(domain);
  //https://login-register-85dd0.firebaseio.com/domains
  // var ref = new Firebase("https://login-register-85dd0.firebaseio.com/domains");
  let rootRef = firebase.database().ref();
  return rootRef
    .child("domains")
    .orderByChild("domain")
    .equalTo(domain)
    .once("value")
    .then((snapshot) => {
      console.log();
      if (snapshot.exists()) {
        let userData = snapshot.val();
        console.log("exist.............................", userData);
        alert("user already exists");
        return "already Exists";
      } else {
        console.log("not found");
        doCreateDomain(domain);
        onceGetDomains();
        alert("Domain Added Successfully");
        return "added";
      }
    });
};

export const doGetAnUnser = (uid) => db.ref(`users/${uid}`).once("value");

// other APIs could come below
