import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import * as constants from "../constants";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default class IssueModal extends Component {
  static propTypes = {
    show: PropTypes.bool,
    closeModal: PropTypes.func,
    createNewItem: PropTypes.func,
    editItem: PropTypes.func,
    issueType: PropTypes.number,
    summary: PropTypes.string,
    description: PropTypes.string,
    issueStage: PropTypes.number,
    modalType: PropTypes.string,
    id: PropTypes.number,
    deleteIssue: PropTypes.func,
  };

  state = {
    issueType:
      this.props.modalType === constants.MODAL_TYPE_CREATE
        ? constants.ISSUE_TYPE_TASK
        : this.props.issueType,
    summary:
      this.props.modalType === constants.MODAL_TYPE_CREATE
        ? ""
        : this.props.summary,
    description:
      this.props.closeModalmodalType === constants.MODAL_TYPE_CREATE
        ? ""
        : this.props.description,
    issueStage:
      this.props.closeModalmodalType === constants.MODAL_TYPE_CREATE
        ? ""
        : this.props.issueStage,
    validated: false,
    showConfirmDeleteModal: false,
  };

  onChangeFormItem = ({ target: { value } }, stateKey) => {
    this.setState({ [stateKey]: value });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      this.setState({ validated: true });
    } else if (this.props.modalType === constants.MODAL_TYPE_CREATE) {
      this.props.createNewItem(
        this.state.issueType,
        this.state.summary,
        this.state.description
      );
      this.onCloseModal();
    } else {
      this.props.editItem(
        this.props.id,
        this.state.issueType,
        this.state.summary,
        this.state.description,
        this.state.issueStage
      );
      this.setState({
        issueType: this.state.issueType,
        summary: this.state.summary,
        description: this.state.description,
        issueStage: this.state.issueStage,
        validated: false,
      });
      this.props.closeModal();
    }
  };

  onCloseModal = () => {
    if (this.props.modalType === constants.MODAL_TYPE_CREATE) {
      this.setState({
        issueType: constants.ISSUE_TYPE_TASK,
        summary: "",
        description: "",
        validated: false,
      });
    } else {
      this.setState({
        issueType: this.props.issueType,
        summary: this.props.summary,
        description: this.props.description,
        validated: false,
      });
    }
    this.props.closeModal();
  };

  onClickDelete = () => {
    this.setState({ showConfirmDeleteModal: true });
  };

  onConfirmDelete = () => {
    this.props.deleteIssue(this.props.id);
    this.setState({ showConfirmDeleteModal: false });
    this.onCloseModal();
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={this.onCloseModal} size="lg">
        <Container>
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.onSubmit}
          >
            <p>
              {this.props.modalType === constants.MODAL_TYPE_CREATE
                ? "Create Issue"
                : "Edit Issue"}
            </p>
            <Form.Row>
              <Form.Group as={Col} controlId="issueType">
                <Form.Label>Issue Type</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => this.onChangeFormItem(e, "issueType")}
                  style={{ backgroundImage: "none" }}
                  value={this.state.issueType}
                >
                  <option value={constants.ISSUE_TYPE_TASK}>Task</option>
                  <option value={constants.ISSUE_TYPE_BUG}>Bug</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="issueType">
                {this.props.modalType === constants.MODAL_TYPE_EDIT && (
                  <div>
                    <Form.Label>Issue Stage</Form.Label>
                    <Form.Control
                      as="select"
                      onChange={(e) => this.onChangeFormItem(e, "issueStage")}
                      style={{ backgroundImage: "none" }}
                      value={this.state.issueStage}
                    >
                      <option value={constants.ISSUE_STAGE_TO_DO}>To Do</option>
                      <option value={constants.ISSUE_STAGE_IN_PROGRESS}>
                        In Progress
                      </option>
                      <option value={constants.ISSUE_STAGE_DONE}>Done</option>
                    </Form.Control>
                  </div>
                )}
              </Form.Group>
            </Form.Row>
            <Form.Group controlId="summary">
              <Form.Label>Summary</Form.Label>
              <Form.Control
                required
                type="text"
                onChange={(e) => this.onChangeFormItem(e, "summary")}
                style={{ backgroundImage: "none" }}
                value={this.state.summary}
              />
              <Form.Control.Feedback type="invalid">
                a summary of the issue is required
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                onChange={(e) => this.onChangeFormItem(e, "description")}
                style={{ backgroundImage: "none", height: "150px" }}
                value={this.state.description ?? ""}
              />
            </Form.Group>
            <Form.Row>
              <Col>
                <Button variant="primary" type="submit">
                  {this.props.modalType === constants.MODAL_TYPE_CREATE
                    ? "Create"
                    : "Save"}
                </Button>
                <Button variant="link" onClick={this.onCloseModal}>
                  {" "}
                  Cancel
                </Button>
              </Col>
              {this.props.modalType === constants.MODAL_TYPE_EDIT && (
                <Col md={{ span: 2, offset: 3 }}>
                  <Button variant="danger" onClick={this.onClickDelete}>
                    Delete
                  </Button>
                </Col>
              )}
            </Form.Row>
          </Form>
        </Container>

        {/* maybe make a component for this modal */}
        <Modal
          size="sm"
          show={this.state.showConfirmDeleteModal}
          onHide={() => this.setState({ showConfirmDeleteModal: false })}
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header>
            <Modal.Title id="example-modal-sizes-title-sm">
              Delete this issue?
            </Modal.Title>
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
