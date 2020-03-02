import React, {useEffect, useState, useCallback} from 'react';
import DuangRequestServices from '../services/duangRequestServices';

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

  useEffect(_refreshHistory, []);

  return (
    <div>
      Duang component
      <button onClick={_onRequestADuang}>
        Request A Duang
      </button>
      <hr/>
      <table border="1">
        <thead>
          <tr>
            <th>
              <p>Index</p>
            </th>
            <th>
              <p>Request ID</p>
            </th>
            <th>
              <p>Duang Requested Time</p>
            </th>
            <th>
              <p>Request Sent To Worker Time</p>
            </th>
            <th>
              <p>Request Closed Time</p>
            </th>
            <th>
              <p>Current State</p>
            </th>
            <th>
              <p>Reject Reason</p>
            </th>
            <th>
              <p>Delete</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {duangRequestHistory.map((history, idx) => {
            return (
              <tr key={`duang-request-history-${idx}`}>
                <td>
                  <p>{idx + 1}</p>
                </td>
                <td>
                  <p>{history.requestId}</p>
                </td>
                <td>
                  <p>{new Date(history.requestedAt).toLocaleString()}</p>
                </td>
                <td>
                  <p>{history.sentToWorkerAt != null && new Date(history.sentToWorkerAt).toLocaleString()}</p>
                </td>
                <td>
                  <p>{history.requestClosedAt != null && new Date(history.requestClosedAt).toLocaleString()}</p>
                </td>
                <td>
                  <p>{history.currentState}</p>
                </td>
                <td>
                  <p>{history.rejectReason}</p>
                </td>
                <td>
                  {history.requestClosedAt == null && (<button onClick={() => _onDeleteADuang(history.requestId)}>Delete</button>)}
                </td>
              </tr>);
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DuangOnce;
