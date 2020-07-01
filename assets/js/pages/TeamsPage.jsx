import React, {forwardRef, useEffect, useState} from 'react';
import TeamsAPI from "../services/teamsAPI"
import GendersAPI from "../services/gendersAPI";
import CategoriesAPI from "../services/categoriesAPI";
import MembersAPI from "../services/membersAPI";
import NavbarMembers from "../components/NavbarMembers";
import {toast} from "react-toastify";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles} from "@material-ui/core";
import MaterialTable from "material-table";
import {Link} from "react-router-dom";

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
import Avatar from "@material-ui/core/Avatar";
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

const TeamsPage = () => {

  const useStyles = makeStyles((theme) =>
    createStyles({
      paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        color: theme.palette.text.secondary,
      },
    })
  );

  const classes = useStyles();

  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);
  const [coachs, setCoachs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [iserror, setIserror] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);

  //Récupérer la liste de toutes les équipes équipes
  const fetchTeams = async () => {
    try {
      const data = await TeamsAPI.findAll();
      setTeams(data);
    }catch (error) {
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

  //Récupérer la liste des joueurs
  const fetchCoachs = async () => {
    try {
      const data = await MembersAPI.findAllByStatus("Coach");
      setCoachs(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  // Au chargement du composant, on va chercher les teams
  useEffect(() => {
    fetchTeams();
    fetchCategories();
    fetchGenders();
    fetchCoachs();
  }, []);

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

  const coachLookup = {};
  coachs.map(c => {
    const {id, firstName, lastName} = c;
    coachLookup[id] = firstName + ' ' + lastName;
  });

  var columns = [
    {title: "id", field: "id", hidden: true},
    {
      title: "Équipes",
      field: "name",
      render: rowData => <Link to={"team/" + rowData.id}>{rowData.name}</Link>
    },
    {title: "Catégories", field: "category.id", lookup:categoryLookup},
    {title: "Genre", field: "gender.id", lookup:genderLookup},
    {
      title: "Coachs",
      field: "coachs.id",
      lookup:coachLookup,
      render: rowData => rowData.coachs.map(c => <li key={c.id} className="li-without-decoration">{c.firstName+' '+c.lastName}</li>)
    },
    {
      title: "Nombre de joueurs",
      field: "nbJoueurs",
      render: rowData => <Chip color="primary" avatar={<Avatar>{rowData.players.length}</Avatar>} label="Joueurs"/>
    },
  ];

  const handleRowDelete = async (oldData, resolve) => {

    await TeamsAPI.delete(oldData.id);
    const dataDelete = [...teams];
    const index = oldData.tableData.id;
    dataDelete.splice(index, 1);
    setTeams([...dataDelete]);
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
      await TeamsAPI.update(newData, oldData.id);
      const dataUpdate = [...teams];
      const index = oldData.tableData.id;
      dataUpdate[index] = newData;
      setTeams([...dataUpdate]);
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
    console.log(teams);
    //validation
    let errorList = [];
    if (errorList.length < 1) { //no error
      await TeamsAPI.create(newData)
        .then(res => {
          let dataToAdd = [...teams];
          dataToAdd.push(newData);
          setTeams(dataToAdd);
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
          <h1>Gestion des licenciés - liste des équipes</h1>
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
        }}
        title=""
        columns={columns}
        data={teams}
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
            emptyDataSourceMessage: 'Vous n\'avez pas encore d\'équipe...',
            addTooltip: 'Ajouter',
            deleteTooltip: 'Supprimer',
            editTooltip: 'Modifier',
            filterRow: {
              filterTooltip: 'Filtrer'
            },
            editRow: {
              cancelTooltip: 'Annuler',
              saveTooltip: 'Enregistrer',
              deleteText: 'Êtes vous sûre de vouloir supprimer cette équipe ?'
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
            searchPlaceholder: 'Rechercher une équipe'
          },
        }}
      />
    </>

  );
};
export default TeamsPage;