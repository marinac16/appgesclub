import React, {useEffect, useState} from 'react';
import Field from "../components/forms/Field";
import TeamsAPI from "../services/teamsAPI";
import {toast} from "react-toastify";
import {Col, Row} from "react-bootstrap";
import MatchsAPI from "../services/matchsAPI";
import MembersAPI from "../services/membersAPI";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from "@material-ui/core/TextField";


const MatchPage = ({match, history}) => {

  const {id = "new"} = match.params;

  const [members, setMembers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [newMatch, setNewMatch] = useState({
    refMatch: "",
    location: "",
    teamLocal: "",
    teamOpponent: "",
    startTime: "",
    home: true,
    weekend: {id},
    clubReferent: "",
    referees: [],
  });
  const [errors, setErrors] = useState({
    refMatch: "",
    location: "",
    teamLocal: "",
    teamOpponent: "",
    startTime: "",
    home: true,
    weekend: {id},
    clubReferent: "",
    referees: [],
  });
  const [editing, setEditing] = useState(false);


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

  //Récupération de la liste des genres et des catégories a chaque chargement du composant
  useEffect(() => {
    fetchTeamsLocal();
    fetchMembers();
  }, []);

  // Récupération de la bonne équipe quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchTeam(id);
    }
  }, [id]);


  // Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    console.log(currentTarget);
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
      if (editing) {
        await MatchsAPI.update(id, match);
        toast.info("Cette équipe à bien été mise à jour");
        history.replace(-1);
      } else {
        await MatchsAPI.create(newMatch);
        toast.info("Cette équipe à bien été créée");
        history.replace(-1);
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

  return (
    <>

      <div className="bg-container mt-4">
        {(editing && <h1>Modification d'un match</h1>) || (<h1>Création d'un match</h1>)}
        <hr/>
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
          <Row>
            <Col sm={4}>
              <Autocomplete
                multiple
                id="tags-standard"
                options={members}
                getOptionLabel={(option) => option.firstName + " " + option.lastName}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Arbitres"
                    placeholder="Arbitres"
                    value={members.id}
                  />
                )}
              />
            </Col>
          </Row>
          <div className="mt-2 form-group d-flex flex-row-reverse">
            <button type="submit" className="btn btn-success">Enregistrer </button>
          </div>
        </form>
      </div>

    </>
  );
};
export default MatchPage;