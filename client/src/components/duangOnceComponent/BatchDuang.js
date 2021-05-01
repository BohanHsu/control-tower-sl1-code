import React, {useEffect, useState, useCallback} from 'react';

import { Button, Input, TextField } from '@material-ui/core';

function BatchDuang(props) {
  const today = new Date();

  const [duangStartYear, setDuangStartYear] = useState(today.getFullYear() + "");
  const [duangStartMonth, setDuangStartMonth] = useState((today.getMonth() + 1) + "");
  const [duangStartDate, setDuangStartDate] = useState(today.getDate() + "");
  const [duangStartHour, setDuangStartHour] = useState(today.getHours() + "");
  const [duangStartMinute, setDuangStartMinute] = useState((today.getMinutes() + 2) + "");
  const [duangStartSecond, setDuangStartSecond] = useState("0");

  const [duangEndYear, setDuangEndYear] = useState(today.getFullYear() + "");
  const [duangEndMonth, setDuangEndMonth] = useState((today.getMonth() + 1) + "");
  const [duangEndDate, setDuangEndDate] = useState(today.getDate() + "");
  const [duangEndHour, setDuangEndHour] = useState("");
  const [duangEndMinute, setDuangEndMinute] = useState("");
  const [duangEndSecond, setDuangEndSecond] = useState("0");

  const [warningMessage, setWarningMessage] = useState("");

  const [intervalHour, setIntervalHour] = useState(0);
  const [intervalMin, setIntervalMin] = useState(10);
  const [intervalSecond, setIntervalSecond] = useState(0);

  const [optionalMp3FilePool, setOptionalMp3FilePool] = useState([]);

  const [playTimes, setPlayTimes] = useState(1);

  const [clusters, setClusters] = useState(10);
  const [windowLength, setWindowLength] = useState(10);
  const [clusterDense, setClusterDense] = useState(3);

  const [duangs, setDuangs] = useState([]);

  const _onStartOrIntervalChange = (changed) => {
    const stateTimes = {
      duangStartYear,
      duangStartMonth,
      duangStartDate,
      duangStartHour,
      duangStartMinute,
      duangStartSecond,
    };

    const intervalTimes = {
      intervalHour,
      intervalMin,
      intervalSecond,
    };

    for (const k in changed) {
      switch(k) {
        case "duangStartYear":
          stateTimes[k] = changed[k];
          setDuangStartYear(changed[k]);
          break;
        case "duangStartMonth":
          stateTimes[k] = changed[k];
          setDuangStartMonth(changed[k]);
          break;
        case "duangStartDate":
          stateTimes[k] = changed[k];
          setDuangStartDate(changed[k]);
          break;
        case "duangStartHour":
          stateTimes[k] = changed[k];
          setDuangStartHour(changed[k]);
          break;
        case "duangStartMinute":
          stateTimes[k] = changed[k];
          setDuangStartMinute(changed[k]);
          break;
        case "duangStartSecond":
          stateTimes[k] = changed[k];
          setDuangStartSecond(changed[k]);
          break;

        case "intervalHour":
          intervalTimes[k] = changed[k];
          setIntervalHour(changed[k]);
          break;
        case "intervalMin":
          intervalTimes[k] = changed[k];
          setIntervalMin(changed[k]);
          break;
        case "intervalSecond":
          intervalTimes[k] = changed[k];
          setIntervalSecond(changed[k]);
          break;
      }
    }

    const allStartTime = getAllCleanedStartTime(stateTimes);
    if (allStartTime == null)  {
      return;
    }

    const allInterval = getAllCleanedInterval(intervalTimes);
    if (allInterval == null) {
      return;
    }

    const startDate = new Date(
      allStartTime.parsedDuangStartYear, 
      allStartTime.parsedDuangStartMonth - 1, 
      allStartTime.parsedDuangStartDate, 
      allStartTime.parsedDuangStartHour,
      allStartTime.parsedDuangStartMinute,
      allStartTime.parsedDuangStartSecond
    );

    let endTimestamp = startDate.getTime()
      + allInterval.parsedIntervalSecond * 1000
      + allInterval.parsedIntervalMin * 1000 * 60
      + allInterval.parsedIntervalHour * 1000 * 60 * 60;

    const endDate = new Date(endTimestamp);

    setDuangEndYear(endDate.getFullYear());
    setDuangEndMonth(endDate.getMonth() + 1);
    setDuangEndDate(endDate.getDate());
    setDuangEndHour(endDate.getHours());
    setDuangEndMinute(endDate.getMinutes());
    setDuangEndSecond(endDate.getSeconds());
  };

  useEffect(() => {
    _onStartOrIntervalChange({});
  }, []);

  const _onEndChange = (changed) => {
    const stateTimes = {
      duangStartYear,
      duangStartMonth,
      duangStartDate,
      duangStartHour,
      duangStartMinute,
      duangStartSecond,
    };

    const endTimes = {
      duangEndYear,
      duangEndMonth,
      duangEndDate,
      duangEndHour,
      duangEndMinute,
      duangEndSecond,
    };

    for (const k in changed) {
      switch(k) {
        case "duangEndYear":
          endTimes[k] = changed[k];
          setDuangEndYear(changed[k]);
          break;
        case "duangEndMonth":
          endTimes[k] = changed[k];
          setDuangEndMonth(changed[k]);
          break;
        case "duangEndDate":
          endTimes[k] = changed[k];
          setDuangEndDate(changed[k]);
          break;
        case "duangEndHour":
          endTimes[k] = changed[k];
          setDuangEndHour(changed[k]);
          break;
        case "duangEndMinute":
          endTimes[k] = changed[k];
          setDuangEndMinute(changed[k]);
          break;
        case "duangEndSecond":
          endTimes[k] = changed[k];
          setDuangEndSecond(changed[k]);
          break;
      }
    }

    const allStartTime = getAllCleanedStartTime(stateTimes);
    if (allStartTime == null) {
      return;
    }

    const allEndTime = getAllCleanedEndTime(endTimes);
    if (allEndTime == null) {
      return;
    }

    const startDate = new Date(
      allStartTime.parsedDuangStartYear, 
      allStartTime.parsedDuangStartMonth - 1, 
      allStartTime.parsedDuangStartDate, 
      allStartTime.parsedDuangStartHour,
      allStartTime.parsedDuangStartMinute,
      allStartTime.parsedDuangStartSecond
    );

    const endDate = new Date(
      allEndTime.parsedDuangEndYear, 
      allEndTime.parsedDuangEndMonth - 1, 
      allEndTime.parsedDuangEndDate, 
      allEndTime.parsedDuangEndHour,
      allEndTime.parsedDuangEndMinute,
      allEndTime.parsedDuangEndSecond
    );

    const timeInterval = endDate.getTime() - startDate.getTime();
    const newSecondInterval = parseInt(timeInterval / 1000) % 60;
    const newMinInterval = parseInt(timeInterval / 1000 / 60) % 60;
    const newHourInterval = parseInt(timeInterval / 1000 / 60 / 60);

    setIntervalHour(newHourInterval);
    setIntervalMin(newMinInterval);
    setIntervalSecond(newSecondInterval);
  };

  const _canRollTheDice = () => {
    const stateTimes = {
      duangStartYear,
      duangStartMonth,
      duangStartDate,
      duangStartHour,
      duangStartMinute,
      duangStartSecond,
    };
    const allStartTime = getAllCleanedStartTime(stateTimes);
    if (allStartTime == null)  {
      return false;
    }

    const endTimes = {
      duangEndYear,
      duangEndMonth,
      duangEndDate,
      duangEndHour,
      duangEndMinute,
      duangEndSecond,
    };

    const allEndTime = getAllCleanedEndTime(endTimes);
    if (allEndTime == null) {
      return false;
    }
    
    const startDate = new Date(
      allStartTime.parsedDuangStartYear, 
      allStartTime.parsedDuangStartMonth - 1, 
      allStartTime.parsedDuangStartDate, 
      allStartTime.parsedDuangStartHour,
      allStartTime.parsedDuangStartMinute,
      allStartTime.parsedDuangStartSecond
    );

    const endDate = new Date(
      allEndTime.parsedDuangEndYear, 
      allEndTime.parsedDuangEndMonth - 1, 
      allEndTime.parsedDuangEndDate, 
      allEndTime.parsedDuangEndHour,
      allEndTime.parsedDuangEndMinute,
      allEndTime.parsedDuangEndSecond
    );

    return endDate.getTime() > startDate.getTime();
  };

  const _handleRollTheDice = () => {
    const stateTimes = {
      duangStartYear,
      duangStartMonth,
      duangStartDate,
      duangStartHour,
      duangStartMinute,
      duangStartSecond,
    };
    const allStartTime = getAllCleanedStartTime(stateTimes);

    const endTimes = {
      duangEndYear,
      duangEndMonth,
      duangEndDate,
      duangEndHour,
      duangEndMinute,
      duangEndSecond,
    };

    const allEndTime = getAllCleanedEndTime(endTimes);
    
    const startDate = new Date(
      allStartTime.parsedDuangStartYear, 
      allStartTime.parsedDuangStartMonth - 1, 
      allStartTime.parsedDuangStartDate, 
      allStartTime.parsedDuangStartHour,
      allStartTime.parsedDuangStartMinute,
      allStartTime.parsedDuangStartSecond
    );

    const endDate = new Date(
      allEndTime.parsedDuangEndYear, 
      allEndTime.parsedDuangEndMonth - 1, 
      allEndTime.parsedDuangEndDate, 
      allEndTime.parsedDuangEndHour,
      allEndTime.parsedDuangEndMinute,
      allEndTime.parsedDuangEndSecond
    );
    
    const localDuangs = generateDuangs(
      startDate.getTime(),
      endDate.getTime(),
      clusters,
      windowLength,
      clusterDense,
      optionalMp3FilePool,
    );

    setDuangs(localDuangs);
  };

  const _handleSubmitDuangs = () => {
    const localDuangs = [];
    duangs.forEach((duang) => {
      if (duang) {
        localDuangs.push(duang);
      }
    });


    (async () => {
      const resp = await props.duangRequestServices.requestDuangs(localDuangs);

      if (resp && resp.data && resp.data.created) {
        props.refreshHistory();
      }

      setDuangs([]);
    })();
  };

  const _handleAddMp3InPool = () => {
    const mp3File = props.localMp3FileGetter();
    if (mp3File) {
      const tmpmap = {};
      tmpmap[mp3File] = mp3File;
      optionalMp3FilePool.forEach((optionalMp3File) => {
        tmpmap[optionalMp3File] = optionalMp3File;
      });

      const mp3Files = [];
      for (const key in tmpmap) {
        mp3Files.push(key);
      }

      if (mp3Files.length === optionalMp3FilePool.length) {
        setWarningMessage("Mp3 file already exist");
      } else {
        mp3Files.sort();
        setOptionalMp3FilePool(mp3Files);
      }
    } else {
      setWarningMessage("Please pick one mp3 file");
    }
  };

  const _handleRemoveMp3InPool = (idx) => {
    const newOptionalMp3FilePool = [];
    optionalMp3FilePool.forEach((element, i) => {
      if (idx !== i) {
        newOptionalMp3FilePool.push(element);
      }
    });
    setOptionalMp3FilePool(newOptionalMp3FilePool);
  };

  const RenderRollDice = () => {
    if (!_canRollTheDice()) {
      return null;
    }

    return (
      <div>
        <hr/>
        <div>
          How much time to Duang?
        </div>
        <div>
          <TextField 
            id="clusters" 
          label="Clusters" 
          value={clusters}
          onChange={(evt) => {
            setClusters(evt.target.value);
          }}
          />

          <TextField 
            id="window-length" 
          label="Window Length (second)" 
          value={windowLength}
          onChange={(evt) => {
            setWindowLength(evt.target.value);
          }}
          />

          <TextField 
            id="cluster-dense" 
          label="Cluster Dense" 
          value={clusterDense}
          onChange={(evt) => {
            setClusterDense(evt.target.value);
          }}
          />
      
          <Button onClick={_handleRollTheDice}
            variant="contained"
          >
            Roll the dice
          </Button>
        </div>
        <div>
          <ul>
            {duangs.map((duang) => {
              if (duang == null) {
                return (
                  <li>
                  </li>
                );
              } else {
                return (
                  <li>
                    {duang.duangYear}/{duang.duangMonth}/{duang.duangDate} - {duang.duangHour}:{duang.duangMinute}:{duang.duangSecond} == {(duang.optionalAudioFilePath ? duang.optionalAudioFilePath : "default")}
                  </li>
                );
              }
            })}
          </ul>
        </div>
        {duangs && duangs.length > 0 && 
          <div>
            <Button onClick={_handleSubmitDuangs}
              variant="contained"
              color="primary"
            >
              Submit Duangs
            </Button>
          </div>
        }
      </div>
    );
  };

  const RenderPool = () => {
    return (
      <div>
        <div>
          {optionalMp3FilePool.length == 0 &&
            <span>
              Currently no MP3 file in Pool, will use default file.
            </span>
          }
        </div>
        <div>
          <Button onClick={_handleAddMp3InPool}
            variant="contained"
          >
            Add current File to Pool
          </Button>
        </div>
        {optionalMp3FilePool.length > 0 &&
          <div>
            <ul>
            {optionalMp3FilePool.map((optionalMp3File, idx) => {
              return (
                <li key={`optional-mp3-file-idx-${idx}`}>
                  {optionalMp3File}
                  <button onClick={() => _handleRemoveMp3InPool(idx)}>
                    Remove
                  </button>
                </li>
              );
            })
            }
            </ul>
          </div>
        }
      </div>
    );
  };

  return (
    <div>
      <h2>Batch Schedule Duang</h2>
      {warningMessage &&
        <h1>
          {warningMessage}
        </h1>
      }
      <hr/>
      {RenderPool()}
      <h3>Start time</h3>
      <div>
        <TextField 
          id="duang-start-year" 
        label="Start Year" 
        value={duangStartYear}
        onChange={(evt) => {
          _onStartOrIntervalChange({"duangStartYear": evt.target.value})
        }}
        />
        <TextField 
          id="duang-start-month" 
        label="Start Month" 
        value={duangStartMonth}
        onChange={(evt) => {
          _onStartOrIntervalChange({"duangStartMonth": evt.target.value})
        }}
        />
        <TextField 
          id="duang-start-date" 
        label="Start Date" 
        value={duangStartDate}
        onChange={(evt) => {
          _onStartOrIntervalChange({"duangStartDate": evt.target.value})
        }}
        />
        <TextField 
          id="duang-start-hour" 
        label="Start Hour (24h)" 
        value={duangStartHour}
        onChange={(evt) => {
          _onStartOrIntervalChange({"duangStartHour": evt.target.value})
        }}
        />
        <TextField 
          id="duang-start-minute" 
        label="Start Minute" 
        value={duangStartMinute}
        onChange={(evt) => {
          _onStartOrIntervalChange({"duangStartMinute": evt.target.value})
        }}
        />
        <TextField 
          id="duang-start-second" 
        label="Start Second" 
        value={duangStartSecond}
        onChange={(evt) => {
          _onStartOrIntervalChange({"duangStartSecond": evt.target.value})
        }}
        />
      </div>

      <h3>Window size</h3>
      <div>
        <TextField 
          id="interval-hour" 
        label="Interval Hour" 
        value={intervalHour}
        onChange={(evt) => {
          _onStartOrIntervalChange({"intervalHour": evt.target.value})
        }}
        />
        <TextField 
          id="interval-min" 
        label="Interval Min" 
        value={intervalMin}
        onChange={(evt) => {
          _onStartOrIntervalChange({"intervalMin": evt.target.value})
        }}
        />
        <TextField 
          id="interval-second" 
        label="Interval Second" 
        value={intervalSecond}
        onChange={(evt) => {
          _onStartOrIntervalChange({"intervalSecond": evt.target.value})
        }}
        />
      </div>

      <h3>End time</h3>
      <div>
        <TextField 
          id="duang-end-year" 
        label="End Year" 
        value={duangEndYear}
        onChange={(evt) => {
          _onEndChange({"duangEndYear": evt.target.value});
        }}
        />
        <TextField 
          id="duang-end-month" 
        label="End Month" 
        value={duangEndMonth}
        onChange={(evt) => {
          _onEndChange({"duangEndMonth": evt.target.value});
        }}
        />
        <TextField 
          id="duang-end-date" 
        label="End Date" 
        value={duangEndDate}
        onChange={(evt) => {
          _onEndChange({"duangEndDate": evt.target.value});
        }}
        />
        <TextField 
          id="duang-end-hour" 
        label="End Hour (24h)" 
        value={duangEndHour}
        onChange={(evt) => {
          _onEndChange({"duangEndHour": evt.target.value});
        }}
        />
        <TextField 
          id="duang-end-minute" 
        label="End Minute" 
        value={duangEndMinute}
        onChange={(evt) => {
          _onEndChange({"duangEndMinute": evt.target.value});
        }}
        />
        <TextField 
          id="duang-end-second" 
        label="End Second" 
        value={duangEndSecond}
        onChange={(evt) => {
          _onEndChange({"duangEndSecond": evt.target.value});
        }}
        />
      </div>
      {RenderRollDice()}
      <hr/>
    </div>
  );
}


function getAllCleanedStartTime(times) {
  const today = new Date();
  const parsedDuangStartYear = parseInt(times.duangStartYear);
  const parsedDuangStartMonth = parseInt(times.duangStartMonth);
  const parsedDuangStartDate = parseInt(times.duangStartDate);
  const parsedDuangStartHour = parseInt(times.duangStartHour);
  const parsedDuangStartMinute = parseInt(times.duangStartMinute);
  const parsedDuangStartSecond = parseInt(times.duangStartSecond);

  if (isNaN(parsedDuangStartYear) || parsedDuangStartYear < today.getFullYear()) {
    return null;
  }

  if (isNaN(parsedDuangStartMonth) || parsedDuangStartMonth < 0 || parsedDuangStartMonth > 12) {
    return null;
  }

  if (isNaN(parsedDuangStartDate) || parsedDuangStartDate < 0 || parsedDuangStartDate > 31) {
    return null;
  }

  if (isNaN(parsedDuangStartHour) || parsedDuangStartHour < 0 || parsedDuangStartHour > 23) {
    return null;
  }

  if (isNaN(parsedDuangStartMinute) || parsedDuangStartMinute < 0 || parsedDuangStartMinute > 59) {
    return null;
  }

  if (isNaN(parsedDuangStartSecond) || parsedDuangStartSecond < 0 || parsedDuangStartSecond > 59) {

    return null;
  }

  return {
    parsedDuangStartYear,
    parsedDuangStartMonth,
    parsedDuangStartDate,
    parsedDuangStartHour,
    parsedDuangStartMinute,
    parsedDuangStartSecond,
  };
}

function getAllCleanedInterval(times) {
  const parsedIntervalHour = parseInt(times.intervalHour);
  const parsedIntervalMin = parseInt(times.intervalMin);
  const parsedIntervalSecond = parseInt(times.intervalSecond);

  if (isNaN(parsedIntervalHour)) {
    return null;
  }

  if (isNaN(parsedIntervalMin)) {
    return null;
  }

  if (isNaN(parsedIntervalSecond)) {
    return null;
  }

  return {
    parsedIntervalHour,
    parsedIntervalMin,
    parsedIntervalSecond,
  };
}

function getAllCleanedEndTime(times) {
  const today = new Date();
  const parsedDuangEndYear = parseInt(times.duangEndYear);
  const parsedDuangEndMonth = parseInt(times.duangEndMonth);
  const parsedDuangEndDate = parseInt(times.duangEndDate);
  const parsedDuangEndHour = parseInt(times.duangEndHour);
  const parsedDuangEndMinute = parseInt(times.duangEndMinute);
  const parsedDuangEndSecond = parseInt(times.duangEndSecond);

  if (isNaN(parsedDuangEndYear) || parsedDuangEndYear < today.getFullYear()) {
    return null;
  }

  if (isNaN(parsedDuangEndMonth) || parsedDuangEndMonth < 0 || parsedDuangEndMonth > 12) {
    return null;
  }

  if (isNaN(parsedDuangEndDate) || parsedDuangEndDate < 0 || parsedDuangEndDate > 31) {
    return null;
  }

  if (isNaN(parsedDuangEndHour) || parsedDuangEndHour < 0 || parsedDuangEndHour > 23) {
    return null;
  }

  if (isNaN(parsedDuangEndMinute) || parsedDuangEndMinute < 0 || parsedDuangEndMinute > 59) {
    return null;
  }

  if (isNaN(parsedDuangEndSecond) || parsedDuangEndSecond < 0 || parsedDuangEndSecond > 59) {
    return null;
  }

  return {
    parsedDuangEndYear,
    parsedDuangEndMonth,
    parsedDuangEndDate,
    parsedDuangEndHour,
    parsedDuangEndMinute,
    parsedDuangEndSecond,
  }
}

function generateDuangs(startTimestamp, endTimestamp, clusters, windowLength, clusterDense, optionalMp3FilePool) {
  let localDuangs = [];

  const clusterCenters = [];

  const difference = endTimestamp - startTimestamp;

  for (let i = 0; i < clusters; i++) {
    const clusterCenter = Math.floor(Math.random() * difference) + startTimestamp;
    clusterCenters.push(clusterCenter);
  }

  clusterCenters.sort((a, b) => {return a - b;});

  clusterCenters.forEach((clusterCenter) => {
    const begin = Math.max(startTimestamp, (clusterCenter - windowLength * 1000 / 2));
    const end = Math.min(endTimestamp, (clusterCenter + windowLength * 1000 / 2));
    const repeat = Math.max(1, Math.min(Math.floor(Math.random() * clusterDense * 3), clusterDense));
    const duangs = [];

    for (let i = 0; i < repeat; i++) {
      const duangTime = Math.floor(Math.random() * (end - begin)) + begin;

      let choosedMp3File = null;
      if (optionalMp3FilePool.length > 0) {
        const mp3Idx = Math.floor(Math.random() * optionalMp3FilePool.length);
        choosedMp3File = optionalMp3FilePool[mp3Idx];
      }

      const duangTimeDate = new Date(duangTime);

      const duangInfo = {
        timestamp: duangTime,
        duangYear: duangTimeDate.getFullYear(),
        duangMonth: duangTimeDate.getMonth() + 1,
        duangDate: duangTimeDate.getDate(),
        duangHour: duangTimeDate.getHours(),
        duangMinute: duangTimeDate.getMinutes(),
        duangSecond: duangTimeDate.getSeconds(),
        optionalAudioFilePath: choosedMp3File,
      };

      duangs.push(duangInfo);
    }
    duangs.sort((a, b) => {return a.timestamp - b.timestamp;});
    duangs.push(null);
    localDuangs = localDuangs.concat(duangs);
  });

  localDuangs.splice(localDuangs.length - 1, 1);

  return localDuangs;
}


export default BatchDuang;
