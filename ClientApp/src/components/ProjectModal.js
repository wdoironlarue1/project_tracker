import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import * as constants from "../constants";
import Col from "react-bootstrap/Col";

export default class ProjectModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    closeModal: PropTypes.func,
    createNewProject: PropTypes.func,
  };

  state = {
    validated: false,
    projectType: constants.PROJECT_TYPE_SCRUM,
    name: "",
  };

  onChangeFormItem = ({ target: { value } }, stateKey) => {
    this.setState({ [stateKey]: value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      this.setState({ validated: true });
    } else {
      this.props.createNewProject(this.state.name, this.state.projectType);
      this.onCloseModal();
    }
  };

  onCloseModal = () => {
    this.setState({
      projectType: constants.PROJECT_TYPE_SCRUM,
      name: "",
      validated: false,
    });

    this.props.closeModal();
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={this.onCloseModal}>
        <Container>
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.onSubmit}
          >
            <p>Create Project</p>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={(e) => this.onChangeFormItem(e, "name")}
                style={{ backgroundImage: "none" }}
                value={this.state.name}
              />
              <Form.Control.Feedback type="invalid">
                please enter a name for the project
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="projectType">
              <Form.Label>Project Type</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => this.onChangeFormItem(e, "projectType")}
                style={{ backgroundImage: "none" }}
                value={this.state.issueType}
              >
                <option value={constants.PROJECT_TYPE_SCRUM}>Scrum</option>
                <option value={constants.PROJECT_TYPE_KANBAN} disabled>
                  Kanban
                </option>
                <option value={constants.PROJECT_TYPE_BUG_TRACKING} disabled>
                  Bug Tracking
                </option>
              </Form.Control>
            </Form.Group>

            <Form.Row>
              <Col>
                <Button variant="primary" type="submit">
                  Create
                </Button>
                <Button variant="link" onClick={this.onCloseModal}>
                  {" "}
                  Cancel
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Container>
      </Modal>
    );
  }
}
