import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import * as constants from "../constants";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default class ProjectModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    closeModal: PropTypes.func,
    createNewProject: PropTypes.func,
    editProject: PropTypes.func,
    deleteProject: PropTypes.func,
    modalType: PropTypes.string,
    project: PropTypes.object,
  };

  state = {
    validated: false,
    projectType:
      this.props.modalType === constants.MODAL_TYPE_CREATE
        ? constants.PROJECT_TYPE_SCRUM
        : this.props.project.type,
    name:
      this.props.modalType === constants.MODAL_TYPE_CREATE
        ? ""
        : this.props.project.name,
        showConfirmDeleteModal: false
  };

  onChangeFormItem = ({ target: { value } }, stateKey) => {
    this.setState({ [stateKey]: value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      this.setState({ validated: true });
    } else if(this.props.modalType === constants.MODAL_TYPE_CREATE) {
      this.props.createNewProject(this.state.name, this.state.projectType);
      this.onCloseModal();
    } else {
      this.props.editProject(this.props.project.id, this.state.name, this.state.projectType);
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

  onClickDelete = () => {
    this.setState({ showConfirmDeleteModal: true });
  };

  onConfirmDelete = () => {
    this.props.deleteProject(this.props.project.id);
    this.setState({ showConfirmDeleteModal: false });
    this.onCloseModal();
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
            <p>
              {this.props.modalType === constants.MODAL_TYPE_CREATE
                ? "Create Project"
                : "Edit Project"}
            </p>
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
            <Button variant="primary" type="submit">
              {this.props.modalType === constants.MODAL_TYPE_CREATE
                ? "Create"
                : "Save Changes"}
            </Button>
            <Button variant="link" onClick={this.onCloseModal}>
              {" "}
              Cancel
            </Button>
            {this.props.modalType === constants.MODAL_TYPE_EDIT && (
              <Button variant="danger" className="float-right" onClick={this.onClickDelete}>
                Delete
              </Button>
            )}
          </Form>
        </Container>
        <Modal
          size="sm"
          show={this.state.showConfirmDeleteModal}
          onHide={() => this.setState({ showConfirmDeleteModal: false })}
        >
          <Modal.Header>
            <Modal.Title>Delete this project and all the issues related to it?</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col>
                <Button variant="danger" onClick={this.onConfirmDelete}>
                  Delete
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={() =>
                    this.setState({ showConfirmDeleteModal: false })
                  }
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </Modal>
    );
  }
}
