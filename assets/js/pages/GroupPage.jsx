import React, {useEffect, useState} from 'react';
import NavbarMembers from "../components/NavbarMembers";
import Field from "../components/forms/Field";
import MembersAPI from "../services/membersAPI"
import GendersAPI from "../services/gendersAPI";


const GroupPage = ({match, history}) => {
  const {id = "new"} = match.params;
  const [members, setMembers] = useState([]);
  const [group, setGroup] = useState({
    name: "",
    members: []
  });
  const [errors, setErrors] = useState({
    name: "",
    members: []
  });
  const [editing, setEditing] = useState(false);

  //Récupération des membres
  const fetchMembers = async () => {
    try {
      const data = await MembersAPI.findAll();
      setMembers(data);
    } catch (error) {
      history.replace('/groups');
      //TODO : Notification flash d'une erreur
    }
  };
  //Récupération de la liste des genres et des catégories a chaque chargement du composant
  useEffect(() => {
    fetchMembers();
  }, []);

  // Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setGroup({...group, [name]: value});
  };


  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <NavbarMembers/>
      </div>


    </>
  );
};
export default GroupPage;