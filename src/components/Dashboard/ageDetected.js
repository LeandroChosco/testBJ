import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
} from 'recharts';

import Chart from 'react-apexcharts'

const NAME = {
  MEN: "Hombres",
  WOMEN: "Mujeres",
  TOTAL: "Total"
}

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

const AgeDetected = (props) => {
  const { agesDetected } = props;
  const [options, setOptions] = useState();
  const [series, setSeries] = useState();
  useEffect(() => {
    let total = [], women = [], men = [], name = [];
    if (agesDetected.length > 0) {
      agesDetected.forEach((item) => {
        total.push(item.total);
        name.push(item.name);
        women.push(item.Mujeres);
        men.push(item.Hombres)
      })


      let options = {
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
                filename: 'Rango de edades',
                columnDelimiter: ',',
                headerCategory: 'Rango de edades',
                headerValue: 'value',
              },
              svg: {
                filename: 'Rango de edades',
              },
              png: {
                filename: 'Rango de edades',
              }
            },
          },
        },
        colors: ['#1d5dec', '#2dc50e', '#007aff'],
        dataLabels: {
          enabled: false
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        xaxis: {
          id: "camera",
          categories: name,
        },
        stroke: {
          show: true,
          curve: 'smooth',
          lineCap: 'butt',
          colors: undefined,
          width: 1.5,
          dashArray: 0,
        }
      };

      let newSerie = [
        { name: NAME.WOMEN, data: women },
        { name: NAME.TOTAL, data: total },
        { name: NAME.MEN, data: men },
      ];
      setOptions(options);
      setSeries(newSerie);
    }
  }, [])

  return (
    <ResponsiveContainer>
      { agesDetected.length > 0 && options && series ?
        <Chart options={options} series={series} type="bar" height={350} />
        :
        <div style={styles.noData}>No hay datos dispononibles</div>

      }
    </ResponsiveContainer>
  )
}

export default AgeDetected;