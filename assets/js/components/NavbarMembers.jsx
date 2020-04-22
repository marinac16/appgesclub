import React, {useContext} from 'react';
import {Link} from "react-router-dom";

const NavbarMembers = (props) => {
  return (<>

    <nav className="nav nav-tabs  flex-column flex-sm-row mt-3 mb-3">

      <Link to="/members" className="navlink-custom">Membres</Link>
      <Link to="/teams" className="navlink-custom">Équipes</Link>
      <a className="navlink-custom" href="#">Coach</a>
      <a className="navlink-custom" href="#">Dirigeant</a>
      <a className="navlink-custom" href="#">Statistiques</a>

    </nav>

  </>);
};
export default NavbarMembers;



