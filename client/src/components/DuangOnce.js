import React, {useEffect, useState, useCallback} from 'react';
import DuangRequestServices from '../services/duangRequestServices';
import DuangHistory from './duangOnceComponent/DuangHistory';
import ScheduleDuang from './duangOnceComponent/ScheduleDuang';
import ConfigServices from '../services/configServices';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
      }, 5000);

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

  const _deleteDuangHandle = _onDeleteADuang;

  useEffect(_refreshHistory, []);

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

  return (
    <div>
      Duang component
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
      <button onClick={_onRequestADuang}>
        Request A Duang
      </button>

      <ScheduleDuang
        duangRequestServices={duangRequestServices}
        refreshHistory={() => {_refreshHistory()}}
        localMp3FileGetter={localMp3FileGetter}/>

      <DuangHistory 
        duangRequestHistory={duangRequestHistory} 
        deleteDuangHandle={_deleteDuangHandle}/>
    </div>
  );
}

export default DuangOnce;
