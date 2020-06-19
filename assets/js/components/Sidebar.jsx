import React, {useContext} from 'react';
import AuthAPI from "../services/authAPI";
import {Link, NavLink} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import EventNoteIcon from '@material-ui/icons/EventNote';

const Sidebar = ({history}) => {

  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);


  return (
    <>
      <div className="position-fixed div-sidebar">
        <ul className="list-group ul-sidebar">
          <li className="list-group-item bg-blue li-sidebar text-center">
            <Link to="/dashboard" className="link-sidebar"><DashboardIcon/></Link>
          </li>
          <li className="list-group-item bg-blue li-sidebar text-center">
            <Link to="/members" className="link-sidebar"><PeopleAltIcon/></Link>
          </li>
          <li className="list-group-item bg-blue li-sidebar text-center">
            <Link to="/weekends" className="link-sidebar"><EventNoteIcon/></Link>
          </li>
        </ul>
        <ul>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
