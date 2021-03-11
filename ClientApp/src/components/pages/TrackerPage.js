import React, { Component } from "react";
import Tracker from "../Tracker";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import IssueModal from "../IssueModal";
import * as constants from "../../constants";
import { withAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import AddPeopleModal from "../AddPeopleModal";

const PROJECT_ID = parseInt(
  new URL(window.location.href).searchParams.get("projectId")
);

class TrackerPage extends Component {
  state = {
    isIssueModalOpen: false,
    isPeopleModalOpen: false,
    issues: [],
    users: []
  };

  componentDidMount = () => {
    const { user } = this.props.auth0;
    // this should hit the project controller and return a project 
    fetch("Project/Project?userId=" + user.sub + "&projectId=" + PROJECT_ID)
      .then((response) => response.json())
      .then((project) => {
        console.log(project)
        let issues = project.Issues.map((issue) => ({
            id: issue.Id,
            issueType: issue.IssueType,
            issueStage: issue.IssueStage,
            summary: issue.Summary,
            description: issue.Description,
            createdBy: issue.CreatedBy,
            dateCreated: issue.DateCreated,
        }));
        let users = project.Users.map((user) => ({
          id: user.Id,
          email: user.Email,
          nickName: user.NickName
        }))
        this.setState({ issues, users });
      })
      .catch((e) => console.log(e));
  };

  createNewItem = (issueType, summary, description) => {
    const { user } = this.props.auth0;
    let url = "Issue/Create?";
    url += new URLSearchParams({
      issueType,
      summary,
      createdBy: user.sub,
      projectId: PROJECT_ID
    }).toString();
    url += description ? "&description=" + description : "";

    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        this.setState((prevstate) => ({
          issues: [
            ...prevstate.issues,
            {
              id: parseInt(data),
              issueType,
              summary,
              description,
              issueStage: constants.ISSUE_STAGE_TO_DO,
            },
          ],
        }));
      });
  };

  editItem = (id, issueType, summary, description, issueStage) => {
    let url = "Issue/Edit?";
    url += new URLSearchParams({
      id,
      issueType,
      issueStage,
      summary,
      description,
    }).toString();

    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        this.setState((prevState) => {
          let tempList = [...prevState.issues];
          let issue = tempList.find((issue) => issue.id === parseInt(id));
          issue.issueType = parseInt(issueType);
          issue.summary = summary;
          issue.description = description;
          issue.issueStage = parseInt(issueStage);
          return { issues: tempList };
        });
      });
  };

  onMoveIssue = (newStage, issueId) => {
    fetch("Issue/Move?id=" + issueId + "&issueStage=" + newStage)
      .then((response) => response.text())
      .then((data) => {
        this.setState((prevState) => {
          let tempList = [...prevState.issues];
          let issue = tempList.find((issue) => issue.id === parseInt(issueId));
          issue.issueStage = newStage;
          return { issues: tempList };
        });
      });

    this.setState((prevState) => {
      let tempList = [...prevState.issues];
      let issue = tempList.find((issue) => issue.id === parseInt(issueId));
      issue.issueStage = newStage;
      return { issues: tempList };
    });
  };

  deleteIssue = (issueId) => {
    fetch("Issue/Delete?id=" + issueId)
      .then((response) => response.json())
      .then((data) => {
        //check if the delete was succesful first
        this.setState((prevState) => {
          let tempList = [...prevState.issues];
          for (let i = 0; i < tempList.length; i++) {
            if (tempList[i].id === issueId) {
              tempList.splice(i, 1);
            }
          }
          return { issues: tempList };
        });
      });
  };

  changePeopleModalState = (bool) => {
    this.setState({isPeopleModalOpen: bool})
  }

  changeIssueModalState = (bool) => {
    this.setState({isIssueModalOpen: bool})
  }

  render() {
    let toDoList = [],
      inProgressList = [],
      doneList = [];
    for (let i = 0; i < this.state.issues.length; i++) {
      switch (this.state.issues[i].issueStage) {
        case constants.ISSUE_STAGE_TO_DO:
          toDoList.push(this.state.issues[i]);
          break;
        case constants.ISSUE_STAGE_IN_PROGRESS:
          inProgressList.push(this.state.issues[i]);
          break;
        case constants.ISSUE_STAGE_DONE:
          doneList.push(this.state.issues[i]);
          break;
        default:
          toDoList.push(this.state.issues[i]);
          break;
      }
    }

    return (
      <div>
        <Container>
          <Button variant="primary" onClick={() => this.changeIssueModalState(true)}>
            create
          </Button>{" "}
          <Button onClick={() => this.changePeopleModalState(true)}>add people</Button>
        </Container>
        <Tracker
          onMoveTask={this.onMoveIssue}
          toDoList={toDoList}
          inProgressList={inProgressList}
          doneList={doneList}
          editItem={this.editItem}
          deleteIssue={this.deleteIssue}
        />
        <IssueModal
          show={this.state.isIssueModalOpen}
          closeModal={() => this.changeIssueModalState(false)}
          createNewItem={this.createNewItem}
          modalType={constants.MODAL_TYPE_CREATE}
        />
        <AddPeopleModal
          show={this.state.isPeopleModalOpen}
          currentUsers={this.state.users}
          closeModal={() => this.changePeopleModalState(false)}
        />
      </div>
    );
  }
}

export default withAuthenticationRequired(withAuth0(TrackerPage), {
  onRedirecting: () => <div>Redirecting to login page...</div>,
});
