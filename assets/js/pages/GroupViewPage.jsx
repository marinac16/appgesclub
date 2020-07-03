import React, {forwardRef, useEffect, useState} from 'react';
import NavbarMembers from "../components/NavbarMembers";
import GroupsAPI from "../services/groupsAPI";
import MembersAPI from "../services/membersAPI";
import {toast} from "react-toastify";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {Box, createStyles} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MaterialTable from "material-table";

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
import Button from "@material-ui/core/Button";
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

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


const GroupViewPage = ({match, history}) => {
  const useStyles = makeStyles((theme) =>
    createStyles({
      paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        color: theme.palette.text.secondary,
      },
      btnAdd: {
        marginLeft: theme.spacing(2),
      }
    })
  );

  const classes = useStyles();

  const {id = "new"} = match.params;

  const [group, setGroup] = useState([]);
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState([]);

  //Récupération de l'équipe en fonction de l'identifiant
  const fetchGroup = async id => {
    try {
      const data = await GroupsAPI.find(id);
      setGroup(data);
    } catch (error) {
      console.log(error.response);
      //TODO : Notification flash d'une erreur
      //history.replace("/teams");
    }
  };

  //Récupérer la liste des membres
  const fetchMembers = async () => {
    try {
      const data = await MembersAPI.findAll();
      setMembers(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  // Au chargement du composant, on va chercher les membres
  useEffect(() => {
    fetchMembers();
  }, []);

  // Récupération de la bonne équipe quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      fetchGroup(id);
    }
  }, [id]);


  // Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    console.log(currentTarget);
    setNewMember({id: currentTarget.value});
  };

  var columns = [
    {title: "id", field: "id", hidden: true},
    {
      title: "Membre",
      field: "name",
      render: rowData => <p>{rowData.firstName + ' ' + rowData.lastName}</p>
    },
    {title: "Date de naissance", field: "birthDate", type: 'date'},
    {title: "Numero de licence", field: "licenceNumber"},
    {title: "Email", field: "email"},
    {title: "Téléphone", field: "phoneNumber"},
  ];

  const handleRemoveMember = async (oldData, resolve) => {
    const originalMembers = (group.members);
    const index = oldData.tableData.id;
    originalMembers.splice(index, 1);
    setGroup({members: originalMembers});
    resolve();
    try {
      await GroupsAPI.updatePlus(group, group.id);
    } catch (error) {
      toast.error("Une erreur est survenue ...")
    }
  };

  const handleAddMember = async event => {
    event.preventDefault();
    const originalMembers = (group.members);
    originalMembers.push(newMember);
    setGroup({members: originalMembers});
    try {
      await GroupsAPI.updatePlus(group, id);
    } catch (error) {
      toast.error("Une erreur est survenue ...")
    }

  };


  return (
    <>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <h1>Gestion des groupes - {group.name}</h1>
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
        data={group.members}
        icons={tableIcons}
        editable={{
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRemoveMember(oldData, resolve)
            }),
        }}
        localization={{
          body: {
            emptyDataSourceMessage: 'Vous n\'avez pas encore de groupe...',
            addTooltip: 'Ajouter',
            deleteTooltip: 'Supprimer',
            editTooltip: 'Modifier',
            filterRow: {
              filterTooltip: 'Filtrer'
            },
            editRow: {
              cancelTooltip: 'Annuler',
              saveTooltip: 'Enregistrer',
              deleteText: 'Êtes vous sûre de vouloir supprimer ce membre?'
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
            searchPlaceholder: 'Rechercher un membre'
          },
        }}
      />

      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Box display="flex" flexDirection="row">
            <Autocomplete
              id="combo-box-demo"
              options={members}
              onChange={(event, newValue) => {
                setNewMember(newValue);
              }}
              getOptionLabel={(option) => option.firstName + ' ' + option.lastName}
              style={{width: 500}}
              renderInput={(params) =>
                <TextField {...params} label="Choisir un membre pour l'ajouter au groupe" variant="outlined"/>}
            />
            <Button
              className={classes.btnAdd}
              variant="outlined"
              color="primary"
              onClick={handleAddMember}>
              <PersonAddIcon/>
            </Button>
          </Box>
        </Paper>
      </Grid>


    </>
  );
};
export default GroupViewPage;