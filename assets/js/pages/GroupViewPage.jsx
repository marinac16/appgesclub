import React, {useEffect, useState} from 'react';
import NavbarMembers from "../components/NavbarMembers";
import Field from "../components/forms/Field";
import MembersAPI from "../services/membersAPI"
import GendersAPI from "../services/gendersAPI";


const GroupViewPage = ({match, history}) => {


  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <NavbarMembers/>
      </div>


    </>
  );
};
export default GroupViewPage;