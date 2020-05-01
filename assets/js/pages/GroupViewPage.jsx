import React, {useEffect, useState} from 'react';
import NavbarMembers from "../components/NavbarMembers";
import GroupsAPI from "../services/groupsAPI";
import MembersAPI from "../services/membersAPI";
import TeamsAPI from "../services/teamsAPI";
import moment from "moment";


const GroupViewPage = ({match, history}) => {

  const {id = "new"} = match.params;
  const [showing, setShowing] = useState(false);

  //Gestion du format de date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY');

  const [group, setGroup] = useState({
    name: "",
    members: [],
  });
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState([]);

  //Récupération de l'équipe en fonction de l'identifiant
  const fetchGroup = async id => {
    try {
      const data = await GroupsAPI.find(id);
      setGroup(data);
    } catch (error) {
      console.log(error.response);
      //TODO : Notification flash d'une erreur
      //history.replace("/teams");
    }
  };

  //Récupérer la liste des membres
  const fetchMembers = async () => {
    try {
      const data = await MembersAPI.findAll();
      setMembers(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  // Au chargement du composant, on va chercher les membres
  useEffect(() => {
    fetchMembers();
  }, []);

  // Récupération de la bonne équipe quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setShowing(true);
      fetchGroup(id);
    }
  }, [id]);

  // Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    setNewMember({id: currentTarget.value});
  };

  const handleAddMember = async event => {
    event.preventDefault();

    console.log(newMember);
    const originalMembers = (group.members);
    originalMembers.push(newMember);

    setGroup({members: originalMembers});
    try {
      await GroupsAPI.update(id, group);
      window.location.reload()
    } catch (error) {


    }

  };


  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <NavbarMembers/>
      </div>

      <div className="bg-container">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="text-white">{group.name}</h3>
          <button className="btn btn-success">Bouton 1</button>
        </div>

        <table className="table bg-dark text-white mt-3">
          <thead>
          <tr>
            <th className="text-center">Membre</th>
            <th className="text-center">Date de naissance</th>
            <th className="text-center">Numéro de licence</th>
            <th className="text-center">Email</th>
            <th className="text-center">Téléphone</th>
            <th/>
          </tr>
          </thead>
          <tbody>

          {group.members.map(m =>
            <tr key={m.id}>
              <td>{m.firstName} {m.lastName}</td>
              <td className="text-center">{formatDate(m.birthDate)}</td>
              <td className="text-center">{m.licenceNumber}</td>
              <td className="text-center">{m.email}</td>
              <td className="text-center">{m.phoneNumber}</td>
              <td className="text-center">
                <button
                  //onClick={() => handleRemovePlayers(memberOfTeam.id)}
                  className="ml-1 btn btn-sm btn-danger"><i className="fas fa-user-times"/>
                </button>
              </td>
            </tr>
          )}
          </tbody>
        </table>

        <form onSubmit={handleAddMember} className="white-container">
          <div className="d-flex mt-2 p-3 white-container">
            <h5 className="text-white mr-3">Ajouter un membre ce groupe : </h5>

            <input className="form-control form-control-sm w-25"
                   type="text"
                   placeholder="Choisissez un joueur ..."
                   name="members"
                   onChange={handleChange}
                   list="members"/>
            <datalist id="members">
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
          </div>
        </form>
      </div>


    </>
  );
};
export default GroupViewPage;