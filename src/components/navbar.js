import React from 'react'
import { Link } from 'react-router-dom';

import NavSearchField from './navSearchField';

import logo from '../images/mesocLogoBlue.png';

const Navbar = () => {

  return(
    <nav>
      <a href="http://localhost:4001" className="logoA">
        <img src={logo} alt="logo of mesoc toolkit application" className="logo"/>
      </a>

      <NavSearchField />

      <Link to="browse" className="mainA">Browse</Link>
      <Link to="sign-in" className="secondaryA">Sign in</Link>
      <Link to="create-account" className="secondaryA">Create account</Link>
    </nav>
  );
};

export default Navbar;