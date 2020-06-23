import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import MembersAPI from "../services/membersAPI";
import TeamsAPI from "../services/teamsAPI";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {createStyles} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Team from '../../images/team.jpg'
import match from '../../images/volleyball.jpg'
import {cyan, green, orange, red} from "@material-ui/core/colors";
import DraftsIcon from '@material-ui/icons/Drafts';
import TodayIcon from '@material-ui/icons/Today';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Avatar from "@material-ui/core/Avatar";
import deepPurple from "@material-ui/core/colors/deepPurple";

const HomePage = (props) => {

  const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: theme.palette.text.secondary,
    },
    button1: {
      color: '#fff',
      backgroundColor: orange[400],
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    button2: {
      color: '#fff',
      backgroundColor: green[400],
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    button3: {
      color: '#fff',
      backgroundColor: deepPurple[400],
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    button4: {
      color: '#fff',
      backgroundColor: cyan[500],
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    button5: {
      color: '#fff',
      backgroundColor: red[500],
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    avatarLarge1: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginTop: theme.spacing(2),
      backgroundColor: deepPurple[400],
    },
    avatarLarge2: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginTop: theme.spacing(2),
      backgroundColor: cyan[500],
    },
    avatarLarge3: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginTop: theme.spacing(2),
      backgroundColor: red[500],
    },
  }),
);
  const classes = useStyles();

  const [nbMembers, setNbMembers] = useState(0);
  const [nbTeams, setNbTeams] = useState(0);

  //Récupérer la liste des members
  const fetchMembers = async () => {
    try {
      const data = await MembersAPI.findAll();
      setNbMembers(data.length);
    } catch (error) {
      console.log(error.response)
    }
  };

  //Récupérer la liste des équipes
  const fetchTeams = async () => {
    try {
      const data = await TeamsAPI.findAll();
      setNbTeams(data.length);
    }catch (error) {
      console.log(error.response)
    }
  };

  // Au chargement du composant, on va chercher les customers
  useEffect(() => {
    fetchMembers();
    fetchTeams();
  }, []);


  return (
    <>
      <div className={classes.root}>
        <h1>Tableau de bord</h1><br/>
        <Grid container spacing={3}>
          <Grid item xs>
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt="teambuilding"
                  height="140"
                  image={Team}
                  title="teambuilding"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Gestion des licenciés
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Vous avez {nbMembers} membres et {nbTeams} équipes !
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions dir="rtl">
                <Button className={classes.button1} variant="contained" size="small" color="primary">
                  Voir
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs>
            <Card className={classes.root}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  alt="managecalendar"
                  height="140"
                  image={match}
                  title="managecalendar"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Organisations des matchs
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Toute la gestion de vos weekends, vos matchs et vos rencontres ICI ! <br/>
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions dir="rtl">
                <Button className={classes.button2} variant="contained" size="small" color="primary">
                  Voir
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid><br/>
        <Grid container spacing={3}>
          <Grid item xs>
            <Card className={classes.paper}>
              <Avatar className={classes.avatarLarge1}><TodayIcon style={{ fontSize: 40 }}/></Avatar>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Calendrier
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Partagez vos réunions et vos évenements !
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button className={classes.button3} variant="contained" size="small">
                  Voir
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs>
            <Card className={classes.paper}>
              <Avatar className={classes.avatarLarge2}><DraftsIcon style={{ fontSize: 40 }}/></Avatar>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Gestion des Mails
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Vous avez déja envoyé 10 000 mails !
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button className={classes.button4} variant="contained" size="small">
                  Envoyer un mail
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs>
            <Card className={classes.paper}>
              <Avatar className={classes.avatarLarge3}><AssignmentIndIcon style={{ fontSize: 40 }}/></Avatar>
              <CardActionArea>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    Adhésion
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    Lancez une campagne d'adhésion !
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button className={classes.button5} variant="contained" size="small">
                  Ouvrir
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </div>



    </>
  );
};
export default HomePage;