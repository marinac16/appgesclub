import React, {useState, useContext} from 'react';
import AuthAPI from "../services/authAPI";
import AuthContext from "../context/AuthContext";
import {Col, Row} from "react-bootstrap";
import {toast} from "react-toastify";

const LoginPage = ({history}) => {

  const {setIsAuthenticated} = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  //GEstion des champs
  const handleChange = ({currentTarget}) => {
    const {value, name} = currentTarget;

    setCredentials({...credentials, [name]: value})
  };
  //Gestion du submit
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await AuthAPI.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      toast.info("Bonjour, vous êtes bien connecté !" );
      history.replace("/dashboard")
    } catch (error) {
      setError("Email invalide, veuillez vérifier votre saisie");
      toast.error("Attention ! Une erreur est survenue...")
    }
  };

  return (
    <>
      <Row>
        <Col sm={3}/>
        <Col sm={6} className="white-container-arround mt-4">
          <h1 className="text-primary">Connexion à l'application</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Email</label>
              <input
                value={credentials.username}
                onChange={handleChange}
                type="email"
                placeholder="adresse@email.fr"
                name="username"
                id="username"
                autoFocus={true}
                className={"form-control" + (error && " is-invalid")}/>
            </div>
            {error && <p className="text-danger">{error}</p>}

            <div className="form-group">
              <label htmlFor="password">Mot de Passe</label>
              <input
                value={credentials.password}
                onChange={handleChange}
                type="password"
                placeholder="mot de passe"
                name="password"
                id="password"
                className="form-control"/>
            </div>
            <div className="form-group d-flex flex-row-reverse">
              <button type="submit" className="btn btn-success">
                Connexion
              </button>
            </div>
          </form>

        </Col>
        <Col sm={3}/>
      </Row>
    </>
  );
};
export default LoginPage;