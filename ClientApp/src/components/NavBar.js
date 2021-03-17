import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <Navbar bg="light">
      <Navbar.Brand href="#home">Project Tracker</Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavLink to="/" exact className="nav-link">
            {" "}
            Home
          </NavLink>
          <NavLink to="/dashboard" exact className="nav-link">
            {" "}
            Dashboard
          </NavLink>
        </Nav>

        {isAuthenticated ? (
          <div>
            {user.nickname} <LogoutButton />
          </div>
        ) : (
          <LoginButton />
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
