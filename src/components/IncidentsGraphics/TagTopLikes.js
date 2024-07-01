import React from 'react';
import ReactApexChart from 'react-apexcharts';

export class TagTopLikes extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
      
        series: [6, 5, 2],
        options: {
          chart: {
            width: 380,
            type: 'pie',
          },
          labels: ['Residuos', 'DesastresNaturales', 'AccidenteDeTráfico'],
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
        },
      };
    };

    render() {
      return (
          <div id="chart">
            <h3>Top 3 con más likes</h3>
            <ReactApexChart options={this.state.options} series={this.state.series} type="pie" width={380} />
          </div>
      );
    }
  }