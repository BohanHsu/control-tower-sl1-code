import React, {useEffect, useState, useCallback} from 'react';

import DashboardServices from '../services/dashboardServices';

function Info(props) {
  const api = props.api;

  const dashboardServices = new DashboardServices(api);

  const [globalSwitch, setGlobalSwitch,] = useState(null);
  const [shouldPlay, setShouldPlay] = useState(null);
  const [useShouldPlayWindow, setUseShouldPlayWindow] = useState(null);
  const [isPlaying, setIsPlaying] = useState(null);
  const [lastWorkerReportTimestamp, setLastWorkerReportTimestamp] = useState(null);
  const [ipAddress, setIpAddress] = useState(null);
  const [ipLastUpdateAt, setIpLastUpdateAt] = useState(null);

  const [isPlayingHistory, setIsPlayingHistory] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyningFinishTime, setLastSyningFinishTime] = useState(null);

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
        console.log('refreshing info page');
        _refreshDisplayValue();
      }, 5000);

      return null;
    })();
  }, [timerId]);

  useEffect(_refreshDisplayValue, []);

  useEffect(() => {
    return () => {
      console.log("cleaned up info");
      clearInterval(timerId);
    };
  }, [timerId]);

  const _onGlobalSwitchClick = useCallback((val) => {
    const globalSwitchIsOn = val.target.checked
    setLocalGlobalSwitch(globalSwitchIsOn);
    (async () => {
      await dashboardServices.updateGlobalSwitch(globalSwitchIsOn);
      _refreshDisplayValue();
    })();
  }, [timerId]);

  const globalSwitchDescription = globalSwitch === null ? "Syncing..." : globalSwitch ? "On" : "Off";
  const shouldPlayDescription = shouldPlay === null ? "Syncing..." : shouldPlay ? "On" : "Off";
  const isPlayingDescription = isPlaying === null ? "Syncing..." : isPlaying ? "Yes" : "No";
  const lastWorkerReportTimestampDescription = lastWorkerReportTimestamp === null ? "Syncing..." : lastWorkerReportTimestamp;
  const lastSyningFinishTimeDescription = lastSyningFinishTime === null ? "Not Available" : new Date(lastSyningFinishTime).toLocaleString();
  const ipAddressDescription = ipAddress ? ipAddress : "Not Available";
  const ipLastUpdateAtDescription = ipLastUpdateAt ? new Date(ipLastUpdateAt).toLocaleString() : "Not Available";
  const timeSinceWorkerUpdatedIp = (Date.now() - new Date(ipLastUpdateAt).getTime()) / 1000;
  const workerOnlineDescription = timeSinceWorkerUpdatedIp < 10 ? (<span style={{color:'green'}}>(Online)</span>) : (<span>(Offline)</span>);

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
        <p>IP address last update at: {ipLastUpdateAtDescription}{' '}{workerOnlineDescription}</p>
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
}

export default Info;
