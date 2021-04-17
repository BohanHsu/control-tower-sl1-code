import React, {useEffect, useState, useCallback} from 'react';
import DuangRequestServices from '../services/duangRequestServices';
import DuangHistory from './duangOnceComponent/DuangHistory';
import ScheduleDuang from './duangOnceComponent/ScheduleDuang';
import BatchDuang from './duangOnceComponent/BatchDuang';
import ConfigServices from '../services/configServices';

import { Button, Select, FormControl, MenuItem, InputLabel } from '@material-ui/core';

const DEFAULT = "Default";

function DuangOnce(props) {
  const api = props.api;
  const duangRequestServices = new DuangRequestServices(api);
  const configServices = new ConfigServices(api);

  let timerId;

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyningFinishTime, setLastSyningFinishTime] = useState(null);
  const [duangRequestHistory, setDuangRequestHistory] = useState([]);
  const [rawServerConfigData, setRawServerConfigData] = useState(null);
  const [localMp3File, setLocalMp3File] = useState(DEFAULT);
  const [showPanelIdx, setShowPanelIdx] = useState(0);

  const _refreshHistory = useCallback(() => {
    clearInterval(timerId);
    setIsSyncing(true);
    (async () => {
      const resp = await duangRequestServices.getDuangHistory();
      if (resp) {
        setDuangRequestHistory(resp.data.history);
      }

      setIsSyncing(false);
      setLastSyningFinishTime(new Date().getTime());

      timerId = setInterval(() => {
        console.log('refreshing duang request history');
        _refreshHistory();
      }, 2500);

      return null;
    })();
  }, [timerId]);

  const localMp3FileGetter = useCallback(() => {
    if (localMp3File === DEFAULT) {
      return null;
    }

    return localMp3File;
  }, [localMp3File, DEFAULT]);

  const _onRequestADuang = () => {
    (async () => {
      const resp = await duangRequestServices.requestDuang({}, localMp3FileGetter());

      if (resp && resp.data.created) {
        _refreshHistory();
      }
    })();
  };

  const _onDeleteADuang = (requestId) => {
    (async () => {
      const resp = await duangRequestServices.cancelDuang(requestId);

      if (resp && resp.data.cancelled) {
        _refreshHistory();
      }
    })();
  };

  const _handleLocalMp3FileChange = (event) => {
    setLocalMp3File(event.target.value);
  };

  const _handlePickOneMp3File = () => {
    if (rawServerConfigData) {
      if (rawServerConfigData.workerReportedAvailableMp3Files) {
        const len = rawServerConfigData.workerReportedAvailableMp3Files.length;
        const idx = Math.floor(Math.random() * (len * 3 / 2)) % len;

        _handleLocalMp3FileChange({
          target: {
            value: rawServerConfigData.workerReportedAvailableMp3Files[idx],
          }
        });
      }
    }
  };

  const _deleteDuangHandle = _onDeleteADuang;

  useEffect(_refreshHistory, []);

  useEffect(() => {
    return () => {
      console.log("cleaned up duang request page");
      clearInterval(timerId);
    };
  }, [timerId]);

  useEffect(() => {
    (async () => {
      const resp = await configServices.getConfig();
      console.log(resp);
      if (resp) {
        setRawServerConfigData(resp.data);
      }
      return null;
    })();
  }, []);

  const _setShowPanelIdx = (idx) => {
    setShowPanelIdx(idx);
  };

  return (
    <div>
      <div>
        <hr/>
        {showPanelIdx != 0 &&
            <Button onClick={() => {_setShowPanelIdx(0);}}
              variant="contained"
            >
              Show Immediate Duang
            </Button>
        }
        {showPanelIdx != 1 &&
          <Button onClick={() => {_setShowPanelIdx(1);}}
            variant="contained"
          >
            Show Schedule
          </Button>
        }
        {showPanelIdx != 2 &&
          <Button onClick={() => {_setShowPanelIdx(2);}}
            variant="contained"
          >
            Show Batch
          </Button>
        }

      </div>
      <hr/>
      <div>
        <div>
          Select optional audio file:&nbsp;
        </div>
        <div>
          <FormControl>
            <Select
              value={localMp3File}
              onChange={_handleLocalMp3FileChange}
            >
              <MenuItem value={DEFAULT}>{DEFAULT}</MenuItem>
              {rawServerConfigData && rawServerConfigData.workerReportedAvailableMp3Files.map((mp3File, idx) => {
                return (
                  <MenuItem value={mp3File}>{mp3File}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <hr/>
        {showPanelIdx == 0 &&
          <div>
            <Button onClick={_onRequestADuang} 
              color="primary"
              variant="contained"
            >
              Request A Duang
            </Button>
          </div>
        }
        <div>
          <Button onClick={_handlePickOneMp3File} 
            variant="contained"
          >
            Pick one for me
          </Button>
        </div>
      </div>
      {showPanelIdx == 1 &&
        <hr/>
      }
      {showPanelIdx == 1 &&
        <ScheduleDuang
          duangRequestServices={duangRequestServices}
          refreshHistory={() => {_refreshHistory()}}
          localMp3FileGetter={localMp3FileGetter}/>
      }
      {showPanelIdx == 2 &&
        <BatchDuang
          duangRequestServices={duangRequestServices}
          refreshHistory={() => {_refreshHistory()}}
          localMp3FileGetter={localMp3FileGetter}/>
      }

      <DuangHistory 
        duangRequestHistory={duangRequestHistory} 
        deleteDuangHandle={_deleteDuangHandle}/>
    </div>
  );
}

export default DuangOnce;
