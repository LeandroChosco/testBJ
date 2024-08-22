import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import conections from "../../../conections";
import "./styles.css";

export const CurveDash = ({ camId }) => {
  let curveData = {
    "cam_id": camId,
    "start_time": "00",
    "end_time": "23"
  }
  let dataArraySeries = [];
  let dataArrayCategories = [];
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const init = async () => {
    const alertPerHour = await conections.getLPRFilterHour(curveData);
    if (
      alertPerHour.data &&
      alertPerHour.data.msg === "ok" &&
      alertPerHour.data.success &&
      Object.keys(alertPerHour.data.data).length > 0
    ) {
      const sortAlertPerHour = await alertPerHour.data.data.sort((a, b) => a.hour > b.hour ? 1 : -1);

      sortAlertPerHour.forEach((element) => {
        dataArraySeries.push(element.total);
        dataArrayCategories.push(`${element.hour}:00`);
      });


      setSeries(dataArraySeries);
      setCategories(dataArrayCategories);
    }
  };
  useEffect(() => {
    init();
  }, [camId]);

  const data = {
    options: {
      stroke: {
        curve: "smooth",
      },
      chart: {
        id: "smooth",
      },
      xaxis: {
        categories: categories,
      },
      colors: ["#EE8B05"],
    },

    series: [
      {
        name: "Camara 1",
        data: series,
      },
    ],
  };
  return (
    // <div className="wChart">
    <Chart
      options={data.options}
      series={data.series}
      type="area"
      width="100%"
      height="250"
    />
    // </div>
  );
};

export const DonoutDash = () => {
  const [donoutSeries, setDonoutSeries] = useState([]);
  let dataArray = [];
  const init = async () => {
    let typeLPR = await conections.getLPRGroupType();

    if (typeLPR.data && typeLPR.data.msg === "ok" && typeLPR.data.success && Object.keys(typeLPR.data.data).length > 0) {
      typeLPR.data.data.forEach((element) => {
        dataArray.push(element.total);
      });
    }
    setDonoutSeries(dataArray);
  };
  useEffect(() => {
    init();
  }, []);

  const data = {
    options: {},
    labels: ["Placa de reconocimiento", "Listado LPR Detectado"],
    chartOptions: {
      labels: ["Placa de reconocimiento", "Listado LPR Detectado"],
    },
  };
  return (
    <div className=" ">
      <Chart
        options={data.chartOptions}
        series={donoutSeries}
        type="donut"
        width="100%"
      />
    </div>
  );
};

export const HeatMapChart = ({ camId }) => {
  const [heatMapSeries, setHeatMapSeries] = useState([]);

  let Sunday = [];
  let Monday = [];
  let Tuesday = [];
  let Wednesday = [];
  let Thursday = [];
  let Friday = [];
  let Saturday = [];
  let hours = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];

  for (let index = 0; index < hours.length; index++) {
    Sunday.push({ x: `${hours[index]}:00`, y: 0 });
    Monday.push({ x: `${hours[index]}:00`, y: 0 });
    Tuesday.push({ x: `${hours[index]}:00`, y: 0 });
    Wednesday.push({ x: `${hours[index]}:00`, y: 0 });
    Thursday.push({ x: `${hours[index]}:00`, y: 0 });
    Friday.push({ x: `${hours[index]}:00`, y: 0 });
    Saturday.push({ x: `${hours[index]}:00`, y: 0 });
  }
  const init = async () => {
    const dataWeek = await conections.getLPRAlertWeek();
    if (dataWeek.data && dataWeek.data.msg === "ok" && dataWeek.data.success && Object.keys(dataWeek.data.data).length > 0) {

      if (camId) {
        let dataArrayFilter = []
        dataArrayFilter = dataWeek.data.data.filter((element) => {
          return element.cam_id === camId
        })
        dataArrayFilter.forEach((element) => {

          switch (element.day) {
            case "Sunday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Sunday[index] = { x: `${hora}:00`, y: element.total };
                }
              }

              break;
            case "Monday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Monday[index] = { x: `${hora}:00`, y: element.total };
                }
              }
              break;
            case "Tuesday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Tuesday[index] = { x: `${hora}:00`, y: element.total };
                }
              }
              break;
            case "Wednesday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Wednesday[index] = { x: `${hora}:00`, y: element.total };
                }
              }
              break;
            case "Thursday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Thursday[index] = { x: `${hora}:00`, y: element.total };
                }
              }
              break;
            case "Friday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Friday[index] = { x: `${hora}:00`, y: element.total };
                }
              }
              break;
            case "Saturday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Saturday[index] = { x: `${hora}:00`, y: element.total };
                }
              }
              break;
            default:
              break;
          }
        });
      } else {
        dataWeek.data.data.forEach((element) => {

          switch (element.day) {
            case "Sunday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Sunday[index] = { x: `${hora}:00`, y: element.total };
                }
              }

              break;
            case "Monday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Monday[index] = { x: `${hora}:00`, y: element.total };
                }
              }
              break;
            case "Tuesday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Tuesday[index] = { x: `${hora}:00`, y: element.total };
                }
              }
              break;
            case "Wednesday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Wednesday[index] = { x: `${hora}:00`, y: element.total };
                }
              }
              break;
            case "Thursday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Thursday[index] = { x: `${hora}:00`, y: element.total };
                }
              }
              break;
            case "Friday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Friday[index] = { x: `${hora}:00`, y: element.total };
                }
              }
              break;
            case "Saturday":
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if (hora === element.hour) {
                  Saturday[index] = { x: `${hora}:00`, y: element.total };
                }
              }
              break;
            default:
              break;
          }
        });
      }

      setHeatMapSeries([
        { name: "Lunes", data: Monday },
        { name: "martes", data: Tuesday },
        { name: "Miercoles", data: Wednesday },
        { name: "Jueves", data: Thursday },
        { name: "Viernes", data: Friday },
        { name: "Sabado", data: Saturday },
        { name: "Domingo", data: Sunday },
      ]);
    }
  };

  useEffect(() => {
    init();
  }, [camId]);

  const options = {
    series: heatMapSeries,
    options: {
      chart: {
        height: 350,
        type: "heatmap",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#008FFB"],
    },
  };

  return (
    <Chart
      options={options.options}
      series={options.series}
      type="heatmap"
      width="100%"
      height="350"
    />
  );
};

export const ColumnChart = ({ month, cam }) => {
  const actualDate = new Date();
  // const year= actualDate.getFullYear()
  let lastDay = actualDate.getDate()
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  let firstDay = actualDate.getDate() - actualDate.getDay()
  if (firstDay < 10) {
    firstDay = `0${firstDay}`
  }
  if (lastDay < 10) {
    lastDay = `0${lastDay}`
  }
  if (month < 10) {
    month = `0${month}`
  }

  let Sunday = 0;
  let Monday = 0;
  let Tuesday = 0;
  let Wednesday = 0;
  let Thursday = 0;
  let Friday = 0;
  let Saturday = 0;
  const init = async () => {
    // let dataReq = {
    //   start_date:`${year}-${month+1}-${firstDay}`,
    //   end_date:`${year}-${month+1}-${lastDay}` ,
    //   "cam_id":cam
    // };
    let dataReq = {
      start_date: `2022-11-27`,
      end_date: `2022-12-04`,
      "cam_id": cam
    };
    // let dataReqMes = {
    //   start_date: "2022-11-01",
    //   end_date: "2022-11-30",
    // };
    let alertPerWeek = "";
    alertPerWeek = await conections.getLPRFilterWeek(dataReq);
    // }else{
    //    alertPerWeek = await conections.getLPRFilterWeek(dataReqMes);
    // }
    if (
      alertPerWeek.data &&
      alertPerWeek.data.msg === "ok" &&
      alertPerWeek.data.success &&
      Object.keys(alertPerWeek.data.data).length > 0
    ) {
      alertPerWeek.data.data.forEach((element) => {
        switch (element.day) {
          case "Sunday":
            Sunday += element.total;

            break;
          case "Monday":
            Monday += element.total;
            break;
          case "Tuesday":
            Tuesday += element.total;
            break;
          case "Wednesday":
            Wednesday += element.total;
            break;
          case "Thursday":
            Thursday += element.total;
            break;
          case "Friday":
            Friday += element.total;
            break;
          case "Saturday":
            Saturday += element.total;
            break;
          default:
            break;
        }
      });
      setSeries([
        Monday,
        Tuesday,
        Wednesday,
        Thursday,
        Friday,
        Saturday,
        Sunday,
      ]);
      setCategories([
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ]);
      //   alertPerHour.data.data.forEach(element => {
      //     dataArraySeries.push(element.total)
      //     dataArrayCategories.push(`${element.hour}:00`)
      //   });
      //   setSeries(dataArraySeries)
      //   setCategories(dataArrayCategories)
    }
  };

  const data = {
    series: [
      {
        name: "Conteo",
        data: series,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: categories,
      },
    },
  };
  useEffect(() => {
    init();
  }, [cam]);
  return (
    <Chart
      options={data.options}
      series={data.series}
      type="bar"
      width="100%"
      height="250"
    />
  );
};

export const ColumnMonthChart = ({ month, cam }) => {
  const [series, setSeries] = useState([]);
  const [categories, setCategories] = useState([]);

  let Semana1 = 0;
  let Semana2 = 0;
  let Semana3 = 0;
  let Semana4 = 0;
  let Semana5 = 0;
  const init = async () => {
    let dataReqMes = {
      start_date: "2022-11-01",
      end_date: "2022-11-30",
      "cam_id": cam
    };
    // let dataReqMes = {
    //   start_date: `2022-${month + 1}-01`,
    //   end_date: `2022-${month + 1}-30`,
    //   "cam_id":cam
    // };
    let alertPerWeek = "";
    alertPerWeek = await conections.getLPRFilterWeek(dataReqMes);
    // }else{
    //    alertPerWeek = await conections.getLPRFilterWeek(dataReqMes);
    // }


    if (
      alertPerWeek.data &&
      alertPerWeek.data.msg === "ok" &&
      alertPerWeek.data.success &&
      Object.keys(alertPerWeek.data.data).length > 0
    ) {
      alertPerWeek.data.data.forEach((element) => {
        let current = new Date(element.date);
        let start = new Date(current.getUTCFullYear(), 0, 1);
        let days = Math.floor((current - start) / (24 * 60 * 60 * 1000));
        let weekNumber = Math.ceil(days / 7);
        let numberWeek = weekNumber % 4;
        switch (numberWeek) {
          case 0:
            Semana1 += element.total;
            break;
          case 1:
            Semana2 += element.total;
            break;
          case 2:
            Semana3 += element.total;
            break;
          case 3:
            Semana4 += element.total;
            break;
          default:
            break;
        }
      });
      setSeries([Semana1, Semana2, Semana3, Semana4, Semana5]);
      setCategories([
        "Semana 1",
        "Semana 2",
        "Semana 3",
        "Semana 4",
        "Semana 5",
      ]);
      //   alertPerHour.data.data.forEach(element => {
      //     dataArraySeries.push(element.total)
      //     dataArrayCategories.push(`${element.hour}:00`)
      //   });
      //   setSeries(dataArraySeries)
      //   setCategories(dataArrayCategories)
    }
  };

  const data = {
    series: [
      {
        name: "Conteo",
        data: series,
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: categories,
      },
    },
  };

  useEffect(() => {
    init();
  }, [cam]);

  return (
    <Chart
      options={data.options}
      series={data.series}
      type="bar"
      width="100%"
      height="250"
    />
  );
};
