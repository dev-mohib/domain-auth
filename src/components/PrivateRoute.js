import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import firebase from 'firebase'

export const PrivateRoute = ({ component: Component, ...rest }) => {
// const [user, setUser] = React.useState({})
const [isAdmin, setAdmin] = React.useState(false)
React.useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
        if (user) {
            user.getIdTokenResult().then(IdToken => {
               if(IdToken.claims.Admin)
               {
                console.log("You are logged in as Admin")
                setAdmin(true)
                } 
                else
                {
                console.log("Welcome User")
                setAdmin(false)
            }
           })
        } else {
            console.log('unauthorized')
        }
      }); 
    }, [])
   return( 
   <Route {...rest} render={props => (
        isAdmin
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/home', state: { from: props.location } }} />
    )} />)
}