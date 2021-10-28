import React, { useState, useEffect  } from 'react';
import { ResponsiveContainer } from 'recharts';
import Chart from 'react-apexcharts'
import * as moment from 'moment';

const TotalMonth = (props) => {

  const { data:dataParser } = props;
  const test =  dataParser.slice('', 10)
  // console.log('test', test.slice('', 10));
  const [days, setDays] = useState([])
  const incidenciaNull = dataParser && dataParser.filter(f => !f.incidentName)
  const otro = dataParser && dataParser.filter(f => f.incidentName === 'Otro')
  const nsv = dataParser && dataParser.filter(f => f.incidentName === 'Robo a negocio sin violencia')
  const chsv = dataParser && dataParser.filter(f => f.incidentName === 'Robo a casa habitación sin violencia')
  const chcv = dataParser && dataParser.filter(f => f.incidentName === 'Robo a casa habitación con violencia')
  const tcv = dataParser && dataParser.filter(f => f.incidentName === 'Robo a transeúnte con violencia')
  const ap = dataParser && dataParser.filter(f => f.incidentName === 'Robo de auto partes')


  const getDays = () => {
    test && test.map( d => {
      setDays(days => [...days, d.date])
    })
  }

  // console.log(days);

  const series =  [{
      name: 'Incidencias',
      data:[
        otro.length, 
        nsv.length,
        chsv.length,
        chcv.length,
        tcv.length,
        ap.length,
      ]
    }
  ];

  const options = {
    plotOptions: {
      bar: {
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: [
        'Otro',
        'Robo a negocio sin violencia',
        'Robo a casa habitación sin violencia',
        'Robo a casa habitación con violencia',
        'Robo a transeúnte con violencia',
        'Robo de auto partes',
      ],
    }
  };

  useEffect(() => {
    getDays();
  }, [])

    return (
      <>
        <ResponsiveContainer width="80%" height='80%'>
          {
            <Chart options={options} series={series} type="bar" width={500} />
          }
        </ResponsiveContainer>
      </>
    );
}

export default TotalMonth;