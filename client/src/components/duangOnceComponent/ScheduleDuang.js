import React, {useEffect, useState, useCallback} from 'react';

import { Button, Input, TextField } from '@material-ui/core';


function ScheduleDuang(props) {

  const today = new Date();
  const [duangYear, setDuangYear] = useState(today.getFullYear() + "");
  const [duangMonth, setDuangMonth] = useState((today.getMonth() + 1) + "");
  const [duangDate, setDuangDate] = useState(today.getDate() + "");
  const [duangHour, setDuangHour] = useState("");
  const [duangMinute, setDuangMinute] = useState("");
  const [duangSecond, setDuangSecond] = useState("0");

  const [warningMessage, setWarningMessage] = useState("");

  const _handleScheduleDuang = (evt) => {
    setWarningMessage("");
    const parsedDuangYear = parseInt(duangYear);
    const parsedDuangMonth = parseInt(duangMonth);
    const parsedDuangDate = parseInt(duangDate);
    const parsedDuangHour = parseInt(duangHour);
    const parsedDuangMinute = parseInt(duangMinute);
    const parsedDuangSecond = parseInt(duangSecond);

    if (isNaN(parsedDuangYear) || parsedDuangYear < today.getFullYear()) {
      setWarningMessage("Year wrong");
      return;
    }

    if (isNaN(parsedDuangYear) || parsedDuangMonth < 0 || parsedDuangMonth > 12) {
      setWarningMessage("Month wrong");
      return;
    }

    if (isNaN(parsedDuangDate) || parsedDuangDate < 0 || parsedDuangDate > 31) {
      setWarningMessage("Date wrong");
      return;
    }

    if (isNaN(parsedDuangHour) || parsedDuangHour < 0 || parsedDuangHour > 23) {
      setWarningMessage("Hour wrong");
      return;
    }

    if (isNaN(parsedDuangMinute) || parsedDuangMinute < 0 || parsedDuangMinute > 59) {
      setWarningMessage("Wrong minute");
      return;
    }

    if (isNaN(parsedDuangSecond) || parsedDuangSecond < 0 || parsedDuangSecond > 59) {
      setWarningMessage("Wrong second");
      return;
    }

    const scheduleDuangTimestamp = {
      schedule: true,
      duangYear: parsedDuangYear,
      duangMonth: parsedDuangMonth,
      duangDate: parsedDuangDate,
      duangHour: parsedDuangHour,
      duangMinute: parsedDuangMinute,
      duangSecond: parsedDuangSecond,
    };

    (async () => {
      const resp = await props.duangRequestServices.requestDuang(scheduleDuangTimestamp, props.localMp3FileGetter());

      if (resp && resp.data.created) {
        props.refreshHistory();
      }
    })();
    
  };

  return (
    <div>
      Schedule Duang
      <hr/>
      <div>
        <TextField 
          id="duang-year" 
        label="Year" 
        value={duangYear}
        onChange={(evt) => {
          setDuangYear(evt.target.value);
        }}
        />

        <TextField 
          id="duang-month" 
        label="Month" 
        value={duangMonth}
        onChange={(evt) => {
          setDuangMonth(evt.target.value);
        }}
        />

        <TextField 
          id="duang-date" 
        label="Date" 
        value={duangDate}
        onChange={(evt) => {
          setDuangDate(evt.target.value);
        }}
        />

        <TextField 
          id="duang-hour" 
        label="Hour" 
        value={duangHour}
        onChange={(evt) => {
          setDuangHour(evt.target.value);
        }}
        />

        <TextField 
          id="duang-minute" 
        label="Minute" 
        value={duangMinute}
        onChange={(evt) => {
          setDuangMinute(evt.target.value);
        }}
        />

        <TextField 
          id="duang-second" 
        label="Second" 
        value={duangSecond}
        onChange={(evt) => {
          setDuangSecond(evt.target.value);
        }}
        />

        <Button 
          variant="contained"
          onClick={_handleScheduleDuang}>
          Schedule Duang
        </Button>
      </div>
      <div>
        {warningMessage}
      </div>
    </div>
  );

}

export default ScheduleDuang;

