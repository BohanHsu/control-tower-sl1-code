import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

import Public from './components/Public';
import Private from './components/Private';

import DashboardServices from './services/dashboardServices';

function refreshLoggedIn() {
  const tkn = localStorage.getItem('tkn');
  const loggedIn = (tkn !== null && tkn !== 'null');
  return loggedIn;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(refreshLoggedIn());

  const _handleLoggedInChanged = () => {
    setIsLoggedIn(refreshLoggedIn());
  }

  const publicComponent = () => {return (<Public onLoggedInChanged={_handleLoggedInChanged}/>)};
  const privateComponent = () => {return (<Private onLoggedInChanged={_handleLoggedInChanged}/>)};
  return (
    <div>
      {isLoggedIn ? privateComponent() : publicComponent()}
    </div>
  )
}

export default App;
