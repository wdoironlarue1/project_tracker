import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/Card";
import AsyncDropdown from "./AsyncDropdown";

// want this to show people who are already added
// select users from a search dropdown
export default class AddPeopleModal extends Component {
  static propTypes = {
    showModal: PropTypes.bool,
    currentUsers: PropTypes.array,
    closeModal: PropTypes.func,
  };

  state = {
    usersToAdd: [],
    usersToRemove: [],
  };

  createUserCards = () => {
    return this.props.currentUsers.map((user) => {
      return (
        <Card>
          <Card.Body>{user.nickName}</Card.Body>
        </Card>
      );
    });
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeModal}>
        <Container>
          <AsyncDropdown returnNumber={10}/>
        </Container>
        <Container>people{this.createUserCards()}</Container>
      </Modal>
    );
  }
}
