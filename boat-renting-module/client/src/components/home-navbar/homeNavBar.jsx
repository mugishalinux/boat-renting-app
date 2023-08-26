import React from 'react';
import {  Link } from "react-router-dom";

const Navbar= () =>{
  return (
  <div>
    <li>
      <Link to="/">Dogs</Link>
    </li>
    <li>
      <Link to="/cats">Cats</Link>
    </li>
    <li>
      <Link to="/sheeps">Sheeps</Link>
    </li>
    <li>
      <Link to="/goats">Goat</Link>
    </li>
  </div>
  );
}
export default Navbar;