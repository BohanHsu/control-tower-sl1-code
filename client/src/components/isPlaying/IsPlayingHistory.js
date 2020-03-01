import React, {useEffect, useState, useCallback} from 'react';

function IsPlayingHistory(props) {
  return (
    <div>
      Is Playing History
      <table border="1">
        <tr>
          <th>
            Start time
          </th>
            End time
          <th>
          </th>
        </tr>
        {props.isPlayingHistory.map((history) => {
          return (
            <tr>
              <td width="50%">
                {new Date(history.startTime).toLocaleString()}
              </td>
              <td width="50%">
                {history.endTime !== null && new Date(history.endTime).toLocaleString()}
              </td>
            </tr>);
        })}
      </table>
    </div>
  );
}

export default IsPlayingHistory;
