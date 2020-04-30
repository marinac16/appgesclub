import React, {useEffect, useState} from 'react';
import TeamsAPI from "../services/teamsAPI";
import MembersAPI from "../services/membersAPI";
import moment from "moment";
import NavbarMembers from "../components/NavbarMembers";
import {Container, Row, Col, Button} from "react-bootstrap";
import Modal from 'react-bootstrap/Modal'
import {Link} from "react-router-dom";


const TeamViewPage = ({match, history}) => {

  const {id = "new"} = match.params;
  const [showing, setShowing] = useState(false);

  //Gestion du format de date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY');

  const [error, setError] = useState("");
  const [joueurs, setJoueurs] = useState([]);
  const [coachs, setCoachs] = useState([]);
  const [newMember, setNewMember] = useState([]);
  const [team, setTeam] = useState({
    name: "",
    gender: "",
    category: "",
    players: [],
    coachs: []
  });

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Récupérer la liste des joueurs
  const fetchJoueurs = async () => {
    try {
      const data = await MembersAPI.findAllByStatus("Joueur");
      setJoueurs(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  //Récupérer la liste des joueurs
  const fetchCoachs = async () => {
    try {
      const data = await MembersAPI.findAllByStatus("Coach");
      setCoachs(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  //Récupération de l'équipe en fonction de l'identifiant
  const fetchTeam = async id => {
    try {
      const data = await TeamsAPI.find(id);
      setTeam(data);
    } catch (error) {
      console.log(error.response);
      //TODO : Notification flash d'une erreur
      //history.replace("/teams");
    }
  };

  // Au chargement du composant, on va chercher les membres
  useEffect(() => {
    fetchJoueurs();
    fetchCoachs();
  }, []);

  // Récupération de la bonne équipe quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== "new") {
      setShowing(true);
      fetchTeam(id);
    }
  }, [id]);

  const handleRemovePlayers = async id => {
    const originalPlayers = (team.players);
    const index = originalPlayers.findIndex(player => player.id === id);

    originalPlayers.splice(index, 1);
    setTeam({players: originalPlayers});

    try {
      console.log(team);
      await TeamsAPI.updateMembers(team.id, team);
      window.location.reload();
    } catch (error) {
      setError("Ce joueur ne peut pas etre supprimé !");

    }
  };

  // Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    setNewMember({id: currentTarget.value});
  };


  //Mise a jour d'une équipe en ajoutant un membre dans l'équipe
  const handleAddPlayer = async event => {
    event.preventDefault();

    const originalMembers = (team.players);
    originalMembers.push(newMember);

    setTeam({players: originalMembers});
    window.location.reload();

    try {
      await TeamsAPI.updateMembers(id, team);
      window.location.reload()
    } catch (error) {
      setError("Ce joueur ne peut pas etre ajouté !");

    }
  };

  const handleAddCoach = async event => {
    event.preventDefault();

    const originalCoachs = (team.coachs);
    originalCoachs.push(newMember);

    setTeam({coachs: originalCoachs});

    try {
      await TeamsAPI.updateMembers(id, team);
      window.location.reload()
    } catch (error) {
      setError("Ce joueur ne peut pas etre ajouté !");

    }
  };

  return (<>

    <div className="mb-3 d-flex justify-content-between align-items-center">
      <NavbarMembers/>
    </div>
    <Container fluid className="bg-container">
      <Row>
        <Col sm={5}>
          <div className="card bg-dark text-white mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>{team.name}</h3>
              <Link
                to={"/teams/" + team.id}
                className="btn btn-sm btn-outline-primary">
                <i className="fas fa-pen"/>
              </Link>

            </div>
            {team.coachs.map(coach =>
              <div className="card-body">
                <h4>Coach <a className="text-primary">{coach.firstName} {coach.lastName}</a></h4>
                <ul className="card-text">
                  <li>Numéro de licence : <a className="text-primary">{coach.licenceNumber}</a></li>
                  <li>Email : <a className="text-primary">{coach.email}</a></li>
                  <li>Téléphone : <a className="text-primary">{coach.phoneNumber}</a></li>
                </ul>
              </div>
            )}

            <div className="card-footer text-right">
              <button className="btn btn-success" onClick={handleShow}> Ajouter un Coach <i
                className="fas fa-user-tie"/></button>
            </div>
          </div>


        </Col>
        <Col sm={7}>
          <div className="card text-white bg-dark mb-3">
            <div className="card-body">
              <table className="table bg-dark text-white">
                <thead>
                <tr>
                  <th className="text-center">Joueur</th>
                  <th className="text-center">Date de naissance</th>
                  <th className="text-center">Numéro de licence</th>
                  <th className="text-center">Email</th>
                  <th className="text-center">Téléphone</th>
                  <th/>
                </tr>
                </thead>
                <tbody>

                {team.players.map(memberOfTeam =>
                  <tr key={memberOfTeam.id} className="ligne-tableau-equipe">
                    <td>{memberOfTeam.firstName} {memberOfTeam.lastName}</td>
                    <td className="text-center">{formatDate(memberOfTeam.birthDate)}</td>
                    <td className="text-center">{memberOfTeam.licenceNumber}</td>
                    <td className="text-center">{memberOfTeam.email}</td>
                    <td className="text-center">{memberOfTeam.phoneNumber}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleRemovePlayers(memberOfTeam.id)}
                        className="ml-1 btn btn-sm btn-danger"><i className="fas fa-user-times"/>
                      </button>
                    </td>
                  </tr>
                )}
                </tbody>
              </table>
              <form onSubmit={handleAddPlayer} className="white-container">
                <div className="d-flex mt-2 p-3 white-container">
                  <h5 className="text-white mr-3">Ajouter un(e) joueur(se) à cette équipe : </h5>

                  <input className="form-control form-control-sm w-25"
                         type="text"
                         placeholder="Choisissez un joueur ..."
                         name="players"
                         onChange={handleChange}
                         list="joueurs"/>
                  <datalist id="joueurs">
                    {joueurs.map((member, key) => (
                      <option key={key}
                              value={member.id}
                      >
                        {member.firstName + " " + member.lastName}
                      </option>
                    ))}
                  </datalist>

                  <button type="submit" className="btn btn-success ml-3 d-flex ">
                    <i className="fas fa-user-plus pr-2"/>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
      {/* ------ MODAL ajouter un coach -------- */}

      <Modal show={show} onHide={handleClose} animation={true} size="lg" centered>
        <form onSubmit={handleAddCoach}>
          <Modal.Header closeButton>
            <Modal.Title>Modification de l'équipe {team.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>

            <div className="d-flex mt-2 p-3">
              <h6 className="text-dark mr-3">Ajouter un coach à cette équipe : </h6>

              <input className="form-control form-control-sm w-50"
                     type="text"
                     placeholder="Choisissez un coach ..."
                     id="search"
                     name="coachs"
                     onChange={handleChange}
                     list="coachs"/>
              <datalist id="coachs">
                {coachs.map((member, key) => (
                  <option key={key}
                          value={member.id}
                  >
                    {member.firstName + " " + member.lastName}
                  </option>
                ))}
              </datalist>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" type="submit" onClick={handleClose}>
              Ajouter <i className="fas fa-user-plus pr-2"/>
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
  </>)
    ;
};
export default TeamViewPage;
