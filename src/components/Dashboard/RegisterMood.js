import React from 'react';
import Chart from 'react-apexcharts'

class RegisterMood extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [
                {
                    name: "Neutral",
                    data: [2110, 2241, 2335, 2251, 2349, 2362, 2269, 2491, 3714]
                },
                {
                    name: "Sorprendido",
                    data: [2120, 2204, 2235, 2625, 2436, 2532, 2623, 2441, 3393]
                },
                {
                    name: "Triste",
                    data: [2141, 2251, 2365, 2261, 2359, 2368, 2289, 2489, 3122]
                },
                {
                    name: "Feliz",
                    data: [2120, 2492, 2095, 3125, 3536, 3532, 3623, 3441, 3193]
                },
                {
                    name: "Enojado",
                    data: [2891, 2411, 2365, 2261, 2059, 2468, 2989, 3488, 3122]
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
                    categories: ['12/11', '15/11', '18/11', '21/11', '24/11', '27/11', '30/11', '03/12', '06/12'],
                }
            },


        };
    }

    render() {
        return (
            <div id="chart" style={{width: "100%"}}>
                <Chart options={this.state.options} series={this.state.series} type="line" height={350} />
            </div>
        );
    }
}

export default RegisterMood;