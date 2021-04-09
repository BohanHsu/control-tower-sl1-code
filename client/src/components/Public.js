import React, {useEffect, useState, useCallback} from 'react';

import AuthServices from '../services/authServices';

function Public(props) {
  const loggedInChangedCallback = props.onLoggedInChanged;

  const [motto, setMotto] = useState("");
  const [showHint, setShowHint] = useState(false);

  const services = new AuthServices();

  const handleMottoChange = (evt) => {
    setMotto(evt.target.value);
  };

  const _handleBtnClick = () => {
    (async () => {
      const response = await services.login(motto, showHint);
      if (response && loggedInChangedCallback) {
        loggedInChangedCallback();
      }
    })();
  };

  const _handleKeyDown = (event) => {
    if (props.isLoggedIn()) {
      return;
    }

    switch( event.keyCode ) {
      case 13: // ENTER
        _handleBtnClick();
      break;
      default: 
        break;
    }
  };

  const _onShowHintClicked = (val) => {
    const newShowHint = val.target.checked;
    setShowHint(newShowHint);
  };

  useEffect(() => {
    document.addEventListener("keydown", _handleKeyDown);
  }, [motto]);

  useEffect(() => {
    return () => {
      document.removeEventListener("keydown", _handleKeyDown, true);
    }
  }, []);

  return (
    <div>
      <h1>Trivia</h1>
      <div>Flight Number from JFK to LGA?</div>
      <div><label><input value={motto} onChange={handleMottoChange} type="text"/></label></div>
      <div><button onClick={_handleBtnClick}>Answer!</button></div>
      <hr/>
      <label>
        <input 
          type='checkbox' 
          checked={showHint}
          onChange={_onShowHintClicked}/>
        Show me a hint!
      </label>
      <div>
        {showHint ? (<span>Are you f**king kidding me?</span>) : (<span></span>)}
      </div>
    </div>
  );
}

export default Public;
