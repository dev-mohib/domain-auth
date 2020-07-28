import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import { useState } from "react";
import { auth } from "../firebase";
import { useHistory } from "react-router";
import { Alert, AlertTitle } from "@material-ui/lab";
import Navigation from './Navigation'
import firebase from 'firebase'
const useStyles = makeStyles((theme) => ({
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const INITIAL_STATE = {
    email: "",
    password: "",
    error: null,
    showingAlert: false,
  };
  const history = useHistory();

  const [state, setState] = useState({
    ...INITIAL_STATE,
  });
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState(null);
  const handleChange = (event: any) => {
    const value = event.target.value;
    console.log(event);
    setState({
      ...state,
      [event.target.name]: value,
    });
  };
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      if(user) history.push({ pathname: "/home" })
  }) 
  },[])
  const onSubmit = (event: any) => {
    const { email, password } = state;

    // const { history } = this.props;
    console.log(state);

    auth
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setState({ ...INITIAL_STATE });
        console.log("hahahaha", state);
        history.push({ pathname: "/home" });
      })
      .catch((error: any) => {
        console.log(error, "error");
        setError(error.message);
        timer(); //defined below
      });

    event.preventDefault();
  };
  const timer = () => {
    setAlert(true);

    setTimeout(() => {
      setAlert(false);
    }, 4000);
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
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            onChange={handleChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to="/">Forgot password?</Link>
            </Grid>
            <Grid item>
              <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  </div>
  );
}
