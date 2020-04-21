import React, {useEffect, useState} from 'react';
import TeamsAPI from "../services/teamsAPI";
import GendersAPI from "../services/gendersAPI";
import CategoriesAPI from "../services/categoriesAPI";
import MembersAPI from "../services/membersAPI";
import moment from "moment";


const TeamViewPage = ({match, history}) => {

  const {id = "new"} = match.params;
  //const id = match.params;
  const [showing, setShowing] = useState(false);

  //Gestion du format de date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY');

  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState([]);
  const [team, setTeam] = useState({
    name: "",
    gender: "",
    category: "",
    members: []
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

  //Récupérer du members par son id
  const fetchNewMember = async id => {
    try {
      const data = await MembersAPI.find(id);
      setNewMember(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  //Récupération de l'équipe en fonction de l'identifiant
  const fetchTeam = async id => {
    try {
      const data = await TeamsAPI.find(id);
      setTeam(data);

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


  // Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    console.log(value);
    setNewMember({...newMember, [name]: [value]});
  };

  const handleAddMember = async event => {
    event.preventDefault();
    try{
      console.log(id, newMember);
      await TeamsAPI.addMember(id, [newMember]);




    }catch (error) {
      setError("Ce joueur ne peut pas etre ajouté !")

    }
  };


  return (<>

  <h1 className="text-primary">{team.name}</h1>
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

    {team.members.map(memberOfTeam =>
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


  <form onSubmit={handleAddMember}>
    <h4 className="text-secondary">Ajouter un(e) joueur(se) à cette équipe</h4>
  <div className="form-group d-flex justify-content-between align-items-center">
    <input className="form-control form-control-sm"
           value={newMember}
           type="text"
           placeholder="Choisissez un joueur ..."
           name="newMember"
           onChange={handleChange}
           id="search"
           list="joueurs"/>
    <datalist id="joueurs">
      {members.map(member => (
        <option key={member.id}>{member.firstName + " " + member.lastName}</option>
      ))}
    </datalist>
    <button onClick={handleAddMember} type="submit" className="btn btn-success ml-3">
      Ajouter
    </button>
  </div>


  </form>

</>)
  ;
};
export default TeamViewPage;
