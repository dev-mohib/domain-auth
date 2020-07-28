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
import firebase from "firebase/app";
import { functions } from 'firebase'
import Navigation from './Navigation'

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
    username: "",
    email: "",
    password: "",
    passwordTwo: "",
    showingAlert: false,
  };
  const [state, setState] = useState({
    ...INITIAL_STATE,
  });

  const [alert, setAlert] = useState(false);
  const [error, setError] = useState({});

  const history = useHistory();

  const handleChange = (event: any) => {
    const value = event.target.value;
    // const name = event.target.name;
    // console.log(event.target.name, state);

    setState({
      ...state,
      [event.target.name]: value,
    });
  };

  const timer = () => {
    setAlert(true);

    setTimeout(() => {
      setAlert(false);
    }, 4000);
  };
  const onSubmit = (event: any) => {
    const { username, email, password } = state;
    const domain = email.split("@");
    let van = domain[1];
    // console.log(van, domain);
    let rootRef = firebase.database().ref();
    rootRef
      .child("domains")
      .orderByChild("domain")
      .equalTo(van)
      .once("value")
      .then((snapshot) => {
        if (snapshot.exists()) {
          // let userData = snapshot.val();
          auth
            .doCreateUserWithEmailAndPassword(email, password)
            //it the above functions resolves, reset the state to its initial state values, otherwise, set the error object
            .then((authUser: any) => {
              //creating a user in the database after the sign up through Firebase auth API
              db.doCreateUser(authUser.user.uid, username, email)
                .then(() => {
                  setState({
                    ...INITIAL_STATE,
                  });
                  // const addAdmin = firebase.functions().httpsCallable('addAdmin')
                  // addAdmin('test').then((res) => {
                  //   console.log(res)
                  // })
                  history.push({ pathname: "/home" });
                  return
                })
                .catch((error: any) => {
                  console.log(error);
                  setError(error.message);
                  timer(); //defined below

                  // this.setState(byPropKey("error", error));
                  // this.timer(); //show alert message for some seconds
                });
            })
            .catch((err: any) => {
              console.log(err, "erro last");
              setError(err.message);

              timer(); //defined below

              // this.setState(byPropKey("error", err));
              // this.timer(); //show alert message for some seconds
            });
        } else {
          // const { history } = this.props;
          setError("Domain not exist....");
          timer();
          event.preventDefault(); //prevents refreshing
        }
      });
  };
  return (
    <div>
      <Navigation />
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {alert && (
        <Alert severity="error">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>{/* <LockOutlinedIcon /> */}</Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <div className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="username"
                name="username"
                variant="outlined"
                required
                fullWidth
                id="username"
                onChange={handleChange}
                label="Full Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email"
                onChange={handleChange}
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="examplepassword"
                onChange={handleChange}
                label="Password"
                name="password"
                type="password"
                autoComplete="password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passwordTwo"
                label="Confirm Password"
                type="password"
                onChange={handleChange}
                id="examplePassword2"
                autoComplete="current-password"
              />
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={onSubmit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/signin">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </div>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  </div>
  );
}
