import React, {useEffect, useState} from 'react';
import {Formik, FormikProps, useFormik} from "formik";
import {TextField} from "@material-ui/core";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import GendersAPI from "../services/gendersAPI";
import CategoriesAPI from "../services/categoriesAPI";
import MembersAPI from "../services/membersAPI";
import StatusAPI from "../services/statusAPI";
import {Link} from "react-router-dom";
import FieldCheckBox from "../components/forms/FieldCheckBox";
import moment from "moment";
import NavbarMembers from "../components/NavbarMembers";


const MemberPageFormik = ({match, history}) => {

  const {id = "new"} = match.params;
  //Gestion du format de date
  const formatDate = (str) => moment(str).format('DD-MM-YYYY');
  const [genders, setGenders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [checked, setChecked] = useState(true);
  const member = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      licenceNumber: "",
      email: "",
      phoneNumber: "",
      gender: "",
      category: "",
      licencieAuClub: true,
      statuses: ""
    },

    onSubmit: async values => {
      console.log(values);
      try {
        if (editing) {
          await MembersAPI.update(id, values);
          //TODO : Flash notification de succes
          history.replace("/members");
        } else {
          await MembersAPI.create(values);
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

    }
  });

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
    statuses: ""
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
      const {firstName, lastName, birthDate, licenceNumber, email, phoneNumber, gender, category, statuses, licencieAuClub} = data;
      member.setValues({
        firstName,
        lastName,
        birthDate,
        licenceNumber,
        email,
        phoneNumber,
        gender: gender.id,
        category: category.id,
        statuses: statuses.id,
        licencieAuClub,
      });
    } catch (error) {
      console.log(error.response);
      //TODO : Notification flash d'une erreur
      //history.replace("/members");
    }
  };

  //Récupération de la liste des genres, catégories et status pour les mettre dans les inputs
  useEffect(() => {
    fetchGenders();
    fetchCategories();
    fetchStatus();
  }, []);

  // Récupération du bon membre quand l'identifiant de l'url change pour la modification d'un member
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchMember(id);
    }
  }, [id]);



  return (<>

    <div className="mb-3 d-flex justify-content-between align-items-center">
      <NavbarMembers/>
    </div>

    <div className="bg-container">

    {(!editing && <h1>Ajout d'un licencié</h1>) || (<h1>Modification d'un licencié</h1>)}
    <hr/>

    <form onSubmit={member.handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <Field
            name="firstName"
            label="Prénom"
            value={member.values.firstName}
            onChange={member.handleChange}
            as={TextField}
          />
        </div>
        <div className="col-md-6">
          <Field
            name="lastName"
            label="Nom de famille"
            value={member.values.lastName}
            onChange={member.handleChange}
            as={TextField}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Field
            name="birthDate"
            label="Date de naissance"
            placeHolder="Format de la date : JJ-MM-AAAA"
            value={(editing && formatDate(member.values.birthDate) || (member.values.birthDate))}
            onChange={member.handleChange}
            as={TextField}
          />
        </div>
        <div className="col-md-6">
          <Field
            name="licenceNumber"
            label="Numéro de licence"
            value={member.values.licenceNumber}
            onChange={member.handleChange}
            as={TextField}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <Field
            name="email"
            type="email"
            label="Email"
            value={member.values.email}
            onChange={member.handleChange}
            as={TextField}
          />
        </div>
        <div className="col-md-6">
          <Field
            name="phoneNumber"
            label="Numéro de téléphone"
            value={member.values.phoneNumber}
            onChange={member.handleChange}
            as={TextField}
          />
        </div>
      </div>
      <Select
        name="gender"
        label="Sexe"
        value={member.values.gender}
        onChange={member.handleChange}
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
        value={member.values.category}
        onChange={member.handleChange}
      >
        <option>- Choisir la catégorie -</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      <p>Statut(s)</p>
      <div className="div-checkbox-team d-flex justify-content-start flex-wrap align-items-center ml-4">
        {statuses.map(status => (
          <FieldCheckBox key={status.id}
                         id={status.id}
                         value={status.id}
                         label={status.name}
                         type="checkbox"
                         name="statuses"
                         checked={checked}
                         onChange={member.handleChange}
          />))}

      </div>
      <div className="div-checkbox-team d-flex justify-content-start flex-wrap align-items-center ml-4">
        <FieldCheckBox
          value={member.values.licencieAuClub=false}
          label="Je coche cette case si je ne fais pas parti des licenciés du club, et je confirme être licencié dans un autre club."
          type="checkbox"
          name="licencieAuClub"
          selected={member.values.licencieAuClub}
          onChange={member.handleChange}/></div>

      <div className="form-group d-flex flex-row-reverse">
        <Link to="/members" className="btn btn-link">Retour à la liste des licenciés</Link>
        <button type="submit" className="btn btn-success">Enregistrer</button>
      </div>
    </form>

    </div>
  </>);
};
export default MemberPageFormik;