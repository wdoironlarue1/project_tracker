import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TaskCard from "./TaskCard";
import PropTypes from "prop-types";
import * as constants from "../constants";

export default class Tracker extends Component {
  static propTypes = {
    onMoveTask: PropTypes.func,
    toDoList: PropTypes.array,
    inProgressList: PropTypes.array,
    doneList: PropTypes.array,
    deleteIssue: PropTypes.func,
    editItem: PropTypes.func,
  };

  onDrop = (ev, newStage) => {
    this.props.onMoveTask(newStage, ev.dataTransfer.getData("id"));
  };

  onDragOver = (e) => {
    e.preventDefault();
  };

  render() {
    return (
      <Container>
        <Row>
          <Col
            className={"trackerCol"}
            onDragOver={this.onDragOver}
            onDrop={(e) => {
              this.onDrop(e, constants.ISSUE_STAGE_TO_DO);
            }}
          >
            To Do
            {this.props.toDoList.map((item, index) => (
              <TaskCard
                issueType={item.issueType}
                summary={item.summary}
                description={item.description}
                key={index}
                editItem={this.props.editItem}
                issueStage={item.issueStage}
                id={item.id}
                deleteIssue={this.props.deleteIssue}
              />
            ))}
          </Col>
          <Col
            className={"trackerCol"}
            onDragOver={this.onDragOver}
            onDrop={(e) => {
              this.onDrop(e, constants.ISSUE_STAGE_IN_PROGRESS);
            }}
          >
            In Progress
            {this.props.inProgressList.map((item, index) => (
              <TaskCard
                issueType={item.issueType}
                summary={item.summary}
                description={item.description}
                key={index}
                editItem={this.props.editItem}
                issueStage={item.issueStage}
                id={item.id}
                deleteIssue={this.props.deleteIssue}
              />
            ))}
          </Col>
          <Col
            className={"trackerCol"}
            onDragOver={this.onDragOver}
            onDrop={(e) => {
              this.onDrop(e, constants.ISSUE_STAGE_DONE);
            }}
          >
            Done
            {this.props.doneList.map((item, index) => (
              <TaskCard
                issueType={item.issueType}
                summary={item.summary}
                description={item.description}
                key={index}
                editItem={this.props.editItem}
                issueStage={item.issueStage}
                id={item.id}
                deleteIssue={this.props.deleteIssue}
              />
            ))}
          </Col>
        </Row>
      </Container>
    );
  }
}
