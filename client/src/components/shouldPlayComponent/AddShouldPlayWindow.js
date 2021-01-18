import React, {useEffect, useState, useCallback} from 'react';

import { Button, Input, TextField } from '@material-ui/core';

function validateIsIntAndInRange(text, minInclude, maxExclude) {
  if (text === "") {
    return false;
  }

  let isInt = (parseInt(text) + "") === text;

  return isInt && (minInclude <= text && text < maxExclude);
}

function AddShouldPlayWindow(props) {
  const [startHour, setStartHour] = useState("");
  const [startMinute, setStartMinute] = useState("");
  const [startSecond, setStartSecond] = useState("0");
  const [endHour, setEndHour] = useState("");
  const [endMinute, setEndMinute] = useState("");
  const [endSecond, setEndSecond] = useState("0");

  const [warning, setWarning] = useState("");

  const shouldPlayWindowServices = props.shouldPlayWindowServices;
  const refreshShouldPlayWindowListCallback = props.refreshShouldPlayWindowListCallback;

  const _handleAddNewShouldPlayWindow = (evt) => {
    setWarning("");

    if (!validateIsIntAndInRange(startHour, 0, 24)) {
      setWarning("Wrong start hour (do NOT append 0 like 01, use 1)");
      return;
    }

    if (!validateIsIntAndInRange(endHour, 0, 24)) {
      setWarning("Wrong end hour (do NOT append 0 like 01, use 1)");
      return;
    }

    if (!validateIsIntAndInRange(startMinute, 0, 60)) {
      setWarning("Wrong start minute (do NOT append 0 like 01, use 1)");
      return;
    }

    if (!validateIsIntAndInRange(endMinute, 0, 60)) {
      setWarning("Wrong end minute (do NOT append 0 like 01, use 1)");
      return;
    }

    if (!validateIsIntAndInRange(startSecond, 0, 60)) {
      setWarning("Wrong start second (do NOT append 0 like 01, use 1)");
      return;
    }

    if (!validateIsIntAndInRange(endSecond, 0, 60)) {
      setWarning("Wrong end second (do NOT append 0 like 01, use 1)");
      return;
    }

    (async () => {
      await shouldPlayWindowServices.addShouldPlayWindow(
        startHour,
        startMinute,
        startSecond,
        endHour,
        endMinute,
        endSecond,
      );

      setStartHour("");
      setStartMinute("");
      setStartSecond("0");

      setEndHour("");
      setEndMinute("");
      setEndSecond("0");

      if (refreshShouldPlayWindowListCallback) {
        refreshShouldPlayWindowListCallback();
      }
    })();
  };

  return (
    <div>
      <div>
        <p style={{color:'red'}}><em>{warning}</em></p>
      </div>
      <div>
        Start:
        <TextField 
          id="start-hour" 
          label="Start Hour" 
          value={startHour}
          onChange={(evt) => {
            setStartHour(evt.target.value);
          }}
        />

        <TextField 
          id="start-minute" 
          label="Start Minute" 
          value={startMinute}
          onChange={(evt) => {
            setStartMinute(evt.target.value);
          }}
        />

        <TextField 
          id="start-second" 
          label="Start Second" 
          value={startSecond}
          onChange={(evt) => {
            setStartSecond(evt.target.value);
          }}
        />
      </div>

      <div>
        End:
        <TextField 
          id="end-hour" 
          label="End Hour" 
          value={endHour}
          onChange={(evt) => {
            setEndHour(evt.target.value);
          }}
        />

        <TextField 
          id="end-minute" 
          label="End Minute" 
          value={endMinute}
          onChange={(evt) => {
            setEndMinute(evt.target.value);
          }}
        />

        <TextField 
          id="end-second" 
          label="End Second" 
          value={endSecond}
          onChange={(evt) => {
            setEndSecond(evt.target.value);
          }}
        />
      </div>

      <div>
        <Button 
          variant="contained"
          onClick={_handleAddNewShouldPlayWindow}>
          Add
        </Button>
      </div>
    </div>
  );
}

export default AddShouldPlayWindow;
