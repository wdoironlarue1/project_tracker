import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import PropTypes from "prop-types";
import IssueModal from "./IssueModal";
import { MODAL_TYPE_EDIT } from "../constants";

export default class TaskCard extends Component {
  static propTypes = {
    //could just make a lot of these come from one object
    issueType: PropTypes.number,
    summary: PropTypes.string,
    description: PropTypes.string,
    issueStage: PropTypes.number,
    editItem: PropTypes.func,
    id: PropTypes.number,
    deleteIssue: PropTypes.func
  };

  state = {
    showModal: false,
  };

  showModal = () => {
    this.setState({ showModal: true });
  };

  onDragStart = (ev, id) => {
    //sets the id of the dragged item
    ev.dataTransfer.setData("id", id);
  };

  onClick = () => {
    if (!this.state.showModal) {
      this.showModal();
    }
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    return (
      //maybe create a unique key for each issue in a project in the future(should be handled when moved to db)
      <div
        draggable
        onDragStart={(e) => {
          this.onDragStart(e, this.props.id);
        }}
        onClick={this.onClick}
      >
        <Card>
          <Card.Body>{this.props.summary}</Card.Body>
        </Card>
        <IssueModal
          show={this.state.showModal}
          closeModal={this.closeModal}
          editItem={this.props.editItem}
          modalType={MODAL_TYPE_EDIT}
          issueType={this.props.issueType}
          summary={this.props.summary}
          description={this.props.description}
          issueStage={this.props.issueStage}
          id={this.props.id}
          deleteIssue={this.props.deleteIssue}
        />
      </div>
    );
  }
}
