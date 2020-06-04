import React, {useEffect, useState} from 'react';
import MaterialTable from 'material-table';
import MatchsAPI from "../services/matchsAPI";
import TeamsAPI from "../services/teamsAPI";
import {toast} from "react-toastify";

import { forwardRef } from 'react';
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

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const WeekendTestPage = ({match, history}) => {

  const {id = "new"} = match.params;

  const [teams, setTeams] = useState([]);
  const [data, setData] = useState([]);
  const [iserror, setIserror] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);


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
      setErrorMessage (["Cannot load user data"] );
      setIserror (true)
    }
  };
  // Au chargement du composant, on récupère des infos
  useEffect(() => {
    fetchMatches();
  }, []);

  //Récupération de la liste des équipes a chaque chargement du composant
  useEffect(() => {
    fetchTeamsLocal();
  }, []);


  var columns = [
    {title: "id", field: "id", hidden: true},
    {title: 'Ref Match', field: 'refMatch'},
    {title: 'Heure du début', field: 'startTime'},
    {title: 'Équipe Locale', field: 'teamLocal.name', lookup: {1:'a'}},
    {title: 'Équipe adverse', field: 'teamOpponent'},
    {title: 'Lieu', field: 'location'},
  ];

  const handleRowAdd = async (newData, resolve) => {
    //validation
    let errorList = [];
    if(newData.teamLocal === undefined){
      errorList.push("Merci de préciser l'équipe locale")
    }
    //Enregistrement
    if(errorList.length < 1){ //no error
      await MatchsAPI.create(newData);
    }else{
      setErrorMessage(errorList);
      setIserror(true);
      resolve()
    }
  };
  const handleRowUpdate = async (newData, oldData, resolve) => {
    //validation
    let errorList = [];
    //enregistrement
    if(errorList.length < 1){
      console.log(oldData);
      await MatchsAPI.update(newData, oldData.id);
    }else{
      setErrorMessage(errorList);
      setIserror(true);
      resolve()
    }
  };

  return (<>
      <MaterialTable
        title="Liste des matchs"
        columns={columns}
        data={data}
        icons={tableIcons}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve);
            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve)
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              //handleRowDelete(oldData, resolve)
            }),
        }}
      />


    </>
  )
};
export default WeekendTestPage;


