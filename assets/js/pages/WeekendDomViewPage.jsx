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
import ViewColumn from '@material-ui/icons/ViewColumn';
import Field from "../components/forms/Field";
import MembersAPI from "../services/membersAPI";import {
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  TextField
} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";

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

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const WeekendDomViewPage = ({match, history}) => {

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

  const memberLookup = {};
  members.map(m => {
    const {id, firstName, lastName} = m;
    memberLookup[id] = firstName +' '+ lastName;
  });


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

  var columns = [
    {title: "id", field: "id", hidden: true},
    {title: 'Ref Match', field: 'refMatch'},
    {title: 'Heure du début', field: 'startTime'},
    {title: 'Équipe Locale', field: 'teamLocal.name', editable: 'never'},
    {title: 'Équipe adverse', field: 'teamOpponent'},
    {title: 'Lieu', field: 'location'},
    {title: 'Arbitres', field: 'matchUpdate', lookup: memberLookup,
    editComponent: props => (
      console.log(props),
      <Select
        labelId="demo-mutiple-name-label"
        id="demo-mutiple-name"
        multiple
        value={matchUpdate}
        onChange={handleChangeMultiple}
        input={<Input />}
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

  //Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await MatchsAPI.create(newMatch);
      window.location.reload();
    } catch ({response}) {
      toast.error("Une erreur est survenue ...");
      const {violations} = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({propertyPath, message}) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
    }
  };


  return (<>

      <Container fluid>
        <div className="bg-container mt-4">
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div className="mb-3 d-flex justify-content">
              <Link to={"/weekends"}><i className="mr-3 text-white fas fa-3x fa-arrow-alt-circle-left"/></Link>
              <h1>{weekend.name} - Matchs à domicile</h1>
            </div>
            {!showForm && (<button onClick={handleShowForm} className="btn btn-success">Ajouter un match
              <i className="pl-2 fas fa-location-arrow"/>
            </button>)}
          </div>
          <hr/>
          <nav className="nav nav-tabs  flex-column flex-sm-row mt-3 mb-3">
            <Link to={"/weekend/domicile/" + id} className="navlink-custom text-warning"><i
              className="fas fa-map-marker"/> Matchs à domicile</Link>
            <Link to={"/weekend/exterieur/" + id} className="navlink-custom"><i
              className="fas fa-location-arrow"/> Matchs à l'extérieur</Link>
          </nav>

          {showForm && (
            <form onSubmit={handleSubmit}>
              <Row>
                <Col sm={4}>
                  <Field
                    name="refMatch"
                    placeholder="Réf Match"
                    label="Référence du Match"
                    value={newMatch.refMatch}
                    onChange={handleChange}
                    error={errors.refMatch}
                  />
                </Col>
                <Col sm={4}>
                  <Field
                    name="startTime"
                    placeholder="00:00"
                    label="Heure du Match"
                    onChange={handleChange}
                    value={newMatch.startTime}
                    error={errors.startTime}
                  />
                </Col>
                <Col sm={4}>
                  <Field
                    name="location"
                    placeholder="Lieu"
                    label="Lieu du Match"
                    onChange={handleChange}
                    value={newMatch.location}
                    error={errors.location}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Field type="text"
                         placeholder="Choisissez une équipe ..."
                         label="Équipe locale"
                         name="teamLocal"
                         onChange={handleChange}
                         list="teams"/>
                  <datalist id="teams">
                    {teams.map((team, key) => (
                      <option key={key}
                              value={team.id}
                              label={team.name}
                      >
                      </option>
                    ))}
                  </datalist>
                </Col>
                <Col sm={6}>
                  <Field
                    name="teamOpponent"
                    label="Équipe adverse"
                    placeholder="Choisissez une équipe adverse ..."
                    onChange={handleChange}
                    value={newMatch.teamOpponent}
                    error={errors.teamOpponent}
                  />
                </Col>
              </Row>
              <div className="mt-2 form-group d-flex flex-row-reverse">
                <button type="submit" className="btn btn-success">Enregistrer</button>
                <button onClick={handleHideForm} className="btn btn-link text-white">Annuler</button>
              </div>
            </form>
          )}
          <div style={{maxWidth: "100%", color: 'palette.background.default'}}>
            <ThemeProvider theme={darkTheme}>
              <MaterialTable
                options={{
                  exportButton: true,
                  actionsColumnIndex: -1,
                  paging: false
                }}

                title="Liste des matchs"
                columns={columns}
                data={data}
                icons={tableIcons}
                editable={{
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
                      saveTooltip: 'Enregistrer'
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
            </ThemeProvider>
          </div>
        </div>
      </Container>
    </>
  )
};
export default WeekendDomViewPage;


