import React, { useState } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Time from '../utils/Time';

function DuangHistory(props) {
  const [showDetailTable, setShowDetailTable] = useState(false);

  const duangRequestHistory = props.duangRequestHistory;
  const deleteDuangHandle = props.deleteDuangHandle;

  const _onDeleteADuang = (requestId) => {
    return deleteDuangHandle(requestId);
  };

  const _toggleShowDetailTable = () => {
    setShowDetailTable(!showDetailTable);
  };
  
  return (
    <div>
      <h2>Duang Request History</h2>
      <div>
        <Button onClick={_toggleShowDetailTable} variant="contained">
          {showDetailTable ? "Hide" : "Show"} details
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {showDetailTable &&
                <TableCell>
                  <p>Index</p>
                </TableCell>
              }
              <TableCell align="right">
                <p>Current State</p>
              </TableCell>
              {showDetailTable &&
                <TableCell align="right">
                  <p>Reject Reason</p>
                </TableCell>
              }
              <TableCell align="right">
                <p>Duang Scheduled Time</p>
              </TableCell>
              {showDetailTable &&
                <TableCell align="right">
                  <p>Duang Requested Time</p>
                </TableCell>
              }
              {showDetailTable &&
                <TableCell align="right">
                  <p>Request Sent To Worker Time</p>
                </TableCell>
              }
              {showDetailTable &&
                <TableCell align="right">
                  <p>Request Closed Time</p>
                </TableCell>
              }
              {showDetailTable &&
                <TableCell align="right">
                  <p>Request ID</p>
                </TableCell>
              }
              {showDetailTable &&
                <TableCell align="right">
                  <p>Optional Audio File</p>
                </TableCell>
              }
              <TableCell align="right">
                <p>Delete</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {duangRequestHistory.map((history, idx) => {
              return (
                <TableRow key={`is-playing-history-${idx}`}>
                  {showDetailTable &&
                    <TableCell component="th" scope="row">
                      <p>{idx + 1}</p>
                    </TableCell>
                  }
                  <TableCell align="right">
                    <p>{history.currentState}</p>
                  </TableCell>
                  {showDetailTable &&
                    <TableCell align="right">
                      <p>{history.rejectReason}</p>
                    </TableCell>
                  }
                  <TableCell align="right">
                    <Time time={history.scheduleDuangTime}/>
                  </TableCell>
                  {showDetailTable &&
                    <TableCell align="right">
                      <Time time={history.requestedAt}/>
                    </TableCell>
                  }
                  {showDetailTable &&
                    <TableCell align="right">
                      <Time time={history.sentToWorkerAt}/>
                    </TableCell>
                  }
                  {showDetailTable &&
                    <TableCell align="right">
                      <Time time={history.requestClosedAt}/>
                    </TableCell>
                  }
                  {showDetailTable &&
                    <TableCell align="right">
                      <p>{history.requestId}</p>
                    </TableCell>
                  }
                  {showDetailTable &&
                    <TableCell align="right">
                      {history.optionalAudioFilePath}
                    </TableCell>
                  }
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
