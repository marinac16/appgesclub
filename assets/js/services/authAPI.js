import axios from "axios";
import jwtDecode from "jwt-decode";


//Déconnexion  (suppression du token du localStorage et sur axios)
function logout() {
  window.localStorage.removeItem("authToken");
  delete axios.defaults.headers["Authorization"];

}

/**
 * Requete HTTP d'authentification et stockage du token dans le storage et sur axios
 * @param credentials
 * @returns {Promise<boolean>}
 */
function authenticate(credentials) {
  return axios
    .post("http://localhost/appli-GESCLUB/public/api/login_check", credentials)
    .then(response => response.data.token)
    .then(token => {
      //Je stock le token dans le local storage
      window.localStorage.setItem("authToken", token);
      //On previent axios qu'on a maintenant un header par défault sur toute nos futures requetes HTTP
      setAxiosToken(token);

      return true;
    })
}

/**
 * Positionne le token JWT sur axios
 * @param token
 */
function setAxiosToken(token) {
  axios.defaults.headers["Authorization"] = "Bearer " + token;
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
  //1. Voir si on a un Token ?
  const token = window.localStorage.getItem("authToken");

  //2. Si le Token est encore valide
  if (token) {

    const {exp: expiration} = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de savoir si on est authentifier ou pas
 * @returns {boolean}
 */
function isAuthenticated() {
  //1. Voir si on a un Token ?
  const token = window.localStorage.getItem("authToken");

  //2. Si le Token est encore valide
  if (token) {

    const {exp: expiration} = jwtDecode(token);
    if (expiration * 1000 > new Date().getTime()) {
      return true
    }
    return false
  }
  return false
}

export default {
  authenticate,
  logout,
  setup,
  isAuthenticated

};