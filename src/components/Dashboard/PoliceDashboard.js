import React from 'react';
import Chart from 'react-apexcharts'
import {
  ResponsiveContainer
} from 'recharts';

const PoliceDashboard = (props) => {
  const { data:dataParser } = props;
  const filterSector = dataParser && dataParser.filter( f => f.sector)
  const filterNull = dataParser && dataParser.filter( f => !f.sector)
  const napoles = dataParser && dataParser.filter(f => f.sector === "NAPOLES") 
  const portales = dataParser && dataParser.filter(f => f.sector === "PORTALES")
  const delvalle = dataParser && dataParser.filter(f => f.sector === "DEL VALLE")
  const narvarte = dataParser && dataParser.filter(f => f.sector === "NARVARTE")
  const series = [ 
    napoles.length,
    filterNull.length,
    portales.length,
    delvalle.length,
    narvarte.length
  ];
  const labels = ['NAPOLES', 'S/I', 'PORTALES', 'DEL VALLE', 'NARVARTE'];
  const options = {
    labels: labels,
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
            filename: 'Sectores',
            columnDelimiter: ',',
            headerCategory: 'Sectores',
            headerValue: 'Total'
          },
          svg: {
            filename: 'Sectores',
          },
          png: {
            filename: 'Sectores',
          }
        },
      },
    },   
  }

    return (
      <>
        <ResponsiveContainer width="80%" height='80%'>
          {
              <Chart options={options} series={series} type="donut" width={500}  />
          }
        </ResponsiveContainer>
      </>
    );
}

export default PoliceDashboard;