import React, {forwardRef, useEffect, useState} from 'react';
import TeamsAPI from "../services/teamsAPI";
import MembersAPI from "../services/membersAPI";
import moment from "moment";
import NavbarMembers from "../components/NavbarMembers";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {Box, createStyles} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MaterialTable from "material-table";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import blue from "@material-ui/core/colors/blue";
import {toast} from "react-toastify";
import Button from "@material-ui/core/Button";
import Card from '@material-ui/core/Card';
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import green from "@material-ui/core/colors/green";
import grey from "@material-ui/core/colors/grey";
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import GroupsAPI from "../services/groupsAPI";


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};


const TeamViewPage = ({match, history}) => {

  const useStyles = makeStyles((theme) =>
    createStyles({
      paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        color: theme.palette.text.secondary,
      },
      btnAdd: {
        marginLeft: theme.spacing(2),
        backgroundColor: green[200],
      },
      cardHeader: {
        backgroundColor: grey[50],
      },
      cardFooter: {
        backgroundColor: grey[50],
      },

    })
  );

  const classes = useStyles();

  const {id = "new"} = match.params;

  const [error, setError] = useState("");
  const [joueurs, setJoueurs] = useState([]);
  const [coachs, setCoachs] = useState([]);
  const [newMember, setNewMember] = useState([]);
  const [team, setTeam] = useState({
    name: "",
    gender: "",
    category: "",
    players: [],
    coachs: []
  });


  //Récupérer la liste des joueurs
  const fetchJoueurs = async () => {
    try {
      const data = await MembersAPI.findAllByStatus("Joueur");
      setJoueurs(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  //Récupérer la liste des joueurs
  const fetchCoachs = async () => {
    try {
      const data = await MembersAPI.findAllByStatus("Coach");
      setCoachs(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  //Récupération de l'équipe en fonction de l'identifiant
  const fetchTeam = async id => {
    try {
      const data = await TeamsAPI.find(id);
      setTeam(data);
    } catch (error) {
      console.log(error.response);
      //TODO : Notification flash d'une erreur
      //history.replace("/teams");
    }
  };

  // Au chargement du composant, on va chercher les membres
  useEffect(() => {
    fetchJoueurs();
    fetchCoachs();
  }, []);

  // Récupération de la bonne équipe quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      fetchTeam(id);
    }
  }, [id]);

  var columns = [
    {title: "id", field: "id", hidden: true},
    {
      title: "Joueurs",
      field: "name",
      render: rowData => <p>{rowData.firstName + ' ' + rowData.lastName}</p>
    },
    {title: "Date de naissance", field: "birthDate", type: 'date'},
    {title: "Numero de licence", field: "licenceNumber"},
    {title: "Email", field: "email"},
    {title: "Téléphone", field: "phoneNumber"},
  ];


  //Gestion de la suppression et de l'ajout d'un joueur
  const handleRemovePlayers = async (oldData, resolve) => {
    const originalMembers = (team.players);
    const index = oldData.tableData.id;
    originalMembers.splice(index, 1);
    setTeam({players: originalMembers});
    resolve();
    try {
      await TeamsAPI.updateMembers(team, team.id);
    } catch (error) {
      toast.error("Une erreur est survenue ...")
    }
  };

  const handleAddPlayer = async event => {
    event.preventDefault();
    const originalMembers = (team.players);
    originalMembers.push(newMember);
    setTeam({players: originalMembers});

    try {
      await TeamsAPI.updateMembers(team, team.id);
    } catch (error) {
      toast.error("Une erreur est survenue ...")
    }

  };

  //Gestion de la suppression et de l'ajout d'un coach
  const handleRemoveCoach = async id => {
    const originalCoachs = (team.coachs);
    const index = originalCoachs.findIndex(coach => coach.id === id);
    originalCoachs.splice(index, 1);
    setTeam({coachs: originalCoachs});

    try {
      await TeamsAPI.updateMembers(team, team.id);
      //window.location.reload();
    } catch (error) {
      setError("Ce joueur ne peut pas etre supprimé !");

    }
  };

  const handleAddCoach = async event => {
    event.preventDefault();

    const originalMembers = (team.coachs);
    originalMembers.push(newMember);
    setTeam({coachs: originalMembers});
    try {
      await TeamsAPI.updateMembers(team, team.id);
    } catch (error) {
      toast.error("Une erreur est survenue ...")
    }

  };

  return (<>

      {/* ------ CARD HEADER -------- */}
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <h1>Gestion des équipes - {team.name}</h1>
          <NavbarMembers/>
        </Paper>
      </Grid>

      {/* ------ CARD COACHS -------- */}
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Card>
            <CardContent className={classes.cardHeader}>
              <Box display="flex" flexDirection="row">
                <Box flexGrow={1}><h4>Coachs</h4></Box>
              </Box>
            </CardContent>
            {team.coachs.map(c =>
              <CardContent key={c.id} className={classes.cardCoachs} >
                <Box display="flex" flexDirection="row">
                  <Box flexGrow={1}><h5>{c.firstName + ' ' + c.lastName}</h5></Box>
                  <Button onClick={handleRemoveCoach}><DeleteOutlineIcon/></Button>
                </Box>

                <ul>
                  <li className="li-without-decoration">{c.licenceNumber}</li>
                  <li className="li-without-decoration">{c.email}</li>
                  <li className="li-without-decoration">{c.phoneNumber}</li>
                </ul>
              </CardContent>
            )}
            <CardContent className={classes.cardFooter}>
              <Box display="flex" flexDirection="row" justifyContent="center" className={classes.formAdd}>
                <Autocomplete
                  id="combo-box-demo1"
                  options={coachs}
                  onChange={(event, newValue) => {
                    setNewMember(newValue);
                  }}
                  getOptionLabel={(option) => option.firstName + ' ' + option.lastName}
                  style={{width: 300}}
                  renderInput={(params) =>
                    <TextField {...params}
                               label="Ajouter un coach"
                               variant="outlined"
                    />}
                />
                <Button
                  className={classes.btnAdd}
                  variant="contained"
                  onClick={handleAddCoach}
                >
                  <PersonAddIcon/>
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* ------ CARD JOUEURS -------- */}
        <Grid item xs={8}>
          <Card>
            <CardContent className={classes.cardHeader}>
              <Box display="flex" flexDirection="row">
                <Box flexGrow={1}><h4>Joueurs</h4></Box>
              </Box>
            </CardContent>
            <MaterialTable
              options={{
                exportButton: true,
                paging: false,
                actionsColumnIndex: -1,
                actionsCellStyle: {
                  display: 'flex',
                  justifyContent: 'center',
                  padding: 16,
                  width: '100%'
                },
                searchFieldAlignment: 'left',
              }}
              title=""
              columns={columns}
              data={team.players}
              icons={tableIcons}
              editable={{
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    handleRemovePlayers(oldData, resolve)
                  }),
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: 'Vous n\'avez pas encore de groupe...',
                  addTooltip: 'Ajouter',
                  deleteTooltip: 'Retirer ce joueur de l\'équipe',
                  editTooltip: 'Modifier',
                  filterRow: {
                    filterTooltip: 'Filtrer'
                  },
                  editRow: {
                    cancelTooltip: 'Annuler',
                    saveTooltip: 'Enregistrer',
                    deleteText: 'Êtes vous sûre de vouloir supprimer ce joueur?'
                  }
                },
                pagination: {
                  labelDisplayedRows: '{count} de {from}-{to}',
                  firstTooltip: 'Première page',
                  previousTooltip: 'Page précedente',
                  nextTooltip: 'Page suivante',
                  lastTooltip: 'Dernière page',
                  labelRowsSelect: 'lignes'
                },
                toolbar: {
                  exportTitle: 'Télécharger',
                  exportAriaLabel: 'Télécharger',
                  exportName: 'Télécharger en CSV',
                  searchTooltip: 'Rechercher',
                  searchPlaceholder: 'Rechercher un joueur'
                },
              }}
            />

            <CardContent className={classes.cardHeader}>
              <Box display="flex" flexDirection="row" justifyContent="center">
                <Autocomplete
                  id="combo-box-demo2"
                  options={joueurs}
                  onChange={(event, newValue) => {
                    setNewMember(newValue);
                  }}
                  getOptionLabel={(option) => option.firstName + ' ' + option.lastName}
                  style={{width: 500}}
                  renderInput={(params) =>
                    <TextField {...params}
                               label="Choisir un joueur pour l'ajouter à cette équipe"
                               variant="outlined"
                    />}
                />
                <Button
                  className={classes.btnAdd}
                  variant="contained"
                  onClick={handleAddPlayer}
                >
                  <PersonAddIcon/>
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


    </>
  )
    ;
};
export default TeamViewPage;
