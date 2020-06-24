import axios from "axios";

function findAll() {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/members")
    .then(response => response.data["hydra:member"])
}

function find(id) {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/members/" + id)
    .then(response => response.data)
}

function findAllByStatus(status) {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/members?statuses.name=" + status)
    .then(response => response.data["hydra:member"])
}

function create(values) {
  return axios
    .post("http://localhost/appli-GESCLUB/public/api/members",
      {
        ...values,
        gender: `/api/genders/${values.gender}`,
        category: `/api/categories/${values.category}`,
        statuses: values.statuses.map(status => `/api/statuses/${status}`)
      });
}

function update(membre, id) {
  return axios
    .put("http://localhost/appli-GESCLUB/public/api/members/" + id,
      {
        ...membre,
        gender: `/api/genders/${membre.gender.id}`,
        category: `/api/categories/${membre.category.id}`,
        statuses: membre.statuses.map(status => `/api/statuses/${status.id}`),
        teams: membre.teams.map(team =>`/api/teams/${team.id}`)
      });
}

function deleteMembers(id) {
  return axios
    .delete("http://localhost/appli-GESCLUB/public/api/members/" + id)
}

export default {
  findAll,
  find,
  findAllByStatus,
  create,
  update,
  delete: deleteMembers
}