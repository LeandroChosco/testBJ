import React, { useState, useEffect } from 'react';
import { ResponsiveContainer } from "recharts";
import Chart from 'react-apexcharts'

const Police = (props) => {
  const [ofi, setOfi] = useState([]);
  const [data, setData] = useState([]);
  const { data:dataParser } = props;

  const police = () => {
    let pol = []
    dataParser && dataParser.map(d => {
      pol.push(d.nameOficial)
    }); 
    let su = pol && pol.reduce((a, d) =>{
      return(a[d] ? a[d] += 1 : a[d] = 1, a)
    } , {})

    setOfi(su);
  }

  const getData = () => {
    let d = []
    for (var [key, value] of Object.entries(ofi)) {
      d.push({
        name: key,
        total: value
      })
     
      d.sort((a, b) => {
        if(a.name < b.name){
          return -1
        }
        if(a.name > b.name){
          return 1
        }
        return 0
      })
      
      setData(d)
    }
  }

  const polices = data && data.map(d => (d.name));
  const total = data && data.map(d => (d.total));

  const series =  [{
      name: 'Casos atentidos',
      data: total && total
    }
  ];

  const options = {
    plotOptions: {
      bar: {
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: polices && polices
    },
    colors: '#6435c9'
  };

  useEffect(() => {
    getData()
  }, [ofi])

  useEffect(() => {
    police();
  }, [])

    return (
      <>
        <ResponsiveContainer width="80%" height='80%'>
          {
              <Chart options={options} series={series} type="bar" height='500px' />
          }
        </ResponsiveContainer>
      </>
    );
}

export default Police;