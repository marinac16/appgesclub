import React, {useEffect, useState} from 'react';
import NavbarMembers from "../components/NavbarMembers";
import moment from "moment";
import MembersAPI from "../services/membersAPI";

const CoachsPage= (props) => {

  //Gestion du format de date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY');

  const [coachs, setCoachs] = useState([]);

  const fetchCoachs = async () => {
    try {
      const data = await MembersAPI.findAllByStatus();
      console.log(data);
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
    <table className="table table-hover">
      <thead>
      <tr>
        <th>Coachs</th>
        <th>Date de naissance</th>
        <th>Numéro de licence</th>
        <th>Email</th>
        <th>Téléphone</th>
        <th/>
      </tr>
      </thead>
      <tbody>

      {coachs.map(coach =>
        <tr key={coach.id}>
          <td>{coach.firstName} {coach.lastName}</td>
          <td>{formatDate(coach.birthDate)}</td>
          <td>{coach.licenceNumber}</td>
          <td>{coach.email}</td>
          <td>{coach.phoneNumber}</td>
          <td>
            <button
              //onClick={() => handleRemoveMember(memberOfTeam.id)}
              className="ml-1 btn btn-sm btn-outline-danger"><i className="fas fa-user-times"/>
            </button>
          </td>
        </tr>
      )}

      </tbody>
    </table>
    </>);
};
export default CoachsPage;

