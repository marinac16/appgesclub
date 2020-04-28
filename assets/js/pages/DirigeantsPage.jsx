import React, {useEffect, useState} from 'react';
import NavbarMembers from "../components/NavbarMembers";
import moment from "moment";
import MembersAPI from "../services/membersAPI";
import {Link} from "react-router-dom";

const DirigeantsPage= (props) => {

  //Gestion du format de date
  const formatDate = (str) => moment(str).format('DD/MM/YYYY');

  const [dirigeants, setdirigeants] = useState([]);

  const fetchDirigeants = async () => {
    try {
      const data = await MembersAPI.findAllByStatus("Dirigeant");
      setdirigeants(data);
    } catch (error) {
      console.log(error.response)
    }
  };

  // Au chargement du composant, on va chercher les coachs
  useEffect(() => {
    fetchDirigeants();
  }, []);

  return (<>

    <div className="mb-3 d-flex justify-content-between align-items-center">
      <NavbarMembers/>
    </div>
    <table className="table table-hover">
      <thead>
      <tr>
        <th>Dirigeants</th>
        <th>Numéro de licence</th>
        <th>Date de naissance</th>
        <th>Email</th>
        <th>Téléphone</th>
      </tr>
      </thead>
      <tbody>

      {dirigeants.map(dirigeant =>
        <tr key={dirigeant.id}>
          <td>{dirigeant.firstName} {dirigeant.lastName}</td>
          <td>{dirigeant.licenceNumber}</td>
          <td>{formatDate(dirigeant.birthDate)}</td>
          <td>{dirigeant.email}</td>
          <td>{dirigeant.phoneNumber}</td>

        </tr>
      )}

      </tbody>
    </table>
    </>);
};
export default DirigeantsPage;

