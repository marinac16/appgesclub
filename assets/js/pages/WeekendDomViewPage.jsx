import React, {useEffect, useState} from 'react';
import WeekendsAPI from "../services/weekendsAPI";
import MatchsAPI from "../services/matchsAPI";
import {Button, Col, Container, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import MaterialTable from "material-table";
import TeamsAPI from "../services/teamsAPI";

import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles'

import {forwardRef} from 'react';
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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import NearMeIcon from '@material-ui/icons/NearMe';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MembersAPI from "../services/membersAPI";
import {Select, MenuItem, TextField} from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Input from "@material-ui/core/Input";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Avatar from '@material-ui/core/Avatar';
import {blue, brown, green, orange} from "@material-ui/core/colors";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Chip from "@material-ui/core/Chip";

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


const WeekendDomViewPage = ({match, history}) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      height: '100vh',
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(4),
      padding: theme.spacing(2),
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    backButton: {
      color: '#fff',
      backgroundColor: blue[800],
      marginRight: theme.spacing(3),
      marginLeft: theme.spacing(3),
      marginTop: theme.spacing(1),
    },
    chipButton: {
      color: '#fff',
      backgroundColor: orange[400],
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(1),
      border: 'none',
    },
    white: {
      color: '#fff',
    }
  }));

  const classes = useStyles();

  const {id = "new"} = match.params;

  const [showForm, setShowForm] = useState(false);
  const [showing, setShowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [data, setData] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const [newMatch, setNewMatch] = useState({
    refMatch: "",
    location: "",
    teamLocal: "",
    teamOpponent: "",
    startTime: "",
    home: true,
    weekend: {id},
    referentClub: "",
    referees: [],
  });
  const [errors, setErrors] = useState({
    refMatch: "",
    teamLocal: "",
    teamOpponent: "",
    startTime: "",
    home: false,
    weekend: ""
  });
  const [weekend, setWeekend] = useState({
    name: "",
    beginDate: "",
    endDate: "",
  });

  const handleShowForm = () => {
    setShowForm(true)
  };
  const handleHideForm = () => {
    setShowForm(false)
  };

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
  //Récupérer la liste des équipes locales
  const fetchTeamsLocal = async () => {
    try {
      const data = await TeamsAPI.findAll();
      setTeams(data);
    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue ...");
    }
  };
  //Récupérer la liste des matchs
  const fetchMatches = async () => {
    try {
      const data = await MatchsAPI.findAllByWeekendAndisHome(id, true);
      setData(data);
      console.log(data);
    } catch (error) {
      setErrorMessage(["Cannot load user data"]);
      setIserror(true)
    }
  };

  //Récupérer la liste des membres
  const fetchMembers = async () => {
    try {
      const data = await MembersAPI.findAll();
      setMembers(data);
    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue ...");
    }
  };


  // Au chargement du composant, on récupère des infos
  useEffect(() => {
    fetchMatches();
    fetchMembers();
    fetchTeamsLocal();
  }, []);

  // Récupération du bon weekend quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setShowing(true);
      fetchWeekend(id);
    }
  }, [id]);


  // Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setNewMatch({
      ...newMatch, [name]: value,
      weekend: id,
    });
  };

  const [matchUpdate, setMatchUpdate] = useState([]);
  const handleChangeMultiple = (event) => {
    console.log(event.target.value);
    setMatchUpdate(event.target.value);
  };

  const memberLookup = {};
  members.map(m => {
    const {id, firstName, lastName} = m;
    memberLookup[id] = firstName + ' ' + lastName;
  });

  const teamLookup = {};
  teams.map(t => {
    const {id, name} = t;
    teamLookup[id] = name;
  });

  var columns = [
    {title: "id", field: "id", hidden: true},
    {title: 'Ref Match', field: 'refMatch'},
    {title: 'Heure du début', field: 'startTime'},
    {title: 'Équipe Locale', field: 'teamLocal.id', lookup: teamLookup},
    {title: 'Équipe adverse', field: 'teamOpponent'},
    {title: 'Lieu', field: 'location'},
    {
      title: 'Arbitres', field: 'matchUpdate', lookup: memberLookup,
      editComponent: props => (
        <Select
          labelId="demo-mutiple-name-label"
          id="demo-mutiple-name"
          multiple
          value={matchUpdate}
          onChange={handleChangeMultiple}
          input={<Input/>}
        >
          {members.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.firstName + ' ' + m.lastName}
            </MenuItem>
          ))}
        </Select>
      )
    },
    {title: 'Referent Club', field: 'referentClub.id', lookup: memberLookup},
  ];

  const handleRowDelete = async (oldData, resolve) => {

    await MatchsAPI.delete(oldData.id);
    const dataDelete = [...data];
    const index = oldData.tableData.id;
    dataDelete.splice(index, 1);
    setData([...dataDelete]);
    resolve()
      .catch(error => {
        setErrorMessage(["Erreur serveur ! "]);
        setIserror(true);
        resolve()
      })
  };

  const handleRowUpdate = async (newData, matchUpdate, oldData, resolve) => {
    //validation
    let errorList = [];
    //enregistrement
    if (errorList.length < 1) {
      await MatchsAPI.update(newData, oldData.id);
      const dataUpdate = [...data];
      const index = oldData.tableData.id;
      dataUpdate[index] = newData;
      setData([...dataUpdate]);
      resolve();
      setIserror(false);
      setErrorMessage([])
    } else {
      setErrorMessage(errorList);
      setIserror(true);
      resolve()
    }
  };

  const handleRowAdd = async (newData, resolve) => {
    //Match à domicile
    var home = true;
    //validation
    let errorList = [];
    if(newData.teamLocal.id === undefined){
      errorList.push("Merci de définir l'équipe locale")
    }
    if(errorList.length < 1){ //no error
      await MatchsAPI.create(newData, weekend.id, home)
        .then(res => {
          let dataToAdd = [...data];
          dataToAdd.push(newData);
          setData(dataToAdd);
          resolve();
          setErrorMessage([]);
          setIserror(false)
        })
        .catch(error => {
          setErrorMessage(["Cannot add data. Server error!"]);
          setIserror(true);
          resolve()
        })
    }else{
      setErrorMessage(errorList);
      setIserror(true);
      resolve()
    }
  };

  return (<>

      <Container fluid>
        <TableContainer component={Paper}>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div className="mb-3 mt-3 d-flex justify-content">
              <Link to={"/weekends"}><Avatar className={classes.backButton}><ArrowBackIcon/></Avatar></Link>
              <h1>{weekend.name} - Matchs à domicile</h1>
            </div>
            <div>
              <Link to={"/weekend/exterieur/" + id}>
              <Chip
                icon={<NearMeIcon className={classes.white}/>}
                label="Voir les Matchs à l'éxterieur"
                clickable
                className={classes.chipButton}
              />
              </Link>
            </div>
          </div>

        </TableContainer>
        <br/>
        <MaterialTable
          options={{
            exportButton: true,
            actionsColumnIndex: -1,
            paging: false,
            searchFieldAlignment: 'left',
          }}

          title=""
          columns={columns}
          data={data}
          icons={tableIcons}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve) => {
                handleRowAdd(newData, resolve)
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve) => {
                handleRowUpdate(newData, oldData, resolve);
              }),

            onRowDelete: (oldData) =>
              new Promise((resolve) => {
                handleRowDelete(oldData, resolve)
              }),
          }}
          localization={{
            body: {
              emptyDataSourceMessage: 'Ce weekend ne contient pas encore de match !',
              addTooltip: 'Ajouter',
              deleteTooltip: 'Supprimer',
              editTooltip: 'Modifier',
              filterRow: {
                filterTooltip: 'Filtrer'
              },
              editRow: {
                cancelTooltip: 'Annuler',
                saveTooltip: 'Enregistrer',
                deleteText: 'Êtes vous sûre de vouloir supprimer ce match ?'
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
              searchPlaceholder: 'Rechercher un match'
            },
          }}
        />
      </Container>
    </>
  )
};
export default WeekendDomViewPage;


