import React, {useEffect, useState, useCallback} from 'react';

function IsPlayingHistory(props) {
  return (
    <div>
      Is Playing History
      <table border="1">
        <thead>
          <tr>
            <th>
              <p>Start time</p>
            </th>
            <th>
              <p>End time</p>
            </th>
          </tr>
        </thead>
        <tbody>
          {props.isPlayingHistory.map((history, idx) => {
            return (
              <tr key={`is-playing-history-${idx}`}>
                <td width="50%">
                  <p>{new Date(history.startTime).toLocaleString()}</p>
                </td>
                <td width="50%">
                  <p>{history.endTime !== null && new Date(history.endTime).toLocaleString()}</p>
                </td>
              </tr>);
          })}
        </tbody>
      </table>
    </div>
  );
}

export default IsPlayingHistory;
