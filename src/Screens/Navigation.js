import React from "react";
import NavigationAuth1 from "./NavigationAuth";

import AuthUserContext from "../helpers/AuthUserContext";

const Navigation = () => (
  <AuthUserContext.Consumer>
    {(authUser) =>
      authUser ? <NavigationAuth userInfo={authUser} /> : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>
);

const NavigationNonAuth = () => <NavigationAuth1 />;

export default Navigation;

const NavigationAuth = ({ userInfo }) => (
  <NavigationAuth1 userInfo={userInfo} />
);
