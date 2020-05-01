import React, {useEffect, useState} from 'react';
import NavbarMembers from "../components/NavbarMembers";
import moment from "moment";
import MembersAPI from "../services/membersAPI";
import {Link} from "react-router-dom";

const CoachsPage= (props) => {

  //Gestion du format de date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY');

  const [coachs, setCoachs] = useState([]);

  const fetchCoachs = async () => {
    try {
      const data = await MembersAPI.findAllByStatus("Coach");
      setCoachs(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  // Au chargement du composant, on va chercher les coachs
  useEffect(() => {
    fetchCoachs();
  }, []);

  return (<>

    <div className="mb-3 d-flex justify-content-between align-items-center">
      <NavbarMembers/>
    </div>
    <table className="table bg-dark text-white">
      <thead>
      <tr>
        <th>Coachs</th>
        <th>Numéro de licence</th>
        <th>Date de naissance</th>
        <th>Email</th>
        <th>Téléphone</th>
        <th>Équipe(s)</th>
      </tr>
      </thead>
      <tbody>

      {coachs.map(coach =>
        <tr key={coach.id}>
          <td>{coach.firstName} {coach.lastName}</td>
          <td>{coach.licenceNumber}</td>
          <td>{formatDate(coach.birthDate)}</td>
          <td>{coach.email}</td>
          <td>{coach.phoneNumber}</td>
          <td>{coach.teamsCoached.map(t =>
            <li className="li-without-decoration">
              <h6><span
                key={t.id}
                className="badge badge-pill mr-1 badge-warning">
                {t.name}
              </span></h6>
            </li>)}
          </td>

        </tr>
      )}

      </tbody>
    </table>
    </>);
};
export default CoachsPage;

