import React, {useContext} from 'react';
import {Link} from "react-router-dom";

const NavbarMembers = (props) => {
  return (<>

    <nav className="nav nav-tabs  flex-column flex-sm-row mt-3 mb-3">

      <Link to="/members" className="navlink-custom"><i className="fas fa-user"/>  Membres</Link>
      <Link to="/teams" className="navlink-custom"><i className="fas fa-users"/>  Équipes</Link>
      <Link to="/coachs" className="navlink-custom"><i className="fas fa-user-tie"/> Coachs</Link>
      <Link to="/dirigeants" className="navlink-custom"><i className="fas fa-user-tie"/> Dirigeants</Link>
      <Link to="/groupes" className="navlink-custom"><i className="fas fa-user-friends"/> Groupes</Link>
      <p className="navlink-custom"><i className="fas fa-chart-pie"/> Statistiques</p>

    </nav>

  </>);
};
export default NavbarMembers;



