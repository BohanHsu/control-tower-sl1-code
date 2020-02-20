import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

import DashboardServices from './services/dashboardServices';

function App() {
  const services = new DashboardServices();

  const [killSwitch, setKillSwitch] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(async () => {
    const resp = await services.loadDashboardInfo();
    if (resp) {
      setShouldPlay(setShouldPlay(resp.shouldPlay));
    }
    return null;
  }, []);

  return (
    <div className="App">
      <p>Should Play: {shouldPlay ? "Yes" : "No"}</p>
    </div>
  );
}

export default App;
