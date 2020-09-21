import React, {useEffect, useState, useCallback} from 'react';
import { AppBar, Container, Tab, Tabs, Toolbar, Button, Menu, MenuItem } from '@material-ui/core';

import AuthServices from '../services/authServices';
import DashboardServices from '../services/dashboardServices';
import IsPlayingHistory from './isPlaying/IsPlayingHistory';
import ShouldPlay from './ShouldPlay';
import DuangOnce from './DuangOnce';
import Config from './Config';

function Private(props) {
  const loggedInChangedCallback = props.onLoggedInChanged;
  const api = props.api;

  const dashboardServices = new DashboardServices(api);
  const authServices = new AuthServices();

  // From dashboard-api
  const [globalSwitch, setGlobalSwitch,] = useState(null);
  const [shouldPlay, setShouldPlay] = useState(null);
  const [useShouldPlayWindow, setUseShouldPlayWindow] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [lastWorkerReportTimestamp, setLastWorkerReportTimestamp] = useState(null);
  const [ipAddress, setIpAddress] = useState(null);
  const [ipLastUpdateAt, setIpLastUpdateAt] = useState(null);
  // End From dashboard-api

  // Master Page UI
  const [isPlayingHistory, setIsPlayingHistory] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyningFinishTime, setLastSyningFinishTime] = useState(null);
  const [displayTabIdx, setDisplayTabIdx] = useState(0);
  // Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
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
        setUseShouldPlayWindow(resp.data.shouldPlay.useShouldPlayWindow);
        setLocalShouldPlay(resp.data.shouldPlay.shouldPlay);
        setIsPlaying(resp.data.isPlaying.isPlaying);

        const tmpLastWorkerReportTimestamp = resp.data.isPlaying.lastWorkerReportTime;
        const tmpLastWorkerReportTimestampString = tmpLastWorkerReportTimestamp > 0 ? new Date(tmpLastWorkerReportTimestamp).toLocaleString() : "Not available";
        setLastWorkerReportTimestamp(tmpLastWorkerReportTimestampString);

        setIsPlayingHistory(resp.data.isPlayingHistories);

        if (resp.data.ip.ipAddress) {
          setIpAddress(resp.data.ip.ipAddress);
        }

        if (resp.data.ip.lastReportAt) {
          setIpLastUpdateAt(resp.data.ip.lastReportAt);
        }
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

  const _handleMenuBtnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const _handleMenuClose = (val) => {
    setAnchorEl(null);
    if (val != null) {
      setDisplayTabIdx(val);
    }
  };

  const globalSwitchDescription = globalSwitch === null ? "Syncing..." : globalSwitch ? "On" : "Off";
  const shouldPlayDescription = shouldPlay === null ? "Syncing..." : shouldPlay ? "On" : "Off";
  const isPlayingDescription = isPlaying === null ? "Syncing..." : isPlaying ? "Yes" : "No";
  const lastWorkerReportTimestampDescription = lastWorkerReportTimestamp === null ? "Syncing..." : lastWorkerReportTimestamp;
  const lastSyningFinishTimeDescription = lastSyningFinishTime === null ? "Not Available" : new Date(lastSyningFinishTime).toLocaleString();
  const ipAddressDescription = ipAddress ? ipAddress : "Not Available";
  const ipLastUpdateAtDescription = ipLastUpdateAt ? new Date(ipLastUpdateAt).toLocaleString() : "Not Available";
  
  const _playerInformation = () => {
    return (
      <div>
        <div>
          <p>Updating Information: {isSyncing ? "Yes" : "No"}</p>
          <p>Last Sync finish time: {lastSyningFinishTimeDescription}</p>
          <hr/>
          <p>Player is playing: {isPlayingDescription}</p>
          <p>Is playing latest update time: {lastWorkerReportTimestampDescription}</p>
          <hr/>
          <p>IP address: {ipAddressDescription}</p>
          <p>IP address last update at: {ipLastUpdateAtDescription}</p>
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
        </div>

      </div>
    );
  };

  const _playHistory = () => {
    // return "playhistory";
    return (
      <IsPlayingHistory isPlayingHistory={isPlayingHistory}/>
    );
  };

  // Master Page UI
  const tabsToDisplay = [
    ['Player Info', (() => {return _playerInformation()})()],
    ['Duang', (() => <DuangOnce api={api}/>)()],
    ['Config', (() => <Config api={api}/>)()],
    ['Should Play', (() => <ShouldPlay remoteShouldPlay={shouldPlay} remoteUseShouldPlayWindow={useShouldPlayWindow} dashboardServices={dashboardServices} refreshDashbordDisplay={_refreshDisplayValue} api={api}/>)()],
    ['Play History', (() => {return _playHistory()})()],
  ];
  // End Master Page UI

  return (
    <Container>
      <div>
        <div>
          <button onClick={_handleLogout}>Logout</button>
          <button onClick={_handleManualRefresh}>Refresh</button>
        </div>

        <hr/>
        <div>
          <AppBar position="relative" color="default">
            <Toolbar>
            <div style={{flex: 'inline'}}>
              <Button aria-controls="simple-menu" aria-haspopup="true" onClick={_handleMenuBtnClick}>
                &#9776;
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => {_handleMenuClose(null)}}
              >
                {tabsToDisplay.map((tabInfo, idx) => {
                  return <MenuItem onClick={() => {_handleMenuClose(idx)}}>{tabInfo[0]}</MenuItem>
                })}
                
              </Menu>
            </div>
            <div style={{flex: 'inline'}}>
            <Tabs value={displayTabIdx}
              onChange={_handleTabChange}
              variant="scrollable"
              scrollButtons="auto">
              {tabsToDisplay.map((tabInfo) => {
                return <Tab label={tabInfo[0]}/>
              })}
            </Tabs>
            </div>
            </Toolbar>
          </AppBar>
        </div>
        <div>
          {tabsToDisplay[displayTabIdx][1]}
        </div>
        <hr/>
      </div>
    </Container>
  );
}

export default Private;
