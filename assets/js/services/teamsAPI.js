import axios from "axios";

function findAll() {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/teams")
    .then(response => response.data["hydra:member"])
}
function findAllByGender(gender) {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/teams?gender.type=" + gender)
    .then(response => response.data["hydra:member"])
}

function find(id) {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/teams/" + id)
    .then(response => response.data);
}

function create(team) {
  return axios.post("http://localhost/appli-GESCLUB/public/api/teams",
    {
      ...team,
      gender: `/api/genders/${team.gender}`,
      category: `/api/categories/${team.category}`
    });
}

function update(id, team) {
  return axios.put("http://localhost/appli-GESCLUB/public/api/teams/" + id,
    {
      ...team,
      gender: `/api/genders/${team.gender}`,
      category: `/api/categories/${team.category}`,
    });
}

function updateMembers(id, team) {

  return axios.put("http://localhost/appli-GESCLUB/public/api/teams/" + id,
    {
      ...team,
      gender: `/api/genders/${team.gender.id}`,
      category: `/api/categories/${team.category.id}`,
      players: team.players.map(p => `/api/members/${p.id}`),
      coachs: team.coachs.map(c => `/api/members/${c.id}`)
    });
}

function deleteTeam(id) {
  return axios
    .delete("http://localhost/appli-GESCLUB/public/api/teams/" + id)
}

function addMember(id, newMember) {
  return axios.post("http://localhost/appli-GESCLUB/public/api/teams/" + id + "/addMember",
    {
      ...newMember,
      members: newMember.map(m => `/api/members/${m}`)

    })
}

export default {
  findAll,
  findAllByGender,
  find,
  create,
  update,
  updateMembers,
  delete: deleteTeam,
  addMember,
}