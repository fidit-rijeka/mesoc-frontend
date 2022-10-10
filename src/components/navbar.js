import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom';
import classnames from 'classnames';

import logo from '../images/mesocLogoBlue.png';

const Navbar = ({ userToken, setUserToken, removeAuthCookie, setUserVerified, history }) => {

  const [navOpen, setNavOpen] = useState(false);

  const signOut = () => {
    removeAuthCookie('mesoc_local_user', { path: '/' });
    removeAuthCookie('mesoc_local_user_verified', { path: '/' });
    setUserToken(null);
    setUserVerified(null);
    setNavOpen(false);
    history.push('/browse');
  };

  return(
    <nav>
      <a href={`${process.env.REACT_APP_HOME_URL}`} className="logoA">
        <img src={logo} alt="logo of mesoc toolkit application" className="logo"/>
      </a>

      <Link to="/browse" className="mainA">Browse</Link>
      {userToken === null && <Link to="/sign-in" className="secondaryA">Sign in</Link>}
      {userToken === null ?
        <Link to="/create-account" className="secondaryA">Create account</Link> :
        <p to="/browse" onClick={signOut} className="secondaryA">Sign out</p>
      }

      {/* Mobile */}
      <div onClick={() => setNavOpen(!navOpen)} className="hamburgerApk">
        <span className={classnames({ burgerLinesApk: true, hamOpen: navOpen })}></span>
      </div>
      <div className={classnames({ mobileNavList: true, mobileNavLOpen: navOpen })}>
        {userToken === null ?
          <div className="accountDiv">
            <Link onClick={() => setNavOpen(!navOpen)} to="/sign-in" className="secondaryAPhone">Sign in</Link>
            <span>or</span>
            <Link onClick={() => setNavOpen(!navOpen)} to="/create-account" className="secondaryAPhone">Create account</Link>
          </div> :
          <Link onClick={signOut} to="/browse" className="secondaryAPhone" style={{ margin: '1.4em auto', display: 'block', width: '83px' }}>Sign out</Link>
        }
        <Link onClick={() => setNavOpen(!navOpen)} to="/browse" className="mobileSideLink">Browse</Link>
        <Link onClick={() => setNavOpen(!navOpen)} to="/my-documents" className="mobileSideLink">My documents</Link>
        <Link onClick={() => setNavOpen(!navOpen)} to="/upload-document" className="mobileSideLink">Upload document</Link>
        <Link onClick={() => setNavOpen(!navOpen)} to="/send-feedback" className="mobileSideLink">Send-feedback</Link>
      </div>
    </nav>
  );
};

export default withRouter(Navbar);