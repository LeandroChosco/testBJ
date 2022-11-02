import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts'
import {
  ResponsiveContainer
} from 'recharts';

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

const MicrofonosDash = (props) => {

  const { eventDetected } = props;
  const [options, setOptions] = useState();
  const [series, setSeries] = useState();

  useEffect(() => {
    let xAxis = [], yAxis = [];
    if (eventDetected.length > 0) {
      eventDetected.forEach((item) => {
        xAxis.push(item.name);
        yAxis.push(item.value)
      })
      let options = {
        labels: xAxis,
        chart: {
          toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              customIcons: []
            },
            export: {
              csv: {
                filename: 'Personas detectadas',
                columnDelimiter: ',',
                headerCategory: 'Personas detectadas',
                headerValue: 'Total'
              },
              svg: {
                filename: 'Personas detectadas',
              },
              png: {
                filename: 'Personas detectadas',
              }
            },
          },
        },

        colors: ['#00e396', '#008ffb'],
        legend: {
          show: true,
          showForSingleSeries: false,
          showForNullSeries: true,
          showForZeroSeries: true,
          position: 'bottom',
          horizontalAlign: 'center',
          floating: false,
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial',
          fontWeight: 400,
          formatter: undefined,
          inverseOrder: false,
          width: undefined,
          height: undefined,
          tooltipHoverFormatter: undefined,
          offsetX: 0,
          offsetY: 0,
          labels: {
            colors: undefined,
            useSeriesColors: false
          },
          markers: {
            width: 12,
            height: 12,
            strokeWidth: 0,
            strokeColor: '#fff',
            fillColors: undefined,
            radius: 12,
            customHTML: undefined,
            onClick: undefined,
            offsetX: 0,
            offsetY: 0
          },
          itemMargin: {
            horizontal: 5,
            vertical: 0
          },
          onItemClick: {
            toggleDataSeries: true
          },

        }
      }

      let series = yAxis
      setOptions(options);
      setSeries(series)
    }
  }, [])

  return (
    <ResponsiveContainer >

      {
        options && series ?
          <Chart options={options} series={series} type="donut" height={320} />
          :
          <div style={styles.noData}>No hay datos dispononibles</div>

      }

    </ResponsiveContainer>
  )
}

export default MicrofonosDash;