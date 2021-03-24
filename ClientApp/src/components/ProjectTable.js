import React, { useState } from "react";
import PropTypes from "prop-types";
import Table from "react-bootstrap/Table";
import { NavLink } from "react-router-dom";
import "./ProjectTable.scss";
import * as constants from "../constants";
import ProjectModal from "./ProjectModal";

const ProjectTable = ({ projects, editProject, deleteProject }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(0);

  let rows = projects.map((project, index) => (
    <tr key={index}>
      <td>
        <NavLink to={`/tracker?projectId=${project.id}`}>
          {project.name}
        </NavLink>
      </td>
      <td>{constants.PROJECT_TYPE_MAP[project.type]}</td>
      <td>{project.createdBy}</td>
      <td className="last-div">
        <div className="project-options-btn" onClick={() => setSelectedProjectId(project.id)}>
          ...
        </div>
      </td>
      <ProjectModal
        show={selectedProjectId === project.id}
        project={project}
        modalType={constants.MODAL_TYPE_EDIT}
        closeModal={() => setSelectedProjectId(0)}
        editProject={editProject}
        deleteProject={deleteProject}
      />
    </tr>
  ));

  return (
    <div>
      <div className="project-table-wrapper">
        <Table hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Created By</th>
              <th></th>
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
