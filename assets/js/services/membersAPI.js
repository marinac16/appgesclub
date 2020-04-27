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

function findAllByStatus() {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/members")
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

function update(id, values) {
  return axios
    .put("http://localhost/appli-GESCLUB/public/api/members/" + id,
      {
        ...values,
        gender: `/api/genders/${values.gender}`,
        category: `/api/categories/${values.category}`,
        statuses: values.statuses.map(status => `/api/statuses/${status}`),
        team: `/api/teams/${values.team}`
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