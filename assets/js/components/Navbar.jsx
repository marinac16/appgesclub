import React, {useContext} from 'react';
import AuthAPI from "../services/authAPI";
import {Link, NavLink} from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {toast} from "react-toastify";
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import Tooltip from "@material-ui/core/Tooltip";
import logo from '../../images/logo.png'

const Navbar = ({history}) => {

  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

  const handleLogout = () => {
    AuthAPI.logout();
    setIsAuthenticated(false);
    toast.info("Vous êtes désormais déconnecté, à bientôt !");
    history.push("/login")

  };

  return (


    <nav className="navbar fixed-top navbar-expand-lg bg-blue">
      <div className="navbar-brand text-white ml-3">
        <Link to="/dashboard">
          <img src={logo}
               alt="logo"
               width="11%"/>
        </Link>
      </div>


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
          )) || (<>
              <Tooltip title="Déconnexion">
                <li className="nav-items">
                  <NavLink onClick={handleLogout} to={'/login'}
                           className="nav-link text-white"><PowerSettingsNewIcon/></NavLink>
                </li>
              </Tooltip>
            </>
          )}
        </ul>
      </div>
    </nav>

  );
};

export default Navbar;
