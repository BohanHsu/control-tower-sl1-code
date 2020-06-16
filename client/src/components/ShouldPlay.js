import React, {useEffect, useState, useCallback} from 'react';

import ShouldPlayWindow from './shouldPlayComponent/ShouldPlayWindow';

import DashboardServices from '../services/dashboardServices';
import ShouldPlayWindowServices from '../services/shouldPlayWindowServices';


function ShouldPlay(props) {
  const remoteShouldPlay = props.remoteShouldPlay;
  const remoteUseShouldPlayWindow = props.remoteUseShouldPlayWindow;
  const dashboardServices = props.dashboardServices;
  const refreshDashbordDisplay = props.refreshDashbordDisplay;

  const api = props.api;
  const shouldPlayWindowServices = new ShouldPlayWindowServices(api);

  const [localShouldPlay, setLocalShouldPlay] = useState(false);
  const [localUseShouldPlayWindow, setLocalUseShouldPlayWindow] = useState(false);

  // Sync props with localShouldPlay
  useEffect(() => {
    setLocalShouldPlay(props.remoteShouldPlay || false); // React consider null initial value as uncontrolled input
    setLocalUseShouldPlayWindow(props.remoteUseShouldPlayWindow || false);
  }, [props]);

  const _onShouldPlayClick = useCallback((val) => {
    const newShouldPlay = val.target.checked
    setLocalShouldPlay(newShouldPlay);
    (async () => {
      await dashboardServices.updateShouldPlay(newShouldPlay);
      refreshDashbordDisplay();
    })();
  }, []);;

  const _onUseShouldPlayWindowClick = useCallback((val) => {
    const newUseShouldPlayWindow = val.target.checked
    setLocalUseShouldPlayWindow(newUseShouldPlayWindow);
    (async () => {
      await shouldPlayWindowServices.updateUseShouldPlayWindow(newUseShouldPlayWindow);

      refreshDashbordDisplay();
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
