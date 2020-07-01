import React, {useEffect, useState} from 'react';
import NavbarMembers from "../components/NavbarMembers";
import moment from "moment";
import MembersAPI from "../services/membersAPI";
import Grid from "@material-ui/core/Grid";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import {createStyles} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const DirigeantsPage= (props) => {

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

  const [dirigeants, setdirigeants] = useState([]);

  const fetchDirigeants = async () => {
    try {
      const data = await MembersAPI.findAllByStatus("Dirigeant");
      setdirigeants(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  // Au chargement du composant, on va chercher les coachs
  useEffect(() => {
    fetchDirigeants();
  }, []);

  return (<>

    <Grid item xs={12}>
      <Paper className={classes.paper}>
        <h1>Gestion des licenciés - liste des dirigeants</h1>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {dirigeants.map((d) => (
            <TableRow key={c.id} hover>
              <TableCell component="th" scope="row">{d.firstName + ' ' + d.lastName}</TableCell>
              <TableCell component="th" scope="row">{d.licenceNumber}</TableCell>
              <TableCell component="th" scope="row">{formatDate(d.birthDate)}</TableCell>
              <TableCell component="th" scope="row">{d.email}</TableCell>
              <TableCell component="th" scope="row">{d.phoneNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>);
};
export default DirigeantsPage;

