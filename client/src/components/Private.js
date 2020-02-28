import React, {useEffect, useState, useCallback} from 'react';

import AuthServices from '../services/authServices';
import DashboardServices from '../services/dashboardServices';

function Private(props) {
  const loggedInChangedCallback = props.onLoggedInChanged;
  const api = props.api;

  const dashboardServices = new DashboardServices(api);
  const authServices = new AuthServices();

  const [globalSwitch, setGlobalSwitch,] = useState(null);
  const [shouldPlay, setShouldPlay] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);

  const [isSyncing, setIsSyncing] = useState(false);

  const [localGlobalSwitch, setLocalGlobalSwitch,] = useState(false);
  const [localShouldPlay, setLocalShouldPlay,] = useState(false);

  let timerId;

  const refreshDisplayValue = () => {
    clearInterval(timerId);
    setIsSyncing(true);
    (async () => {
      const resp = await dashboardServices.loadDashboardInfo();
      if (resp) {
        setGlobalSwitch(resp.data.globalSwitch.isOn);
        setLocalGlobalSwitch(resp.data.globalSwitch.isOn)
        setShouldPlay(resp.data.shouldPlay.shouldPlay);
        setLocalShouldPlay(resp.data.shouldPlay.shouldPlay);
        setIsPlaying(resp.data.isPlaying.isPlaying);
      }
      setIsSyncing(false);

      timerId = setInterval(() => {
        console.log('refreshing page');
        refreshDisplayValue();
      }, 10000);

      return null;
    })();
  };

  useEffect(refreshDisplayValue, []);

  const _onGlobalSwitchClick = useCallback((val) => {
    const globalSwitchIsOn = val.target.checked
    setLocalGlobalSwitch(globalSwitchIsOn);
    (async () => {
      await dashboardServices.updateGlobalSwitch(globalSwitchIsOn);
      refreshDisplayValue();
    })();
  }, [timerId]);

  const _onShouldPlayClick = useCallback((val) => {
    const newShouldPlay = val.target.checked
    setLocalShouldPlay(newShouldPlay);
    (async () => {
      await dashboardServices.updateShouldPlay(newShouldPlay);
      refreshDisplayValue();
    })();
  }, [timerId]);;

  const _handleLogout = (val) => {
    authServices.logout();
    if (loggedInChangedCallback) {
      loggedInChangedCallback();
    }
  };

  const globalSwitchDescription = globalSwitch === null ? "Syncing..." : globalSwitch ? "On" : "Off";
  const shouldPlayDescription = shouldPlay === null ? "Syncing..." : shouldPlay ? "On" : "Off";
  const isPlayingDescription = isPlaying === null ? "Syncing..." : isPlaying ? "Yes" : "No";

  return (
    <div className>
      <div>
        <button onClick={_handleLogout}>Logout</button>
      </div>
      <p>Updating Information: {isSyncing ? "Yes" : "No"}</p>
      <hr/>
      <p>Global switch is ON: {globalSwitchDescription}</p>
      <p>Should Play: {shouldPlayDescription}</p>
      <hr/>
      <p>Player is playing: {isPlayingDescription}</p>
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
