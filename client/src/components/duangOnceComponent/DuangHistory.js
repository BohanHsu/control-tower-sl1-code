import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function DuangHistory(props) {
  const duangRequestHistory = props.duangRequestHistory;
  const deleteDuangHandle = props.deleteDuangHandle;

  const _onDeleteADuang = (requestId) => {
    return deleteDuangHandle(requestId);
  };

  return (
    <div>
      <h2>Duang Request History</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <p>Index</p>
              </TableCell>
              <TableCell align="right">
                <p>Current State</p>
              </TableCell>
              <TableCell align="right">
                <p>Reject Reason</p>
              </TableCell>
              <TableCell align="right">
                <p>Duang Requested Time</p>
              </TableCell>
              <TableCell align="right">
                <p>Request Sent To Worker Time</p>
              </TableCell>
              <TableCell align="right">
                <p>Request Closed Time</p>
              </TableCell>
              <TableCell align="right">
                <p>Request ID</p>
              </TableCell>
              <TableCell align="right">
                <p>Delete</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {duangRequestHistory.map((history, idx) => {
              return (
                <TableRow key={`is-playing-history-${idx}`}>
                  <TableCell component="th" scope="row">
                    <p>{idx + 1}</p>
                  </TableCell>
                  <TableCell align="right">
                    <p>{history.currentState}</p>
                  </TableCell>
                  <TableCell align="right">
                    <p>{history.rejectReason}</p>
                  </TableCell>
                  <TableCell align="right">
                    <p>{new Date(history.requestedAt).toLocaleString()}</p>
                  </TableCell>
                  <TableCell align="right">
                    <p>{history.sentToWorkerAt != null && new Date(history.sentToWorkerAt).toLocaleString()}</p>
                  </TableCell>
                  <TableCell align="right">
                    <p>{history.requestClosedAt != null && new Date(history.requestClosedAt).toLocaleString()}</p>
                  </TableCell>
                  <TableCell align="right">
                    <p>{history.requestId}</p>
                  </TableCell>
                  <TableCell align="right">
                    {history.requestClosedAt == null && (<button onClick={() => _onDeleteADuang(history.requestId)}>Delete</button>)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default DuangHistory;
