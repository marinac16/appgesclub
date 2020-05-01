import React, {useEffect, useState} from 'react';
import NavbarMembers from "../components/NavbarMembers";
import GroupsAPI from "../services/groupsAPI";

import {Container, Row, Col, Button} from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';

const GroupsPage= ({history}) => {

  const [groupes, setGroupes] = useState([]);
  const [newGroupe, setNewGroupe] = useState({
    name: "",
    members: []
  });
  const [errors, setErrors] = useState({
    name: "",
    members: []
  });

  //Gestion de la modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Récupération des groupes
  const fetchGroups = async () => {
    try {
      const data = await GroupsAPI.findAll();
      setGroupes(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  // Au chargement du composant, on va chercher les coachs
  useEffect(() => {
    fetchGroups();
  }, []);

  // Gestion des changements / enregistrements des inputs dans le formulaires
  const handleChange = ({currentTarget}) => {
    const {name, value} = currentTarget;
    setNewGroupe({...newGroupe, [name]: value});
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try{
      await GroupsAPI.create(newGroupe);
      //TODO : Flash notification de succes
      history.replace("/groupe");
    }catch (error) {

    }


  };

  return (<>

    <div className="mb-3 d-flex justify-content-between align-items-center">
      <NavbarMembers/>
      <button onClick={handleShow} className="btn btn-success">Ajouter un groupe</button>
    </div>
    <h3 className="text-white">Liste de mes groupes</h3>
    <ul>
      {groupes.map(g =>
        <li key={g.id}>{g.name}</li>
      )}

    </ul>



    {/* ------ MODAL ajouter un coach -------- */}

    <Modal show={show} onHide={handleClose} animation={true} size="lg" centered>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary"><i className="fas fa-user-friends"/>  Ajouter un groupe</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-sm">Choisir un nom pour ce groupe</span>
            </div>
            <input className="form-control form-control-sm w-50"
                   type="text"
                   name="name"
                   value={newGroupe.name}
                   error={errors.name}
                   onChange={handleChange}/>
          </div>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" type="submit" onClick={handleClose}>
            Enregistrer
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
        </Modal.Footer>
      </form>
    </Modal>

    </>);
};
export default GroupsPage;

