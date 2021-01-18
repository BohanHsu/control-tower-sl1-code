import React, {useEffect, useState, useCallback} from 'react';

import ShouldPlayWindow from './shouldPlayComponent/ShouldPlayWindow';

import DashboardServices from '../services/dashboardServices';
import ShouldPlayWindowServices from '../services/shouldPlayWindowServices';


function ShouldPlay(props) {
  const api = props.api;
  const dashboardServices = new DashboardServices(api);
  const shouldPlayWindowServices = new ShouldPlayWindowServices(api);

  const [localShouldPlay, setLocalShouldPlay] = useState(false);
  const [localUseShouldPlayWindow, setLocalUseShouldPlayWindow] = useState(false);

  const [remoteShouldPlay, setRemoteShouldPlay] = useState(null);
  const [remoteUseShouldPlayWindow, setRemoteUseShouldPlayWindow] = useState(null);

  const _refreshPageWithRemoteValues = () => {
    setRemoteShouldPlay(null);
    setRemoteUseShouldPlayWindow(null);
    (async () => {
      const resp = await dashboardServices.loadDashboardInfo();
      if (resp && resp.data) {
        setLocalShouldPlay(resp.data.shouldPlay.shouldPlay || false); // React consider null initial value as uncontrolled input
        setLocalUseShouldPlayWindow(resp.data.shouldPlay.useShouldPlayWindow || false); // React consider null initial value as uncontrolled input

        setRemoteShouldPlay(resp.data.shouldPlay.shouldPlay);
        setRemoteUseShouldPlayWindow(resp.data.shouldPlay.useShouldPlayWindow);
      }
    })();
  };

  useEffect(() => {
    _refreshPageWithRemoteValues();
  }, []);

  const _onShouldPlayClick = useCallback((val) => {
    const newShouldPlay = val.target.checked
    setLocalShouldPlay(newShouldPlay);
    (async () => {
      await dashboardServices.updateShouldPlay(newShouldPlay);
      _refreshPageWithRemoteValues();
    })();
  }, []);;

  const _onUseShouldPlayWindowClick = useCallback((val) => {
    const newUseShouldPlayWindow = val.target.checked
    setLocalUseShouldPlayWindow(newUseShouldPlayWindow);
    (async () => {
      await shouldPlayWindowServices.updateUseShouldPlayWindow(newUseShouldPlayWindow);
      _refreshPageWithRemoteValues();
    })();
  }, []);

  const remoteShouldPlayDescription = remoteShouldPlay === null ? "Syncing..." : remoteShouldPlay ? "On" : "Off";

  const remoteUseShouldPlayWindowDescription = remoteUseShouldPlayWindow === null ? "Syncing..." : remoteUseShouldPlayWindow ? "On" : "Off";

  return (
    <div>
      <div>
        <label>
          <input 
            type='checkbox' 
            checked={localShouldPlay}
            onChange={_onShouldPlayClick}/>
          Change Should Play
        </label>
      </div>
      <div>
        <label>
          <input 
            type='checkbox' 
            checked={localUseShouldPlayWindow}
            onChange={_onUseShouldPlayWindowClick}/>
          Change Use Should Play Window
        </label>
      </div>
      <p>Should Play: {remoteShouldPlayDescription}</p>
      <p>Use Should Play Window: {remoteUseShouldPlayWindowDescription}</p>

      <hr/>

      <ShouldPlayWindow shouldPlayWindowServices={shouldPlayWindowServices} />
    </div>
  );
}

export default ShouldPlay;
