import React, {useEffect, useState, useCallback} from 'react';
import DuangRequestServices from '../services/duangRequestServices';
import DuangHistory from './duangOnceComponent/DuangHistory';

function DuangOnce(props) {
  const api = props.api;
  const duangRequestServices = new DuangRequestServices(api);

  let timerId;

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyningFinishTime, setLastSyningFinishTime] = useState(null);
  const [duangRequestHistory, setDuangRequestHistory] = useState([]);

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

  const _onRequestADuang = () => {
    (async () => {
      const resp = await duangRequestServices.requestDuang();

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

  const _deleteDuangHandle = _onDeleteADuang;

  useEffect(_refreshHistory, []);

  return (
    <div>
      Duang component
      <button onClick={_onRequestADuang}>
        Request A Duang
      </button>

      <DuangHistory 
        duangRequestHistory={duangRequestHistory} 
        deleteDuangHandle={_deleteDuangHandle}/>
    </div>
  );
}

export default DuangOnce;
