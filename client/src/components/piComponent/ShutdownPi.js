import React, {useEffect, useState, useCallback} from 'react';

import { Button } from '@material-ui/core';

import PiServices from '../../services/piServices';
import DashboardServices from '../../services/dashboardServices';

const REFRESH_ONLINE_INTERVAL = 1000;

function ShutdownPi(props) {
  const api = props.api;
  const piServices = new PiServices(api);
  const dashboardServices = new DashboardServices(api);

  const [ipLastUpdateAt, setIpLastUpdateAt] = useState(null);
  const [timeSinceWorkerUpdatedIp, setTimeSinceWorkerUpdatedIp] = useState(-1);

  let timerId;

  const _refreshDisplayValue = useCallback(() => {
    clearInterval(timerId);
    (async () => {
      const resp = await dashboardServices.loadDashboardInfo();
      if (resp) {
        if (resp.data.ip.lastReportAt) {
          setIpLastUpdateAt(resp.data.ip.lastReportAt);
          setTimeSinceWorkerUpdatedIp((Date.now() - new Date(resp.data.ip.lastReportAt).getTime()) / 1000);
          
        }
      }

      timerId = setInterval(() => {
        console.log('refreshing shutdown pi');
        _refreshDisplayValue();
      }, REFRESH_ONLINE_INTERVAL);

      return null;
    })();
  }, [timerId]);

  useEffect(_refreshDisplayValue, [timerId]);

  useEffect(() => {
    return () => {
      console.log("cleaned up shutdown pi");
      clearInterval(timerId);
    };
  }, [timerId]);

  const _handleShutdownPi = () => {
    if (window.confirm("You cannot turn on Pi without physically touch the Pi.") == true) {
      console.log("confirmed to turn off");
      if (window.confirm("Make stereo is turned off") == true) {
        console.log("confirmed stereo is off");
        (async () => {
          await piServices.shutdownPi();
        })();

        return;
      }
      console.log("abort due to stereo")
      return;
    } 
    console.log("abort")
  };

  const workerOnlineDescription = () => {
    return timeSinceWorkerUpdatedIp < 4 ? 
      (<span style={{color:'green'}}>Online</span>) : 
      (<span>Offline</span>);
  };

  return (
    <div>
      <hr/>
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={_handleShutdownPi}>
          Shutdown Pi
        </Button>
      </div>
      <div>
        Current status of the pi is: {workerOnlineDescription()}
      </div>
    </div>
  );
}

export default ShutdownPi;

