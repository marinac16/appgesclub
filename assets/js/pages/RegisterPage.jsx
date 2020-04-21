import React, {useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import UsersAPI from "../services/usersAPI"


const RegisterPage= (props) => {

  const [user, setUser] = useState({

    email:"",
    password:"",
    passwordConfirm:"",
    club:""
  });
  const [errors, setErrors] = useState({

    email:"",
    password:"",
    passwordConfirm:"",
    club:""
  });

  // Gestion des changements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setUser({...user, [name]: value});
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    const apiErrors = {};

    if (user.password !== user.passwordConfirm) {
      apiErrors.passwordConfirm = "Le mot de passe et la confirmation du mot de passe ne sont pas identiques";
      setErrors(apiErrors);
    }
    event.preventDefault();
    console.log(user);
    try {
      await UsersAPI.register(user);

      //TODO : Flash success
      history.replace("/login");
    } catch (error) {
      const {violations} = error.response.data;

      if (violations) {

        violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);

        //TODO : Flash notification des erreurs
      }
    }

  };


    return (<>

      <h1>Inscription</h1>

      <form onSubmit={handleSubmit}>

        <Field
          name="club"
          label="Référence du club"
          placeHolder="Numéro fourni par le club"
          error={errors.club}
          value={user.club}
          onChange={handleChange}
        />
        <Field
          name="email"
          label="Email"
          placeHolder="adresse@email.fr"
          type="email"
          error={errors.email}
          value={user.email}
          onChange={handleChange}
        />
        <Field
          name="password"
          label="Mot de passe"
          type="password"
          placeHolder="Mot de passe"
          error={errors.password}
          value={user.password}
          onChange={handleChange}
        />
        <Field
          name="passwordConfirm"
          label="Confirmation du mot de passe"
          type="password"
          placeHolder="Confirmation du mot de passe"
          error={errors.passwordConfirm}
          value={user.passwordConfirm}
          onChange={handleChange}
        />
        <div className="form-group d-flex flex-row-reverse">
          <Link to="/login" className="btn btn-link">J'ai déja un compte</Link>
          <button type="submit" className="btn btn-success">S'inscrire</button>
        </div>


      </form>

    </>
  );
};

export default RegisterPage;