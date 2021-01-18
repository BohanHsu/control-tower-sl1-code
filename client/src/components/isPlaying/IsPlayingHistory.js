import React, {useEffect, useState, useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import DashboardServices from '../../services/dashboardServices';

const useStyles = makeStyles({
  table: {
  },
});

function IsPlayingHistory(props) {
  const classes = useStyles();

  const dashboardServices = new DashboardServices(props.api);

  const [isPlayingHistories, setIsPlayingHistories] = useState([]);

  const _refreshPageWithRemoteValues = () => {
    (async () => {
      const resp = await dashboardServices.loadDashboardInfo();
      if (resp && resp.data) {
        setIsPlayingHistories(resp.data.isPlayingHistories);
      }
    })();
  };

  useEffect(() => {
    _refreshPageWithRemoteValues();
  }, []);

  return (
    <div>
      <h2>Is Playing History</h2>

      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Start time</TableCell>
              <TableCell align="right">End time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isPlayingHistories.map((history, idx) => {
              return (
                <TableRow key={`is-playing-history-${idx}`}>
                  <TableCell component="th" scope="row">
                    <p>{new Date(history.startTime).toLocaleString()}</p>
                  </TableCell>
                  <TableCell align="right">
                    <p>{history.endTime !== null && new Date(history.endTime).toLocaleString()}</p>
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

export default IsPlayingHistory;
