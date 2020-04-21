import axios from "axios";

function register(user){
  return axios.post("http://localhost/appli-GESCLUB/public/api/users",
    {...user,
    club: `/api/clubs/${user.club}`
  });
}

export default {
  register,
}