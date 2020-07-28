import { db } from "./firebase";
import firebase from "firebase/app";
export const doCreateUser = (id, fullname, email) =>
  db.ref(`users/${id}`).set({
    fullname,
    email,
  });
export const doCreateDomain = (domainObj, domainId) =>
// db.ref(`domains`).push({
  db.ref(`domains/${domainId}`).set(domainObj);
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
