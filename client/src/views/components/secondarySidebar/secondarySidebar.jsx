import React from "react";
import { NavLink } from "react-router-dom";
import "./secondarySidebar.scss";
import PropTypes from "prop-types";

export default class SecondarySidebar extends React.Component {
  render = () => {
    return (
      <aside className="secondary-sidebar">
        <div className="content">
          <div className="header">{this.props.header}</div>
          {this.props.entries.map((entry) => {
            return (
              <NavLink key={entry.id} className="item" activeClassName="active" to={entry.link}>{entry.label}</NavLink>
            );
          })}
        </div>
      </aside>
    );
  }
}

SecondarySidebar.propTypes = {
  header: PropTypes.string,
  entries: PropTypes.array,
};
