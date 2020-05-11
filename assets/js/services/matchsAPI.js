import axios from "axios";

function create(match) {
  return axios
    .post("http://localhost/appli-GESCLUB/public/api/matches",
      {
        ...match,
        teamLocal: `/api/teams/${match.teamLocal}`,
        clubReferent: `/api/members/${match.clubReferent}`,
        weekend: `/api/weekends/${match.weekend}`,
        referees: match.referees.map(r => `/api/members/${r}`),
        scorers: match.scorers.map(s => `/api/members/${s}`)
      });
}

function update(match, id) {
  return axios
    .put("http://localhost/appli-GESCLUB/public/api/matches/" + id ,
      {
        ...match,
        teamLocal: `/api/teams/${match.teamLocal}`,
        clubReferent: `/api/members/${match.clubReferent}`,
        weekend: `/api/weekends/${match.weekend}`,
        referees:`/api/members/${match.referees}`,
        scorers:`/api/members/${match.scorers}`,
      });
}

function deleteMatch(id) {
  return axios
    .delete("http://localhost/appli-GESCLUB/public/api/matches/" + id)
}

export default {
  create,
  update,
  delete: deleteMatch,

}