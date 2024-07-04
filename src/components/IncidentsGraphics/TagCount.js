import React from 'react'
import ReactApexChart from 'react-apexcharts';

export class TagCount extends React.Component {


    constructor(props) {
        super(props);
    }

    render() {

        const colors = ["#21B6A8", "#007DE9", "#B4BC00", "#283747", "#145A32", "#F1C40F", "#B4045F"];

        const { data } = this.props;

        const arraySeries = [];
        const arrayOptions = [];

        data.forEach(el => {
            arraySeries.push(el.count);

            const newTag = el._id.replace(/([a-z])([A-Z])/g, '$1 $2').split(" "); // REGEX PARA CAMELCASE, separa palabras agregando espacios

            arrayOptions.push(newTag);
        })

        const series = [{
            name: "Conteo",
            data: arraySeries
        }]

        const options = {
            chart: {
                height: 350,
                type: 'bar',
                // events: {
                //     click: function (chart, w, e) {
                //         // console.log(chart, w, e)
                //     }
                // }
            },
            labels: arrayOptions,
            colors: colors,
            plotOptions: {
                bar: {
                    columnWidth: '45%',
                    distributed: true,
                }
            },
            dataLabels: {
                enabled: true
            },
            legend: {
                show: false
            },
            xaxis: {
                categories: arrayOptions,
                labels: {
                    style: {
                        colors: colors,
                        fontSize: '12px'
                    }
                }
            },
        }

        return (
            <div id="chart">
                <h3>Trending Topics</h3>
                {
                    data.length > 0 ?
                        <ReactApexChart options={options} series={series} type="bar" height={200} />
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