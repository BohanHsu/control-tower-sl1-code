import React, {useEffect, useState, useCallback} from 'react';

import { Button, Input, TextField } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function ConfigHistoryCell(props) {
  const configHistory = props.configHistory;

  const refreshHandle = props.refreshHandle;
  const configServices = props.configServices;

  const [showEditDescription, setShowEditDescription] = useState(false);
  const [localNewDescription, setLocalNewDescription] = useState("");

  const _showEditDescription = (shouldShow) => {
    setShowEditDescription(shouldShow);
  };

  const _changeLocalDescription = (evt) => {
    setLocalNewDescription(evt.target.value);
  };

  const _setPinConfigHistoryValue = useCallback((configHistoryId, pinned) => {
    (async () => {
      await configServices.setPinConfigHistoryValue(configHistoryId, pinned);
      refreshHandle();
    })();
  }, [configServices, refreshHandle]);

  const _updateConfigHistoryDescription = useCallback((configHistoryId) => {
    (async () => {
      await configServices.updateConfigHistoryDescription(configHistoryId, localNewDescription);
      refreshHandle();
    })();
  }, [configServices, refreshHandle]);


  const _useConfig = useCallback((localConfigJSONStr) => {
    let minimuzedConfig = null;
    try {
      minimuzedConfig = JSON.stringify(JSON.parse(localConfigJSONStr));
    } catch (e) {
    }
    if (minimuzedConfig !== null) {
      (async () => {
        const resp = await configServices.updateConfig(minimuzedConfig);
        if (resp && resp.data.updated) {
          refreshHandle();
        }
      })();
    }
  }, [refreshHandle, configServices]);

  return (
    <div>
      <pre>{JSON.stringify(JSON.parse(configHistory.workerReportedConfig), null, 2)}</pre>
      <ul>
        <li>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              _useConfig(configHistory.workerReportedConfig);
              }
            }>
            Use this config
          </Button>
        </li>
        <li>
          <p>{new Date(configHistory.created_at).toLocaleString()}</p>
        </li>
        <li>
          <p>
            {configHistory.pinned ? <span>pinned</span> : <span>unpinned</span>}{`   `}
            <Button
              variant="contained"
            onClick={() => {
              _setPinConfigHistoryValue(configHistory.id, !configHistory.pinned);
            }}>
              Click to {configHistory.pinned ? "unpin" : "pin"}
            </Button>
          </p>
        </li>
        <li>
          <p>
            Description: {configHistory.description}{"   "}
            {!showEditDescription &&
              <Button
                variant="contained"
                onClick={() => {
                  _showEditDescription(true);
                }}>
                Click to update description
              </Button>
            }
            {showEditDescription &&
              <div>
                <TextField
                  id="standard-full-width"
                  label="New Description"
                  style={{ margin: 8 }}
                  placeholder=""
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                value={localNewDescription}
                onChange={_changeLocalDescription}
                />
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      _updateConfigHistoryDescription(configHistory.id);
                      _showEditDescription(false);
                    }}>
                    Confirm
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      _showEditDescription(false);
                      _changeLocalDescription({target: {value: ""}})
                    }}>
                    Cancel
                  </Button>
                </div>
              </div>
            }
          </p>
        </li>
      </ul>
    </div>
  );
}

function ConfigHistory(props) {
  const configHistories = props.configHistories;

  return (
    <div>
      <h3>Config History</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Config</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {configHistories.map((configHistory, idx) => {
              return (
                <TableRow key={`config-history-${idx}`}>
                  <TableCell component="th" scope="row">
                    <ConfigHistoryCell 
                      configHistory={configHistory}
                      refreshHandle={props.refreshHandle}
                      configServices={props.configServices}
                    />
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

export default ConfigHistory;
