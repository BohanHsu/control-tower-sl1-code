import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

import DashboardServices from './services/dashboardServices';

function App() {
  const services = new DashboardServices();

  const [globalSwitch, setGlobalSwitch,] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [localGlobalSwitch, setLocalGlobalSwitch,] = useState(false);

  useEffect(() => {
    (async () => {
      const resp = await services.loadDashboardInfo();
      console.log(resp);
      if (resp) {
        setGlobalSwitch(resp.data.globalSwitch.isOn);
        setLocalGlobalSwitch(resp.data.globalSwitch.isOn)
        setShouldPlay(resp.data.shouldPlay.shouldPlay);
      }
      return null;
    })();
  }, []);

  const _onGlobalSwitchClick = (val) => {
    console.log("_onGlobalSwitchClick", val, val.target, val.target.checked);
    const globalSwitchIsOn = val.target.checked
    setLocalGlobalSwitch(globalSwitchIsOn);
    (async () => {
      await services.updateGlobalSwitch(globalSwitchIsOn);
    })();
  };

  return (
    <div className="App">
      <p>Global switch is ON: {globalSwitch ? "Yes" : "No"}</p>
      <p>Should Play: {shouldPlay ? "Yes" : "No"}</p>
        <label>
          <input 
            type='checkbox' 
            checked={localGlobalSwitch}
            onChange={_onGlobalSwitchClick}
            onClick={()=>{}}/>
          Change Global Switch
        </label>
    </div>
  );
}

export default App;
