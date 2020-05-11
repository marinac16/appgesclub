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

const WeekendViewPage = ({match, history}) => {

  const {id = "new"} = match.params;

  const [showing, setShowing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [membersOptions, setMembersOptions] = useState({
    value:"",
    label:""
  });
  const [weekend, setWeekend] = useState({
    name: "",
    beginDate: "",
    endDate: "",
    matches: []
  });

  const [newMatch, setNewMatch] = useState({
    refMatch: "",
    location: "",
    teamLocal: "",
    teamOpponent: "",
    timeStart: "",
    home: true,
    referees: [],
    scorers: [],
    clubReferent: "",
  });
  const [errors, setErrors] = useState({
    refMatch: "",
    teamLocal: "",
    teamOpponent: "",
    timeStart: "",
    home: true,
    referees: [],
    scorers: [],
    clubReferent: "",
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

  // Au chargement du composant, on va chercher les membres
  useEffect(() => {
    fetchTeamsLocal();
    fetchMembers();
  }, []);

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
      setMembers(originalMatchs);
      toast.error("Une erreur est survenue ...")
    }
  };

  // Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    console.log(currentTarget);
    setNewMatch({...newMatch, [name]: value});
  };

  //Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      console.log(newMatch);
      await MatchsAPI.create(newMatch);

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
            <h1>{weekend.name} - Match à domicile</h1>
            {!showForm && (<button onClick={handleShowForm} className="btn btn-success">Ajouter un match</button>)}
          </div>
          <hr/>

          <nav className="nav nav-tabs  flex-column flex-sm-row mt-3 mb-3">

            <Link to={"/weekend/domicile/" + id} className="navlink-custom"><i className="fas fa-map-marker"/>  Matchs à domicile</Link>
            <Link to={"/weekend/exterieur/" + id} className="navlink-custom"><i className="fas fa-location-arrow"/>  Matchs à l'extérieur</Link>

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
                    name="timeStart"
                    placeholder="00:00"
                    label="Heure du Match"
                    onChange={handleChange}
                    value={newMatch.timeStart}
                    error={errors.timeStart}
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
              <Row>
                <Col sm={4}>
                  <Field type="text"
                         placeholder="Choisissez un arbitre ..."
                         label="Arbitres"
                         name="referees"
                         onChange={handleChange}
                         list="members"/>
                  <datalist id="members">
                    {members.map((member, key) => (
                      <option key={key}
                              value={member.id}
                              label={member.firstName + " " + member.lastName}
                      >

                      </option>
                    ))}
                  </datalist>
                </Col>
                <Col sm={4}>
                  <Field type="text"
                         placeholder="Choisissez un scoreur ..."
                         label="Marqueur / Chronométreur"
                         name="scorers"
                         onChange={handleChange}
                         list="members"/>
                  <datalist id="members">
                    {members.map((member, key) => (
                      <option key={key}
                              value={member.id}
                              label={member.firstName + " " + member.lastName}
                      >

                      </option>
                    ))}
                  </datalist>
                </Col>
                <Col sm={4}>
                  <Field type="text"
                         placeholder="Choisissez un référent ..."
                         label="Référent Club"
                         name="clubReferent"
                         onChange={handleChange}
                         list="members"/>
                  <datalist id="members">
                    {members.map((member, key) => (
                      <option key={key}
                              value={member.id}
                              label={member.firstName + " " + member.lastName}
                      >
                      </option>
                    ))}
                  </datalist>
                </Col>
              </Row>
              <Select
                value={newMatch.referees}
                isMulti
                isClearable
                name="referees"
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChange}
                options={membersOptions}
              />


              <Field
                type="hidden"
                name="weekend"
                value={weekend.id}
                onChange={handleChange}
              />
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
              <th className="text-center">Lieu</th>
              <th className="text-center">Équipe</th>
              <th className="text-center">Équipe Adverse</th>
              <th>Arbitres</th>
              <th>Marqueurs</th>
              <th className="text-center">Ref Club</th>
              <th/>


            </tr>
            </thead>
            <tbody>
            {weekend.matches.map(m =>
              <tr key={m.id} className="">
                <td>{m.refMatch}</td>
                <td className="text-center">{m.startTime}</td>
                <td className="text-center">{m.location}</td>
                <td className="text-center">{m.teamLocal.name}</td>
                <td className="text-center">{m.teamOpponent}</td>
                <td>{m.referees.map(r =>
                  <ul key={r.id} className="p-0">
                    <li className="li-without-decoration">{r.firstName + " " + r.lastName}</li>
                  </ul>)}</td>
                <td>{m.scorers.map(s =>
                  <ul key={s.id} className="p-0">
                    <li className="li-without-decoration">{s.firstName + " " + s.lastName}</li>
                  </ul>)}</td>
                <td className="text-center">{m.clubReferent.firstName + " " + m.clubReferent.lastName}</td>
                <td className="text-right">
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="ml-1 btn btn-sm btn-primary"><i className="fas fa-trash"/>
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
export default WeekendViewPage;


