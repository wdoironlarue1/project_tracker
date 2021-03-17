import React, { Component } from "react";
import PropTypes from "prop-types";

export default class AsyncDropdown extends Component {
  static propTypes = {
    returnNumber: PropTypes.number,
    onClickOption: PropTypes.func,
    currentUsers: PropTypes.array,
  };

  state = {
    options: [],
    isLoading: false,
    focused: false,
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
        data = data.map((user) => ({
          email: user.Email,
          id: user.Id,
          nickName: user.NickName,
        }));
        this.setState({ options: data });
      });
  };

  onClickOption = (option) => {
    this.props.onClickOption(option);
  };

  getOptionsFromState = () => {
    return this.state.options.map((option) => {
      let isInProject = false;
      for (let i = 0; i < this.props.currentUsers.length; i++) {
        if (option.id === this.props.currentUsers[i].id) {
          isInProject = true;
          break;
        }
      }

      return (
        <div
          className="async-dropdown-option"
          key={option.id}
          onMouseDown={
            !isInProject ? () => this.onClickOption(option) : () => {}
          }
        >
          {option.nickName}
        </div>
      );
    });
  };

  onClickAway = () => {
    this.setState({ focused: false });
  };

  onClickIn = () => {
    this.setState({ focused: true });
  };

  render() {
    return (
      <div
        className="async-dropdown"
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
    );
  }
}
