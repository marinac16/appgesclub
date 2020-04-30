import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import {Link} from "react-router-dom";
import TeamsAPI from "../services/teamsAPI";
import GendersAPI from "../services/gendersAPI";
import CategoriesAPI from "../services/categoriesAPI";
import NavbarMembers from "../components/NavbarMembers";


const TeamPage = ({match, history}) => {

  const {id = "new"} = match.params;

  const [team, setTeam] = useState({
    name: "",
    gender: "",
    category: ""
  });
  const [errors, setErrors] = useState({
    name: "",
    gender: "",
    category: ""
  });
  const [genders, setGenders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(false);

  //Récupération des genres (F/M)
  const fetchGenders = async () => {
    try {
      const data = await GendersAPI.findAll();
      setGenders(data);
    } catch (error) {
      history.replace('/teams');
      //TODO : Notification flash d'une erreur
    }
  };
  //Récupération des Catégories
  const fetchCategories = async () => {
    try {
      const data = await CategoriesAPI.findAll();
      setCategories(data);
    } catch (error) {
      history.replace('/teams');
      //TODO : Notification flash d'une erreur
    }
  };

  //Récupération de l'équipe en fonction de l'identifiant
  const fetchTeam = async id => {
    try {
      const data = await TeamsAPI.find(id);
      const {name, gender, category} = data;
      setTeam({name, gender: gender.id, category: category.id});

    } catch (error) {
      console.log(error.response);
      //TODO : Notification flash d'une erreur
      history.replace("/teams");
    }
  };

  //Récupération de la liste des clients a chaque chargement du composant
  useEffect(() => {
    fetchGenders();
    fetchCategories();
  }, []);

  // Récupération de la bonne facture quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchTeam(id);
    }
  }, [id]);

  // Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setTeam({...team, [name]: value});
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      if (editing) {
        await TeamsAPI.update(id, team);
        //TODO : Flash notification de succes
        history.replace("/teams");
      } else {
        await TeamsAPI.create(team);
        //TODO : Flash notification de succes
        history.replace("/teams");
        setErrors({});
      }
    } catch ({response}) {
      const {violations} = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({propertyPath, message}) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
        //TODO : Flash notification des erreurs
      }
    }
  };

  return (
    <>

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <NavbarMembers/>
      </div>
      <div className="bg-container mt-4">
        {(editing && <h1>Modification d'une équipe</h1>) || (<h1>Création d'un équipe</h1>)}
        <hr/>


        <form onSubmit={handleSubmit} className="mt-5">
          <Field
            name="name"
            placeHolder="Categorie - Niveau - Sexe"
            label="Nom de l'équipe"
            onChange={handleChange}
            value={team.name}
            error={errors.name}
          />
          <Select
            name="gender"
            label="Sexe"
            value={team.gender}
            error={errors.gender}
            onChange={handleChange}
          >
            <option>- Choisir le sexe -</option>
            {genders.map(gender => (
              <option key={gender.id} value={gender.id}>
                {gender.type}
              </option>
            ))}
          </Select>
          <Select
            name="category"
            label="Catégorie"
            value={team.category}
            error={errors.category}
            onChange={handleChange}
          >
            <option>- Choisir la catégorie -</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          <div className="form-group d-flex flex-row-reverse">
            <button type="submit" className="btn btn-success">Enregistrer</button>
            <Link to="/teams" className="btn btn-link text-white">Retour à la liste des équipes</Link>
          </div>
        </form>
      </div>

      </>
      );
      };
      export default TeamPage;