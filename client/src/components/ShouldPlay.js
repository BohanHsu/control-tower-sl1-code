import React, {useEffect, useState, useCallback} from 'react';

import DashboardServices from '../services/dashboardServices';

function ShouldPlay(props) {
  const remoteShouldPlay = props.remoteShouldPlay;
  const dashboardServices = props.dashboardServices;
  const refreshDashbordDisplay = props.refreshDashbordDisplay;

  const [localShouldPlay, setLocalShouldPlay] = useState(false);

  // Sync props with localShouldPlay
  useEffect(() => {
    setLocalShouldPlay(props.remoteShouldPlay || false); // React consider null initial value as uncontrolled input
  }, [props]);

  const _onShouldPlayClick = useCallback((val) => {
    const newShouldPlay = val.target.checked
    setLocalShouldPlay(newShouldPlay);
    (async () => {
      await dashboardServices.updateShouldPlay(newShouldPlay);
      refreshDashbordDisplay();
    })();
  }, []);;

  const remoteShouldPlayDescription = remoteShouldPlay === null ? "Syncing..." : remoteShouldPlay ? "On" : "Off";

  return (
    <div>
      <p>Should Play: {remoteShouldPlayDescription}</p>
      <div>
        <label>
          <input 
            type='checkbox' 
            checked={localShouldPlay}
            onChange={_onShouldPlayClick}/>
          Change Should Play
        </label>
      </div>
    </div>
  );
}

export default ShouldPlay;
