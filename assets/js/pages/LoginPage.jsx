import React, {useState, useContext} from 'react';
import AuthAPI from "../services/authAPI";
import AuthContext from "../context/AuthContext";
import {toast} from "react-toastify";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Link} from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import BackgroundImage from '../../images/laptoploginpage.png'

const LoginPage = ({history}) => {

  const useStyles = makeStyles((theme) => ({
    root: {
      height: '100vh',
    },
    image: {
      backgroundImage: 'url('+ BackgroundImage+')',
      backgroundRepeat: 'no-repeat',
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: '600px',
      backgroundPosition: 'center',
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.primary.main,
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    form: {
      width: '90%', // Fix IE 11 issue.
      marginTop: theme.spacing(4),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const classes = useStyles();

  const {setIsAuthenticated} = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  //GEstion des champs
  const handleChange = ({currentTarget}) => {
    const {value, name} = currentTarget;

    setCredentials({...credentials, [name]: value})
  };
  //Gestion du submit
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      toast.info("Bonjour, vous êtes bien connecté !" );
      history.replace("/dashboard")
    } catch (error) {
      setError("Email invalide, veuillez vérifier votre saisie");
      toast.error("Attention ! Une erreur est survenue...")
    }
  };

  return (
    <>
          <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <BlurOnIcon className={classes.large}/>
                </Avatar>
                <Typography component="h1" variant="h5" color={"primary"}>
                  Connexion
                </Typography>
                <form onSubmit={handleSubmit} className={classes.form} noValidate>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    value={credentials.username}
                    onChange={handleChange}
                    type="email"
                    placeholder="adresse@email.fr"
                    name="username"
                    id="username"
                    autoFocus={true}
                    className={"form-control" + (error && " is-invalid")}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    value={credentials.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="Mot de passe"
                    name="password"
                    id="password"
                    className="form-control mb-4"
                    autoComplete="current-password"
                  />

                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Se souvenir de moi"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Se connecter
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link to="/register" variant="body2">
                        {"Pas de compte ? Je m'inscris"}
                      </Link>
                    </Grid>
                    <Grid item>
                      <Link to="#" variant="body2">
                        Mot de passe oublié ?
                      </Link>
                    </Grid>
                  </Grid>
                  <Box mt={5}>

                  </Box>
                </form>
              </div>
            </Grid>
          </Grid>

    </>
  );
};
export default LoginPage;