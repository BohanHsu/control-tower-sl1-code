import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Time from '../utils/Time';

function ShouldPlayWindowList(props) {
  const shouldPlayWindowList = props.shouldPlayWindowList;
  const shouldPlayWindowServices = props.shouldPlayWindowServices;
  const refreshShouldPlayWindowListCallback = props.refreshShouldPlayWindowListCallback;

  const _deleteWindow = (id) => {
    (async () => {
      await shouldPlayWindowServices.removeShouldPlayWindow(id);

      refreshShouldPlayWindowListCallback();
    })();
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <p>Index</p>
              </TableCell>
              <TableCell>
                <p>Start Time</p>
              </TableCell>
              <TableCell>
                <p>End Time</p>
              </TableCell>
              <TableCell>
                <p>Delete</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shouldPlayWindowList.map((shouldPlayWindow, idx) => {
              return (
                <TableRow key={`should-play-window-${idx}`}>
                  <TableCell component="th" scope="row">
                    <p>{idx + 1}</p>
                  </TableCell>
                  <TableCell align="left">
                    <p>{shouldPlayWindow.startHour}:{shouldPlayWindow.startMinute}:{shouldPlayWindow.startSecond}</p>
                  </TableCell>
                  <TableCell align="left">
                    <p>{shouldPlayWindow.endHour}:{shouldPlayWindow.endMinute}:{shouldPlayWindow.endSecond}</p>
                  </TableCell>
                  <TableCell align="right">
                    <button onClick={() => _deleteWindow(shouldPlayWindow.id)}>
                      Delete Window
                    </button>
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

export default ShouldPlayWindowList;
