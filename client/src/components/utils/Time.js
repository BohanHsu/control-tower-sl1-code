import React, {useEffect, useState, useCallback} from 'react';
const moment = require('moment-timezone');

function Time(props) {
  let localTime = null;
  let nyTime = null;

  if (props.time != null) {
    const dateOfTime = new Date(props.time);
    localTime = dateOfTime.toLocaleString()
    nyTime = moment(props.time).tz("America/New_York").format('MM/DD/YYYY HH:mm:ss');
  }



  return props.time 
    ? (
      <p>
        <span>{`NYT: ${nyTime},`}</span>
        <span style={{'color': '#A9A9A9'}}>{` (LOCAL: ${localTime})`}</span>
        </p>
    )
    : (<p></p>);
}

export default Time;
