import axios from "axios";

function findAllByWeekendAndisHome(weekend, response) {
  return axios
    .get("http://localhost/appli-GESCLUB/public/api/matches?home=" + response + "&weekend=" + weekend)
    .then(response => response.data["hydra:member"])
}

function create(match) {
  return axios
    .post("http://localhost/appli-GESCLUB/public/api/matches",
      {
        ...match,
        teamLocal: `/api/teams/${match.teamLocal}`,
        weekend: `/api/weekends/${match.weekend}`,
        //clubReferent: `/api/members/${match.clubReferent}`,
      });
}

function update(match, matchUpdate, id) {
  return axios
    .put("http://localhost/appli-GESCLUB/public/api/matches/" + id ,
      {
        ...match,
        teamLocal: `/api/teams/${match.teamLocal.id}`,
        referentClub: `/api/members/${match.referentClub.id}`,
        weekend: `/api/weekends/${match.weekend.id}`,
        referees: matchUpdate.referees.map(r => `/api/members/${r}`),
        //scorers: match.scorers.map(s => `/api/members/${s}`)
      });
}

function deleteMatch(id) {
  return axios
    .delete("http://localhost/appli-GESCLUB/public/api/matches/" + id)
}

export default {
  findAllByWeekendAndisHome,
  create,
  update,
  delete: deleteMatch,

}