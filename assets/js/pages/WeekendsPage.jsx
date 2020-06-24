import React, {forwardRef, useEffect, useState} from 'react';
import WeekendsAPI from "../services/weekendsAPI";
import {toast} from "react-toastify";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {Button, createStyles} from "@material-ui/core";
import {blue, green, red} from '@material-ui/core/colors';
import {Link} from "react-router-dom";

import moment from "moment";
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from "@material-ui/core/Tooltip";
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
import TodayIcon from '@material-ui/icons/Today';
import ViewColumn from '@material-ui/icons/ViewColumn';

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
      root: {
        display: 'flex',
        '& > *': {
          margin: theme.spacing(1),
        },
      },
      square: {
        color: theme.palette.getContrastText(green[500]),
        backgroundColor: green[500],
      },
      rounded: {
        color: '#fff',
        backgroundColor: green[500],
      },
      table: {
        minWidth: 650,
      },
    }),
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
      render: rowData => <Chip color="primary" avatar={<Avatar>{rowData.matches.length}</Avatar>} label="Matchs"/>,
      editable: false,
    },
  ];

  //Gestion du format de date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY');

  const [weekends, setWeekends] = useState([]);
  const [loading, setLoading] = useState(true);

  //Récupérer la liste des weekends
  const fetchWeekends = async () => {
    try {
      const data = await WeekendsAPI.findAll();
      setWeekends(data);
      setLoading(false);
    } catch (error) {
      toast.error("Une erreur est survenue ...");
    }
  };

  // Chargement du composant
  useEffect(() => {
    fetchWeekends();
  }, []);


  return (<>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des weekends</h1>
        <Link to={"/weekends/new"}>
          <Tooltip title="Ajouter un weekend">
            <Avatar variant="rounded" className={classes.rounded}>
              <AddIcon/>
            </Avatar>
          </Tooltip>
        </Link>
      </div>


      <h4>Weekends à venir</h4><br/>

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
          searchFieldAlignment: 'left',
        }}

        title=""
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

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {weekends.map((row, key) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  <Link to={"weekend/domicile/" + row.id} className="link-default">
                    {row.name.toUpperCase()}
                  </Link>
                </TableCell>
                <TableCell component="th" scope="row">
                  <TodayIcon style={{color: blue[700]}} fontSize="small"/> {formatDate(row.beginDate)}
                </TableCell>
                <TableCell component="th" scope="row">
                  <TodayIcon style={{color: blue[700]}} fontSize="small"/> {formatDate(row.endDate)}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Link to={"weekend/domicile/" + row.id} className="link-default">
                    <Chip color="primary" avatar={<Avatar>{row.matches.length}</Avatar>} label="Matchs"/>
                  </Link>
                </TableCell>
                <TableCell className="text-right">
                  <Tooltip title="Modifier">
                    <Link to={"weekends/" + row.id}>
                      <EditIcon style={{color: blue[700]}}/>
                    </Link>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <Button>
                      <DeleteOutlineIcon style={{color: red[300]}}/>
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </>
  )
};
export default WeekendsPage;

