import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import firebase from 'firebase'
import { useHistory } from 'react-router'
import { CircularProgress } from '@material-ui/core';
import Navigation from './Navigation'
import Card from '../components/Cards' 
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function UsersList() {
  const classes = useStyles();
  const history = useHistory();
  interface userObj {
    FullName : string;
    Email : string;
  }
  const [users , setUsers] = React.useState<userObj[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isReady, setReady] = React.useState(false)
  const checkAdmin = () => {
    firebase.auth().onAuthStateChanged(async user => {
    //This is admin uid
    if (!user || user.uid !== 'GA1STmDPYTYcsDMN4KrMXksMfZl2')
    history.push({ pathname: "/home" })
    else
    setReady(true)
    }) 
}
  const getAllUsers = () => {
    firebase
    .database()
    .ref("users")
    .once("value")
    .then((snapshot: any) => {
      snapshot.forEach(function (childSnapshot: any) {
        var childData = childSnapshot.val()
        setUsers(prevUsers => [...prevUsers , {FullName : childData.fullname , Email : childData.email}])
      })
    }) 
    setLoading(false)
  }

React.useEffect(() => {
    checkAdmin()
    getAllUsers()
},[])
if(isReady)
  return (
    <div>
      <Navigation />
    <List className={classes.root}>
        <h1>Regitered App Users</h1>
        {/* <Card /> */}
        {
          loading ?  <CircularProgress color="secondary" /> :  
          users.map(user => 
            <ListItem>
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText primary={user.FullName} secondary={user.Email} />
          </ListItem>
         )
        }

    </List>
  </div>
  )
  else return(<div/>)
}
