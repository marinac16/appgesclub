import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import {blue, orange} from "@material-ui/core/colors";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';

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
        backgroundColor: blue[800],
      }
    })
  );
  const classes = useStyles();

  return (<>

    <div className={classes.nav}>
      <Link to="/members" className={classes.link}>
        <Chip
          icon={<PersonIcon/>}
          className={classes.chip}
          label="Membres"
          clickable
          color="primary"/>
      </Link>
      <Link to="/teams" className={classes.link}>
        <Chip
          icon={<GroupIcon/>}
          className={classes.chip}
          label="Équipes"
          clickable
          color="primary"/>
      </Link>
      <Link to="/coachs" className={classes.link}>
        <Chip
          icon={<PermIdentityIcon/>}
          className={classes.chip}
          label="Coachs"
          clickable
          color="primary"/>
      </Link>
      <Link to="/dirigeants" className={classes.link}>
        <Chip
          icon={<PermIdentityIcon/>}
          className={classes.chip}
          label="Dirigeants"
          clickable
          color="primary"/>
      </Link>
      <Link to="/groupes" className={classes.link}>
        <Chip
          icon={<SupervisorAccountIcon/>}
          className={classes.chip}
          label="Groupes"
          clickable
          color="primary"/>
      </Link>
      <Link to="#" className={classes.link}>
        <Chip
          icon={<BubbleChartIcon/>}
          className={classes.chip}
          label="Statistiques"
          clickable
          color="primary"
          className={classes.chip}/>
      </Link>
    </div>

  </>);
};
export default NavbarMembers;



