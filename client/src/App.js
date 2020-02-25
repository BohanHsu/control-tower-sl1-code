import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

import Public from './components/Public';
import Private from './components/Private';

import DashboardServices from './services/dashboardServices';

import Api from './api/api';

function refreshLoggedIn() {
  const tkn = localStorage.getItem('tkn');
  const loggedIn = (tkn !== null && tkn !== 'null');
  return loggedIn;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(refreshLoggedIn());

  const _handleLoggedInChanged = () => {
    console.log('_handleLoggedInChanged');
    setIsLoggedIn(refreshLoggedIn());
  };

  const api = new Api(_handleLoggedInChanged);

  const publicComponent = () => {return (<Public onLoggedInChanged={_handleLoggedInChanged}/>)};
  const privateComponent = () => {return (<Private onLoggedInChanged={_handleLoggedInChanged} api={api}/>)};

  console.log('loggedin: ', isLoggedIn);

  return (
    <div>
      {isLoggedIn ? privateComponent() : publicComponent()}
    </div>
  );
}

export default App;
