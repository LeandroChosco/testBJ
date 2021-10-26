import React from 'react';
import { ResponsiveContainer } from "recharts";
import Chart from 'react-apexcharts'

const Police = (props) => {
  const { data:dataParser } = props;
  const oficial1 = dataParser && dataParser.filter(f => f.nameOficial === '1 Policía')
  const oficial2 = dataParser && dataParser.filter(f => f.nameOficial === '2 Policía')
  const oficial3 = dataParser && dataParser.filter(f => f.nameOficial === '3 Policía')
  const oficial4 = dataParser && dataParser.filter(f => f.nameOficial === '4 Policía')
  const oficial5 = dataParser && dataParser.filter(f => f.nameOficial === '5 Policía')
  const oficial6 = dataParser && dataParser.filter(f => f.nameOficial === 'Jaquelin')
  const oficial7 = dataParser && dataParser.filter(f => f.nameOficial === 'Felipe')

  const series =  [{
      name: 'Casos atentidos',
      data:[
        oficial1.length, 
        oficial2.length,
        oficial3.length,
        oficial4.length,
        oficial5.length,
        oficial6.length,
        oficial7.length
      ]
    }
  ];

  const options = {
    // plotOptions: {
    //   bar: {
    //     horizontal: true,
    //   }
    // },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: [
        "1 Policía",
        "2 Policía",
        "3 Policía",
        "4 Policía",
        "5 Policía",
        "Jaquelin",
        "Felipe",
      ],
    }
  };

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

export default Police;