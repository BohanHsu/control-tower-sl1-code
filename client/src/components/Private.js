import React, {useEffect, useState, useCallback} from 'react';
import { AppBar, Container, Tab, Tabs, Toolbar, Button, Menu, MenuItem } from '@material-ui/core';

import AuthServices from '../services/authServices';

import Info from './Info';
import IsPlayingHistory from './isPlaying/IsPlayingHistory';
import ShouldPlay from './ShouldPlay';
import DuangOnce from './DuangOnce';
import Config from './Config';
import Pi from './Pi';

function Private(props) {
  const loggedInChangedCallback = props.onLoggedInChanged;
  const api = props.api;

  const authServices = new AuthServices();

  const [displayTabIdx, setDisplayTabIdx] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const _handleLogout = (val) => {
    authServices.logout();
    if (loggedInChangedCallback) {
      loggedInChangedCallback();
    }
  };

  const _handleManualRefresh = (val) => {
    alert("not working, please fix");
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

  // Master Page UI
  const tabsToDisplay = [
    ['Info', (() => <Info api={api}/>)()],
    ['Duang', (() => <DuangOnce api={api}/>)()],
    ['Pi', (() => {return <Pi api={api}/>})()],
    ['Config', (() => <Config api={api}/>)()],
    ['Should Play', (() => <ShouldPlay api={api}/>)()],
    ['Play History', (() => <IsPlayingHistory api={api}/>)()],
  ];
  // End Master Page UI

  return (
    <Container>
      <div>
        <div>
          <AppBar position="relative" color="default">
            <div style={{display: 'inline'}}>
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
              <div style={{float: 'right'}}>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={_handleLogout}>
                  Logout
                </Button>
              </div>
            </div>

            <div style={{display: 'flex'}}>
              <Tabs value={displayTabIdx}
                onChange={_handleTabChange}
                variant="scrollable"
                scrollButtons="auto">
                {tabsToDisplay.map((tabInfo) => {
                  return <Tab label={tabInfo[0]}/>
                })}
              </Tabs>
            </div>
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
