import React from "react";
import SignIn from "./Screens/SignIn";
import SignUp from "./Screens/SignUp";
import Home from "./Screens/Home";
import InsertDomain from "./Screens/InsertDomain";
import withAuthentication from "./helpers/withAuthentication";
import Navigation from "./Screens/Navigation";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Navigation />
        <Route exact path="/" component={SignIn} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/insert" component={InsertDomain} />
      </Router>
    </div>
  );
};

export default withAuthentication(App); //using HoC to handle session
