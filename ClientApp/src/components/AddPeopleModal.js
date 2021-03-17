import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import AsyncDropdown from "./AsyncDropdown";

export default class AddPeopleModal extends Component {
  static propTypes = {
    showModal: PropTypes.bool,
    currentUsers: PropTypes.array,
    closeModal: PropTypes.func,
    creatorId: PropTypes.number,
    projectId: PropTypes.number,
    removeUser: PropTypes.func,
  };

  state = {
    usersToAdd: [],
  };

  onClickRemoveUser = (userId) => {
    fetch(`User/Remove?projectId=${this.props.projectId}&userId=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Http error " + response.status);
        }
        response.json();
      })
      .then((data) => {
        this.props.removeUser(userId);
      });
  };

  onClickCancelAddUser = (userId) => {
    this.setState((prevState) => {
      let tempList = [...prevState.usersToAdd];
      for (let i = 0; i < tempList.length; i++) {
        if (tempList[i].id === userId) {
          tempList.splice(i, 1);
        }
      }
      return { usersToAdd: tempList };
    });
  };

  onClickDropdownOption = (option) => {
    this.setState((prevState) => ({
      usersToAdd: [
        ...prevState.usersToAdd,
        { id: option.id, email: option.email, nickName: option.nickName },
      ],
    }));
  };

  onClickAdd = () => {
    const commaSeparatedIds = this.state.usersToAdd.reduce(
      (accumulator, currentVal) => ({
        id: accumulator.id + "," + currentVal.id,
      })
    ).id;
    fetch(
      "User/Add?projectId=" +
        this.props.projectId +
        "&userIdsString=" +
        commaSeparatedIds
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Http error " + response.status);
        }
        response.json();
      })
      .then((data) => {
        this.props.closeModal();
      });
  };

  createUserCards = () => {
    let currentUsers = this.props.currentUsers.map((user) => {
      return (
        <Card key={user.id}>
          <Card.Body>
            {user.nickName}
            <div className="float-right">
              {user.id === this.props.creatorId ? (
                "(project owner)"
              ) : (
                <Button
                  onClick={() => this.onClickRemoveUser(user.id)}
                  className="float-right"
                  variant="danger"
                >
                  Remove
                </Button>
              )}
            </div>
          </Card.Body>
        </Card>
      );
    });

    let usersToAdd = this.state.usersToAdd.map((user) => {
      return (
        <Card key={user.id}>
          <Card.Body>
            {user.nickName}{" "}
            <Button
              onClick={() => this.onClickCancelAddUser(user.id)}
              className="float-right"
              variant="danger"
            >
              X
            </Button>
          </Card.Body>
        </Card>
      );
    });

    return currentUsers.concat(usersToAdd);
  };

  onCloseModal = () => {
    this.setState({
      usersToAdd: []
    })
    this.props.closeModal();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.onCloseModal}>
        <Container>
          <p>Add People</p>
          <AsyncDropdown
            currentUsers={this.props.currentUsers.concat(this.state.usersToAdd)}
            onClickOption={this.onClickDropdownOption}
            returnNumber={10}
          />
        </Container>
        <Container>people{this.createUserCards()}</Container>
        <Container>
          <Button variant="primary" onClick={this.onClickAdd}>
            Add
          </Button>
        </Container>
      </Modal>
    );
  }
}
