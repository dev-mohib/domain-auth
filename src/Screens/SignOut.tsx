import React from "react";
import Button from "@material-ui/core/Button";

import { auth } from "../firebase";

const SignOutButton = () => (
  <Button color="default" variant="outlined" onClick={auth.doSignOut}>
    Sign Out
  </Button>
);

export default SignOutButton;
