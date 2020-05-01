import axios from "axios";

function findAll() {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/groups")
    .then(response => response.data["hydra:member"])
}
function create(group) {
  return axios.post("http://localhost/appli-GESCLUB/public/api/groups", group);
}

export default {
  findAll,
  create,
}