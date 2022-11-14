import React from 'react';
import Chart from 'react-apexcharts'

class RegisterMood extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    name: "Neutral",
                    data: [21104, 22414, 23354, 22514, 23494, 23624, 22694, 24914, 37148]
                },
                {
                    name: "Sorprendido",
                    data: [21204, 22044, 22354, 26254, 24364, 25324, 26234, 24414, 33939]
                },
                {
                    name: "Triste",
                    data: [21414, 22514, 23654, 22614, 23594, 23684, 22894, 24894, 31221]
                },
                {
                    name: "Feliz",
                    data: [21204, 24924, 20954, 31254, 35364, 35324, 36234, 34414, 31939]
                },
                {
                    name: "Enojado",
                    data: [28914, 24114, 23654, 22614, 20599, 24684, 29894, 34884, 31221]
                },

            ],
            options: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                // title: {
                //     text: 'Emociones registradas',
                //     align: 'left'
                // },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: ['03/10', '06/10', '09/10', '12/10', '15/10', '18/10', '21/10', '24/10', '27/10'],
                }
            },


        };
    }

    render() {
        return (
            <div id="chart">
                <Chart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>
        );
    }
}

export default RegisterMood;