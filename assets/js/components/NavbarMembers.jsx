import React from 'react';
import {Link} from "react-router-dom";
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import Grid from "@material-ui/core/Grid";

const NavbarMembers = (props) => {


  return (<>


    <Grid container direction="row" justify="flex-start" alignItems="center">
      <div className="border-link">
        <Link to="/members" className="link-custom">
          <PersonIcon/>
          Membres
        </Link>
      </div>
      <div className="border-link">
        <Link to="/teams" className="link-custom">
          <GroupIcon/>
          Équipes
        </Link>
      </div>
      <div className="border-link">
        <Link to="/coachs" className="link-custom">
          <PersonIcon/>
          Coachs
        </Link>
      </div>
      <div className="border-link">
        <Link to="/dirigeants" className="link-custom">
          <PersonIcon/>
          Dirigeants
        </Link>
      </div>
      <div className="border-link">
        <Link to="/groupes" className="link-custom">
          <GroupIcon/>>
          Groupes
        </Link>
      </div>
      <div className="border-link">
        <Link to="#" className="link-custom">
          <BubbleChartIcon/>
          Statistiques
        </Link>
      </div>
    </Grid>

  </>);
};
export default NavbarMembers;



