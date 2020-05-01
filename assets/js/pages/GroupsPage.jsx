import React, {useEffect, useState} from 'react';
import NavbarMembers from "../components/NavbarMembers";
import GroupsAPI from "../services/groupsAPI";

import {Container, Row, Col, Button} from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import {Link} from "react-router-dom";
import TeamsAPI from "../services/teamsAPI";
import {toast} from "react-toastify";

const GroupsPage = ({history}) => {

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
      toast.error("Une erreur est survenue ...")
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

  // Gestion de la suppression d'un customers
  const handleDelete = async id => {
    const originalGroups = [...groupes];

    //1. L'approche optimiste
    setGroupes(groupes.filter(group => group.id !== id));

    //2. L'approche pessismiste
    try {
      await GroupsAPI.delete(id);
      toast.info("Le groupe à bien été supprimé !");
    } catch (error) {
      setGroupes(originalGroups);
      toast.error("Une erreur est survenue ...");
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      await GroupsAPI.create(newGroupe);
      toast.info("Le groupe à bien été créé !");
      window.location.reload()
    } catch (error) {

    }
  };

  return (<>

    <div className="mb-3 d-flex justify-content-between align-items-center">
      <NavbarMembers/>
      <button onClick={handleShow} className="btn btn-success">Ajouter un groupe</button>
    </div>
    <h3 className="text-white">Liste de mes groupes</h3>

    <table className="table bg-dark text-white mt-4">
      <tbody>
      {groupes.map(g =>
        <tr key={g.id} className="">
          <td>
            <Link to={"groupe/" + g.id} className="link-white text-orange">
              {g.name.toUpperCase()}
            </Link>
          </td>
          <td><h4><span className="badge badge-pill badge-secondary pl-2 pr-2 pb-0">{g.members.length}</span></h4></td>
          <td className="text-right">
            <button
              onClick={() => handleDelete(g.id)}
              className="ml-1 btn btn-sm btn-primary"><i className="fas fa-trash"/>
            </button>
          </td>
        </tr>
      )}
      </tbody>
    </table>


    {/* ------ MODAL ajouter un coach -------- */}

    <Modal show={show} onHide={handleClose} animation={true} size="lg" centered>
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary"><i className="fas fa-user-friends"/> Ajouter un groupe</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <div className="input-group input-group-sm mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="inputGroup-sizing-sm">Choisir un nom pour ce groupe</span>
            </div>
            <input className="form-control form-control-sm w-50"
                   autoFocus={true}
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

