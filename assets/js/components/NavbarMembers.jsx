import React, {useContext} from 'react';
import {Link} from "react-router-dom";

const NavbarMembers = (props) => {
  return (<>

    <nav className="nav nav-tabs  flex-column flex-sm-row mt-3 mb-3">

      <Link to="/members" className="navlink-custom"><i className="fas fa-user"/>  Membres</Link>
      <Link to="/teams" className="navlink-custom"><i className="fas fa-users"/>  Équipes</Link>
      <a className="navlink-custom" href="#"><i className="fas fa-user-tie"/> Coachs</a>
      <a className="navlink-custom" href="#"> <i className="fas fa-user-tie"/> Dirigeants</a>
      <a className="navlink-custom" href="#"><i className="fas fa-chart-pie"/> Statistiques</a>

    </nav>

  </>);
};
export default NavbarMembers;



