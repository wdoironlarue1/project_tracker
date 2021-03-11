import React from "react";
import PropTypes from "prop-types";
import Table from "react-bootstrap/Table";
import { NavLink } from "react-router-dom";

const ProjectTable = ({ projects }) => {
  let rows = projects.map((project, index) => (
    <tr key={index}>
      <td><NavLink to={`/tracker?projectId=${project.id}`}>{project.name}</NavLink></td>
      <td>{project.type}</td>
      <td>{project.createdBy}</td>
    </tr>
  ));

  return (
    <div>
      Projects
      <div className="project-table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </div>
    </div>
  );
};

ProjectTable.propTypes = {
  projects: PropTypes.array,
};

export default ProjectTable;
