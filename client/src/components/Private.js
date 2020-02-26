import React, {useEffect, useState} from 'react';

import AuthServices from '../services/authServices';
import DashboardServices from '../services/dashboardServices';

function Private(props) {
  const loggedInChangedCallback = props.onLoggedInChanged;
  const api = props.api;

  const dashboardServices = new DashboardServices(api);
  const authServices = new AuthServices();

  const [globalSwitch, setGlobalSwitch,] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [localGlobalSwitch, setLocalGlobalSwitch,] = useState(false);
  const [localShouldPlay, setLocalShouldPlay,] = useState(false);

  const refreshDisplayValue = () => {
    (async () => {
      const resp = await dashboardServices.loadDashboardInfo();
      if (resp) {
        setGlobalSwitch(resp.data.globalSwitch.isOn);
        setLocalGlobalSwitch(resp.data.globalSwitch.isOn)
        setShouldPlay(resp.data.shouldPlay.shouldPlay);
        setLocalShouldPlay(resp.data.shouldPlay.shouldPlay);
      }
      return null;
    })();
  };

  useEffect(refreshDisplayValue, []);

  const _onGlobalSwitchClick = (val) => {
    const globalSwitchIsOn = val.target.checked
    setLocalGlobalSwitch(globalSwitchIsOn);
    (async () => {
      await dashboardServices.updateGlobalSwitch(globalSwitchIsOn);
      refreshDisplayValue();
    })();
  };

  const _onShouldPlayClick = (val) => {
    const newShouldPlay = val.target.checked
    setLocalShouldPlay(newShouldPlay);
    (async () => {
      await dashboardServices.updateShouldPlay(newShouldPlay);
      refreshDisplayValue();
    })();
  };

  const _handleLogout = (val) => {
    authServices.logout();
    if (loggedInChangedCallback) {
      loggedInChangedCallback();
    }
  };

  return (
    <div className>
      <div>
        <button onClick={_handleLogout}>Logout</button>
      </div>
      <p>Global switch is ON: {globalSwitch ? "Yes" : "No"}</p>
      <p>Should Play: {shouldPlay ? "Yes" : "No"}</p>
      <hr/>
      <div>
        <label>
          <input 
            type='checkbox' 
            checked={localGlobalSwitch}
            onChange={_onGlobalSwitchClick}
            onClick={()=>{}}/>
          Change Global Switch
        </label>
      </div>
      <div>
        <label>
          <input 
            type='checkbox' 
            checked={localShouldPlay}
            onChange={_onShouldPlayClick}
            onClick={()=>{}}/>
          Change Should Play
        </label>
      </div>
    </div>
  );
}

export default Private;
