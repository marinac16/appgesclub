import React, {useEffect, useState} from 'react';
import NavbarMembers from "../components/NavbarMembers";
import moment from "moment";
import MembersAPI from "../services/membersAPI";
import {Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import {createStyles} from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";

const CoachsPage= (props) => {

  const useStyles = makeStyles((theme) =>
    createStyles({
      paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        color: theme.palette.text.secondary,
      },
      head: {
        color: theme.palette.common.white,
      }
    })
  );

  const classes = useStyles();

  //Gestion du format de date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY');

  const [coachs, setCoachs] = useState([]);

  const fetchCoachs = async () => {
    try {
      const data = await MembersAPI.findAllByStatus("Coach");
      setCoachs(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  // Au chargement du composant, on va chercher les coachs
  useEffect(() => {
    fetchCoachs();
  }, []);

  return (<>

    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <h1>Gestion des licenciés - liste des coachs</h1>
        <NavbarMembers/>
      </Paper>
    </Grid>

    <TableContainer component={Paper}>
      <Table className={classes.table} stickyHeader aria-label="sticky table">
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell>Coachs</TableCell>
            <TableCell>Numéro de licence</TableCell>
            <TableCell>Date de naissance</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Téléphone</TableCell>
            <TableCell>Équipe(s)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coachs.map((c) => (
            <TableRow key={c.id} hover>
              <TableCell component="th" scope="row">{c.firstName + ' ' + c.lastName}</TableCell>
              <TableCell component="th" scope="row">{c.licenceNumber}</TableCell>
              <TableCell component="th" scope="row">{formatDate(c.birthDate)}</TableCell>
              <TableCell component="th" scope="row">{c.email}</TableCell>
              <TableCell component="th" scope="row">{c.phoneNumber}</TableCell>
              <TableCell component="th" scope="row">{c.teams.map(t => (
                <li key={t.id} className="li-without-decoration">{t.name}</li>
              ))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    </>);
};
export default CoachsPage;

