import React, {useEffect, useState, useCallback} from 'react';

import { Toolbar, Tab, Tabs } from '@material-ui/core';

import ShutdownPi from './piComponent/ShutdownPi';
import Temperature from './piComponent/Temperature';

function Pi(props) {
  const api = props.api;

  const [displayTabIdx, setDisplayTabIdx] = useState(0);

  const _handleTabChange = (evt, val) => {
    setDisplayTabIdx(val);
  }

  const tabsToDisplay = [
    ["Temperature", (() => <Temperature api={api}/>)()],
    ["Shutdown Pi", (() => <ShutdownPi api={api}/>)()],
  ];

  return (
    <div>
      <Tabs value={displayTabIdx}
        onChange={_handleTabChange}
        variant="scrollable"
        scrollButtons="auto">
        {tabsToDisplay.map((tabInfo) => {
          return <Tab label={tabInfo[0]}/>
        })}
      </Tabs>
      <div>
        {tabsToDisplay[displayTabIdx][1]}
      </div>
    </div>
  );
}

export default Pi;
