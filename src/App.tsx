import React from "react";
import SignIn from "./Screens/SignIn";
import SignUp from "./Screens/SignUp";
import Home from "./Screens/Home";
import InsertDomain from "./Screens/InsertDomain";
import withAuthentication from "./helpers/withAuthentication";
// import Navigation from "./Screens/Navigation";
import AddImage from './Screens/AddImage'
import Users from './Screens/Users'
import ViewImage from './Screens/Image'
// import { PrivateRoute } from './components/PrivateRoute'

import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

const App: React.FC = () => {
  return (

      <Router>
        <Route exact path="/addImage" component={AddImage} />
        <Route exact path="/users" component={Users} />
        <Route exact path="/insert" component={InsertDomain} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/" component={SignIn} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/ViewProduct" component={ViewImage} />
        {/* <Route exact path="/home" component={Home} /> */}
      </Router>
  );
};

export default withAuthentication(App); //using HoC to handle session
