import React, {forwardRef, useEffect, useState} from 'react';
import WeekendsAPI from "../services/weekendsAPI";
import {toast} from "react-toastify";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import EditIcon from '@material-ui/icons/Edit';
import TodayIcon from '@material-ui/icons/Today';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import {Button, createStyles} from "@material-ui/core";
import {blue, green, red, orange} from '@material-ui/core/colors';
import {Link} from "react-router-dom";

import moment from "moment";
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Tooltip from "@material-ui/core/Tooltip";

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

      <br/>

      <h4>Weekends passés</h4><br/>

    </>
  )
};
export default WeekendsPage;

