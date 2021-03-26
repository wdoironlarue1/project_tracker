import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ProjectTable from "../ProjectTable";
import ProjectModal from "../ProjectModal";
import { withAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import * as constants from "../../constants";
import Jumbotron from "react-bootstrap/Jumbotron";

class Dashboard extends Component {
  state = {
    projects: [],
    isModalOpen: false,
    selectedProject: {},
  };

  componentDidMount = () => {
    const { user } = this.props.auth0;
    fetch("Project/Projects?userId=" + user.sub)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Http error " + response.status);
        }
        return response.json();
      })
      .then((projects) => {
        projects = projects[0].map((project) => {
          return {
            ...project,
            createdBy: project.users.find(
              (user) => user.id === project.creatorId
            ).nickName,
          };
        });
        this.setState({ projects });
      })
      .catch((e) => console.log(e));
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  onNewProjectButtonClick = () => {
    this.setState({
      isModalOpen: true,
    });
  };

  createNewProject = (name, type) => {
    const { user } = this.props.auth0;
    let url = "Project/Create?";
    url += new URLSearchParams({
      name,
      type,
      creatorId: user.sub,
    }).toString();
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Http error " + response.status);
        }
        return response.json();
      })
      .then((project) => {
        this.setState((prevState) => ({
          projects: [
            ...prevState.projects,
            {
              ...project,
              type: type,
              createdBy: user.nickname,
            },
          ],
        }));
      });
  };

  editProject = (projectId, name, type) => {
    let url = "Project/Edit?";
    url += new URLSearchParams({
      projectId,
      name,
      type,
    }).toString();
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Http error " + response.status);
        }
      })
      .then(() => {
        this.setState((prevState) => {
          let projectList = [...prevState.projects];
          let project = projectList.find(
            (project) => project.id === parseInt(projectId)
          );
          project.name = name;
          project.type = parseInt(type);
          return { projects: projectList };
        });
      });
  };

  deleteProject = (projectId) => {
    fetch("Project/Delete?projectId=" + projectId)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Http error " + response.status);
        }
      })
      .then(() => {
        this.setState((prevState) => {
          let projectList = [...prevState.projects];
          for (let i = 0; i < projectList.length; i++) {
            if (projectList[i].id === projectId) {
              projectList.splice(i, 1);
            }
          }
          return { projects: projectList };
        });
      });
  };

  render() {
    return (
      <Container>
        <Jumbotron>
          <h2>Projects</h2>
          <div>
            <Button variant="primary" onClick={this.onNewProjectButtonClick}>
              new project
            </Button>{" "}
          </div>
          <ProjectTable
            projects={this.state.projects}
            editProject={this.editProject}
            deleteProject={this.deleteProject}
          />
          <ProjectModal
            modalType={constants.MODAL_TYPE_CREATE}
            show={this.state.isModalOpen}
            closeModal={this.closeModal}
            createNewProject={this.createNewProject}
          />
        </Jumbotron>
      </Container>
    );
  }
}

export default withAuthenticationRequired(withAuth0(Dashboard), {
  onRedirecting: () => <div>Redirecting to login page...</div>,
});
