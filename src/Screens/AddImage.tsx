import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
// import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { useHistory } from "react-router";
import { CircularProgress } from '@material-ui/core';
import firebase from 'firebase'
import Navigation from "./Navigation";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link to="/signup">Your Website</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme: any) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const INITIAL_STATE = {
    imageName: "",
    imageDescription: "",
    captions: "",
    artist: "",
    keywords : [],
    mediaLink : "",
    selfLink : "",
    showingAlert: false,
  };

  const [loading, setLoading] = useState(false)
  const [state, setState] = useState({
    ...INITIAL_STATE,
  });

  const [alertMessage, setAlertMessage] = useState("There was an error while adding new image")
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false)

  const history = useHistory();

  const handleChange = (event: any) => {
    const value = event.target.value;
    
    setState({
      ...state,
      [event.target.name]: value,
    });
  };
  const [isReady, setReady] = useState(false)
  const checkAdmin = () => {
    firebase.auth().onAuthStateChanged(async user => {
      //This is admin uid
      if (!user || user.uid !== 'GA1STmDPYTYcsDMN4KrMXksMfZl2')
        history.push({ pathname: "/home" })
      else setReady(true)
    }) 
}
React.useEffect(() => {
  checkAdmin()
},[])
  const onSubmit = () => {
    setLoading(true)
    const d = new Date()
    const dateFormat = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    const doc_id = `${dateFormat}-${Date.now()}-mizaharsiv-jpg`
    const data = {
      fileType : "JPEG",
      fileTypeExtension : "jpg",
      mimeType : "image/jpeg",
      artist : state.artist,
      imageDescription : state.imageDescription,
      // dateTimeOriginal : `${dateFormat}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`,
      objectName : state.imageName,
      keywords : [],
      imageWidth : 1000,
      imageHeight : 1000,
      imageSize : "1000x1000",
      caption : state.captions,
      name : state.imageName,
      storageId : "",
      generation : "8264542972",
      bucket : "mizaharsiv-jpg",
      mediaLink : state.mediaLink,
      selfLink : state.selfLink,
      etag : "CKjzqoqR7ukCEAE=",
      size : "10001000",
      // updated : "SomeTime-.806Z"
     }
     
     if(state.artist.length < 4 || state.imageName.length < 5 || state.imageDescription.length < 10 || state.selfLink.length < 10) {
       setAlertMessage("Please Enter valid Information about the Image")
       setLoading(false)
       setError(true)
       setTimeout(() => {
       setError(false)
    }, 5000)
       return
     }

var raw = JSON.stringify(data);
//FETCH REQUEST
fetch(`https://elasticsearch.mizaharsiv.org/elasticsearch/archive/_doc/${doc_id}?op_type=create`, 
{
  method: "PUT",
  headers: {
   "Content-Type" : "application/json"
  },
  body: raw,
  redirect: "follow"
})
  .then(response => response.text())
  .then(result => {
    console.log(result)
    setSuccess(true)
    setLoading(false)
    setTimeout(() =>{
      setSuccess(false)
    }, 5000)
  })
  .catch(error => {
    console.log('error', error)
    setAlertMessage("There was an Error while adding Image to the database")
    setLoading(false)
    setError(true)
    setTimeout(() => {
      setError(false)
    }, 5000)
  });
}
if(isReady)
return (
  <div>
    <Navigation />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {error ? 
        <Alert severity="error">
          <AlertTitle>{alertMessage}</AlertTitle>
        </Alert>
      : null
    }
      {success ?
        <Alert severity="success">
          <AlertTitle>The Image has been added successfully</AlertTitle>
        </Alert>
      : null
    }
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>{/* <LockOutlinedIcon /> */}</Avatar>
        <Typography component="h1" variant="h5">
          Add Image
        </Typography>
        <div className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="imageName"
                variant="outlined"
                required
                fullWidth
                id="imageName"
                onChange={handleChange}
                label="Image Title"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="artist"
                label="Image Artist"
                onChange={handleChange}
                name="artist"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="imageDescription"
                onChange={handleChange}
                label="Image Description"
                name="imageDescription"
                type="text"
               
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="selfLink"
                label="Media Link"
                type="text"
                id="selfLink"
                onChange={handleChange}
              />
            </Grid>

          </Grid>
          <br />
          {
            !loading ? <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={onSubmit}
          >
            Add Image
          </Button> : 
          <CircularProgress style={{alignSelf : 'center'}} color="secondary" />

          }
          

        </div>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  </div>
  )
  else 
    return(<div/>)
}
