import React, {useEffect, useState, useCallback} from 'react';

import { Button } from '@material-ui/core';

import PiServices from '../services/piServices';

import {Line} from 'react-chartjs-2';

import ShutdownPi from './piComponent/ShutdownPi';

function Pi(props) {
  const api = props.api;
  const piServices = new PiServices(api);

  const [level0TemperatureChart, setLevel0TemperatureChart] = useState(null);
  const [level1TemperatureChart, setLevel1TemperatureChart] = useState(null);
  const [level2TemperatureChart, setLevel2TemperatureChart] = useState(null);

  const _refreshTemperatures = () => {
    console.log("_refreshTemperatures");
    (async () => {
      const resp = await piServices.getTemperatures();
      if (resp) {
        setLevel0TemperatureChart(generateChartState(resp.data.temperatures.level0, "per-min"));
        setLevel1TemperatureChart(generateChartState(resp.data.temperatures.level1, "per-hour"));
        setLevel2TemperatureChart(generateChartState(resp.data.temperatures.level2, "per-day"));
      }
    })();
  };

  useEffect(_refreshTemperatures, []);

  return (
    <div>
      <div>
        <ShutdownPi api={api}/>
      </div>
      <h1>Last Hour</h1>
      {level0TemperatureChart && renderChart(level0TemperatureChart, "60 mins", _refreshTemperatures)}
      <h1>Past 3 Days</h1>
      {level1TemperatureChart && renderChart(level1TemperatureChart, "72 hours", _refreshTemperatures)}
      <h1>Past 30 Days</h1>
      {level2TemperatureChart && renderChart(level2TemperatureChart, "30 days", _refreshTemperatures)}
    </div>

  );
}

function generateChartState(data, label) {
  const labels = [];
  for (let i = 1; i <= data.length; i++) {
    labels.push(i.toString());
  }
  return {
    labels,
    datasets: [
      {
        label,
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: data,
      }
    ]
  };
}

function renderChart(data, text, refreshHandle) {
  const dataSets = data.datasets[0].data;
  let ticks = {};

  if (dataSets.length > 0) {
    const suggestedMax = Math.max(...data.datasets[0].data) * 1.15;
    const suggestedMin = Math.min(...data.datasets[0].data) / 1.5;
    ticks = {
      ...ticks,
      suggestedMax,
      suggestedMin,
    };
  }
  return (
    <div>
      <div>
        <Button
          variant="contained"
          onClick={refreshHandle}>
          Refresh
        </Button>
      </div>
      <div>
        <Line
          data={data}
          options={{
            title:{
              display:true,
              text,
              fontSize:20
            },
            legend:{
              display:true,
              position:'right'
            },
            scales: {
              yAxes: [{
                ticks,
              }]
            }
          }}
        />
      </div>
    </div>
  )
}

export default Pi;
