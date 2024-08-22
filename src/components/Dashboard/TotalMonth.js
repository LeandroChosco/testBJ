import React, { useState, useEffect  } from 'react';
import { ResponsiveContainer } from 'recharts';
import Chart from 'react-apexcharts'

const TotalMonth = (props) => {

  const { data:dataParser } = props;
  const [days, setDays] = useState([])
  const [dayView, setDayView] = useState([])
  const [total, setTotal] = useState([])

  const getDays = () => {
    let cont = []
    dataParser && dataParser.forEach( d => {
      cont.push(d.date)
    });

    let su = cont && cont.reduce((a,d) => {
      return(a[d] ? a[d] += 1 : a[d] = 1, a)
    }, {});

    setDays(su)
  }

  const parserDataView = () => {
    let d = [];
    for (var [key, value] of Object.entries(days)) {
      d.push({
        day: key,
        total: value
      })

      const order = d && d.sort(function(a,b) {
        a = a.day.split('/').reverse().join('');
        b = b.day.split('/').reverse().join('');
        return a > b ? 1 : a < b ? -1 : 0;
      });

      const selectData = order && order.slice(order.length-7)      
      const label =  selectData && selectData.map(d => (d.day));
      const total =  selectData && selectData.map(d => (d.total));

      setDayView(label)
      setTotal(total)
    }
  }

  const series =  [{
      name: 'Incidencias',
      data: total && total
    }
  ];

  const options = {
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: dayView && dayView
    },
    colors: '#21ba45'
  };

  useEffect(() => {
    parserDataView()
  }, [days]);

  useEffect(() => {
    getDays();
  }, []);

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