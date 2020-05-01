import axios from "axios";

function findAll() {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/groups")
    .then(response => response.data["hydra:member"])
}

function find(id) {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/groups/" + id)
    .then(response => response.data);
}

function create(group) {
  return axios.post("http://localhost/appli-GESCLUB/public/api/groups", group);
}

function update(id, group) {
  return axios.put("http://localhost/appli-GESCLUB/public/api/groups/" + id,
    {
      ...group,
      members: group.members.map(m => `/api/members/${m.id}`)
    });
}

function deleteGroup(id) {
  return axios
    .delete("http://localhost/appli-GESCLUB/public/api/groups/" + id)
}

export default {
  findAll,
  find,
  create,
  update,
  delete: deleteGroup,
}