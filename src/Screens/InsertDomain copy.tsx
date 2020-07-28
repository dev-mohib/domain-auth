import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import PropTypes from 'prop-types'
import { useState } from "react";
import { auth, db } from "../firebase";
import { useHistory } from "react-router";
import { Alert, AlertTitle } from "@material-ui/lab";
import { useEffect } from "react";
import firebase from "firebase";
import { Row, Col } from 'antd'
import Navigation from './Navigation'

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
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

function TabPanel(props : any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index : any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



export default function SignIn() {
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
    isActive : Boolean;
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
  }
  const [isReady, setReady] = useState(false)
  const classes = useStyles();
  const [value, setValue] = React.useState(0);


  const checkAdmin = () => {
    firebase.auth().onAuthStateChanged(async user => {
        if(!user || user.uid !== 'GA1STmDPYTYcsDMN4KrMXksMfZl2')
            history.push({ pathname: "/home" })
        else 
            setReady(true)
    }) 
}
  useEffect(() => {
    
    checkAdmin()
    checkDomains()
  }, []);

  const checkDomains = () => {
    firebase
    .database()
    .ref("domains")
    .once("value")
    .then((snapshot: any) => {
      snapshot.forEach(function (childSnapshot: any) {
        var childData = childSnapshot.val();
        setDomains(prevDomains => [...prevDomains , {name : childData.domain , id : childSnapshot.key, isActive : childData.isActive}])
      
      });
    });
    setLoading(false)
  }
  const onSubmit = (event: any) => {
    const { domain } = state;
    setLoading(true)
    const split = state.domain.split(".")
  
    const domainId = split[0] + "-" + split[1]
    let rootRef = firebase.database().ref();
    rootRef
      .child("domains")
      .orderByChild("domain")
      .equalTo(state.domain)
      .once("value")
      .then((snapshot) => {
        setAlert(false)
        if (!snapshot.exists()) {
          db.doCreateDomain({domain : state.domain, slug : domainId, isActive : true}, domainId)
          .then(() => {
            setState({
              ...INITIAL_STATE,
            });
            setDomains([])
            checkDomains()
          })
          .catch((error: any) => {
            // firebase.database().ref('users/' + userId).set({})
            setError(error.message);
            timer(); //defined below
          });
          
        }
        else {
          const x = snapshot.val()
          console.log(snapshot)
          setAlert(true)
          setError("This Domain already exists. Please use different domain...")
          setLoading(false)
        }

      })

    
  };
  const timer = () => {
    setAlert(true);

    setTimeout(() => {
      setAlert(false);
    }, 4000);
  };
  const handleChangeTab = (event : any, newValue : any) => {
    setValue(newValue);
  };
  const handleStatus = (domainId : any, status : Boolean) => {
    let disableUser = firebase.functions().httpsCallable('disableUser')
    let enableUser = firebase.functions().httpsCallable('enableUser')

     // const newDomains = domains.filter(domain => domain.id !== domainId)
     const split = domainId.split("-")
     console.log(domainId)
     const userRef =  firebase
     .database()
     .ref(`domains/${domainId}/users`)

       setLoading(true)
       var delRef = firebase.database().ref(`domains/${domainId}`);
       delRef.update({
         isActive : status
        })
     .then(() => {
      //
      if(status) {
      userRef
      .once("value")
      .then((snapshot: any) => {
        console.log("Enabling the list of users")
        snapshot.forEach((childSnapshot: any) => {
          var childData = childSnapshot.val();
          console.log(childData.uid)
          enableUser({uid : childData.uid}).then(result => {
            console.log(result)
          }).catch(err => console.log(err))
        });
      });
  } else {
    userRef
    .once("value")
    .then((snapshot: any) => {
      console.log("Disabling the list of users")
      snapshot.forEach( (childSnapshot: any) =>{
        var childData = childSnapshot.val();
        console.log(childData.uid)
        disableUser({uid : childData.uid}).then(result => {
          console.log(result)
        }).catch(err => console.log(err))
      });
    });
  }



       setDomains([])
       checkDomains()
       setLoading(false)
   })
   .catch(function(error) {
     console.log("failed: " + error.message)
   });
  }
  const handleDelete = (domainId : any) => {
    // const newDomains = domains.filter(domain => domain.id !== domainId)
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
  if(isReady)
  return ( 
      <div>
      <Navigation />
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
            Insert Domains
          </Button>
        </div>
      </div>
      </Col>
      <Col span={8}>
      
      <h2>Registered Domains</h2>
        <div style={{overflow : "scroll", height : 200, width : 350}} >
            <AppBar position="static">
            <Tabs value={value} onChange={handleChangeTab} aria-label="simple tabs example">
              <Tab label="Active" {...a11yProps(0)} />
              <Tab label="Disabled" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
          
            {
              loading ?  <CircularProgress color="secondary" /> : 
              <ul style={{display : 'flex', flexDirection : 'column'}}>
                  {domains.map(domain => 
                    domain.isActive?
                    <li key={domain.id} className={classes.domains}><span style={{padding : 10, fontWeight : 'bold'}}>{domain.name}</span>          
                      <Button
                      type="submit"
                      color="primary"
                      onClick={() => handleStatus(domain.id, false)}
                      >
                      Disable
                    </Button></li>:null)}
              </ul>
            }
          </TabPanel>
          <TabPanel value={value} index={1}>
          {
              loading ?  <CircularProgress color="secondary" /> : 
              <ul style={{display : 'flex', flexDirection : 'column'}}>
                  {domains.map(domain => 
                    domain.isActive == false?
                    <li key={domain.id} className={classes.domains}><span style={{padding : 10, fontWeight : 'bold'}}>{domain.name}</span>          
                      <Button
                      type="submit"
                      color="primary"
                      onClick={() => handleStatus(domain.id, true)}
                      >
                      Enable
                    </Button>
                      <Button
                      type="submit"
                      color="primary"
                      onClick={() => handleDelete(domain.id)}
                      >
                      X
                    </Button></li>:null)}
              </ul>
            }
          </TabPanel>
        </div>
      </Col>
      </Row>
      </Container> 
      </div>
      );
  else 
    return(<div/>)
}
