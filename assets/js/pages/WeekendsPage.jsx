import React, {forwardRef, useEffect, useState} from 'react';
import WeekendsAPI from "../services/weekendsAPI";
import {toast} from "react-toastify";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import {Button, createStyles} from "@material-ui/core";
import {Link} from "react-router-dom";

import moment from "moment";
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
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
import Grid from "@material-ui/core/Grid";
import lightBlue from "@material-ui/core/colors/lightBlue";
import blue from "@material-ui/core/colors/blue";
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

const WeekendsPage = (props) => {

  const useStyles = makeStyles((theme) =>
    createStyles({
      paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        color: theme.palette.text.secondary,
      },
      chip: {
        backgroundColor: lightBlue[800],
        color: blue[50],
      },
      avatar: {
        backgroundColor: lightBlue[100],
      },
    })
  );

  const classes = useStyles();

  var columns = [
    {title: "id", field: "id", hidden: true},
    {title: 'Nom du weekend', field: 'name',
      render: rowData => <Link to={"weekend/domicile/" + rowData.id}>{rowData.name}</Link>
    },

    {title: 'Début', field: 'beginDate', type: 'date'},
    {title: 'Fin', field: 'endDate', type: 'date'},
    {
      title: 'Nombre de matchs',
      field: 'matches',
      render: rowData => <Chip className={classes.chip} avatar={<Avatar className={classes.avatar}>{rowData.matches.length}</Avatar>} label="Matchs"/>,
    },
  ];

  const [weekends, setWeekends] = useState([]);

  //Récupérer la liste des weekends
  const fetchWeekends = async () => {
    try {
      const data = await WeekendsAPI.findAll();
      setWeekends(data);
    } catch (error) {
      toast.error("Une erreur est survenue ...");
    }
  };

  // Chargement du composant
  useEffect(() => {
    fetchWeekends();
  }, []);


  return (<>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <h1>Liste des weekends</h1>
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
          paging: false,
          searchFieldAlignment: 'right',
          headerStyle: {
            backgroundColor: orange[400],
            color: '#FFF',
            fontSize: '16px',
            fontFamily: 'Cabin, Helvetica Neue, Helvetica, Roboto, Arial, sans-serif',
          }
        }}

        title="Weekends à venir"
        columns={columns}
        data={weekends}
        icons={tableIcons}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              //handleRowAdd(newData, resolve)
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              //handleRowUpdate(newData, oldData, resolve);
            }),

          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              //handleRowDelete(oldData, resolve)
            }),
        }}
        localization={{
          body: {
            emptyDataSourceMessage: 'Pas de weekend disponible',
            addTooltip: 'Ajouter',
            deleteTooltip: 'Supprimer',
            editTooltip: 'Modifier',
            filterRow: {
              filterTooltip: 'Filtrer'
            },
            editRow: {
              cancelTooltip: 'Annuler',
              saveTooltip: 'Enregistrer',
              deleteText: 'Êtes vous sûre de vouloir supprimer ce weekend ?'
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
            searchPlaceholder: 'Rechercher un Weekend'
          },
        }}
      />


      <br/>

      <h4>Weekends passés</h4><br/>



    </>
  )
};
export default WeekendsPage;

