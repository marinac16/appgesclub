import React, {useContext} from 'react';
import AuthAPI from "../services/authAPI";
import {Link, NavLink} from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = ({history}) => {

  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

  const handleLogout = () => {
    AuthAPI.logout();
    setIsAuthenticated(false);
    history.push("/login")

  };

  return (

    <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">App GESCLUB</Link>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor02"
              aria-controls="navbarColor02" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"/>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor02">


        <ul className="navbar-nav ml-auto">
          {(!isAuthenticated && (<>
              <li className="nav-items">
                <NavLink to="/register" className="btn btn-warning mr-2">Inscription</NavLink>
              </li>
              <li className="nav-items">
                <NavLink to="/login" className="btn btn-primary mr-2">Connexion</NavLink>
              </li>
            </>
          )) || (
            <li className="nav-items">
              <NavLink onClick={handleLogout} to={'/login'} className="nav-link" ><i className="fas fa-2x fa-sign-out-alt"/></NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;