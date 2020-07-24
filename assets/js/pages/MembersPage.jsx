import React, {useEffect, useState} from 'react';
import {forwardRef} from 'react';
import MaterialTable from "material-table";
import {amber, blue} from '@material-ui/core/colors';

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
import MembersAPI from "../services/membersAPI";
import {toast} from "react-toastify";
import CategoriesAPI from "../services/categoriesAPI";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Avatar from "@material-ui/core/Avatar";
import {createStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import NavbarMembers from "../components/NavbarMembers";
import GendersAPI from "../services/gendersAPI";
import TeamsAPI from "../services/teamsAPI";
import StatusAPI from "../services/statusAPI";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import useTheme from "@material-ui/core/styles/useTheme";
import lightBlue from "@material-ui/core/colors/lightBlue";
import orange from "@material-ui/core/colors/orange";

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

const MembersPage = (props) => {

  const useStyles = makeStyles((theme) =>
    createStyles({
      root: {
        minWidth: 275,
      },
      title: {
        fontSize: 14,
      },
      pos: {
        marginBottom: 12,
      },
      avatar: {
        backgroundColor: lightBlue[800],
      },
      paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        color: theme.palette.text.secondary,
      },
    })
  );

  const classes = useStyles();

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [teams, setTeams] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);
  const theme = useTheme();
  const [statusName, setStatusName] = React.useState([]);

  //Récupérer la liste des members
  const fetchMembers = async () => {
    try {
      const data = await MembersAPI.findAll();
      setData(data);
    } catch (error) {
      toast.error("Une erreur est survenue ...");
    }
  };

  //Récupération des genres (F/M)
  const fetchGenders = async () => {
    try {
      const data = await GendersAPI.findAll();
      setGenders(data);
    } catch (error) {
      toast.error("Une erreur est survenue ...");
      history.replace('/members');
    }
  };

  //Récupération des Catégories
  const fetchCategories = async () => {
    try {
      const data = await CategoriesAPI.findAll();
      setCategories(data);
    } catch (error) {
      history.replace('/members');
      toast.error("Une erreur est survenue ...")
    }
  };
  //Récupérer la liste des équipes
  const fetchTeams = async () => {
    try {
      const data = await TeamsAPI.findAll();
      setTeams(data);
    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue ...");
    }
  };
  //Récupérer la liste des statuts
  const fetchStatuses = async () => {
    try {
      const data = await StatusAPI.findAll();
      setStatuses(data);
    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue ...");
    }
  };

  // Au chargement du composant, on va chercher les customers
  useEffect(() => {
    fetchMembers();
    fetchCategories();
    fetchGenders();
    fetchTeams();
    fetchStatuses();
  }, []);

  const teamLookup = {};
  teams.map(t => {
    const {id, name} = t;
    teamLookup[id] = name;
  });

  const genderLookup = {};
  genders.map(g => {
    const {id, type} = g;
    genderLookup[id] = type;
  });

  const categoryLookup = {};
  categories.map(g => {
    const {id, name} = g;
    categoryLookup[id] = name;
  });

  const statusLookup = {};
  statuses.map(g => {
    const {id, name} = g;
    statusLookup[id] = name;
  });

  var columns = [
    {title: "id", field: "id", hidden: true},
    {
      title: '',
      field: 'avatar',
      render: rowData => <Avatar
        className={classes.avatar}>{rowData.firstName.substring(0, 1) + rowData.lastName.substring(0, 1)}</Avatar>
    },
    {title: 'Prénom', field: 'firstName'},
    {title: 'Nom', field: 'lastName'},
    {title: 'Licence', field: 'licenceNumber'},
    {title: 'Date de naissance', field: 'birthDate', type: "date"},
    {title: 'Email', field: 'email'},
    {title: 'Téléphone', field: 'phoneNumber'},
    {title: 'Genre', field: 'gender.id', lookup: genderLookup},
    {title: 'Catégorie', field: 'category.id', lookup: categoryLookup},
    {
      title: 'Équipe',
      field: 'teams.id',
      lookup: teamLookup,
      render: rowData => rowData.teams.map(t => t.name)
    },
    {
      title: 'Status',
      field: 'statuses.id',
      lookup: statusLookup,
      render: rowData => rowData.statuses.map(s => s.name),
      editComponent: props =>
        <Select
          value={[statusName]}
          onChange={props.onChange}
          multiple={true}
          renderValue={(selected) => selected.join(', ')}
        >
          {statuses.map(s => <MenuItem key={s.id} value={s.id}>
            <Checkbox checked={statusName.indexOf(s.name) > -1} />
            <ListItemText primary={s.name} />
          </MenuItem>)}
        </Select>

    },

  ];

  const handleRowDelete = async (oldData, resolve) => {

    await MembersAPI.delete(oldData.id);
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
      await MembersAPI.update(newData, oldData.id);
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
    console.log(newData);
    //validation
    let errorList = [];
    if (errorList.length < 1) { //no error
      await MembersAPI.create(newData)
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
    } else {
      setErrorMessage(errorList);
      setIserror(true);
      resolve()
    }
  };

  return (
    <>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <h1>Gestion des licenciés - liste des membres</h1>
          <NavbarMembers/>
        </Paper>
      </Grid>

      <MaterialTable
        options={{
          exportButton: true,
          actionsColumnIndex: -1,
          actionsCellStyle: {
            display: 'flex',
            justifyContent: 'center',
            padding: 16,
            width: '100%'
          },
          searchFieldAlignment: 'left',
          headerStyle: {
            backgroundColor: orange[400],
            color: '#FFF',
            fontSize: '16px',
            fontFamily: 'Cabin, Helvetica Neue, Helvetica, Roboto, Arial, sans-serif',
          }
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
            emptyDataSourceMessage: 'Vous n\'avez pas encore de licencié...',
            addTooltip: 'Ajouter',
            deleteTooltip: 'Supprimer',
            editTooltip: 'Modifier',
            filterRow: {
              filterTooltip: 'Filtrer'
            },
            editRow: {
              cancelTooltip: 'Annuler',
              saveTooltip: 'Enregistrer',
              deleteText: 'Êtes vous sûre de vouloir supprimer ce licencié ?'
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
            searchPlaceholder: 'Rechercher un licencié'
          },
        }}
      />

    </>

  );
};
export default MembersPage;