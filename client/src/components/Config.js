import React, {useEffect, useState, useCallback} from 'react';

import { Button, Input, TextField } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import ConfigServices from '../services/configServices';

function Config(props) {
  const api = props.api;
  const configServices = new ConfigServices(api);

  let timerId;

  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyningFinishTime, setLastSyningFinishTime] = useState(null);
  const [rawServerConfigData, setRawServerConfigData] = useState(null);
  const [localConfigJSONStr, setLocalConfigJSONStr] = useState("");

  const _refreshHistory = useCallback(() => {
    clearInterval(timerId);
    setIsSyncing(true);
    (async () => {

      const resp = await configServices.getConfig();
      if (resp) {
        setRawServerConfigData(resp.data);
      }

      // {"humanOverrideConfig":"","humanOverrideConfigLastUpdateTime":"1970-01-01T00:00:00.000Z","workerReportedConfig":"","workerReportedAvailableMp3Files":[],"workerReportConfigTime":"1970-01-01T00:00:00.000Z"}

      setIsSyncing(false);
      setLastSyningFinishTime(new Date().getTime());

      // TODO why do I need to auto refresh config?
      // timerId = setInterval(() => {
      //   console.log('refreshing config');
      //   _refreshHistory();
      // }, 5000);

      return null;
    })();
  }, [timerId]);

  useEffect(_refreshHistory, []);

  const _handleConfigChange = (evt) => {
    setLocalConfigJSONStr(evt.target.value);
  };

  const _handleRefresh = () => {
    _refreshHistory();
  };

  const _handleSubmit = () => {
    console.log('_handleSubmit');
    // validate JSON
    let configBefore = localConfigJSONStr;
    let minimuzedConfig = null;
    try {
      minimuzedConfig = JSON.stringify(JSON.parse(localConfigJSONStr));
    } catch (e) {
    }
    if (minimuzedConfig !== null) {
      (async () => {
        const resp = await configServices.updateConfig(minimuzedConfig);
        if (resp && resp.data.updated) {
          _refreshHistory();
        }
      })();
    }
  };

  const isSyncingDescription = isSyncing ? "Yes" : "No";
  const lastSyningFinishTimeDescription = lastSyningFinishTime === null ? "Not Available" : new Date(lastSyningFinishTime).toLocaleString();

  let humanOverrideConfig = "";
  let humanOverrideConfigLastUpdateTimeStamp = "";
  let workerReportedConfig = "";
  // let workerReportedAvailableMp3Files = [];
  let workerReportConfigTimeStamp = "";
  if (rawServerConfigData) {
    humanOverrideConfig = rawServerConfigData.humanOverrideConfig;
    humanOverrideConfigLastUpdateTimeStamp = new Date(rawServerConfigData.humanOverrideConfigLastUpdateTime).getTime();
    workerReportedConfig = rawServerConfigData.workerReportedConfig;
    // workerReportedAvailableMp3Files = rawServerConfigData.workerReportedAvailableMp3Files;
    workerReportConfigTimeStamp = new Date(rawServerConfigData.workerReportConfigTime).getTime();
  }

  const humanOverrideConfigDescription = humanOverrideConfig;
  const humanOverrideConfigLastUpdateTimeDescription = humanOverrideConfigLastUpdateTimeStamp === 0 ? "Not Available" : new Date(humanOverrideConfigLastUpdateTimeStamp).toLocaleString();
  const workerReportedConfigDescription = workerReportedConfig;
  const workerReportConfigTimeDescription = workerReportConfigTimeStamp === 0 ? "Not Available" : new Date(workerReportConfigTimeStamp).toLocaleString();

  return (
    <div>
      Config Component

      <Button 
        variant="contained"
        onClick={_handleRefresh}>
        Refresh
      </Button>

      <p>Is syncing: {isSyncingDescription}</p>
      <p>Last Sync Time: {lastSyningFinishTimeDescription}</p>

      <hr/>

      <p>Override Config Overview: {humanOverrideConfigDescription}</p>
      <p>Override Config update time: {humanOverrideConfigLastUpdateTimeDescription}</p>

      <hr/>
      <p>Worker Reported Config: {workerReportedConfigDescription}</p>
      <p>Worker Report time: {workerReportConfigTimeDescription}</p>

      <hr/>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Available Mp3 Files</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rawServerConfigData && rawServerConfigData.workerReportedAvailableMp3Files.map((mp3File, idx) => {

              return (
                <TableRow key={`worker-report-mp3-files-${idx}`}>
                  <TableCell component="th" scope="row">
                    <p>{mp3File}</p>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <hr/>
      <div>
        <TextField
          id="standard-full-width"
          label="Config"
          style={{ margin: 8 }}
          placeholder=""
          helperText="Must be valid JSON"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        value={localConfigJSONStr}
        onChange={_handleConfigChange}
        />
        <Button 
          variant="contained"
          onClick={_handleSubmit}>
          Submit
        </Button>
      </div>

    </div>
  );
}

export default Config;

