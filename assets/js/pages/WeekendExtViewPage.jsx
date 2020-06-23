import React, {forwardRef, useEffect, useState} from 'react';
import WeekendsAPI from "../services/weekendsAPI";
import MatchsAPI from "../services/matchsAPI";
import TeamsAPI from "../services/teamsAPI";
import MembersAPI from "../services/membersAPI";
import {Container} from "react-bootstrap";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import MaterialTable from "material-table";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RoomIcon from '@material-ui/icons/Room';
import {blue, orange} from "@material-ui/core/colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  AddBox, ArrowDownward,
  Check, ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage, LastPage, Remove,
  SaveAlt, Search, ViewColumn
} from "@material-ui/icons";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import TableContainer from "@material-ui/core/TableContainer";
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

  const [showing, setShowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const [data, setData] = useState([]);
  const [weekend, setWeekend] = useState({
    id:"",
    name: "",
    beginDate: "",
    endDate: "",
  });


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
      const data = await MatchsAPI.findAllByWeekendAndisHome(id, false);
      setData(data);
    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue ...");
    }
  };

  // Au chargement du composant, on récupère des infos
  useEffect(() => {
    fetchTeamsLocal();
    fetchMembers();
    fetchMatches();
  }, []);

  // Récupération du bon weekend quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      fetchWeekend(id);
    }
  }, [id]);

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

  const handleRowUpdate = async (newData, oldData, resolve) => {
    //validation
    let errorList = [];
    //enregistrement
    if (errorList.length < 1) {
      await MatchsAPI.updateME(newData, oldData.id);
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
    //Match à l'extérieur
    var home = false;
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
              <h1>{weekend.name} - Matchs à l'extérieur</h1>
            </div>
            <div>
              <Link to={"/weekend/domicile/" + id}>
                <Chip
                  icon={<RoomIcon className={classes.white}/>}
                  label="Voir les Matchs à domicile"
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


