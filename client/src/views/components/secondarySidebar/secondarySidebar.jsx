import React from "react";
import { NavLink } from "react-router-dom";
import "./secondarySidebar.scss";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";


export default class SecondarySidebar extends React.Component {
  constructor(props){
    super(props);
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    selectedItem: PropTypes.number.isRequired,
  }

  static defaultProps = {
    history: null,
  }

  componentDidMount(){
    this.props.history.push(this.props.entries[this.props.selectedItem].link);
  }


  render = () => {
    return (
      <aside className="secondary-sidebar">
        <div className="content">
          <div className="header">{this.props.header}</div>
          {this.props.entries.map((entry, entryIndex) => {
            return (
              <NavLink
                key={entryIndex}
                className="item"
                activeClassName="active"
                to={entry.link}
                onClick={() => {
                  this.props.onChange(entryIndex);
                }}
              >{entry.label}</NavLink>
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
