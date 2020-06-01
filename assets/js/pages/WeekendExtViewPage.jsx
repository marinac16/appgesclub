import React, {Fragment, useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import WeekendsAPI from "../services/weekendsAPI";
import MatchsAPI from "../services/matchsAPI";
import TeamsAPI from "../services/teamsAPI";
import MembersAPI from "../services/membersAPI";
import {Col, Container, Row} from "react-bootstrap";
import {toast} from "react-toastify";
import Select from 'react-select';
import NavbarMatchs from "../components/NavbarMatchs";
import {Link} from "react-router-dom";

const WeekendDomViewPage = ({match, history}) => {

  const {id = "new"} = match.params;

  const [showing, setShowing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [weekend, setWeekend] = useState({
    id:"",
    name: "",
    beginDate: "",
    endDate: "",
  });
  const [matches, setMatches] = useState([]);
  const [newMatch, setNewMatch] = useState({
    refMatch: "",
    location: "",
    teamLocal: "",
    teamOpponent: "",
    startTime: "",
    home: false,
    weekend: {id},
    clubReferent: "",
    referees: [],
  });
  const [errors, setErrors] = useState({
    refMatch: "",
    teamLocal: "",
    teamOpponent: "",
    startTime: "",
    home: false,
    weekend: ""
  });

  const handleShowForm = () => {
    setShowForm(true)
  };
  const handleHideForm = () => {
    setShowForm(false)
  };


  //Récupérer la liste des équipes locales
  const fetchTeamsLocal = async () => {
    try {
      const data = await TeamsAPI.findAll();
      setTeams(data);

    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue ...");
    }
  };

  //Récupérer la liste des membres
  const fetchMembers = async () => {
    try {
      const data = await MembersAPI.findAll();
      setMembers(data);
    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue ...");
    }
  };

  //Récupération du weekend en fonction de l'identifiant
  const fetchWeekend = async id => {
    try {
      const data = await WeekendsAPI.find(id);
      setWeekend(data);
    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue ...");
      history.replace("/weekends");
    }
  };
  //Récupérer la liste des matchs
  const fetchMatches = async () => {
    try {
      const data = await MatchsAPI.findAllByWeekendAndisHome(id, false);
      setMatches(data);
    } catch (error) {
      console.log(error.response);
      toast.error("Une erreur est survenue ...");
    }
  };

  // Au chargement du composant, on récupère des infos
  useEffect(() => {
    fetchTeamsLocal();
    fetchMembers();
    fetchMatches();
  }, []);

  // Récupération du bon weekend quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setShowing(true);
      fetchWeekend(id);
    }
  }, [id]);


// Gestion de la suppression d'un customers
  const handleDelete = async id => {
    const originalMatchs = [weekend.matches];

    //1. L'approche optimiste
    setWeekend({matches: weekend.matches.filter(match => match.id !== id)});

    //2. L'approche pessismiste
    try {
      await MatchsAPI.delete(id);
      toast.info("Le match à bien été supprimé !")
    } catch (error) {
      setWeekend(originalMatchs);
      toast.error("Une erreur est survenue ...")
    }
  };

  // Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setNewMatch({
      ...newMatch, [name]: value,
      weekend: id,
    });
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      await MatchsAPI.create(newMatch);
      window.location.reload();
    } catch ({response}) {
      toast.error("Une erreur est survenue ...");
      const {violations} = response.data;
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
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <div className="mb-3 d-flex justify-content">
              <Link to={"/weekends"} ><i className="mr-3 text-white fas fa-3x fa-arrow-alt-circle-left"/></Link>
              <h1>{weekend.name} - Matchs à l'extérieur</h1></div>
            {!showForm && (<button onClick={handleShowForm} className="btn btn-success">Ajouter un match
              <i className="pl-2 fas fa-location-arrow"/>
            </button>)}
          </div>
          <hr/>

          <nav className="nav nav-tabs  flex-column flex-sm-row mt-3 mb-3">

            <Link to={"/weekend/domicile/" + id} className="navlink-custom"><i className="fas fa-map-marker"/> Matchs à
              domicile</Link>
            <Link to={"/weekend/exterieur/" + id} className="navlink-custom text-warning"><i
              className="fas fa-location-arrow"/> Matchs à l'extérieur</Link>

          </nav>

          {showForm && (
            <form onSubmit={handleSubmit}>
              <Row>
                <Col sm={4}>
                  <Field
                    name="refMatch"
                    placeholder="Réf Match"
                    label="Référence du Match"
                    value={newMatch.refMatch}
                    onChange={handleChange}
                    error={errors.refMatch}
                  />
                </Col>
                <Col sm={4}>
                  <Field
                    name="startTime"
                    placeholder="00:00"
                    label="Heure du Match"
                    onChange={handleChange}
                    value={newMatch.startTime}
                    error={errors.startTime}
                  />
                </Col>
                <Col sm={4}>
                  <Field
                    name="location"
                    placeholder="Lieu"
                    label="Lieu du Match"
                    onChange={handleChange}
                    value={newMatch.location}
                    error={errors.location}
                  />
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Field type="text"
                         placeholder="Choisissez une équipe ..."
                         label="Équipe locale"
                         name="teamLocal"
                         onChange={handleChange}
                         list="teams"/>
                  <datalist id="teams">
                    {teams.map((team, key) => (
                      <option key={key}
                              value={team.id}
                              label={team.name}
                      >
                      </option>
                    ))}
                  </datalist>
                </Col>
                <Col sm={6}>
                  <Field
                    name="teamOpponent"
                    label="Équipe adverse"
                    placeholder="Choisissez une équipe adverse ..."
                    onChange={handleChange}
                    value={newMatch.teamOpponent}
                    error={errors.teamOpponent}
                  />
                </Col>
              </Row>
              <div className="mt-2 form-group d-flex flex-row-reverse">
                <button type="submit" className="btn btn-success">Enregistrer</button>
                <button onClick={handleHideForm} className="btn btn-link text-white">Annuler</button>
              </div>
            </form>
          )}

          <table className="table bg-dark text-white mt-4">
            <thead>
            <tr>
              <th>Référence du match</th>
              <th className="text-center">Heure</th>
              <th className="text-center">Équipe</th>
              <th className="text-center">Équipe Adverse</th>
              <th className="text-center">Lieu</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            {matches.map(m =>
              <tr key={m.id} className="">
                <td>{m.refMatch}</td>
                <td className="text-center">{m.startTime}</td>
                <td className="text-center">{m.teamLocal.name}</td>
                <td className="text-center">{m.teamOpponent}</td>
                <td className="text-center">{m.location}</td>
                <td className="text-right">
                  <Link
                    to={"match/" + m.id}
                    className="btn btn-sm btn-primary">
                    <i className="fas fa-pen"/>
                  </Link>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="ml-1 btn btn-sm btn-warning"><i className="fas fa-trash"/>
                  </button>
                </td>
              </tr>
            )}
            </tbody>
          </table>


        </div>
      </Container>


    </>
  )
};
export default WeekendDomViewPage;


