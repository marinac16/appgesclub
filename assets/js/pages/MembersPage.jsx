import React, {useEffect, useState} from 'react';
import moment from "moment";
import Pagination from "../components/Pagination";
import MembersAPI from "../services/membersAPI"
import {Link} from "react-router-dom";
import CategoriesAPI from "../services/categoriesAPI";
import NavbarMembers from "../components/NavbarMembers";

const MembersPage = (props) => {

  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchByCategory, setSearchByCategory] = useState("");
  const [categories, setCategories] = useState([]);

  //Gestion du format de date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY');

  //Nombre d'items par page
  const itemsPerPage = 15;

  //Récupérer la liste des members
  const fetchMembers = async () => {
    try {
      const data = await MembersAPI.findAll();
      setMembers(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  //Récupération des Catégories
  const fetchCategories = async () => {
    try {
      const data = await CategoriesAPI.findAll();
      setCategories(data);
    } catch (error) {
      history.replace('/members');
      //TODO : Notification flash d'une erreur
    }
  };


  // Au chargement du composant, on va chercher les customers
  useEffect(() => {
    fetchMembers();
    fetchCategories()
  }, []);

  // Gestion de la suppression d'un customers
  const handleDelete = async id => {
    const originalMembers = [...members];

    //1. L'approche optimiste
    setMembers(members.filter(member => member.id !== id));

    //2. L'approche pessismiste
    try {
      await MembersAPI.delete(id);
    } catch (error) {
      setMembers(originalMembers);
    }
  };

  //Gestion du changement de page
  const handlePageChange = page => setCurrentPage(page);

  // Gestion de la recherche
  const handleSearch = ({currentTarget}) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  // Filtrage des customers en fonction de la recherche
  const filteredMembers = members.filter(
    m =>
      m.firstName.toLowerCase().includes(search.toLowerCase()) ||
      m.lastName.toLowerCase().includes(search.toLowerCase())
  );
  // Pagination
  const PaginatedMembers = Pagination.getData(filteredMembers, currentPage, itemsPerPage);

  return (
    <>


      <div className="mb-3 d-flex justify-content-between align-items-center">
        <NavbarMembers/>
        <Link to="/members/new" className="btn btn-success">Ajouter un licencié</Link>
      </div>


      <div className="form-group">
        <input type="text" onChange={handleSearch} value={search} className="form-control"
               placeholder="Rechercher ..."/>
      </div>
      <table className="table table-hover">
        <thead>
        <tr>
          <th>Licencié</th>
          <th>Numéro de Licence</th>
          <th className="text-center">Date de naissance</th>
          <th className="text-center">Email</th>
          <th className="text-center">Téléphone</th>
          <th className="text-center">Équipe</th>
          <th className="text-center">Status</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        {PaginatedMembers.map(member =>
          <tr key={member.id}>
            <td>{member.firstName} {member.lastName}</td>
            <td>{member.licenceNumber}</td>
            <td className="text-center">{formatDate(member.birthDate)}</td>
            <td className="text-center">{member.email}</td>
            <td className="text-center">{member.phoneNumber}</td>
            <td className="text-center">
              {member.teams.map(
                team =>
                  <span
                    key={team.id}
                    className="badge badge-pill mr-1 badge-warning">
                    {team.name}
                  </span>)}
            </td>
            <td className="text-center">{member.statuses.map(s => (s.name))}</td>
            <td className="text-right">
              <Link
                to={"members/" + member.id}
                className="btn btn-sm btn-outline-primary">
                <i className="fas fa-user-edit"/>
              </Link>
              <button
                onClick={() => handleDelete(member.id)}
                className="ml-1 btn btn-sm btn-outline-primary"><i className="fas fa-trash"/>
              </button>
            </td>
          </tr>
        )}

        </tbody>
      </table>
      {itemsPerPage < filteredMembers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredMembers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>

  );
};
export default MembersPage;