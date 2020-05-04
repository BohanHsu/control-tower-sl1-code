import React, {useEffect, useState, useCallback} from 'react';

function Time(props) {

  return (
    <p>
      <span>{props.time != null && new Date(props.time).toLocaleString()}</span>
    </p>
  );
}

export default Time;
