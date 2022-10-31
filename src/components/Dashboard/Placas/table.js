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
    if(dataTable.data && dataTable.data.msg ==='ok' && dataTable.data.success){
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
      {
        dataField: "geolocalization",
        text: 'Coordenada',
        filter: textFilter({
            placeholder: 'Buscar Coordenada'
        })
      },
      {
        dataField: "follow",
        text: "",
        formatter: ()=>( <button type="button" class="btn btn-primary" style={{marginLeft: "43%"}}>Ver</button>),
        sort: true
      }
      ]
    
    const LinkButton =()=>{
      return(
        <button type="button" class="btn btn-primary">Ver</button>
      )
    }
    const data = [
        {place:'CHF-235','timestamp':"1245",'typeevents':'45','camera':'245','geolocalization':'234,66'},
        {place:'AHF-235','timestamp':"2245",'typeevents':'45','camera':'245','geolocalization':'234,66'},
        {place:'DHF-235','timestamp':"3245",'typeevents':'45','camera':'245','geolocalization':'234,66'},
        {place:'BHF-235','timestamp':"4245",'typeevents':'45','camera':'245','geolocalization':'234,66'},
        {place:'EHF-235','timestamp':"5245",'typeevents':'45','camera':'245','geolocalization':'234,66'},
        {place:'FHF-235','timestamp':"6245",'typeevents':'45','camera':'245','geolocalization':'234,66'},
        {place:'GHF-235','timestamp':"7245",'typeevents':'45','camera':'245','geolocalization':'234,66'},
    ]
    return(
        <>
            <BootstrapTable keyField='id' data={ data } columns={ columns } pagination={paginationFactory()} filter={filterFactory()} />
        </>
    )

}

export default TableD