import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ProjectTable from "../ProjectTable";
import ProjectModal from "../ProjectModal";
import { withAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import * as constants from "../../constants";

class Dashboard extends Component {
  state = {
    projects: [],
    isModalOpen: false,
  };

  componentDidMount = () => {
    const { user } = this.props.auth0;
    fetch("Project/Projects?userId=" + user.sub)
      .then((response) => response.json())
      .then((data) => {
        data = data.map((project) => {
          return {
            id: project.Id,
            name: project.Name,
            type: constants.PROJECT_TYPE_MAP[project.Type],
            createdBy: project.Users.find(user => user.Id === project.CreatorId).NickName,
            dateCreated: project.DateCreated,
          };
        });
        this.setState({ projects: data });
      })
      .catch((e) => console.log(e));
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  onNewProjectButtonClick = () => {
    this.setState({ isModalOpen: true });
  };

  createNewProject = (name, type) => {
    const { user } = this.props.auth0;
    let url = "Project/Create?";
    url += new URLSearchParams({
      name,
      type,
      CreatorId: user.sub,
    }).toString();
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        this.setState((prevState) => ({
          projects: [
            ...prevState.projects,
            {
              name,
              type: constants.PROJECT_TYPE_MAP[type],
              createdBy: user.nickname,
            },
          ],
        }));
      });
  };

  render() {
    return (
      <Container>
        <div>
          <Button variant="primary" onClick={this.onNewProjectButtonClick}>
            new project
          </Button>{" "}
        </div>
        <ProjectTable projects={this.state.projects} />
        <ProjectModal
          show={this.state.isModalOpen}
          closeModal={this.closeModal}
          createNewProject={this.createNewProject}
        />
      </Container>
    );
  }
}

export default withAuthenticationRequired(withAuth0(Dashboard), {
  onRedirecting: () => <div>Redirecting to login page...</div>,
});
