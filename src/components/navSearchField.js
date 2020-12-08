import React from 'react';

const NavSearchField = () => {

  const searchRepo = e => {
    e.preventDefault();
    console.log(e.target.repoInput.value);
  };

  return(
    <form onSubmit={searchRepo} className="navSearchForm">
      <input name="repoInput" type="text" className="navInputField" placeholder="Search repository..."/>
    </form>
  );
};

export default NavSearchField;