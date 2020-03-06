import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.scss';

export default class Sidebar extends React.Component {
  render = () => {
    return (
      <div className="sidebar">
        <Link className="button" to="/home">Home</Link>
        <Link className="button" to="/reports">Reports</Link>
      </div>
    );
  }
}
