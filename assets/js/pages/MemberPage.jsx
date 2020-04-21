import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import SelectMultiple from "../components/forms/SelectMultiple"
import GendersAPI from "../services/gendersAPI";
import CategoriesAPI from "../services/categoriesAPI";
import MembersAPI from "../services/membersAPI";
import StatusAPI from "../services/statusAPI";
import {Link} from "react-router-dom";
import SelectM from 'react-select';
import FieldCheckBox from "../components/forms/FieldCheckBox";


const MemberPage = ({match, history}) => {

  const {id = "new"} = match.params;


  const [member, setMember] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    licenceNumber: "",
    email: "",
    phoneNumber: "",
    gender: "",
    category: "",
  });
  const [statuts, setStatuts] = useState([]); //Statuts récupérer des input apres le choix de l'utilisateur
  const [genders, setGenders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);//statuts existant en BDD
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    licenceNumber: "",
    email: "",
    phoneNumber: "",
    gender: "",
    category: "",
  });

  //Récupération des genres (F/M)
  const fetchGenders = async () => {
    try {
      const data = await GendersAPI.findAll();
      setGenders(data);
    } catch (error) {
      history.replace('/members')
      //TODO : Notification flash d'une erreur
    }
  };
  //Récupération des Catégories
  const fetchCategories = async () => {
    try {
      const data = await CategoriesAPI.findAll();
      setCategories(data);
    } catch (error) {
      history.replace('/members');
      //TODO : Notification flash d'une erreur
    }
  };
  //Récupération des status
  const fetchStatus = async () => {
    try {
      const data = await StatusAPI.findAll();
      setStatuses(data);
    } catch (error) {
      history.replace('/members');
      //TODO : Notification flash d'une erreur
    }
  };
  //Récupération du membre en fonction de l'identifiant
  const fetchMember = async id => {
    try {
      const data = await MembersAPI.find(id);
      setMember(data);

    } catch (error) {
      console.log(error.response);
      //TODO : Notification flash d'une erreur
      history.replace("/invoices");
    }
  };

  //Récupération de la liste des genres, catégories et status pour les mettre dans les inputs
  useEffect(() => {
    fetchGenders();
    fetchCategories();
    fetchStatus()
  }, []);

  // Récupération du bon membre quand l'identifiant de l'url change pour la modification d'un member
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchMember(id);
    }
  }, [id]);
  // Gestion des changements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setMember({...member, [name]: value});
  };



  //Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();
    console.log(member);


    try {
      if (editing) {
        await MembersAPI.update(id, member);
        //TODO : Flash notification de succes
      } else {
        await MembersAPI.create(member);

        //TODO : Flash notification de succes
        history.replace("/members");
      }
      setErrors({});
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

  return (<>
    {(!editing && <h1>Création d'un licencié</h1>) || (<h1>Modification d'un licencié</h1>)}


    <form onSubmit={handleSubmit} className="mt-5">
      <div className="row">
        <div className="col-md-6">
          <Field
            name="firstName"
            label="Prénom"
            placeHolder="prénom"
            value={member.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
        </div>
        <div className="col-md-6">
          <Field
            name="lastName"
            label="Nom de famille"
            placeHolder="Nom de famille"
            value={member.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Field
            name="birthDate"
            type="date"
            label="Date de naissance"
            value={member.birthDate}
            onChange={handleChange}
            error={errors.birthDate}
          />
        </div>
        <div className="col-md-6">
          <Field
            name="licenceNumber"
            label="Numéro de licence"
            placeHolder="Numéro de licence"
            value={member.licenceNumber}
            onChange={handleChange}
            error={errors.licenceNumber}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Field
            name="email"
            type="email"
            label="Email"
            value={member.email}
            onChange={handleChange}
            error={errors.email}
          />
        </div>
        <div className="col-md-6">
          <Field
            name="phoneNumber"
            label="Numéro de téléphone"
            placeHolder="10 chiffres"
            value={member.phoneNumber}
            onChange={handleChange}
            error={errors.phoneNumber}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">

        </div>
        <div className="col-md-6">

        </div>
      </div>

      <Select
        name="gender"
        label="Sexe"
        value={member.gender}
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
        value={member.category}
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

      <div className="div-checkbox-team d-flex justify-content-start flex-wrap align-items-center">
        {statuses.map(status => (
          <FieldCheckBox key={status.id}
                         id={status.id}
                         value={status.id}
                         label={status.name}
                         type="checkbox"
                         name="statuses"
                         onChange={handleChange}
          />))}
      </div>



      <div className="form-group d-flex flex-row-reverse">
        <Link to="/members" className="btn btn-link">Retour à la liste des licenciés</Link>
        <button type="submit" className="btn btn-success">Enregistrer</button>
      </div>


    </form>

  </>);
};
export default MemberPage;