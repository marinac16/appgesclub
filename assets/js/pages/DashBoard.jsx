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
      <Container className="p-0">
        <h1 className="title">Tableau de bord</h1>
        <hr/>
        <Row className="mt-50">
          <Col sm={4}>
            <div className="card text-white bg-primary mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3>Membres</h3>
                <Link to="/members/new" className="link-white"><i className="fas fa-2x fa-plus-circle"/></Link>
              </div>
              <div className="card-body">
                <p className="card-text">Vous avez {nbMembers} membres</p>
              </div>
              <div className="card-footer text-right"><Link to="/members" className="link-white">Voir la liste</Link></div>
            </div>
          </Col>
          <Col sm={4}>
            <div className="card text-white bg-warning mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3>Équipes</h3>
                <Link to="/teams/new" className="link-white"><i className="fas fa-2x fa-plus-circle"/></Link>
              </div>
              <div className="card-body">
                <p className="card-text">Vous avez {nbTeams} équipes</p>
              </div>
              <div className="card-footer text-right"><Link to="/teams" className="link-white">Voir la liste</Link></div>
            </div>
          </Col>
          <Col sm={4}>
            <div className="card text-white bg-success mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3>Weekends</h3>
                <Link to="#" className="link-white"><i className="fas fa-2x fa-plus-circle"/></Link>
              </div>
              <div className="card-body">
                <p className="card-text">Weekend précédent</p>
                <p className="card-text">Weekend suivant</p>
              </div>
              <div className="card-footer text-right"><Link to="#" className="link-white">Voir la liste</Link></div>
            </div>
          </Col>
        </Row>
      </Container>


    </>
  );
};
export default HomePage;