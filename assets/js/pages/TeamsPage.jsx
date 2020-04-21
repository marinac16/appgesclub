import React, {useEffect, useState} from 'react';
import moment from "moment";
import Pagination from "../components/Pagination";
import TeamsAPI from "../services/teamsAPI"
import {Link} from "react-router-dom";
import MembersAPI from "../services/membersAPI";

const TeamsPage = (props) => {

  const [teams, setTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  //Gestion du format de date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY');

  //Nombre d'items par page
  const itemsPerPage = 10;

  //Récupérer la liste des équipes
  const fetchTeams = async () => {
    try {
      const data = await TeamsAPI.findAll();
      setTeams(data);
    }catch (error) {
      console.log(error.response)
    }
  };

  // Au chargement du composant, on va chercher les teams
  useEffect(() => {
    fetchTeams()
  }, []);

  // Gestion de la suppression d'un customers
  const handleDelete = async id => {
    const originalTeams = [...teams];

    //1. L'approche optimiste
    setTeams(teams.filter(team => team.id !== id));

    //2. L'approche pessismiste
    try {
      await TeamsAPI.delete(id);
    } catch (error) {
      setTeams(originalTeams);
    }
  };

  //Gestion du changement de page
  const handlePageChange = page => setCurrentPage(page);

  // Gestion de la recherche
  const handleSearch = ({currentTarget}) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  // Filtrage des teams en fonction de la recherche
  const filteredTeams = teams.filter(
    t =>
      t.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const PaginatedTeams = Pagination.getData(filteredTeams, currentPage, itemsPerPage);
  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des Équipes</h1>
        <Link to="/teams/new" className="btn btn-success" >Créer une équipe</Link>
      </div>

      <div className="form-group">
        <input type="text" onChange={handleSearch} value={search} className="form-control"
               placeholder="Rechercher ..."/>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Équipes</th>
            <th className="text-center">Catégorie</th>
            <th className="text-center">Genre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {PaginatedTeams.map(team =>
          <tr key={team.id}>
            <td><Link to={"team/" + team.id} className="text-primary">{team.name}</Link></td>
            <td className="text-center">{team.category.name}</td>
            <td className="text-center">{team.gender.type}</td>

            <td className="text-right">
              <Link
                to={"teams/" + team.id}
                className="btn btn-sm btn-outline-primary">
                <i className="fas fa-pen"/>
              </Link>
              <button
                onClick={() => handleDelete(team.id)}
                className="ml-1 btn btn-sm btn-outline-primary"><i className="fas fa-trash"/>
              </button>
            </td>
          </tr>
        )}

        </tbody>
      </table>
      {itemsPerPage < filteredTeams.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredTeams.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>

  );
};
export default TeamsPage;