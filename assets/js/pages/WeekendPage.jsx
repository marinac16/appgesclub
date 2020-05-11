import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";
import WeekendsAPI from "../services/weekendsAPI";
import {toast} from "react-toastify";
import moment from "moment";

const WeekendPage = ({match, history}) => {

  const {id = "new"} = match.params;

  //Gestion du format de date
  const formatDate = (str) => moment(str).format('YYYY-MM-DD');

  const [weekend, setWeekend] = useState({
    name: "",
    beginDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    beginDate: "",
    endDate: "",
  });
  const [editing, setEditing] = useState(false);

  //Récupération du weekend en fonction de l'identifiant
  const fetchWeekend = async id => {
    try {
      const data = await WeekendsAPI.find(id);
      console.log(data);
      setWeekend(data);
    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue ...");
      history.replace("/weekends");
    }
  };

  // Récupération du bon weekend quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchWeekend(id);
    }
  }, [id]);

// Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setWeekend({...weekend, [name]: value});
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      if (editing) {
        await WeekendsAPI.update(id, weekend);
        toast.info("Ce weekend à bien été mise à jour");
        history.replace("/weekends");
      } else {
        await WeekendsAPI.create(weekend);
        toast.info("Ce weekend à bien été créée");
        history.replace("/weekends");
        setErrors({});
      }
    } catch ({response}) {
      const {violations} = response.data;
      toast.error("Une erreur est survenue ...");

      if (violations) {
        const apiErrors = {};
        violations.forEach(({propertyPath, message}) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);

      }
    }
  };


  return (<>

      <Container fluid>

        <div className="bg-container mt-4">
          {(editing && <h1>Modification d'un weekend</h1>) || (<h1>Ajouter un weekend</h1>)}
          <hr/>

          <form onSubmit={handleSubmit} className="mt-5">
            <Row>
              <Col sm={6}>
                <Field
                  name="name"
                  label="Nom du weekend"
                  onChange={handleChange}
                  value={weekend.name}
                  error={errors.name}
                />
              </Col>
              <Col sm={3}>
                <Field
                  type={"date"}
                  name="beginDate"
                  label="Date début"
                  onChange={handleChange}
                  value={formatDate(weekend.beginDate)}
                  error={errors.beginDate}
                />
              </Col>
              <Col sm={3}>
                <Field
                  type={"date"}
                  name="endDate"
                  label="Date Fin"
                  onChange={handleChange}
                  value={formatDate(weekend.endDate)}
                  error={errors.endDate}
                />
              </Col>
            </Row>


            <div className="mt-5 form-group d-flex flex-row-reverse">
              <button type="submit" className="btn btn-success">Enregistrer</button>
              <Link to="/weekends" className="btn btn-link text-white">Retour à la liste des weekends</Link>
            </div>
          </form>
        </div>
      </Container>


    </>
  )
};
export default WeekendPage;

