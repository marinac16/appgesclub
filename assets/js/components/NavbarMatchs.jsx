import React, {useContext} from 'react';
import {Link} from "react-router-dom";

const NavbarMatchs = (id) => {
  return (<>

    <nav className="nav nav-tabs  flex-column flex-sm-row mt-3 mb-3">

      <Link to={"/weekend/domicile/" + id} className="navlink-custom"><i className="fas fa-map-marker"/>  Matchs à domicile</Link>
      <Link to={"/weekend/exterieur/" + id} className="navlink-custom"><i className="fas fa-location-arrow"/>  Matchs à l'extérieur</Link>

    </nav>

  </>);
};
export default NavbarMatchs;



