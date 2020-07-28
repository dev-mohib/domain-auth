const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.database()
const REGION = 'us-central1';

exports.RegisterUser = functions.auth.user().onCreate((user) => {
  const email = user.email.split("@")
  const domain = email[1].split(".")
  const domainId = domain[0] + "-" + domain[1]
  return db.ref(`domains/${domainId}/users`).push({email : user.email, uid : user.uid}).then(() => {
    return { message : "Success! User has been saved" }
  })
})

exports.handleDomains = functions.database.ref('/domains')
.onUpdate(change => {
  const after = change.after
  after.forEach(childSnapshot => {
    var childData = childSnapshot.val();
    console.log("Domain is "+ childData.domain +  "Status" + childData.isActive)
    const db = admin.database().ref(`/domains/${childData.slug}/users`)
    if(childData.isActive) {
      console.log("Domain Enabled")
      db.once('value')
      .then(userSnapShot => {
        console.log("Reading User")
        userSnapShot.forEach(user => {
          const appUser = user.val()
          admin.auth().updateUser(appUser.uid, {
            disabled: false
        });
        })
        return true
      })
      .catch(err => err)
    } 
    else
    {
      console.log("Domain Disabled")
      db.once('value')
      .then(userSnapShot => {
        userSnapShot.forEach(user => {
          const appUser = user.val()
          admin.auth().updateUser(appUser.uid, {
            disabled: true
        });
        })
        return true
      })
      .catch(err => err)
    }
  })
  return true 
})

// exports.disableUser = functions.region(REGION).https.onCall((data, context) => {
//  return admin.auth().updateUser(data.uid, {
//     disabled: true
// }).then(() => {
//   return {message : "The user has been disabled"}
// })
// })

// exports.enableUser = functions.region(REGION).https.onCall((data, context) => {
// return admin.auth().updateUser(data.uid, {
//     disabled: false
// }).then(() => {
//   return {message : "The user is enabled"}
// });
// })

// exports.EnableUser = functions.https.onRequest((req, res) => {
//  res.send("You have called Request for enabling user")
// })
// exports.DisableUser = functions.https.onRequest((req, res) => {
//   res.send("You have called Request for disbaling user")
//  })

/*
exports.createAdmin = functions.database
   .ref('users/{userId}')
   .onCreate((snap, context) => {
    const email = "administrator@mizaharsiv.org"
    return admin.auth().getUserByEmail(email).then(user => {
      return admin.auth().setCustomUserClaims(user.uid , {
        Admin : true
      })
    }).then(() => {
      console.log("Success fully set an admin")
      return {
        mrssage : `Success ${email} has been made an Admin`
      }
    }).catch(err => {
      console.log(err)
      return err
    })
})

exports.addAdmin = functions.https.onCall((data, context) => {
  const email = "administrator@mizaharsiv.org"
  return admin.auth().getUserByEmail(email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid , {
      Admin : true
    })
  }).then(() => {
    console.log("Success fully set an admin")
    return {
      mrssage : `Success ${email} has been made an Admin`
    }
  }).catch(err => {
    console.log(err)
    return err
  })
})

*/