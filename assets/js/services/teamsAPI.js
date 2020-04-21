import axios from "axios";

function findAll() {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/teams")
    .then(response => response.data["hydra:member"])
}

function find(id) {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/teams/" + id)
    .then(response => response.data);
}

function create(team) {
  return axios.post("http://localhost/appli-GESCLUB/public/api/teams",
    {...team,
    gender: `/api/genders/${team.gender}`,
    category: `/api/categories/${team.category}`
  });
}

function update(id, team) {
  return axios.put("http://localhost/appli-GESCLUB/public/api/teams/" + id,
    {...team,
      gender: `/api/genders/${team.gender}`,
      category: `/api/categories/${team.category}`
    });
}

function deleteTeam(id) {
  return axios
    .delete("http://localhost/appli-GESCLUB/public/api/teams/" + id)
}

function addMember (id, member) {
  return axios.post("http://localhost/appli-GESCLUB/public/api/teams/" + id + "/addMember",
    {...member,
      member: `[/api/members/${member.id}]`
    })
}

export default {
  findAll,
  find,
  create,
  update,
  delete: deleteTeam,
  addMember,
}