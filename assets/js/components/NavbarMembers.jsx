import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import {blue, orange, amber} from "@material-ui/core/colors";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import Grid from "@material-ui/core/Grid";

const NavbarMembers = (props) => {

  const useStyles = makeStyles((theme) =>
    createStyles({
      root: {
        minWidth: 275,
      },
      link: {
        padding: theme.spacing(1),
        color: orange[500],
      },
      nav: {
        marginTop: theme.spacing(5),
      },
      chip: {
        backgroundColor: amber[700],
      }
    })
  );
  const classes = useStyles();

  return (<>


    <Grid container direction="row" justify="flex-start" alignItems="center">
      <div className="border-link">
        <Link to="/members" className="link-custom">
          <avatar><PersonIcon/></avatar>
          Membres
        </Link>
      </div>
      <div className="border-link">
        <Link to="/teams" className="link-custom">
          <avatar><GroupIcon/></avatar>
          Équipes
        </Link>
      </div>
      <div className="border-link">
        <Link to="/coachs" className="link-custom">
          <avatar><PersonIcon/></avatar>
          Coachs
        </Link>
      </div>
      <div className="border-link">
        <Link to="/dirigeants" className="link-custom">
          <avatar><PersonIcon/></avatar>
          Dirigeants
        </Link>
      </div>
      <div className="border-link">
        <Link to="/groupes" className="link-custom">
          <avatar><GroupIcon/></avatar>
          Groupes
        </Link>
      </div>
      <div className="border-link">
        <Link to="#" className="link-custom">
          <avatar><BubbleChartIcon/></avatar>
          Statistiques
        </Link>
      </div>
    </Grid>

  </>);
};
export default NavbarMembers;



