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

export default function UsersList(image : any) {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = React.useState(true)
  const [isReady, setReady] = React.useState(false)



React.useEffect(() => {
  const image_id = window.location.search.substring(1)
  fetch(`https://elasticsearch.mizaharsiv.org/elasticsearch/archive/_doc/${image_id}`, 
{
  method: "GET",
  headers: {
   "Content-Type" : "application/json"
  }
})
  .then(response => response.text())
  .then(result => {
   console.log("RESPONSE "+result)
   setReady(true)
  })
  .catch(error => {
   console.log("Error Occured")
  });

},[])
if(isReady)
  return (
    <div>
      <Navigation />
      <h1>Image details</h1>
  </div>
  )
  else return(<div>Please wait</div>)
}
