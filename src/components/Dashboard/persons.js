import React, { useEffect, useState } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Bar
} from 'recharts';

import Chart from 'react-apexcharts'

const styles = {
  noData: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    display: "flex"
  }
}

const PeoplePerDay = (props) => {
  const { data } = props;
  const [options, setOptions] = useState();
  const [series, setSeries] = useState();

  useEffect(() => {
    let xAxis = [], yAxis = [];
    if (data.length > 0) {
      data.map((item) => {
        xAxis.push(item.fecha);
        yAxis.push(item.total)
      })
      let newOptions = {
        chart: {
          type: 'bar',
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: true,
              selection: true,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: true,
              
              customIcons: []
            },
            export: {
              csv: {
                filename: 'Conteo de personas por día últimos 90 días',
                columnDelimiter: ',',
                headerCategory: 'Fecha',
                headerValue: 'value',
                dateFormatter(timestamp) {
                  return new Date(timestamp).toDateString()
                }
              },
              svg: {
                filename: 'Conteo de personas por día últimos 90 días',
              },
              png: {
                filename: 'Conteo de personas por día últimos 90 días',
              }
            },
          },
        },
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            horizontal: false,
          }
        },
        xaxis: {
          id: "Fecha",
          categories: xAxis,
        },
        colors: ['#0949e9'],
        stroke: {
          show: true,
          curve: 'smooth',
          lineCap: 'butt',
          colors: undefined,
          width: 1,
          dashArray: 0,      
      }
      };

      let newSerie = [{
        name: 'Personas',
        data: yAxis
      }]

      setOptions(newOptions);
      setSeries(newSerie)
    }
  }, [])

  return (
    <ResponsiveContainer>
      {
        data.length > 0  &&  options && series ?
        <Chart options={options} series={series} type="bar" height={350} />
          :
        <div style={styles.noData}>No hay datos dispononibles</div>

      }
    </ResponsiveContainer>
  );
}

export default PeoplePerDay;