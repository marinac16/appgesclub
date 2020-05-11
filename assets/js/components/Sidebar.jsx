import React, {useContext} from 'react';
import AuthAPI from "../services/authAPI";
import {Link, NavLink} from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Sidebar = ({history}) => {

  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);


  return (
    <>
      <div className="position-fixed div-sidebar">
        <ul className="list-group ul-sidebar">
          <li className="list-group-item bg-blue li-sidebar text-center">
            <Link to="/dashboard" className="link-sidebar"><i className="fas fa-2x fa-th-large"/></Link>
          </li>
          <li className="list-group-item bg-blue li-sidebar text-center">
            <Link to="/members" className="link-sidebar"><i className="fas fa-2x fa-user-friends"/></Link>
          </li>
          <li className="list-group-item bg-blue li-sidebar text-center">
            <Link to="/weekends" className="link-sidebar"><i className="fas fa-2x fa-calendar-week"/></Link>
          </li>
        </ul>
        <ul>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
