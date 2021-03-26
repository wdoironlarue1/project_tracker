import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import { NavLink } from "react-router-dom";
import { withAuth0 } from "@auth0/auth0-react";

class HomePage extends Component {
  render() {
    const { isAuthenticated, loginWithRedirect } = this.props.auth0;
    return (
      <Container style={{ textAlign: "center" }}>
        <Jumbotron>
          <h2>
            <p>Welcome to Project Tracker!</p>
          </h2>
          <p>
            A web application that can be used for your project-tracking needs.
          </p>
          {!isAuthenticated ? (
            <p>
              Get started by logging in or signing up{" "}
              <a href="/" onClick={loginWithRedirect}>
                here
              </a>
              , then navigate to the dashboard page to access or create your
              projects.
            </p>
          ) : (
            <p>
              Get Started by navigating to the{" "}
              <NavLink to="/dashboard" exact>
                {" "}
                Dashboard
              </NavLink>{" "}
              to access or create your projects.
            </p>
          )}
          <p>
            Once you've created a project in the Dashboard, click on the name of
            the new project in the table of projects to be sent to the tracker
            page. In the tracker page you can create, edit, and delete issues,
            move them from one stage column to another by dragging and dropping
            (or via the edit modal that pops up when you click on an issue), and
            add people to your project so that they can participate too.{" "}
          </p>
          <p>
            Invite your colleagues to join so that you can track your progress
            together!
          </p>
          <p>
            Any questions, bugs, or concerns? Feel free to reach out to me at
            wdoironlarue@gmail.com.
          </p>
        </Jumbotron>
      </Container>
    );
  }
}

export default withAuth0(HomePage);
