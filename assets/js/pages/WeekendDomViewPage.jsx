import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import WeekendsAPI from "../services/weekendsAPI";
import MatchsAPI from "../services/matchsAPI";
import TeamsAPI from "../services/teamsAPI";
import MembersAPI from "../services/membersAPI";
import {Button, Col, Container, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {withStyles} from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Modal from "react-bootstrap/Modal";


//Création du menu dropdown pour acceder aux actions
const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));
const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const WeekendDomViewPage = ({match, history}) => {

  const {id = "new"} = match.params;

  const [showing, setShowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [weekend, setWeekend] = useState({
    name: "",
    beginDate: "",
    endDate: "",
  });
  const [matches, setMatches] = useState([]);

  //Récupération du weekend en fonction de l'identifiant
  const fetchWeekend = async id => {
    try {
      const data = await WeekendsAPI.find(id);
      setWeekend(data);
    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue ...");
      history.replace("/weekends");
    }
  };

  //Récupérer la liste des matchs
  const fetchMatches = async () => {
    try {
      const data = await MatchsAPI.findAllByWeekendAndisHome(id, true);
      setMatches(data);
    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue ...");
    }
  };

  // Au chargement du composant, on récupère des infos
  useEffect(() => {
    fetchMatches();
  }, []);

  // Récupération du bon weekend quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setShowing(true);
      fetchWeekend(id);
    }
  }, [id]);


// Gestion de la suppression d'un match
  const handleDelete = async id => {
    const originalMatchs = [weekend.matches];

    //1. L'approche optimiste
    setWeekend({matches: weekend.matches.filter(match => match.id !== id)});

    //2. L'approche pessismiste
    try {
      await MatchsAPI.delete(id);
      window.location.reload();
    } catch (error) {
      setWeekend(originalMatchs);
      toast.error("Une erreur est survenue ...")
    }
  };

// Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setNewMatch({
      ...newMatch, [name]: value,
      weekend: id,
    });
  };


  //Gestion du menu dropdown pour acceder aux actions
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (<>

    <Container fluid>
      <div className="bg-container mt-4">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <div className="mb-3 d-flex justify-content">
            <Link to={"/weekends"}><i className="mr-3 text-white fas fa-3x fa-arrow-alt-circle-left"/></Link>
            <h1>{weekend.name} - Matchs à domicile</h1>
          </div>
          <Link to={"/weekend/" + weekend.id + "/matches/new"} className="btn btn-success">Ajouter un match
            <i className="pl-2 fas fa-map-marker"/>
          </Link>
        </div>
        <hr/>
        <nav className="nav nav-tabs  flex-column flex-sm-row mt-3 mb-3">
          <Link to={"/weekend/domicile/" + id} className="navlink-custom text-warning"><i
            className="fas fa-map-marker"/> Matchs à domicile</Link>
          <Link to={"/weekend/exterieur/" + id} className="navlink-custom"><i
            className="fas fa-location-arrow"/> Matchs à l'extérieur</Link>
          <Link to={"/weekend/test/" + id} className="navlink-custom"><i
            className="fas fa-location-arrow"/> Matchs test</Link>
        </nav>
        <table className="table bg-dark text-white mt-4">
          <thead>
          <tr>
            <th>Référence du match</th>
            <th className="text-center">Heure</th>
            <th className="text-center">Lieu</th>
            <th className="text-center">Équipe</th>
            <th className="text-center">Équipe Adverse</th>
            <th>Arbitres</th>
            <th>Marqueurs</th>
            <th className="text-center">Ref Club</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {matches.map(m =>
            <tr key={m.id} className="">
              <td>{m.refMatch}</td>
              <td className="text-center">{m.startTime}</td>
              <td className="text-center">{m.location}</td>
              <td className="text-center">{m.teamLocal.name}</td>
              <td className="text-center">{m.teamOpponent}</td>
              <td>{m.referees.map(r =>
                <ul key={r.id} className="p-0">
                  <li className="li-without-decoration">{r.firstName + " " + r.lastName} </li>
                </ul>)}
              </td>
              <td>{m.scorers.map(s =>
                <ul key={s.id} className="p-0">
                  <li className="li-without-decoration">{s.firstName + " " + s.lastName}</li>
                </ul>)}
              </td>
              <td className="text-center">
                {m.clubReferent && m.clubReferent.firstName + " " + m.clubReferent.lastName || " "}
              </td>
              <td className="text-right">
                <div>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <MoreVertIcon/>
                  </IconButton>
                  <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <StyledMenuItem>
                      <ListItemIcon>
                        <EditIcon fontSize="small"/>
                      </ListItemIcon>
                      <ListItemText primary="Modifier le match"/>
                    </StyledMenuItem>
                    <StyledMenuItem
                      id={m.id}
                      onClick={() => handleDelete(m.id)}
                    >
                      <ListItemIcon>
                        <DeleteForeverIcon fontSize="small"/>
                      </ListItemIcon>
                      <ListItemText primary="Supprimer le match"/>
                    </StyledMenuItem>
                  </StyledMenu>
                </div>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </Container>


  </>
)
};
export default WeekendDomViewPage;


