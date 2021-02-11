import React, { Component } from "react";
import Tracker from "./Tracker";
import { Container, Button } from "react-bootstrap";
import IssueModal from "./IssueModal";
import * as constants from "../constants";

export default class ProjectTrackerPage extends Component {
  state = {
    isModalOpen: false,
    //should maybe just have one list of all the issues
    issueList: [],
  };

  componentDidMount = () => {
    fetch("ProjectTracker/Issues")
      .then((response) => response.json())
      .then((data) => {
        data = data.map((issue) => {
          return {
            id: issue.Id,
            issueType: issue.IssueType,
            issueStage: issue.IssueStage,
            summary: issue.Summary,
            description: issue.Description,
            createdBy: issue.CreatedBy,
            dateCreated: issue.DateCreated,
          };
        });
        this.setState({ issueList: data });
      });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  onCreateButtonClick = () => {
    this.setState({ isModalOpen: true });
  };

  createNewItem = (issueType, summary, description) => {
    let url = "ProjectTracker/CreateNewIssue?";
    url += new URLSearchParams({ issueType, summary }).toString();
    url += description ? "&description=" + description : "";

    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        console.log(data)
        // this should return the id of the newly created issue and use it when updating the list
        this.setState((prevstate) => ({
          issueList: [
            ...prevstate.issueList,
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
    let url = "ProjectTracker/Edit?";
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
          let tempList = [...prevState.issueList];
          let issue = tempList.find((issue) => issue.id === parseInt(id));
          issue.issueType = parseInt(issueType);
          issue.summary = summary;
          issue.description = description;
          issue.issueStage = parseInt(issueStage);
          return { issueList: tempList };
        });
      });
  };

  onMoveIssue = (newStage, issueId) => {
    fetch("ProjectTracker/Move?id=" + issueId + "&issueStage=" + newStage)
      .then((response) => response.text())
      .then((data) => {
        this.setState((prevState) => {
          let tempList = [...prevState.issueList];
          let issue = tempList.find((issue) => issue.id === parseInt(issueId));
          issue.issueStage = newStage;
          return { issueList: tempList };
        });
      });

    this.setState((prevState) => {
      let tempList = [...prevState.issueList];
      let issue = tempList.find((issue) => issue.id === parseInt(issueId));
      issue.issueStage = newStage;
      return { issueList: tempList };
    });
  };

  deleteIssue = (issueId) => {
    fetch("ProjectTracker/Delete?id=" + issueId)
      .then((response) => response.json())
      .then((data) => {
        //check if the delete was succesful first
        this.setState((prevState) => {
          let tempList = [...prevState.issueList];
          for (let i = 0; i < tempList.length; i++) {
            if (tempList[i].id === issueId) {
              tempList.splice(i, 1);
            }
          }
          return { issueList: tempList };
        });
      });
  };

  render() {
    let toDoList = [],
      inProgressList = [],
      doneList = [];
    for (let i = 0; i < this.state.issueList.length; i++) {
      switch (this.state.issueList[i].issueStage) {
        case constants.ISSUE_STAGE_TO_DO:
          toDoList.push(this.state.issueList[i]);
          break;
        case constants.ISSUE_STAGE_IN_PROGRESS:
          inProgressList.push(this.state.issueList[i]);
          break;
        case constants.ISSUE_STAGE_DONE:
          doneList.push(this.state.issueList[i]);
          break;
        default:
          toDoList.push(this.state.issueList[i]);
          break;
      }
    }

    return (
      <div>
        <Container>
          <Button variant="primary" onClick={this.onCreateButtonClick}>
            create
          </Button>{" "}
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
          show={this.state.isModalOpen}
          closeModal={this.closeModal}
          createNewItem={this.createNewItem}
          modalType={constants.MODAL_TYPE_CREATE}
        />
      </div>
    );
  }
}
