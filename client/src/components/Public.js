import React, {useEffect, useState} from 'react';

import AuthServices from '../services/authServices';

function Public(props) {
  const loggedInChangedCallback = props.onLoggedInChanged;

  const [motto, setMotto] = useState("");

  const services = new AuthServices();

  const handleMottoChange = (evt) => {
    setMotto(evt.target.value);
  };

  const handleBtnClick = () => {
    (async () => {
      const response = await services.login(motto);
      if (response && loggedInChangedCallback) {
        loggedInChangedCallback();
      }
    })();
  };

  return (
    <div>
      <div>Flight Number from JFK to LGA?</div>
      <div><label><input value={motto} onChange={handleMottoChange} type="text"/></label></div>
      <div><button onClick={handleBtnClick}>Answer!</button></div>
    </div>
  );
}

export default Public;
