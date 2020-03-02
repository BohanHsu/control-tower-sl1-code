import React, {useEffect, useState, useCallback} from 'react';
import { AppBar, Tab, Tabs } from '@material-ui/core';

import AuthServices from '../services/authServices';
import DashboardServices from '../services/dashboardServices';
import IsPlayingHistory from './isPlaying/IsPlayingHistory';
import ShouldPlay from './ShouldPlay';
import DuangOnce from './DuangOnce';

function Private(props) {
  const loggedInChangedCallback = props.onLoggedInChanged;
  const api = props.api;

  const dashboardServices = new DashboardServices(api);
  const authServices = new AuthServices();

  // From dashboard-api
  const [globalSwitch, setGlobalSwitch,] = useState(null);
  const [shouldPlay, setShouldPlay] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [lastWorkerReportTimestamp, setLastWorkerReportTimestamp] = useState(null);
  // End From dashboard-api

  // Master Page UI
  const [isPlayingHistory, setIsPlayingHistory] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyningFinishTime, setLastSyningFinishTime] = useState(null);
  const [displayTabIdx, setDisplayTabIdx] = useState(0);
  // End Master Page UI

  const [localGlobalSwitch, setLocalGlobalSwitch,] = useState(false);
  const [localShouldPlay, setLocalShouldPlay,] = useState(false);

  let timerId;

  const _refreshDisplayValue = useCallback(() => {
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

        const tmpLastWorkerReportTimestamp = resp.data.isPlaying.lastWorkerReportTime;
        const tmpLastWorkerReportTimestampString = tmpLastWorkerReportTimestamp > 0 ? new Date(tmpLastWorkerReportTimestamp).toLocaleString() : "Not available";
        setLastWorkerReportTimestamp(tmpLastWorkerReportTimestampString);

        setIsPlayingHistory(resp.data.isPlayingHistories);
      }
      setIsSyncing(false);
      setLastSyningFinishTime(new Date().getTime());

      timerId = setInterval(() => {
        console.log('refreshing page');
        _refreshDisplayValue();
      }, 5000);

      return null;
    })();
  }, [timerId]);

  useEffect(_refreshDisplayValue, []);

  const _onGlobalSwitchClick = useCallback((val) => {
    const globalSwitchIsOn = val.target.checked
    setLocalGlobalSwitch(globalSwitchIsOn);
    (async () => {
      await dashboardServices.updateGlobalSwitch(globalSwitchIsOn);
      _refreshDisplayValue();
    })();
  }, [timerId]);

  const _handleLogout = (val) => {
    authServices.logout();
    if (loggedInChangedCallback) {
      loggedInChangedCallback();
    }
  };

  const _handleManualRefresh = (val) => {
    _refreshDisplayValue();
  }

  const _handleTabChange = (evt, val) => {
    setDisplayTabIdx(val);
  }

  const globalSwitchDescription = globalSwitch === null ? "Syncing..." : globalSwitch ? "On" : "Off";
  const shouldPlayDescription = shouldPlay === null ? "Syncing..." : shouldPlay ? "On" : "Off";
  const isPlayingDescription = isPlaying === null ? "Syncing..." : isPlaying ? "Yes" : "No";
  const lastWorkerReportTimestampDescription = lastWorkerReportTimestamp === null ? "Syncing..." : lastWorkerReportTimestamp;
  const lastSyningFinishTimeDescription = lastSyningFinishTime === null ? "Not Available" : new Date(lastSyningFinishTime).toLocaleString();

  // Master Page UI
  const tabsToDisplay = [
    (() => <ShouldPlay remoteShouldPlay={shouldPlay} dashboardServices={dashboardServices} refreshDashbordDisplay={_refreshDisplayValue}/>)(),
    (() => <DuangOnce api={api}/>)(),
  ];
  // End Master Page UI

  return (
    <div>
      <div>
        <button onClick={_handleLogout}>Logout</button>
      </div>
      <p>Updating Information: {isSyncing ? "Yes" : "No"}</p>
      <p>Last Sync finish time: {lastSyningFinishTimeDescription}</p>

      <div>
        <button onClick={_handleManualRefresh}>Refresh</button>
      </div>

      <hr/>

      <p>Global switch is ON: {globalSwitchDescription}</p>
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

      <hr/>
      <p>Player is playing: {isPlayingDescription}</p>
      <p>Is playing latest update time: {lastWorkerReportTimestampDescription}</p>
      <hr/>
      <IsPlayingHistory isPlayingHistory={isPlayingHistory}/>
      <hr/>
      <div>
        <AppBar position="static" color="default">
          <Tabs value={displayTabIdx} 
            onChange={_handleTabChange}>
            <Tab label="Should Play"/>
            <Tab label="Duang"/>
          </Tabs>
        </AppBar>
      </div>
      <div>
        {tabsToDisplay[displayTabIdx]}
      </div>
    </div>
  );
}

export default Private;
