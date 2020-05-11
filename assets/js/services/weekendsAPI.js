import axios from "axios";

function findAll() {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/weekends")
    .then(response => response.data["hydra:member"])
}
function find(id) {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/weekends/" + id)
    .then(response => response.data);
}
function create(weekend) {
  return axios.post("http://localhost/appli-GESCLUB/public/api/weekends", weekend);
}
function update(id, weekend) {
  return axios.put("http://localhost/appli-GESCLUB/public/api/weekends/" + id, weekend);
}


export default {
  findAll,
  find,
  create,
  update,
}