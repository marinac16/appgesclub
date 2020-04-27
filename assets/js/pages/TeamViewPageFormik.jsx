import React, {useEffect, useState} from 'react';
import TeamsAPI from "../services/teamsAPI";
import MembersAPI from "../services/membersAPI";
import moment from "moment";
import NavbarMembers from "../components/NavbarMembers";
import {useFormik} from "formik";


const TeamViewPage = ({match, history}) => {

  const {id = "new"} = match.params;
  const [showing, setShowing] = useState(false);

  //Gestion du format de date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY');

  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState([]);
  const [teamAPI, setTeamAPI] = useState({
    name: "",
    gender: "",
    category: "",
    members: [],
  });
  const team = useFormik({
    initialValues: {
      name: "",
      gender: "",
      category: "",
      members: [],
    },

    onSubmit: async values => {
      console.log(values);
      try {
        console.log(id);
          await TeamsAPI.addMember(id, values);
          //TODO : Flash notification de succes
          history.replace("/teams");

      } catch ({response}) {
        const {violations} = response.data;

        if (violations) {
          const apiErrors = {};
          violations.forEach(({propertyPath, message}) => {
            apiErrors[propertyPath] = message;
          });

          //TODO : Flash notification des erreurs
        }
      }

    }
  });

  //Récupérer la liste des members
  const fetchMembers = async () => {
    try {
      const data = await MembersAPI.findAll();
      setMembers(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  //Récupération de l'équipe en fonction de l'identifiant
  const fetchTeam = async id => {
    try {
      const data = await TeamsAPI.find(id);
      setTeamAPI(data);
    } catch (error) {
      console.log(error.response);
      //TODO : Notification flash d'une erreur
      history.replace("/teams");
    }
  };

  // Au chargement du composant, on va chercher les customers
  useEffect(() => {
    fetchMembers();
  }, []);

  // Récupération de la bonne facture quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setShowing(true);
      fetchTeam(id);
    }
  }, [id]);


  return (<>

    <div className="mb-3 d-flex justify-content-between align-items-center">
      <NavbarMembers/>
      <h3 className="text-light">{team.name}</h3>
    </div>
    <table className="table table-hover">
      <thead>
      <tr>
        <th>Joueur</th>
        <th>Date de naissance</th>
        <th>Numéro de licence</th>
        <th>Email</th>
        <th>Téléphone</th>
      </tr>
      </thead>
      <tbody>

      {teamAPI.members.map(memberOfTeam =>
        <tr key={memberOfTeam.id}>
          <td>{memberOfTeam.firstName} {memberOfTeam.lastName}</td>
          <td>{formatDate(memberOfTeam.birthDate)}</td>
          <td>{memberOfTeam.licenceNumber}</td>
          <td>{memberOfTeam.email}</td>
          <td>{memberOfTeam.phoneNumber}</td>
        </tr>
      )}

      </tbody>
    </table>


    <form onSubmit={team.handleSubmit}>
      <h4 className="text-light">Ajouter un(e) joueur(se) à cette équipe</h4>
      <div className="form-group d-flex justify-content-between align-items-center">
        <input className="form-control form-control-sm"
               type="text"
               placeholder="Choisissez un joueur ..."
               id="members"
               onChange={team.handleChange}
               list="joueurs"/>
        <datalist id="joueurs">
          {members.map(member => (
            <option key={member.id} value={member.id} name="members" label={member.firstName + " " + member.lastName}/>
          ))}
        </datalist>
        <button type="submit" className="btn btn-success ml-3">
          Ajouter
        </button>
      </div>


    </form>

  </>)
    ;
};
export default TeamViewPage;
