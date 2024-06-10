import React, { useEffect, useState } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import conections from './../../../conections'

const TableD = () =>{
  const dataTableArray=[]
  const [dataQuery, setDataQuery] = useState([])
  useEffect(() => {
   initialState()
  }, [])
  

  const initialState = async () =>{

 

    const dataTable = await conections.getLPRTableList()
    if(dataTable.data && dataTable.data.msg ==='ok' && dataTable.data.success && Object.keys(dataTable.data.data).length > 0){
      dataTable.data.data.forEach(element => {
      if(!element.data[0]){
      }else{
        dataTableArray.push({
          place:element.data[0] ? element.data[0].plate_full : 'NA'  ,
          timestamp: element.data[0] ? `${element.data[0].timestamp.split(".")[0].split("T")[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3')} ${element.data[0].timestamp.split(".")[0].split("T")[1].replace(/(\d{2})(\d{2})(\d{2})/g, '$1:$2:$3')}`: 'NA',
          typeevents:element.data[0] ? element.data[0].event_type : 'NA',
          camera:element.data[0] ? element.data[0].camera_ip : 'NA',
          geolocalization:element.data[0].id
        })
      }
      });
      setDataQuery(dataTableArray)
    }
  }
    const columns = [{
        dataField: "place",
        text: 'Placa',
        filter: textFilter({
            placeholder: 'Buscar Placa'
        })
      },
      {
        dataField: "timestamp",
        text: 'Fecha/Hora',
        filter: textFilter({
            placeholder: 'Buscar Fecha'
        })
      },
      {
        dataField: "typeevents",
        text: 'Tipo de Evento',
        filter: textFilter({
            placeholder: 'Buscar Tipo de Evento'
        })
      },
      {
        dataField: "camera",
        text: 'Camara',
        filter: textFilter({
            placeholder: 'Buscar Camara'
        })
      },
      // {
      //   dataField: "follow",
      //   text: "",
      //   formatter: ()=>( <button type="button" class="btn btn-primary" style={{marginLeft: "43%"}}>Ver</button>),
      //   sort: true
      // }
      ]
    


    return(
        <>
            <BootstrapTable keyField='id' data={ dataQuery } columns={ columns } pagination={paginationFactory()} filter={filterFactory()} />
        </>
    )

}

export default TableD