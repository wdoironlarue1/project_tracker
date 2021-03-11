import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";

const Login = () => {
    const history = useHistory();
    const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
        let url = "User/Create?"
        url += new URLSearchParams({
            auth0Key:user.sub,
            email: user.email,
            nickname: user.nickname,
            firstName: user.given_name || "",
            lastName: user.family_name || ""
          }).toString();
      fetch(url)
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          history.push("/");
        });
    }
  });

  return <Container>...</Container>;
};

export default Login;
