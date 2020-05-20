import React, {useEffect, useState} from 'react';
import {Row, Col} from "react-bootstrap"
import Container from "react-bootstrap/Container"
import {Link} from "react-router-dom";
import MembersAPI from "../services/membersAPI";
import TeamsAPI from "../services/teamsAPI";

const HomePage = (props) => {


  const [nbMembers, setNbMembers] = useState(0);
  const [nbTeams, setNbTeams] = useState(0);

  //Récupérer la liste des members
  const fetchMembers = async () => {
    try {
      const data = await MembersAPI.findAll();
      setNbMembers(data.length);
    } catch (error) {
      console.log(error.response)
    }
  };

  //Récupérer la liste des équipes
  const fetchTeams = async () => {
    try {
      const data = await TeamsAPI.findAll();
      setNbTeams(data.length);
    }catch (error) {
      console.log(error.response)
    }
  };

  // Au chargement du composant, on va chercher les customers
  useEffect(() => {
    fetchMembers();
    fetchTeams();
  }, []);


  return (
    <>
      <Container fluid className="white-container-arround mt-4">
        <h1 className="title text-primary">Tableau de bord</h1>
        <hr/>
        <Row className="mt-50">
          <Col sm={4}>
            <div className="card text-white bg-primary mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3>Gestion des Adhérants</h3>
                <Link to="/members/new" className="link-white"><i className="fas fa-2x fa-plus-circle"/></Link>
              </div>
              <div className="card-body">
                <p className="text-marine"><b>Toute la gestion de vos adhérants, et vos équipes en un clic !! </b></p>
                <p className="card-text">Vous avez {nbMembers} adhérants et {nbTeams} équipes</p>
              </div>
              <div className="card-footer text-right"><Link to="/members" className="link-white">Voir la liste</Link></div>
            </div>
          </Col>
          <Col sm={4}>
            <div className="card text-white bg-success mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3>Gestion des Weekends</h3>
                <Link to="weekends/new" className="link-white"><i className="fas fa-2x fa-plus-circle"/></Link>
              </div>
              <div className="card-body">
                <p className="text-green"><b>Toute la gestion de vos weekends, vos matchs et vos rencontres ICI !</b></p>
                <p className="card-text">Retrouvez la liste de tous vos matchs AJOUTER...SUPPRIMER...MODIFIER Organisez-vous comme vous le souhaitez !</p>
              </div>
              <div className="card-footer text-right"><Link to="/weekends" className="link-white">Voir la liste</Link></div>
            </div>
          </Col>
          <Col sm={4}>
            <div className="card text-white bg-warning mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3>Gestion des Mails</h3>
              </div>
              <div className="card-body">
                <p className="card-text">Déja 10 000 mails envoyés</p>
                <p className="card-text">Autres</p>
              </div>
              <div className="card-footer text-right"><Link to="/teams" className="link-white">Envoyer un mail</Link></div>
            </div>
          </Col>

        </Row>
      </Container>

    </>
  );
};
export default HomePage;