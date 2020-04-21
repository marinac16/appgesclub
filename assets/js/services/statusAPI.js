import axios from "axios";

function findAll(){
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/statuses")
    .then(response => response.data["hydra:member"])
}



export default {
  findAll,
}