import Chart from "react-apexcharts";
import React, { useEffect, useState } from 'react'
import conections from "../../../conections";
import './styles.css'

export const CurveDash =() =>{
  let dataArraySeries =[];
  let dataArrayCategories =[];
  const [series, setSeries] = useState([])
  const [categories, setCategories] = useState([])
  const init =async () =>{
    const alertPerHour = await conections.getLPRAlertHour();
    if(alertPerHour.data && alertPerHour.data.msg ==='ok' && alertPerHour.data.success){
      alertPerHour.data.data.forEach(element => {
        dataArraySeries.push(element.total)
        dataArrayCategories.push(`${element.hour}:00`)
      });
      setSeries(dataArraySeries)
      setCategories(dataArrayCategories)
    }


  }
  useEffect(() => {
    init()
  }, [])

    const data={
        options: {
        stroke: {
            curve: 'smooth',
          },
        chart: {
          id: "smooth"
        },
        xaxis: {
          categories:categories
        },
        colors: ["#EE8B05"],
      },
      
      series: [
        {
          name: "Camara 1",
          data: series
        }
      ]
    }
    return (
        // <div className="wChart">
            <Chart
              options={data.options}
              series={data.series}
              type="area"
              width="100%"
              height='250'
            />
        // </div>
    )
}

export const DonoutDash = ()  =>{
const [donoutSeries, setDonoutSeries] = useState([])
let dataArray =[]
const init =async () =>{
  let typeLPR = await conections.getLPRGroupType();

  if(typeLPR.data && typeLPR.data.msg ==='ok' && typeLPR.data.success){
      typeLPR.data.data.forEach(element => {
        dataArray.push(element.total)
      });
  }
  setDonoutSeries(dataArray)
}
useEffect(() => {
 init()

}, [])
 
  const data={
      options: {},
      labels: ['Placa de reconocimiento', 'Listado LPR Detectado'],
      chartOptions: {
        labels: ['Placa de reconocimiento', 'Listado LPR Detectado']
      }
  }
  return (
      <div className=" ">
          <Chart
            options={data.chartOptions}
            series={donoutSeries}
            type="donut"
           width='100%'
          />
       </div>
  )
}

export const HeatMapChart =()=>{
  const [heatMapSeries, setHeatMapSeries] = useState([]);


  let Sunday =[];
  let Monday =[];
  let Tuesday =[];
  let Wednesday =[];
  let Thursday =[];
  let Friday =[];
  let Saturday =[];
  let hours=['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']

  for (let index = 0; index <hours.length; index++) {
      Sunday.push({x:`${hours[index]}:00`,y:0})
      Monday.push({x:`${hours[index]}:00`,y:0})
      Tuesday.push({x:`${hours[index]}:00`,y:0})
      Wednesday.push({x:`${hours[index]}:00`,y:0})
      Thursday.push({x:`${hours[index]}:00`,y:0})
      Friday.push({x:`${hours[index]}:00`,y:0})
      Saturday.push({x:`${hours[index]}:00`,y:0})
    
  }
  const init=async()=>{
    const dataWeek = await conections.getLPRAlertWeek();
   
    if(dataWeek.data && dataWeek.data.msg ==='ok' && dataWeek.data.success){
      dataWeek.data.data.forEach(element => {
         switch (element.day) {
          case 'Sunday':
            for (let index = 0; index < hours.length; index++) {
              const hora = hours[index];
              if(hora===element.hour ){
                Sunday[index]={x:`${hora}:00` ,y:element.total}
              }
            }
             
            break;
            case 'Monday':
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if(hora===element.hour ){
                  Monday[index]={x:`${hora}:00` ,y:element.total}
                }
              }
            break;
            case 'Tuesday':
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if(hora===element.hour ){
                  Tuesday[index]={x:`${hora}:00` ,y:element.total}
                }
              }
            break;
            case 'Wednesday':
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if(hora===element.hour ){
                  Wednesday[index]={x:`${hora}:00` ,y:element.total}
                }
              }
            break;
            case 'Thursday':
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if(hora===element.hour ){
                  Thursday[index]={x:`${hora}:00` ,y:element.total}
                }
              }
            break;
            case 'Friday':
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if(hora===element.hour ){
                  Friday[index]={x:`${hora}:00` ,y:element.total}
                }
              }
            break;
            case 'Saturday':
              for (let index = 0; index < hours.length; index++) {
                const hora = hours[index];
                if(hora===element.hour ){
                  Saturday[index]={x:`${hora}:00` ,y:element.total}
                }
              }
            break;
          default:
            break;
         }
      });
      setHeatMapSeries([{name:"Lunes",data:Monday},{name:"martes",data:Tuesday},{name:"Miercoles",data:Wednesday},{name:"Jueves",data:Thursday},{name:"Viernes",data:Friday},{name:"Sabado",data:Saturday},{name:"Domingo",data:Sunday}])
  }

  }

  useEffect(() => {
   init()
  }, [])
  

  const options = {
    series:heatMapSeries,
    options: {
      chart: {
        height: 350,
        type: 'heatmap',
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#008FFB"],
      title: {
        text: 'Mapa de Calor'
      },
    }

  }

  return (
    <Chart
      options={options.options}
      series={options.series}
      type='heatmap'
      width="100%"
      height='350'
  />
  )
  
}

export const BubleChart =()=>{
  console.log('====================================');
  console.log(new Date().getTime());
  console.log('====================================');
 const data={ 
  series: [
    {
      name: "U296JX",
      data: [[2, 25, 28],
      [3, 50, 50],
      [4, 20, 28],
      [5, 55, 40],
      [6, 10, 100]]
    },
   
   ],
  options:{
    xaxis: {
      tickAmount: 12,
      type: "String",
    },
    chart: {
      height: 350,
      type: "bubble",
      events: {
        dataPointSelection(event, chartContext, config) {
          // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts
          console.log(chartContext.w.globals)
          // console.log(config.config.series[config.seriesIndex].name)
          // console.log(config.config.series[config.seriesIndex].data[config.dataPointIndex])
        }
      }
    },
    dataLabels: {
      enabled: false
    },
    fill: {
      opacity: 0.8
    },
    title: {
      text: ""
    },
    yaxis: {
      max: 70
    }
  
  }
}
  return (
    <Chart
      options={data.options}
      series={data.series}
      type='bubble'
      width="100%"
      height='350'
  />
  )
  
}

export const ColumnChart =({isWeek})=>{
  let dataArraySeries =[];
  let dataArrayCategories =[];
  const [series, setSeries] = useState([])
  const [categories, setCategories] = useState([])

  let Sunday =0;
  let Monday =0;
  let Tuesday =0;
  let Wednesday =0;
  let Thursday =0;
  let Friday =0;
  let Saturday =0;
  const init =async () =>{
    let dataReq={
      "start_date":"2022-11-07",
      "end_date":"2022-11-13"
    }
    let dataReqMes={
      "start_date":"2022-11-01",
      "end_date":"2022-11-30"
    }
    let alertPerWeek='';
    if(isWeek){
       alertPerWeek = await conections.getLPRFilterWeek(dataReq);
    }else{
       alertPerWeek = await conections.getLPRFilterWeek(dataReqMes);
    }
   
    console.log('Filter', alertPerWeek);

    if(alertPerWeek.data && alertPerWeek.data.msg ==='ok' && alertPerWeek.data.success){
      alertPerWeek.data.data.forEach(element => {
        switch (element.day) {
         case 'Sunday':
          	Sunday += element.total
            
           break;
           case 'Monday':
            Monday += element.total
           break;
           case 'Tuesday':
            Tuesday += element.total
           break;
           case 'Wednesday':
            Wednesday += element.total
           break;
           case 'Thursday':
            Thursday += element.total
           break;
           case 'Friday':
            Friday += element.total
           break;
           case 'Saturday':
            Saturday += element.total
           break;
         default:
           break;
        }
     });
     setSeries([Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday])
     setCategories(["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"])
    //   alertPerHour.data.data.forEach(element => {
    //     dataArraySeries.push(element.total)
    //     dataArrayCategories.push(`${element.hour}:00`)
    //   });
    //   setSeries(dataArraySeries)
    //   setCategories(dataArrayCategories)
    }


  }
  useEffect(() => {
    init()
  }, [isWeek])
  const data={ 
    series: [{
      data: series
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: categories,
      }
    },
 }
 
 
 
 
   return (
     <Chart
       options={data.options}
       series={data.series}
       type='bar'
       width="100%"
       height='250'
   />
   )
   
 }
 


