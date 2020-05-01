import React, {useEffect, useState} from 'react';
import moment from "moment";
import Pagination from "../components/Pagination";
import TeamsAPI from "../services/teamsAPI"
import {Link} from "react-router-dom";
import NavbarMembers from "../components/NavbarMembers";
import {toast} from "react-toastify";
import ThreeDotsLoader from "../components/Loader/ThreeDotsLoader";

const TeamsPage = () => {

  const [teams, setTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  //Nombre d'items par page
  const itemsPerPage = 10;

  //Récupérer la liste des équipes féminines
  const fetchTeams = async () => {
    try {
      const data = await TeamsAPI.findAll();
      setTeams(data);
      setLoading(false);
    }catch (error) {
      toast.error("Une erreur est survenue ...");
    }
  };

  // Au chargement du composant, on va chercher les teams
  useEffect(() => {
    fetchTeams();
  }, []);

  // Gestion de la suppression d'un customers
  const handleDelete = async id => {
    const originalTeams = [...teams];

    //1. L'approche optimiste
    setTeams(teams.filter(team => team.id !== id));

    //2. L'approche pessismiste
    try {
      await TeamsAPI.delete(id);
      toast.info("L'équipe a bien été supprimée !");
    } catch (error) {
      setTeams(originalTeams);
      toast.error("Une erreur est survenue ...");
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
        <NavbarMembers/>
        <Link to="/teams/new" className="btn btn-success" >Créer une équipe</Link>
      </div>

      <div className="form-group">
        <input type="text" onChange={handleSearch} value={search} className="form-control input-search"
               placeholder="Rechercher ..."/>
      </div>
      <table className="table bg-dark text-white">
        <thead>
          <tr>
            <th>Équipes</th>
            <th className="text-center">Catégorie</th>
            <th className="text-center">Genre</th>
            <th className="text-center">Coachs</th>
            <th></th>
          </tr>
        </thead>

        {!loading && (<tbody>
        {PaginatedTeams.map(team =>
          <tr key={team.id}>
            <td><Link to={"team/" + team.id} className="link-white text-orange">
              <h6><strong>{team.name}</strong></h6>
            </Link></td>
            <td className="text-center">{team.category.name}</td>
            <td className="text-center">{team.gender.type}</td>
            <td className="text-center">{team.coachs.map(c=> <li className="li-without-decoration">{c.firstName} {c.lastName}</li>)}</td>

            <td className="text-right">
              <Link
                to={"teams/" + team.id}
                className="btn btn-sm btn-primary">
                <i className="fas fa-pen"/>
              </Link>
              <button
                onClick={() => handleDelete(team.id)}
                className="ml-1 btn btn-sm btn-primary"><i className="fas fa-trash"/>
              </button>
            </td>
          </tr>
        )}

        </tbody>)}
      </table>
      {loading && <ThreeDotsLoader/>}
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