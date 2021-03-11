import React, { Component } from "react";
import PropTypes from "prop-types";

export default class AsyncDropdown extends Component {
  static propTypes = {
    returnNumber: PropTypes.number,
  };

  state = {
    options: [],
    isLoading: false,
    focused: false,
  };

  onClickOption = (id) => {
    // console.log(id);
  };

  search = (e) => {
    fetch(
      "User/UsersLike?searchString=" +
        e.target.value +
        "&returnNumber=" +
        this.props.returnNumber
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ options: data });
      });
  };

  getOptionsFromState = () => {
    return this.state.options.map((option) => (
      <div className="async-dropdown-option" key={option.Id} onClick={() => this.onClickOption(option.Id)}>
        {option.NickName}
      </div>
    ));
  };

  onClickAway = () => {
    this.setState({ focused: false });
  };

  onClickIn = () => {
    this.setState({ focused: true });
  };

  render() {
    return (
      <div className="async-dropdown">
        <div
          id="myDropdown"
          className="dropdown-content"
          onBlur={this.onClickAway}
          onFocus={this.onClickIn}
          tabIndex="1"
        >
          <input
            type="text"
            placeholder="Search.."
            id="myInput"
            onKeyUp={this.search}
          />

          {this.state.focused && (
            <div className="async-dropdown-options">
              {this.getOptionsFromState()}{" "}
            </div>
          )}
        </div>
      </div>
    );
  }
}
