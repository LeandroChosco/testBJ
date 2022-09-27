import React, { useEffect, useState } from 'react'
import conections from '../../../conections'
import './styles.css'
const SummaryCount = () =>{
  // Variables Auxiliares
  let incrementWeek=0;
  let incrementMonth=0;
  // Variables de Estado
const [totalDay, setTotalDay] = useState(0)
const [totalWeek, setTotalWeek] = useState(0)
const [totalMonth, setTotalMonth] = useState(0)
const [totalAlerts, setTotalAlerts] = useState(0)

const init =async () => {
   const perDay = await conections.getLPRTotalDay();
  if(perDay.data && perDay.data.msg==='ok' && perDay.data.success){
      perDay.data.data.forEach(element => {
        setTotalDay(element.total)
      });
  }
  const perWeek = await conections.getLPRTotalWeek();
  if(perWeek.data && perWeek.data.msg==='ok' && perWeek.data.success){
    perWeek.data.data.forEach(element => {
     incrementWeek+=element.total
    });
    setTotalWeek(incrementWeek)
}

const perMonth = await conections.getLPRTotalMonth();
if(perMonth.data && perMonth.data.msg==='ok' && perMonth.data.success){
  perMonth.data.data.forEach(element => {
   incrementMonth+=element.total
  });
  setTotalMonth(incrementMonth)
}

const total = await conections.getLPRTotalAlerts();
if(total.data && total.data.msg==='ok' && total.data.success){
 
  setTotalAlerts(total.data.data.total)
}
}


useEffect(() => {
  init()
}, [])
    return(
        <div className="row justify-content-around px-4 mb-4 ">
          <div className="mb-8   col-xl-2 col-sm-6 mb-xl-0">
            <div className="card  shadow colorDay">
              <div className="p-3 pt-2 card-header">
                <div className="text-center icon icon-lg icon-shape bg-gradient-dark shadow-dark border-radius-xl mt-n4 position-absolute">
                  {/* <i className="material-icons opacity-10">weekend</i> */}
                </div>
                <div className="pt-1 d-flex flex-column text-end">
                  <div className='flex-row d-flex justify-content-between'>
                  </div>
                  <div className="top-0 mb-0 textSize text-white text-center">{totalDay}</div>
                  <p className="mb-0 mt-4 text-sm text-capitalize text-center text-white">Conteo por Día</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4 col-xl-2 col-sm-6 mb-xl-0">
            <div className="card shadow colorSemana ">
              <div className="p-3 pt-2 card-header">
                <div className="text-center icon icon-lg icon-shape bg-gradient-primary shadow-primary border-radius-xl mt-n4 position-absolute">
                </div>
                <div className="pt-1 d-flex flex-column text-end">
                  <div className='flex-row d-flex justify-content-between'>
                  </div>
                  <div className="mb-0 textSize text-center text-white ">{totalWeek}</div>
                  <p className="mb-0 mt-4 text-sm text-capitalize text-center text-white">Conteo por Semana</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4 col-xl-2 col-sm-6 mb-xl-0">
            <div className="card shadow colorMes">
              <div className="p-3 pt-2 card-header">
                <div className="text-center icon icon-lg icon-shape bg-gradient-success shadow-success border-radius-xl mt-n4 position-absolute">            
                </div>
                <div className="pt-1 d-flex flex-column text-end">
                  <div className='flex-row d-flex justify-content-between'>                   
                  </div>
                  <div className="mb-0 textSize text-center text-white">{totalMonth}</div>
                  <p className="mb-0 mt-4 text-sm text-capitalize text-center text-white">Conteo por Mes</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-2 col-sm-6">
            <div className="card shadow colorAlerta ">
              <div className="p-3 pt-2 card-header">
                <div className="text-center icon icon-lg icon-shape bg-gradient-info shadow-info border-radius-xl mt-n4 position-absolute">
                </div>
                <div className="pt-1 d-flex flex-column text-end">
                  <div className='flex-row d-flex justify-content-between'>
                  </div>
                  <div className="mb-0 textSize text-center text-white ">{totalAlerts}</div>
                  <p className="mb-0 mt-4 text-sm text-capitalize text-center text-white">Coincidencias</p>
                </div>
              </div>
            </div>
          </div>
        </div>
 
      
    )
}

export default SummaryCount;