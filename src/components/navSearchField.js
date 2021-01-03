import React from 'react';

const NavSearchField = ({ display, margin, width }) => {

  const searchRepo = e => {
    e.preventDefault();
    console.log(e.target.repoInput.value);
  };

  return(
    <form onSubmit={searchRepo} className="navSearchForm" style={{ display, margin, width }}>
      <input name="repoInput" type="text" className="navInputField" placeholder="Search repository..."/>
    </form>
  );
};

export default NavSearchField;