import React, {useEffect, useState} from 'react';
import WeekendsAPI from "../services/weekendsAPI";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";

const WeekendsPage = (props) => {

  const [weekends, setWeekends] = useState([]);
  const [loading, setLoading] = useState(true);

  //Récupérer la liste des weekends
  const fetchWeekends = async () => {
    try {
      const data = await WeekendsAPI.findAll();
      setWeekends(data);
      setLoading(false);
    }catch (error) {
      toast.error("Une erreur est survenue ...");
    }
  };

  // Chargement du composant
  useEffect(() => {
    fetchWeekends();
  }, []);


  return (<>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des weekends</h1>
        <Link to={"/weekends/new"} className="btn btn-success">Ajouter un weekend</Link>
      </div>


      <h4>Weekends à venir</h4>

      <table className="table bg-dark text-white mt-4">
        <tbody>
        {weekends.map(w =>
          <tr key={w.id} className="">
            <td>
              <Link to={"weekend/domicile/" + w.id} className="link-white text-orange">
                {w.name.toUpperCase()}
              </Link>
            </td>
            <td><h4><span className="badge badge-pill badge-secondary pl-2 pr-2 pb-0">{w.matches.length}</span></h4></td>
            <td className="text-right">
              <Link
                to={"weekends/" + w.id}
                className="btn btn-sm btn-primary">
                <i className="fas fa-pen"/>
              </Link>
              <button
                //onClick={() => handleDelete(g.id)}
                className="ml-1 btn btn-sm btn-primary"><i className="fas fa-trash"/>
              </button>
            </td>
          </tr>
        )}
        </tbody>
      </table>

      <h4>Weekends passés</h4>

    </>
  )
};
export default WeekendsPage;

