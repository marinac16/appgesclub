import React, {useEffect, useState} from 'react';
import TeamsAPI from "../services/teamsAPI";
import MembersAPI from "../services/membersAPI";
import moment from "moment";
import NavbarMembers from "../components/NavbarMembers";
import Select from "../components/forms/Select";


const TeamViewPage = ({match, history}) => {

  const {id = "new"} = match.params;
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
    ,
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

  const handleRemoveMember = async id => {
    const originalMembers = (team.members);
    const index = originalMembers.findIndex(member => member.id === id);

    originalMembers.splice(index, 1);
    setTeam({members: originalMembers});

    try {
      console.log(team.id, team);
      await TeamsAPI.updateMembers(team.id, team);
      window.location.reload();
    } catch (error) {
      setError("Ce joueur ne peut pas etre supprimé !");

    }
  };

  // Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    setNewMember({id: currentTarget.value});
  };


  //Mise a jour d'une équipe en ajoutant un membre dans l'équipe
  const handleAddMember = async event => {
    event.preventDefault();

    const originalMembers = (team.members);
    originalMembers.push(newMember);

    setTeam({members: originalMembers});
    console.log(team.members);

    try {
      await TeamsAPI.updateMembers(id, team);
      window.location.reload()
    } catch (error) {
      setError("Ce joueur ne peut pas etre ajouté !");

    }
  };

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
        <th/>
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
          <td>
            <button
              onClick={() => handleRemoveMember(memberOfTeam.id)}
              className="ml-1 btn btn-sm btn-outline-danger"><i className="fas fa-user-times"/>
            </button>
          </td>
        </tr>
      )}

      </tbody>
    </table>


    <form onSubmit={handleAddMember} className="d-flex mt-5 p-3 white-container">
      <h5 className="text-primary mr-3">Ajouter un(e) joueur(se) à cette équipe : </h5>

      <input className="form-control form-control-sm w-25"
             type="text"
             placeholder="Choisissez un joueur ..."
             id="search"
             name="members"
             onChange={handleChange}
             list="joueurs"/>
      <datalist id="joueurs">
        {members.map((member, key) => (
          <option key={key}
                  value={member.id}
            >
            {member.firstName + " " + member.lastName}
          </option>
        ))}
      </datalist>


      <button type="submit" className="btn btn-success ml-3 d-flex ">
        <i className="fas fa-user-plus pr-2"/>
      </button>


    </form>

  </>)
    ;
};
export default TeamViewPage;
