import React from 'react';
import Chart from 'react-apexcharts'
import { MODE } from '../../constants/token';

// const styles = {
//     noData: {
//         position: 'absolute',
//         top: 0,
//         bottom: 0,
//         right: 0,
//         left: 0,
//         justifyContent: 'center',
//         alignItems: 'center',
//         display: "flex"
//     }
// }

class AgeDemographic extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Hombres',
                data: [120, 55, 201, 40]
            }, {
                name: 'Mujeres',
                data: [54, 207, 48, 28]
            }],
            options: {
                chart: {
                    type: 'bar',
                    height: 350,
                    stacked: true,
                    toolbar: {
                        show: true
                    },
                    zoom: {
                        enabled: true
                    }
                },
                theme: {
                    mode: (localStorage.getItem(MODE) && JSON.parse(localStorage.getItem(MODE))) ? 'dark' : "light",
                    palette: 'palette1',
                    monochrome: {
                        enabled: false,
                        color: '#255aee',
                        shadeTo: 'light',
                        shadeIntensity: 0.65
                    },
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }],
                // plotOptions: {
                //     bar: {
                //         horizontal: false,
                //         borderRadius: 10,
                //         dataLabels: {
                //             total: {
                //                 enabled: true,
                //                 style: {
                //                     fontSize: '13px',
                //                     fontWeight: 900
                //                 }
                //             }
                //         }
                //     },
                // },
                xaxis: {
                    type: 'ages',
                    categories: ['-18', '18-30', '31-50', '+50',
                    ],
                },
                legend: {
                    position: 'right',
                    offsetY: 40
                },
                fill: {
                    opacity: 1
                }
            },


        };
    }


    render() {
        return (
            <div id="chart" style={{ width: "90%" }}>
                <Chart options={this.state.options} series={this.state.series} type="bar" height={350} />
            </div>
        )
    }
}

export default AgeDemographic;