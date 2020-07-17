import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { CircularProgress } from '@material-ui/core';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import { useState } from "react";
import { auth, db } from "../firebase";
import { useHistory } from "react-router";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useEffect } from "react";
import firebase from "firebase";
import { Row, Col } from 'antd'

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
  domains : {
    display : 'flex',
    justifyContent : 'space-between',
    flex : 1,
    flexDirection : 'row',
    paddingRight : 30
  }
}));
export default function SignIn() {
  const classes = useStyles();
  const INITIAL_STATE = {
    domain: "",
  };
  const history = useHistory();

  const [state, setState] = useState({
    ...INITIAL_STATE,
  });
  const [alert, setAlert] = useState(false);
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true)
  interface domainObj {
    name : string;
    id : string;
  }
  const [domains , setDomains] = useState<domainObj[]>([])
  const [error, setError] = useState("");
  const handleChange = (event: any) => {
    const value = event.target.value;
    // console.log(value);
    setState({
      ...state,
      [event.target.name]: value,
    });
  };
  useEffect(() => {
    checkDomains();
  }, []);

  const checkDomains = () => {
    firebase
    .database()
    .ref("domains")
    .once("value")
    .then((snapshot: any) => {
      snapshot.forEach(function (childSnapshot: any) {
        var childData = childSnapshot.val();
        setDomains(prevDomains => [...prevDomains , {name : childData.domain , id : childSnapshot.key}])
      });
    });
    setLoading(false)
  }
  const onSubmit = (event: any) => {
    const { domain } = state;
    setLoading(true)

    let rootRef = firebase.database().ref();
    rootRef
      .child("domains")
      .orderByChild("domain")
      .equalTo(state.domain)
      .once("value")
      .then((snapshot) => {
        setAlert(false)
        if (!snapshot.exists()) {
          db.doCreateDomain(state.domain)
          .then(() => {
            setState({
              ...INITIAL_STATE,
            });
            setDomains([])
            
            checkDomains()
            // history.push({ pathname: "/home" });
          })
          .catch((error: any) => {
            console.log(error);
            setError(error.message);
            timer(); //defined below
          });
          
        }
        else {
          setAlert(true)
          setError("This Domain already exists. Please use different domain...")
          setLoading(false)
        }

      })

    // const { history } = this.props;

   /* if (db.checkDomainExistsAlready(domain)) {

      let lastIndex = domains.slice(-1)[0]
      console.log("length  "  + lastIndex);
      setDomains(prevDomains => [...prevDomains , {name : state.domain , id : lastIndex ? lastIndex.id + 1 : 1}])
      state.domain = '' 
      return;
    } else {
      console.log("nonononononono");
    } */
    // console.log(db.onceGetDomains());
    // db.doCreateDomain(domain)
    //   .then(() => {
    //     setState({
    //       ...INITIAL_STATE,
    //     });
    //     // history.push({ pathname: "/home" });
    //   })
    //   .catch((error: any) => {
    //     console.log(error);
    //     setError(error.message);
    //     timer(); //defined below
    //   });
  };
  const timer = () => {
    setAlert(true);

    setTimeout(() => {
      setAlert(false);
    }, 4000);
  };

  const handleDelete = (domainId : any) => {
    // const newDomains = domains.filter(domain => domain.id !== domainId)
    console.log("Deleting Domain " , domainId)
    setLoading(true)
    var delRef = firebase.database().ref(`domains/${domainId}`);
    delRef.remove()
  .then(function() {
    console.log("Remove succeeded.")
    setDomains([])
    checkDomains()
    setLoading(false)
  })
  .catch(function(error) {
    console.log("Remove failed: " + error.message)
  });
  }
  return (
    
    <Container component="main" maxWidth="md" >

      <CssBaseline />
      {alert && (
        <Alert severity="error">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

    <Row
    type="flex"
    gutter={16}
    style={{ margin: "20px auto", borderBottom: "1px solid #ededed", display : 'flex', justifyContent : 'space-between', alignItems : 'center' }}
    >
     <Col span={12}>
      <div className={classes.paper}>
        <div className={classes.form}>
          {/* {console.log("data", data)} */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            value={state.domain}
            fullWidth
            id="domian"
            label="Domain Name"
            name="domain"
            autoComplete="domain"
            onChange={handleChange}
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={onSubmit}
            className={classes.submit}
          >
            Insert Domain
          </Button>
        </div>
      </div>
      </Col>
      <Col span={8}>
      <ul className={classes.paper}>
        {
          loading ?  <CircularProgress color="secondary" /> : 
          domains.map(domain => <li key={domain.id} className={classes.domains}><span style={{padding : 10, fontWeight : 'bold'}}>{domain.name}</span>          
          <Button
          type="submit"
          color="primary"
          onClick={() => handleDelete(domain.id)}
        >
         X
        </Button></li>)
        }
       

        </ul>
      </Col>
      </Row>
    </Container> 
  );
}
