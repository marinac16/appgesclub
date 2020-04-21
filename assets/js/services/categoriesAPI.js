import axios from "axios";

function findAll(){
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/categories")
    .then(response => response.data["hydra:member"])
}



export default {
  findAll,
}