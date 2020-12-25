import React from 'react'
import { Link } from 'react-router-dom';

import NavSearchField from './navSearchField';

import logo from '../images/mesocLogoBlue.png';

const Navbar = ({ userToken, setUserToken, removeAuthCookie }) => {

  const signOut = () => {
    setUserToken(null);
    removeAuthCookie('mesoc_local_user')
  };

  return(
    <nav>
      <a href="http://localhost:4001" className="logoA">
        <img src={logo} alt="logo of mesoc toolkit application" className="logo"/>
      </a>

      <NavSearchField />

      <Link to="browse" className="mainA">Browse</Link>
      {userToken === null && <Link to="sign-in" className="secondaryA">Sign in</Link>}
      {userToken === null ?
        <Link to="create-account" className="secondaryA">Create account</Link> :
        <Link to="/browse" onClick={signOut} className="secondaryA">Sign out</Link>
      }
    </nav>
  );
};

export default Navbar;