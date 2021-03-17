import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import { withAuth0 } from "@auth0/auth0-react";
import AsyncDropdown from "../AsyncDropdown";

class HomePage extends Component {
  render() {
    return <Container>home page</Container>;
  }
}

export default withAuth0(HomePage);
