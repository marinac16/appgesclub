import React, {useState} from 'react';
import {Link} from "react-router-dom";
import UsersAPI from "../services/usersAPI";
import {toast} from "react-toastify";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import BlurOnIcon from '@material-ui/icons/BlurOn';
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";

import BackgroundImage from '../../images/LoginImage.png'

const RegisterPage = (props) => {

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
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(4),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const classes = useStyles();


  const [user, setUser] = useState({

    email: "",
    password: "",
    passwordConfirm: "",
    club: ""
  });
  const [errors, setErrors] = useState({

    email: "",
    password: "",
    passwordConfirm: "",
    club: ""
  });

  // Gestion des changements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setUser({...user, [name]: value});
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    const apiErrors = {};

    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm = "Le mot de passe et la confirmation du mot de passe ne sont pas identiques";
      setErrors(apiErrors);
      toast.error("Attention ! Une erreur est survenue...");
      return;
    }
    event.preventDefault();
    console.log(user);
    try {
      await UsersAPI.register(user);
      toast.success("Votre inscription a été valider, vous pouvez vous connecter !");
      history.replace("/login");
    } catch (error) {
      const {violations} = error.response.data;
      if (violations) {
        violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
        toast.error("Attention ! Une erreur est survenue...");
      }
    }

  };


  return (<>

      <Grid container component="main" className={classes.root}>
        <CssBaseline/>
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <BlurOnIcon className={classes.large}/>
            </Avatar>
            <Typography component="h1" variant="h5" color={"primary"}>
              Inscription
            </Typography>
            <form onSubmit={handleSubmit} className={classes.form} noValidate>
              <TextField
                id="outlined-basic"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="club"
                label="Référence du club"
                placeHolder="Numéro fourni par le club"
                error={errors.club}
                value={user.club}
                onChange={handleChange}/>

              <TextField
                id="outlined-basic"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                name="email"
                label="Email"
                placeHolder="adresse@email.fr"
                type="email"
                error={errors.email}
                value={user.email}
                onChange={handleChange}/>

              <TextField
                id="outlined-basic"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                name="password"
                label="Mot de passe"
                type="password"
                placeHolder="Mot de passe"
                error={errors.password}
                value={user.password}
                onChange={handleChange}/>

              <TextField
                id="outlined-basic"
                variant="outlined"
                margin="normal"
                fullWidth
                required
                name="passwordConfirm"
                label="Confirmation du mot de passe"
                type="password"
                placeHolder="Confirmation du mot de passe"
                error={errors.passwordConfirm}
                value={user.passwordConfirm}
                onChange={handleChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                S'inscrire
              </Button>
              <Grid container>
                <Grid item xs>
                  <p>(*) Ces champs sont obligatoires</p>
                </Grid>
                <Grid item>
                  <Link to="/login">J'ai déja un compte</Link>
                </Grid>
              </Grid>


            </form>
          </div>
        </Grid>
      </Grid>


    </>
  );
};

export default RegisterPage;