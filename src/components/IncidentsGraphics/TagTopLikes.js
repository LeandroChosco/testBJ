import React from 'react';
import ReactApexChart from 'react-apexcharts';

export class TagTopLikes extends React.Component {
  constructor(props) {
    super(props);
  };

  render() {

    const colors = ["#21B6A8", "#007DE9", "#B4BC00", "#283747", "#145A32", "#F1C40F", "#B4045F"];
    
    const { data } = this.props;

    const arraySeries = [];
    const arrayOptions = [];

    data.forEach(el => {
      arraySeries.push(el.total);
      if (el.tags.length > 2) {
        const diff = el.tags.length - 2;
        const arraySlice = el.tags.slice(0, 2);
        arraySlice.push(`+${diff}`);
        arrayOptions.push(arraySlice);
      } else {
        arrayOptions.push(el.tags);
      }
    });

    const series = arraySeries;
    const options = {
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: arrayOptions,
      colors: colors,
      xaxis: {
        categories: arrayOptions,
        labels: {
          style: {
            colors: colors,
            fontSize: '12px'
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    };

    return (
      <div id="chart">
        <h3>Top 5 con más likes</h3>
        {
          data.length > 0 ? 
          <ReactApexChart options={options} series={series} type="pie" width={350} />
          :
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            justifyContent: 'center',
            alignItems: 'center',
            display: "flex"
          }}>No hay datos disponibles</div>
        }
      </div>
    );
  }
}