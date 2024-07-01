import React from 'react'
import ReactApexChart from 'react-apexcharts';

export class TagCount extends React.Component {


    constructor(props) {
        super(props);

        const colors = ["#21B6A8", "#007DE9", "#B4BC00", "#283747", "#145A32", "#F1C40F", "#B4045F"]
        this.state = {

            series: [{
                data: [8, 7, 4, 5, 1, 6, 5]
            }],
            options: {
                chart: {
                    height: 350,
                    type: 'bar',
                    // events: {
                    //     click: function (chart, w, e) {
                    //         // console.log(chart, w, e)
                    //     }
                    // }
                },
                colors: colors,
                plotOptions: {
                    bar: {
                        columnWidth: '45%',
                        distributed: true,
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                xaxis: {
                    categories: [
                        ["Drenajes", "DeAguas"],
                        ["Accidente", "DeTráfico"],
                        ["Desastres", "Naturales"],
                        ["Infraestructura"],
                        ["Residuos"],
                        ["Alumbrado"],
                        "Otros"
                    ],
                    labels: {
                        style: {
                            colors: colors,
                            fontSize: '12px'
                        }
                    }
                }
            },


        };
    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height={200} />
            </div>
        );
    }
}