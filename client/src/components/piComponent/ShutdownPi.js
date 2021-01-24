import React, {useEffect, useState} from 'react';

import { Button } from '@material-ui/core';

import PiServices from '../../services/piServices';

function ShutdownPi(props) {
  const api = props.api;
  const piServices = new PiServices(api);

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

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={_handleShutdownPi}>
        Shutdown Pi
      </Button>
    </div>
  );
}

export default ShutdownPi;

